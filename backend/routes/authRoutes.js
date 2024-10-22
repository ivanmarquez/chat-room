const express = require("express");
const { login, logout } = require("../controllers/authController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username
 *                 example: johndoe
 *               token:
 *                 type: string
 *                 description: The user's token (optional)
 *                 example: abc123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user ID
 *                   example: 60d0fe4f5311236168a109ca
 *                 username:
 *                   type: string
 *                   description: The user's username
 *                   example: johndoe
 *                 token:
 *                   type: string
 *                   description: The user's token
 *                   example: abc123
 *       401:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
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
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: User logged out successfully
 *       500:
 *         description: Internal server error
 */
router.post("/logout", logout);

module.exports = router;