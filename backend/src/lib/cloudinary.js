import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export const uploadToCloudinary = async (file) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.warn("⚠️ Cloudinary credentials missing in .env. Using mock/temp fallback.");
      return null;
    }
    const response = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return response.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Error uploading to Cloudinary");
  }
};

export default cloudinary;
