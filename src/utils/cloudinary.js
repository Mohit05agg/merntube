import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

//use ty catch because in file uploading is as sensitive as database

// this is a method to uplooad the file on localserver first then on cloudinary this is a two steps process , we can upload directly on cloudinary  also but that is not efficient
const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null
        // upload the file one cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto"
        })
       // file has been uploaded successfull
       console.log("file is uploaded on cloudinary",response.url);
       return response;

        }
        catch(error){
            fs.unlinkSync(localFilePath) // remove the locally saved temporaray file as the upload operation got fauled
              return null;
        }
    }

