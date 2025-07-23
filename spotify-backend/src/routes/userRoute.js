import express from "express";
import { adminLogin,userLogin ,userSignup,userDetails,getFriends,getFriendRequests,getSuggestions,acceptFriend,addFriendRequest} from "../controllers/userController.js";
import { userAuth } from "../middleware/userAuth.js";

const userRouter=express.Router()

userRouter.post("/adminlogin",adminLogin)
userRouter.post("/login",userLogin)
userRouter.post("/logout",userAuth,(req,res)=>{
    res.clearCookie("token")
    res.json({success:true,message:"Logged Out"})
})
userRouter.post("/signup",userSignup)
userRouter.get("/userdetails",userDetails)
userRouter.get("/friends",userAuth,getFriends)
userRouter.get("/friendRequests",userAuth,getFriendRequests)
userRouter.get("/suggestions",userAuth,getSuggestions)
userRouter.post("/acceptfriend",userAuth,acceptFriend)
userRouter.post("/addfriendrequest",userAuth,addFriendRequest)

export default userRouter