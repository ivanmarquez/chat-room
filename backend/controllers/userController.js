const User = require("../models/User");

let connectedUsers = [];

exports.getUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.addUser = (user) => {
	if (!connectedUsers.some((u) => u.id === user.id)) {
		connectedUsers.push(user);
	}
};

exports.removeUser = (user_id) => {
	connectedUsers = connectedUsers.filter(
		(user) => user.id !== user_id
	);
};

exports.getConnectedUsersList = () => {
	return connectedUsers.map((user) => {
		const { token, ...userWithoutToken } = user;
		return userWithoutToken;
	});
};

exports.getConnectedUsers = (req, res) => {
	const usersWithoutToken = exports.getConnectedUsersList();
	res.json(usersWithoutToken);
};

// Export connectedUsers for testing purposes
exports._getConnectedUsers = () => connectedUsers;
exports._resetConnectedUsers = () => {
    connectedUsers = [];
};