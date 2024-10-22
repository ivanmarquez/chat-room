const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try {
		const authHeader = req.header("Authorization");
        
		if (!authHeader) {
			return res
				.status(401)
				.json({ message: "No token, authorization denied" });
		}

		const token = authHeader.replace("Bearer ", "");
		if (!token) {
			return res
				.status(401)
				.json({ message: "No token, authorization denied" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		if (error.name === "JsonWebTokenError") {
			return res.status(401).json({ message: "Token is not valid" });
		}
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({ message: "Token has expired" });
		}
		res.status(500).json({ message: "Server error" });
	}
};
