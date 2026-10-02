import { Router } from "express";
import {
  getUserPlaylists,
  getAllPublicPlaylists,
  getPlaylistById,
  createPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.get("/user", getUserPlaylists);
router.get("/public", getAllPublicPlaylists);
router.get("/:id", getPlaylistById);
router.post("/", createPlaylist);
router.post("/add-song", addSongToPlaylist);
router.delete("/:playlistId/songs/:songId", removeSongFromPlaylist);
router.delete("/:id", deletePlaylist);

export default router;
