import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation - not empty
  // check if user is already exists
  //check for images , check for avatar
  // upload them to cloudinary , avatar
  //create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullname, email, username, password } = req.body;
//   console.log("email : ", email);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({
    $or : [{ username }, { email }]
  })
  if (existedUser) {
    throw new ApiError(409, "User with email or username is already existed");
  }
// console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverimage[0]?.path;


  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
    coverImageLocalPath = req.files.coverimage[0].path
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required")
  }

  const avatar =  await uploadOnCloudinary(avatarLocalPath)
  const coverimage = await uploadOnCloudinary(coverImageLocalPath)

if (!avatar) {
    throw new ApiError(400, "Avatar file is required")
}

const user = await User.create({
    fullname,
    avatar : avatar.url,
    coverimage : coverimage?.url || "",
    email,
    password,
    username,
})

const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

if(!createdUser){
    throw new ApiError(500, "something wentwrong while registering a user ")
}

return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
)

});

export default registerUser;
