import {v2 as cloudinary} from 'cloudinary';
          
import fs from "fs"


          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
 
 const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
        })
        // file has been uploaded
        // console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)  //remove the locally saved temporary file as the upload operation got failed
        return null;
    }
 }

 const deleteFromCloudinary = async (url)=>{
    try {
        if(!url)return null

        const deleteResponse = await cloudinary.uploader.destroy(url,{
            resource_type: "auto"
        })
        return deleteResponse;
    } catch (error) {
        return null
    }
 }



export  {uploadOnCloudinary, deleteFromCloudinary};