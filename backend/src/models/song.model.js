import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true, // Duration in seconds
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: false,
    },
    plays: {
      type: Number,
      default: 0,
    },
    genre: {
      type: String,
      default: "Pop",
    },
  },
  { timestamps: true }
);

export const Song = mongoose.model("Song", songSchema);
