import { Playlist } from "../models/playlist.model.js";

export const getUserPlaylists = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || "user_streamify_guest";
    const playlists = await Playlist.find({
      $or: [{ userId }, { isPublic: true }],
    }).populate("songs");
    return res.status(200).json(playlists);
  } catch (error) {
    next(error);
  }
};

export const getAllPublicPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ isPublic: true }).populate("songs");
    return res.status(200).json(playlists);
  } catch (error) {
    next(error);
  }
};

export const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id).populate("songs");
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    return res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const createPlaylist = async (req, res, next) => {
  try {
    const { title, description, imageUrl } = req.body;
    const userId = req.headers["x-user-id"] || "user_streamify_guest";
    const userName = req.headers["x-user-name"] || "Listener";

    const playlist = await Playlist.create({
      title: title || "My Playlist",
      description: description || "",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60",
      userId,
      userName,
      songs: [],
      isPublic: true,
    });

    return res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.body;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    const updated = await Playlist.findById(playlistId).populate("songs");
    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
    await playlist.save();

    const updated = await Playlist.findById(playlistId).populate("songs");
    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Playlist.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    return res.status(200).json({ success: true, message: "Playlist deleted" });
  } catch (error) {
    next(error);
  }
};
