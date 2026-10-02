import mongoose from "mongoose";
import dotenv from "dotenv";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import { sampleSongs, sampleAlbums, samplePlaylists } from "./sampleTracks.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/streamify";
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    // Clean existing data
    await Song.deleteMany({});
    await Album.deleteMany({});
    await Playlist.deleteMany({});
    console.log("Cleared existing songs, albums, and playlists.");

    // Insert songs
    const createdSongs = await Song.insertMany(sampleSongs);
    console.log(`Inserted ${createdSongs.length} songs.`);

    // Insert albums
    const createdAlbums = await Album.insertMany(sampleAlbums);
    console.log(`Inserted ${createdAlbums.length} albums.`);

    // Insert playlists
    const createdPlaylists = await Playlist.insertMany(samplePlaylists);
    console.log(`Inserted ${createdPlaylists.length} playlists.`);

    console.log("🌱 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
