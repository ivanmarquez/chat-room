const request = require("supertest");
const express = require("express");
const authController = require("../controllers/authController");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { JsonWebTokenError } = jwt;
const { generateToken } = require("../utils/authUtils");

jest.mock("../models/User");
jest.mock("jsonwebtoken");
jest.mock("../utils/authUtils");

const app = express();
app.use(express.json());
app.post("/login", authController.login);
app.post("/logout", authController.logout);

describe("Auth Controller", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("login with a valid token", async () => {
		const mockUser = { username: "testuser", token: "validtoken" };
		jwt.verify.mockReturnValue({ username: "testuser" });
		User.findOne.mockResolvedValue(mockUser);

		const response = await request(app)
			.post("/login")
			.send({ username: "testuser", token: "validtoken" });

		expect(response.status).toBe(200);
		expect(response.body.username).toBe("testuser");
		expect(jwt.verify).toHaveBeenCalledWith(
			"validtoken",
			process.env.JWT_SECRET
		);
		expect(User.findOne).toHaveBeenCalledWith({
			username: "testuser",
			token: "validtoken",
		});
	});

	test("login with an invalid token", async () => {
		jwt.verify.mockImplementation(() => {
			throw new JsonWebTokenError("Invalid token");
		});

		const response = await request(app)
			.post("/login")
			.send({ username: "testuser", token: "invalidtoken" });

		expect(response.status).toBe(401);
		expect(response.body.message).toBe("Invalid token");
		expect(jwt.verify).toHaveBeenCalledWith(
			"invalidtoken",
			process.env.JWT_SECRET
		);
	});

	test("login with a server error", async () => {
		jwt.verify.mockImplementation(() => {
			throw new Error("Internal Server error");
		});

		const response = await request(app)
			.post("/login")
			.send({ username: "testuser", token: "validtoken" });

		expect(response.status).toBe(500);
		expect(response.body.message).toBe("Internal Server Error");
		expect(jwt.verify).toHaveBeenCalledWith(
			"validtoken",
			process.env.JWT_SECRET
		);
	});

	test("login with a new user", async () => {
		const mockUser = { username: "newuser", save: jest.fn() };
		User.findOne.mockResolvedValue(null);
		generateToken.mockReturnValue("newtoken");
		User.mockImplementation(() => mockUser);

		const response = await request(app)
			.post("/login")
			.send({ username: "newuser" });

		expect(response.status).toBe(200);
		expect(response.body.username).toBe("newuser");
		expect(response.body.token).toBe("newtoken");
		expect(User.findOne).toHaveBeenCalledWith({ username: "newuser" });
		expect(generateToken).toHaveBeenCalledWith("newuser");
		expect(mockUser.save).toHaveBeenCalled();
	});

	test("login with an existing user", async () => {
		const mockUser = {
			username: "existinguser",
			token: "oldtoken",
			save: jest.fn(),
		};
		User.findOne.mockResolvedValue(mockUser);
		generateToken.mockReturnValue("newtoken");

		const response = await request(app)
			.post("/login")
			.send({ username: "existinguser" });

		expect(response.status).toBe(200);
		expect(response.body.username).toBe("existinguser");
		expect(response.body.token).toBe("newtoken");
		expect(User.findOne).toHaveBeenCalledWith({ username: "existinguser" });
		expect(generateToken).toHaveBeenCalledWith("existinguser");
		expect(mockUser.token).toBe("newtoken");
		expect(mockUser.save).toHaveBeenCalled();
	});

	test("logout successfully", async () => {
		const response = await request(app)
			.post("/logout")
			.send({ user: { id: "userId", username: "testuser" } });

		expect(response.status).toBe(200);
		expect(response.body.message).toBe("User logged out successfully");
	});
});
