import mongoose, { Types } from "mongoose"
import {Comment, } from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if (!videoId) {
        throw new ApiError(400,"Video Id is required for get all comments");
    }

    const options ={
        page,
        limit,
    }

    const videoComments = await Comment.aggregate([
        {
            $match: {
              video : new mongoose.Types.ObjectId(videoId)
            }
          },
          {
            $project: {
              content:1
            }
          }
    ])

    if (!videoComments) {
        throw new  ApiError(400, "error while getting commenmts")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, videoComments, "comments get successfully"))



})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body

    if (!content) {
        throw new ApiError(400, "comment is required")
    }
    if (!videoId) {
        throw new ApiError(400, "videoId id required to create comment")
    }

    const comment = await Comment.create(
        {
            content:content,
            video : new mongoose.Types.ObjectId(videoId),
            owner: new mongoose.Types.ObjectId(req.user?._id)
        }
    )

    const createdComment = await Comment.findById(comment._id)

    if (!createdComment) {
        throw new ApiError(400, "error while adding comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(400, createdComment, "comment added successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {content } = req.body
    const {commentId}= req.params
    
    const commentExist = await Comment.findById(commentId)

    if (!commentExist) {
        throw new ApiError(400, "comment is not exists")
    }

    if (!content) {
        throw new ApiError(400, "comment is required")
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId, {
            $set:{
                content : content
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment updated successfully"))

    
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    if (!commentId) {
        throw new ApiError(400, "commeniId is required")
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    res
    .status(200)
    .json(new ApiResponse(200, deleteComment, "comment deleted successfully"))

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }