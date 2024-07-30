import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload a file to Cloudinary and handle local file cleanup
const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;

    try {
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // File has been uploaded successfully
        console.log("File uploaded to Cloudinary:", response.url);
        return response;
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Cloudinary upload error:", error);

        // Clean up local file if an error occurs
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

export { uploadOnCloudinary };
