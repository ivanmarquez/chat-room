const jwt = require("jsonwebtoken");

const generateToken = (username) => {
	return jwt.sign({ username }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

module.exports = { generateToken };
