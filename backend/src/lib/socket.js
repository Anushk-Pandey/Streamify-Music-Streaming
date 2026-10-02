import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

const userSocketMap = new Map();

export const initSocket = (server) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : []),
  ];

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
      userSocketMap.set(userId, socket.id);
    }

    io.emit("get_online_users", Array.from(userSocketMap.keys()));

    socket.on("send_message", async (data) => {
      try {
        const { senderId, senderName, senderAvatar, receiverId = "community", content, sharedSong } = data;
        const msg = await Message.create({
          senderId,
          senderName,
          senderAvatar,
          receiverId,
          content,
          sharedSong,
        });
        io.emit("receive_message", msg);
      } catch (err) {
        console.error("Socket send_message error:", err.message);
      }
    });

    socket.on("party_sync_track", (payload) => {
      socket.broadcast.emit("party_sync_received", payload);
    });

    socket.on("disconnect", () => {
      if (userId) userSocketMap.delete(userId);
      io.emit("get_online_users", Array.from(userSocketMap.keys()));
    });
  });

  return io;
};
