const express = require("express");
const { login, logout } = require("../controllers/authController");
const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", login);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Logout user
 *     description: Logout the current user and end the session.
 *     tags:
 *       - Authentication
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
 *                   example: User logged out successfully
 */
router.post("/logout", logout);

module.exports = router;
