import { Router } from "express";
import {loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentuser,
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory
} from "../controllers/user.controller.js"
const router = Router(); 
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount :1
        },
        {
            name:"coverimage",
            maxCount : 1
        }
    ]),
    registerUser)


router.route("/login").post(loginUser)

// secured routes

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/changepassword").post(verifyJWT,changeCurrentPassword)

router.route("/getcurrentuser").post(verifyJWT,getCurrentuser)

router.route("/updateaccountdetails").patch(verifyJWT,updateAccountDetails)


router.route("/updateAvatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)

router.route("/updateCoverImage").post(verifyJWT,upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)

router.route("/history").get(verifyJWT, getWatchHistory)


export default router;