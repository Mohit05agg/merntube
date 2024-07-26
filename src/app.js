import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origins: process.env.CORS_ORIGIN,
    credentials: true

}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended: true, limit:"16kb"}))

app.use(express.static("public"))

app.use(cookieParser())



// routes import

import userRouter from './routes/user.routes.js'


// routes declaration
app.use("/api/v1/users",userRouter)// yeh hojayega prefix matlab
//http://localhost:8000/users jaise ispe aaya contol dega /users pe yaani user.routes.js ko
// vaha se /register mila to  registerUSer pe jaunga matlab user.controller.js pe
// yaani abb url ban gaya hai //http://localhost:8000/users/register
// users ke baad jitne control hai user.routes.js ami likhe jayenge

export  { app }