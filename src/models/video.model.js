import mongoose,{Schema} from "mongoose";
//v v import
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema(
    {
        videoFile:{
            type: String, // cloudinary url
            required: true
        },
        thumbnail:{
            type: String, // cloudinary url
            required: true

        },
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String, 
            required: true
        },
        duration:{
            type: Number,  //cloudinary
            required: true
        },
        views: {
            type:Number,
            defualt:0
        },
        isPublish:{
            type:Boolean,
            defualt:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }




},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)


export const Video = mongoose.model("Video",videoSchema)