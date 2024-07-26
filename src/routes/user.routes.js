import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"

const router = Router();

router.route("/register").post(
    upload.fields([ // this is a middleware which helps in uploading file
        {
            name: "avatar",
            maxCount:1
        },
        {
            name: "coverImage",
            maxCount:1

        }
    ]) ,registerUser);
// jaise /register call hoga to post method se registerUser call kar dega


export default router;
 