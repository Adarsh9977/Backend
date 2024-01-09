import { Router } from "express";
import {loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, getCurrentuser, updateAccountDetails, updateUserAvatar, updateUserCoverImage} from "../controllers/user.controller.js"
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

router.route("/updateaccountdetails").post(verifyJWT,updateAccountDetails)


router.route("/updateAvatar").post(updateUserAvatar)

router.route("/updateCoverImage").post(updateUserCoverImage)
export default router;