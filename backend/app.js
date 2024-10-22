const express         = require("express");
const cors            = require("cors");
const fs              = require('fs');
const path            = require('path');
const connectDB       = require("./config/db");
const authRoutes      = require("./routes/authRoutes");
const userRoutes      = require("./routes/userRoutes");
const messageRoutes   = require("./routes/messageRoutes");
const fileRoutes      = require('./routes/fileRoutes');
const swagger         = require("./swagger");
const dotenv          = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, process.env.UPLOADS_DIR || 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(process.env.UPLOADS_STATIC_DIR, express.static(uploadsDir));

connectDB().catch((error) => console.error("MongoDB connection error:", error));

swagger(app);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use('/api/files', fileRoutes);

module.exports = app;
