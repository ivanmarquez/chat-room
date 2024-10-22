const express = require("express");
const router = express.Router();
const upload = require('../config/multerConfig');
const { uploadFile } = require("../controllers/fileController");

/**
 * @swagger
 * /upload:
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
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
