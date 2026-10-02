import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { Album } from "../models/album.model.js";

export const getStats = async (req, res, next) => {
  try {
    const [totalSongs, totalUsers, totalAlbums, uniqueArtists, streamSum] = await Promise.all([
      Song.countDocuments(),
      User.countDocuments(),
      Album.countDocuments(),
      Song.aggregate([
        { $unionWith: { coll: "albums", pipeline: [] } },
        { $group: { _id: "$artist" } },
        { $count: "count" },
      ]),
      Song.aggregate([
        { $group: { _id: null, total: { $sum: "$plays" } } },
      ]),
    ]);

    const totalArtists = uniqueArtists[0]?.count || 0;
    const totalStreams = streamSum[0]?.total || 0;

    res.status(200).json({
      totalSongs,
      totalAlbums,
      totalUsers,
      totalArtists,
      totalStreams,
    });
  } catch (error) {
    next(error);
  }
};
