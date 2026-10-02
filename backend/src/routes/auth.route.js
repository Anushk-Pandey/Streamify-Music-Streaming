import { Router } from "express";
import { authCallback, getCurrentUser } from "../controllers/auth.controller.js";

const router = Router();

router.post("/callback", authCallback);
router.get("/me", getCurrentUser);

export default router;
