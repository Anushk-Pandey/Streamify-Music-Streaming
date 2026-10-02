import { Router } from "express";
import { getAllUsers, getMessages } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/messages/:receiverId", getMessages);

export default router;
