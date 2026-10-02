import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { Playlist } from "../models/playlist.model.js";
import { sampleSongs, sampleAlbums, samplePlaylists } from "../seeds/sampleTracks.js";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/streamify";
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Automatically seed initial catalog if database is empty
    const songCount = await Song.countDocuments();
    if (songCount === 0) {
      console.log("🌱 Database is empty. Seeding initial songs, albums, and playlists...");
      await Song.insertMany(sampleSongs);
      await Album.insertMany(sampleAlbums);
      await Playlist.insertMany(samplePlaylists);
      console.log("✅ Streamify catalog seeded successfully!");
    }
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`);
    console.warn("Streamify will operate in resilient demo mode if MongoDB is not currently running.");
  }
};
