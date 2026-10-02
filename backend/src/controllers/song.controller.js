import { Song } from "../models/song.model.js";

export const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (err) { next(err); }
};

export const getFeaturedSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([{ $sample: { size: 6 } }]);
    res.status(200).json(songs);
  } catch (err) { next(err); }
};

export const getMadeForYouSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([{ $sample: { size: 4 } }]);
    res.status(200).json(songs);
  } catch (err) { next(err); }
};

export const getTrendingSongs = async (req, res, next) => {
  try {
    const songs = await Song.find().sort({ plays: -1 }).limit(4);
    res.status(200).json(songs);
  } catch (err) { next(err); }
};

export const incrementPlayCount = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, { $inc: { plays: 1 } }, { new: true });
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.status(200).json({ success: true, plays: song.plays });
  } catch (err) { next(err); }
};

export const searchSongs = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json([]);
    const regex = new RegExp(q, "i");
    const songs = await Song.find({ $or: [{ title: regex }, { artist: regex }, { genre: regex }] });
    res.status(200).json(songs);
  } catch (err) { next(err); }
};
