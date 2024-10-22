const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const {
	addUser,
	removeUser,
	getConnectedUsersList,
} = require("./controllers/userController");

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket) => {
	console.log("a user connected");

	socket.on("userConnected", (user) => {
		//addUser(user);
		io.emit("updateUsers", getConnectedUsersList());
	});

	socket.on("userDisconnected", (user) => {
		removeUser(user.id);
		io.emit("updateUsers", getConnectedUsersList());
	});

	socket.on("sendMessage", (message) => {
		io.emit("receiveMessage", message);
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Add error handling
server.on("error", (error) => {
	console.error("Server error:", error);
});
