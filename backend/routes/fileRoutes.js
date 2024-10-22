const express = require("express");
const router = express.Router();
const upload = require('../config/multerConfig');
const { uploadFile } = require("../controllers/fileController");

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload a file
 *     tags: 
 *       - Files
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileUrl:
 *                   type: string
 *                   example: "http://localhost:3000/uploads/testfile.png"
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No file uploaded"
 *       500:
 *         description: Internal server error
 */
router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
