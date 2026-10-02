import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";
import path from "path";
import fs from "fs";

export const createSong = async (req, res, next) => {
  try {
    const { title, artist, albumId, duration, genre, audioUrl: providedAudioUrl, imageUrl: providedImageUrl } = req.body;
    let audioUrl = providedAudioUrl;
    let imageUrl = providedImageUrl;

    // If files uploaded via multipart
    if (req.files) {
      if (req.files.audioFile) {
        const uploadedAudio = await uploadToCloudinary(req.files.audioFile);
        if (uploadedAudio) {
          audioUrl = uploadedAudio;
        } else {
          // Local storage fallback
          const audioDir = path.resolve("public/audio");
          if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
          const safeName = `song_${Date.now()}_${req.files.audioFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
          await req.files.audioFile.mv(path.join(audioDir, safeName));
          const host = req.get("host");
          audioUrl = `${req.protocol}://${host}/audio/${safeName}`;
        }
      }
      if (req.files.imageFile) {
        const uploadedImg = await uploadToCloudinary(req.files.imageFile);
        if (uploadedImg) imageUrl = uploadedImg;
      }
    }

    if (!audioUrl) {
      audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    }
    if (!imageUrl) {
      imageUrl = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60";
    }

    const song = await Song.create({
      title: title || "Untitled Track",
      artist: artist || "Unknown Artist",
      audioUrl,
      imageUrl,
      duration: Number(duration) || 180,
      genre: genre || "Electronic",
      albumId: albumId || null,
      plays: 0,
    });

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    return res.status(201).json(song);
  } catch (error) {
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Song deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear, imageUrl: providedImageUrl } = req.body;
    let imageUrl = providedImageUrl;

    if (req.files && req.files.imageFile) {
      const uploadedImg = await uploadToCloudinary(req.files.imageFile);
      if (uploadedImg) imageUrl = uploadedImg;
    }

    if (!imageUrl) {
      imageUrl = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80";
    }

    const album = await Album.create({
      title: title || "New Album",
      artist: artist || "Featured Artist",
      imageUrl,
      releaseYear: Number(releaseYear) || new Date().getFullYear(),
      songs: [],
    });

    return res.status(201).json(album);
  } catch (error) {
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Song.deleteMany({ albumId: id });
    const deleted = await Album.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Album not found" });
    }

    return res.status(200).json({ success: true, message: "Album deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const checkAdmin = async (req, res) => {
  res.status(200).json({ admin: true });
};
