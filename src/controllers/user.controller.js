// hamari helper file hai asynchHandler vah requestHandlerr promise se handle kar lenge
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/ApiResponse.js";


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
    const existedUser = User.findOne({
        $or: [{ username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"username or email already exists")
    }
    // check for image or avatar as they are required field in our model
   const avatarLocalPath= req.files?.avatar[0]?.path;
   const coverImageLoacalPath= req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
    throw new ApiError(400,"avatar is required")
   }
   
   // upload image to cloudinary
  const avatar= await uploadOnCloudinary(avatarLocalPath)
 const coverImage=  await uploadOnCloudinary(coverImageLoacalPath)

 if(!avatar){
    throw new ApiError(400,"avatar upload failed")
 }

 //create user in db
 const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage.url?.url || "",// kya pata coverimage na daali ho user ne
    email,
    password,
    username: username.toLowerCase()

 })

 //check if user created or not
 const createdUser = User.findById(user._id).select(
    "-password -refreshToken"
 )
 if(!createdUser){
    throw new ApiError(500,"user creation failed")}

// return response
return res.status(201).json( new Apiresponse(200, createdUser,"user regitered successfully"))

    
})

export {registerUser}