const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/authUtils");
const { addUser, removeUser } = require("./userController");

exports.login = async (req, res) => {
	const { username, token } = req.body;

	try {
		let user;
		let newToken = token;

		if (token) {
			try {
				// Verificar el token y encontrar al usuario
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				user = await User.findOne({
					username: decoded.username,
					token,
				});
			} catch (error) {
                if (error instanceof jwt.JsonWebTokenError) {
                    return res.status(401).json({ message: "Invalid token" });
                }
                throw error;
			}
		}

		if (!user) {
			// Si no existe el token, buscar al usuario por nombre de usuario
			user = await User.findOne({ username });

			if (user) {
				// Si el usuario ya existe, actualizar el token
				newToken = generateToken(username);
				user.token = newToken;
				await user.save();
			} else {
				// Si el usuario no existe, crear un nuevo usuario
				newToken = generateToken(username);
				user = new User({ username, token: newToken });
				await user.save();
			}
		}

        if (!user || !user._id) {
            return res.status(500).json({ message: "User creation or fetching failed" });
        }


		// Add the user to the connected users list
		user = { id: user._id.toString(), username: user.username, token: newToken };
		addUser(user);

		res.json(user);
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
};

exports.logout = async (req, res) => {
	const { user } = req.body;
	removeUser(user.id);
	res.json({ message: "User logged out successfully" });
};
