const request        = require("supertest");
const express        = require("express");
const userController = require("../controllers/userController");
const User           = require("../models/User");

jest.mock("../models/User");

const app = express();
app.use(express.json());
app.get("/users", userController.getUsers);
app.get("/connected-users", userController.getConnectedUsers);

describe("User Controller", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		userController._resetConnectedUsers();
	});

	test("getUsers should return a list of users", async () => {
		const mockUsers = [{ username: "user1" }, { username: "user2" }];
		User.find.mockResolvedValue(mockUsers);

		const response = await request(app).get("/users");

		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockUsers);
		expect(User.find).toHaveBeenCalled();
	});

	test("getUsers should handle errors", async () => {
		User.find.mockRejectedValue(new Error("Database error"));

		const response = await request(app).get("/users");

		expect(response.status).toBe(500);
		expect(response.body.error).toBe("Database error");
	});

	test("addUser should add a user to connectedUsers", () => {
		const user = { id: "1", username: "user1" };
        userController.addUser(user);

        expect(userController._getConnectedUsers()).toContainEqual(user);
	});

	test("addUser should not add a duplicate user to connectedUsers", () => {
		const user = { id: "1", username: "user1" };
        userController.addUser(user);
        userController.addUser(user);

        expect(userController._getConnectedUsers().length).toBe(1);
	});

	test("removeUser should remove a user from connectedUsers", () => {
		const user1 = { id: "1", username: "user1" };
		const user2 = { id: "2", username: "user2" };
		userController.addUser(user1);
		userController.addUser(user2);

		userController.removeUser("1");

		expect(userController._getConnectedUsers()).not.toContainEqual(user1);
        expect(userController._getConnectedUsers()).toContainEqual(user2);
	});

	test("getConnectedUsersList should return a list of connected users without tokens", () => {
		const user1 = { id: "1", username: "user1", token: "token1" };
		const user2 = { id: "2", username: "user2", token: "token2" };
		userController.addUser(user1);
		userController.addUser(user2);

		const usersWithoutToken = userController.getConnectedUsersList();

		expect(usersWithoutToken).toEqual([
			{ id: "1", username: "user1" },
			{ id: "2", username: "user2" },
		]);
	});

	test("getConnectedUsers should return a list of connected users without tokens", async () => {
		const user1 = { id: "1", username: "user1", token: "token1" };
		const user2 = { id: "2", username: "user2", token: "token2" };
		userController.addUser(user1);
		userController.addUser(user2);

		const response = await request(app).get("/connected-users");

		expect(response.status).toBe(200);
		expect(response.body).toEqual([
			{ id: "1", username: "user1" },
			{ id: "2", username: "user2" },
		]);
	});
});
