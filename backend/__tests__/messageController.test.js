const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const messageController = require("../controllers/messageController");
const Message = require("../models/Message");
const User = require("../models/User");

jest.mock("../models/Message");
jest.mock("../models/User");

const app = express();
app.use(express.json());
app.post("/messages", messageController.saveMessage);
app.get("/messages", messageController.getMessages);

describe("Message Controller", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("saveMessage", () => {

		test("should return 404 if sender or recipient is not found", async () => {
			User.findById.mockResolvedValueOnce(null);

			const response = await request(app)
				.post("/messages")
				.send({
					sender: { id: "senderId" },
					recipient: { id: "recipientId" },
					text: "Hello",
					fileUrl: "http://example.com/file.png",
				});

			expect(response.status).toBe(404);
			expect(response.body.error).toBe("User not found");
		});

		test("should return 500 if there is a server error", async () => {
			User.findById.mockRejectedValueOnce(new Error("Server error"));

			const response = await request(app)
				.post("/messages")
				.send({
					sender: { id: "senderId" },
					recipient: { id: "recipientId" },
					text: "Hello",
					fileUrl: "http://example.com/file.png",
				});

			expect(response.status).toBe(500);
			expect(response.body.error).toBe("Server error");
		});
	});

	describe("getMessages", () => {
		test("should return a list of messages", async () => {
			const mockSender = {
				_id: new mongoose.Types.ObjectId(),
				username: "sender",
			};
			const mockRecipient = {
				_id: new mongoose.Types.ObjectId(),
				username: "recipient",
			};
			const mockMessages = [
				{
					_id: new mongoose.Types.ObjectId(),
					sender: {
						_id: mockSender._id,
						username: mockSender.username,
					},
					recipient: {
						_id: mockRecipient._id,
						username: mockRecipient.username,
					},
					text: "Hello",
					fileUrl: "http://example.com/file1.png",
					timestamp: new Date(),
				},
				{
					_id: new mongoose.Types.ObjectId(),
					sender: {
						_id: mockRecipient._id,
						username: mockRecipient.username,
					},
					recipient: {
						_id: mockSender._id,
						username: mockSender.username,
					},
					text: "Hi",
					fileUrl: "http://example.com/file2.png",
					timestamp: new Date(),
				},
			];

			const mockFind = {
				populate: jest.fn().mockReturnThis(),
				sort: jest.fn().mockResolvedValue(mockMessages),
			};

			Message.find.mockReturnValue(mockFind);

			const response = await request(app)
				.get("/messages")
				.query({
					sender: JSON.stringify({ id: mockSender._id.toString() }),
					recipient: JSON.stringify({
						id: mockRecipient._id.toString(),
					}),
				});

			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				mockMessages.map((message) => ({
					id: message._id.toString(),
					text: message.text,
					fileUrl: message.fileUrl,
					timestamp: message.timestamp.toISOString(),
					sender: {
						id: message.sender._id.toString(),
						username: message.sender.username,
					},
					recipient: {
						id: message.recipient._id.toString(),
						username: message.recipient.username,
					},
				}))
			);
		});

		test("should return 500 if there is a server error", async () => {
			const mockSender = {
				_id: new mongoose.Types.ObjectId(),
				username: "sender",
			};
			const mockRecipient = {
				_id: new mongoose.Types.ObjectId(),
				username: "recipient",
			};

			Message.find.mockImplementationOnce(() => {
				throw new Error("Server error");
			});

			const response = await request(app)
				.get("/messages")
				.query({
					sender: JSON.stringify({ id: mockSender._id.toString() }),
					recipient: JSON.stringify({
						id: mockRecipient._id.toString(),
					}),
				});

			expect(response.status).toBe(500);
			expect(response.body.error).toBe("Server error");
		});

		test("should handle case-insensitive search", async () => {
			const mockSender = {
				_id: new mongoose.Types.ObjectId(),
				username: "sender",
			};
			const mockRecipient = {
				_id: new mongoose.Types.ObjectId(),
				username: "recipient",
			};
			const mockMessages = [
				{
					_id: new mongoose.Types.ObjectId(),
					sender: {
						_id: mockSender._id,
						username: mockSender.username,
					},
					recipient: {
						_id: mockRecipient._id,
						username: mockRecipient.username,
					},
					text: "Hello",
					fileUrl: "http://example.com/file1.png",
					timestamp: new Date(),
				},
			];

			const mockFind = {
				populate: jest.fn().mockReturnThis(),
				sort: jest.fn().mockResolvedValue(mockMessages),
			};

			Message.find.mockReturnValue(mockFind);

			const response = await request(app)
				.get("/messages")
				.query({
					sender: JSON.stringify({ id: mockSender._id.toString() }),
					recipient: JSON.stringify({
						id: mockRecipient._id.toString(),
					}),
					query: "hello",
				});

			// Verify that the response status is 200 and the body matches the mock data
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				mockMessages.map((message) => ({
					id: message._id.toString(),
					text: message.text,
					fileUrl: message.fileUrl,
					timestamp: message.timestamp.toISOString(),
					sender: {
						id: message.sender._id.toString(),
						username: message.sender.username,
					},
					recipient: {
						id: message.recipient._id.toString(),
						username: message.recipient.username,
					},
				}))
			);
		});
	});
});
