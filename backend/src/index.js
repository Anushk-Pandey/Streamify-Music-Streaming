import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import { initSocket } from "./lib/socket.js";

import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import playlistRoutes from "./routes/playlist.route.js";
import userRoutes from "./routes/user.route.js";
import statRoutes from "./routes/stat.route.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize WebSockets
initSocket(server);

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : []),
];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: path.join(__dirname, "../temp"), createParentPath: true, limits: { fileSize: 20 * 1024 * 1024 } }));
app.use("/audio", express.static(path.join(__dirname, "../public/audio")));

// Health API
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok", app: "Streamify API" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/admin", adminRoutes);

// Error Handler
app.use((err, req, res, next) => res.status(err.status || 500).json({ message: err.message || "Server Error" }));

// Start
server.listen(PORT, () => {
  console.log(`🎵 Streamify Server running on http://localhost:${PORT}`);
  connectDB();
});
