const express = require('express');
const { getUsers, getConnectedUsers } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The user ID
 *                     example: 60d0fe4f5311236168a109ca
 *                   username:
 *                     type: string
 *                     description: The user's username
 *                     example: johndoe
 *                   token:
 *                     type: string
 *                     description: The user's token
 *                     example: abc123
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, getUsers);

/**
 * @swagger
 * /api/users/connected:
 *   get:
 *     summary: Retrieve a list of connected users
 *     tags: [Users]
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
 *                     type: string
 *                     description: The user ID
 *                     example: 60d0fe4f5311236168a109ca
 *                   username:
 *                     type: string
 *                     description: The user's username
 *                     example: johndoe
 *       500:
 *         description: Internal server error
 */
router.get('/connected-users', getConnectedUsers);

module.exports = router;