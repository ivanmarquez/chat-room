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
 *               recipient:
 *                 type: string
 *               text:
 *                 type: string
 *               fileUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       401:
 *         description: Unauthorized
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
 *         name: recipient
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   text:
 *                     type: string
 *                   fileUrl:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                   sender:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       username:
 *                         type: string
 *                   recipient:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       username:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, getMessages);

module.exports = router;
