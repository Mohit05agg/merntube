import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config({
    path: './.env'
})



connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{  // ya server pe chaal do vrna hamare localhoast pe 
        console.log(`o server is running at port: ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO db connection is failed !!!",err);

}) 





//1st approach to connect db
/*
import express from "express"
const app = express()


( async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror",(error)=>{
            console.log("error: ",error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`app is listening in port ${process.env.PORT}`);
        })
    }
    catch(error){
        console.error("ERROR:", error)
        throw err
    }

})()  //eifi  function imeediately run ho jayega 
// database connect karne ka best tareeka hai
*/