import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} =req.body
    if (!content) {
        throw new ApiError(400, "content is required")
    }
    const tweet=await Tweet.create({
        content:content.trim(),
        owner: new mongoose.Types.ObjectId(req.user?._id)
    })
    if (!tweet) {
        throw new ApiError(400, "error while tweet")
    }

   const createdTweet = await Tweet.findById(tweet._id)

   if (!createdTweet) {
    throw new ApiError(400, "tweet is not created ")
   }

   return res
   .status(200)
   .json(new ApiResponse(200, createdTweet, "tweet is created"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId}= req.params

    if (!userId) {
        throw new ApiError(400, "userId is required ")
    }

    const userExists = await User.findById(userId)

    if (!userExists) {
        throw new ApiError(400, "User not found")
    }

    const userTweets = await Tweet.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $project:{
                content:1,
                createdAt:1,
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, userTweets, "get user tweets")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId}= req.params
    const {content} = req.body

    if(!tweetId){
        throw new ApiError(400, "tweetId is required")
    }

    const tweetExists = await Tweet.findById(tweetId)
    if (!tweetExists) {
        throw new ApiError(400, "no tweet exists")
    }

    const updatedtweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{
                content:content
            },
        },{
            new:true
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, updatedtweet, "Twwet id updated"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}= req.params

    if (!tweetId) {
        throw new ApiError(400, "tweetId is required")
    }
    const tweetIsExists = await Tweet.findById(tweetId)

    if (!tweetIsExists) {
        throw new ApiError(400, "tweet of this Id is not exists")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    return res
    .status(200)
    .json(new ApiResponse(200, deletedTweet, "tweet is deleted"))
})



export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}