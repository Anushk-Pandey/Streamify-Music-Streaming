import { Router } from "express";
import {
  getAllSongs,
  getFeaturedSongs,
  getMadeForYouSongs,
  getTrendingSongs,
  incrementPlayCount,
  searchSongs,
} from "../controllers/song.controller.js";

const router = Router();

router.get("/", getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/search", searchSongs);
router.post("/:id/play", incrementPlayCount);

export default router;
