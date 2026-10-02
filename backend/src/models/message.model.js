import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderAvatar: { type: String, default: "" },
    receiverId: { type: String, default: "community" },
    content: { type: String, required: true },
    sharedSong: {
      id: String,
      title: String,
      artist: String,
      imageUrl: String,
      audioUrl: String,
      duration: Number,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
