const mongoose = require("mongoose");
const Message = require("../models/Message");
const User = require("../models/User");

exports.saveMessage = async (req, res) => {
	const { sender, recipient, text, fileUrl } = req.body;

	try {
		// Find sender and recipient by username
		const senderUser = await User.findById(sender.id);
		const recipientUser = await User.findById(recipient.id);

		if (!senderUser || !recipientUser) {
			return res.status(404).json({ error: "User not found" });
		}

		const message_save = new Message({
			sender: senderUser._id,
			recipient: recipientUser._id,
			text: text,
			fileUrl: fileUrl,
		});
		await message_save.save();

		const message = {
			id: message_save._id,
			sender: sender,
			recipient: recipient,
			text: text,
			fileUrl: fileUrl,
			timestamp: message_save.timestamp,
		};
		res.status(201).json(message);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getMessages = async (req, res) => {
	const { sender, recipient, query } = req.query;
	try {
		// Parse the JSON strings back into objects
		const senderObj = JSON.parse(sender);
        const senderId = new mongoose.Types.ObjectId(senderObj.id);

        let searchCriteria = {
            $or: [
                { sender: senderId},
                { recipient: senderId },
            ],
        };

        if (recipient) {
            const recipientObj = JSON.parse(recipient);
            const recipientId = new mongoose.Types.ObjectId(recipientObj.id);

            searchCriteria = {
                $or: [
                    { sender: senderId, recipient: recipientId },
                    { sender: recipientId, recipient: senderId },
                ],
            };
        }

		if (query) {
			searchCriteria.text = { $regex: query, $options: "i" }; 
		}
        
		const messages = await Message.find(searchCriteria)
			.populate("sender", "id username token")
			.populate("recipient", "id username token")
			.sort({ timestamp: 1 });

		// Transform the result to replace _id with id
		const transformedMessages = messages.map((message) => {
			return {
				id: message._id,
				text: message.text,
                fileUrl: message.fileUrl,
				timestamp: message.timestamp,
				sender: {
					id: message.sender._id,
					username: message.sender.username,
				},
				recipient: {
					id: message.recipient._id,
					username: message.recipient.username,
				},
			};
		});

		res.json(transformedMessages);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
