import mongoose, {isValidObjectId, mongo} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if (!channelId) {
        throw new ApiError(400, "channelId is required")
    }
    const subscribe = await Subscription.findOne({
        $and:[
            {channel: new mongoose.Types.ObjectId(channelId)},
           { susbcriber: new mongoose.Types.ObjectId(req.user?._id)}
        ]
    })

    if (!subscribe) {
        const subscriber = await Subscription.create(
            {
                channel : new mongoose.Types.ObjectId(channelId),
                susbcriber: new mongoose.Types.ObjectId(req.user?._id)
            }
        )
        if (!subscriber) {
            throw new ApiError(400, "error while toggle subscription")
        }
    }
    
    else{
        await Subscription.findByIdAndDelete(subscribe._id)
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{}, "subscription toggle successfully" ))

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if (!channelId) {
        throw new ApiError(400, "channelId id required")
    }
    const subscribers = await Subscription.aggregate([
        {
            $match:{
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $project:{
                username:1,
                fullname:1,
                avatar:1
            }
        }
    ])



    
    return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "subscribers list "))

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!subscriberId) {
        throw new ApiError(400, "subscriberId is required")    
    }

    const channelList = await Subscription.aggregate([
        {
            $match:{
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $project:{
                username:1,
                fullname:1,
                avatar:1,
            }
        }
    ])
    return res
    .status(200)
    .json(new ApiResponse(200, channelList, "get channel lit successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}