import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.headers["x-user-id"] || "";
    const users = await User.find({ clerkId: { $ne: currentUserId } }).select("-email");
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const messages = await Message.find({ receiverId }).sort({ createdAt: 1 }).limit(100);
    return res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
