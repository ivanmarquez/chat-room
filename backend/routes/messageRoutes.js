const express = require('express');
const { saveMessage, getMessages } = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Message endpoints
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender:
 *                 type: string
 *               receiver:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, saveMessage);

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema:
 *           type: string
 *       - in: query
 *         name: receiver
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, getMessages);

module.exports = router;
