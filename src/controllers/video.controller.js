import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    


})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if([title, description].some((field)=>field?.trim()==="")){
        throw new ApiError(400, "All fields are required")
    }

    const viedoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    // console.log(thumbnailLocalPath);

    if(!viedoLocalPath){
        throw new ApiError(400, "video file is required")
    }

    if(!thumbnailLocalPath){
        throw new ApiError(400, "thumbnail is required")
    }

    const video = await uploadOnCloudinary(viedoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!video){
        throw new ApiError(400,"videofile is not uploaded on cloudinary")
    }

    if(!thumbnail){
        throw new ApiError(400, " thumbnail file is mnot uploaded on cloudinary")
    }
console.log(video.duration);
    const uploadedVideo = await Video.create({
        title:title,
        description:description,
        videoFile: video.url,
        thumbnail : thumbnail.url,
        duration: video.duration,
        // isPublished: isPublished,
        owner : new mongoose.Types.ObjectId(req.user._id)

    })
    if(!uploadedVideo){
        throw new ApiError(400, "something went wrong on uploading video")
    }

    const createdVideo = await Video.findById(uploadedVideo._id);

    if(!createdVideo){
        throw new ApiError(400, "something went wrong while creating video")
    }

    return res.status(200)
    .json(new ApiResponse(200, createdVideo, "video uploaded successfully"))


})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const videos = Video.findById(videoId)
    if(!videos){
        throw new ApiError(400,"not get any video")
    }

    
    console.log(videoId);
    // console.log(videos);

    // const id = `${videoId}`
    // console.log(id);

    const myvideo = await Video.aggregate([
        {
            $match:{
                _id : new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"video",
                as:"totalLikes"
            }
        },
        {
            $lookup:{
                from: "user",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                        $lookup:{
                            from:"subscriptions",
                            localField:"_id",
                            foreignField:"channel",
                            as:"subscribers"
                        }
                    },
                    {
                        $addFields:{
                            subscribersCount:{
                                $size:"$subscribers"
                            },
                             isSubscribed:{
                                $cond:{
                                    if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                                    then: true,
                                    else: false
                                }
                                }
                            
                        }
                    },
                    {
                        $project:{
                            fullName: 1,
                            username: 1,
                            subscribersCount: 1,
                            isSubscribed: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
           $addFields:{
            owner:{
                $first:"$owner"
            },
             totalLikes:{
                    $size:"$totalLikes"
                },
            isLiked:{
                $cond:{
                    if : {$in:[ req.user?._id,"$totalLikes.likedBy"]},
                    then:true,
                    else:false
                }
            }
            
           } 
        },
        {
        $project:
        {
            totalLikes:"0",
            fullName: 1,
            username: 1,
            subscribersCount: 1,
            isSubscribed: 1,
            avatar: 1,
        }
        }
    ])
    return res.status(200)
    .json(new ApiResponse(200, myvideo, "Get video successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const {title, description} = req.body

    const thumbnailLocalPath = req.file?.path

    console.log(thumbnailLocalPath);

    //TODO: update video details like title, description, thumbnail
    if(!title && !description){
        throw new ApiError(400, "title or description required")
    }

    if (!videoId){
        throw new ApiError(400, "videoID is not valid")
    }

    // const video = await Video.findById(videoId)

    if(!Video.findById(videoId)){
        throw new ApiError(400, `video with id ${videoId} is not found`)
    }
    if(!thumbnailLocalPath){
        throw new ApiError(400, " thumbnail path not recieved") 
    }
   
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    
    if (!thumbnail.url) {
        throw new ApiError(400, "Error while uploading thumbnail on cloudinary");
    }
    const video = await Video.findByIdAndUpdate(videoId,
        {
            $set:{
                thumbnail: thumbnail.url,
                description: description,
                title:title
            }
        },
        {
            new:true
        }
        ).select("-password")
    
    
    
    

//    await video.save({validateBeforeSave: false});

   return res
   .status(200)
   .json(new ApiResponse(200, video," video updated successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    // const video = await Video.findById(videoId);

    if(!Video.findById(videoId) ){
        throw new ApiError(400, `video of id ${videoId} is not found`) 
    }

    const deleteVideo = await Video.findByIdAndDelete(videoId)

    const video = await Video.findById(videoId)
    if (video) {
        throw new ApiError(400, "error while deleting the video")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "video deleted sucessfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
