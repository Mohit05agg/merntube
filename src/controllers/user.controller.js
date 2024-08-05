// hamari helper file hai asynchHandler vah requestHandlerr promise se handle kar lenge
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessTokenAndRefreshTokens = async (userId) =>
{
    try{
          const user = await User.findById(userId)
          const accessToken = user.generateAccessToken()
          const refreshToken = user.generateRefreshToken()

         
          user.refreshToken = refreshToken
          await  user.save({validateBeforeSave: false})

          return {accessToken , refreshToken}

         

    } catch (error){
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req,res) =>{
    // //express ami 2 cheeze hoti hao function mai request aur response
    // res.status(200).json({
    //     message: "ok"
    // })  
    // // yeh tab run karega jab URL hit hoga jaise hoga message pass kar dega
    // // to route folder mai saare routing hogi

    // how to get user detail and upload it to cloudinary and then create operation in mongodb
      // steps-
      // 1. get user detail
      // validation check - if not empty
      // check if user already exits
      // check for image or avatar as they are required field in our model
      // upload image to cloudinary
      // create user in mongodb - create object
      // remove password and refresh token field from response
      // check for user creation  - if not return null 
           // return user detail in response

    const {fullname, email,username, password} = req.body  // req.body iss liye bcz frontend se data ayega
    console.log("email:" , email); // 1st step complete ho gaya abb routes maijaakar file handling karni hai next steps ke liye
// check for validation
    // if(fullname === ""){
    //     throw new ApiError(400,"fullname is required")
    // }  1 way to check but we have to check every field .. so not very efficient
    if(  
        [fullname,email,username,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"all fields are required")

    }
    // check if user already exits
    const existedUser = await User.findOne({
        $or: [{ username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"username or email already exists")
    }
    // check for image or avatar as they are required field in our model
   const avatarLocalPath= req.files?.avatar[0]?.path;
   const coverImageLocalPath= req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
    throw new ApiError(400,"avatar is required")
   }
   
   // upload image to cloudinary
  const avatar= await uploadOnCloudinary(avatarLocalPath)
 const coverImage=  await uploadOnCloudinary(coverImageLocalPath)

 if(!avatar){
    throw new ApiError(400,"avatar upload failed")
 }

 //create user in db
 const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",// kya pata coverimage na daali ho user ne
    email,
    password,
    username: username.toLowerCase()

 })

 //check if user created or not
 const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
 )
 if(!createdUser){
    throw new ApiError(500,"user creation failed")}

// return response
return res.status(201).json( new Apiresponse(200, createdUser,"user regitered successfully"))

    
})

// login method
const loginUser = asyncHandler(async(req,res) =>{
    //req body ->data  req body se data chaiye
    //username or email se login karvana
    //password check .. galat ahi to error bhejo 
    // access token and refresh token jab ayega jab password sahi hoga
    //send cookie ... we send tokens in cookies

    const {email,username,password} = req.body

    if(!(username || email)){
        throw new ApiError(400,"username or email is required")
    }
    const user = await User.findOne({
        $or: [{email}, {username}],   // logi user on the basis of email or username
    })
    if(!user){
        throw new ApiError(404,"User does not exist")
    }
    const isPasswordValid =  await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid User credentials")
    }
    // now if paassword is correct we will generate refresh and access tokens
          
  const {accessToken, refreshToken}  = await generateAccessTokenAndRefreshTokens(user._id)
  
  const loggedInUser = await User.findById(user._id).select("-password - refershToken")

  //send cookeis
  const options = {
    httpOnly: true,  // this httpOnly provides functionality to see cookies on server only not on frontend
    secure: true
  }

  return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new Apiresponse(
        200,{
             user: loggedInUser, accessToken, refreshToken
        },  
        "User logged in Successfully"
    )
   )


   // logout method
   const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

   const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

 




}) 

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}