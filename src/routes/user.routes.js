import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"

import { verifyJWT } from "../middleware/auth.middleware.js";

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
 

router.route("/register").post(loginUser)

//secured routes
// secure karnege authmiddleware se
router.route("/logout").post(verifyJWT,logoutUser)










export default router;
 