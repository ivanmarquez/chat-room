const express = require('express');
const { getUsers, getConnectedUsers } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User endpoints
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, getUsers);


/**
 * @swagger
 * /connected-users:
 *   get:
 *     summary: Get connected users
 *     description: Retrieve a list of users currently connected to the chat room.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of connected users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Usuario 1"
 */
router.get('/connected-users', getConnectedUsers);

module.exports = router;
