import express from "express";
import cors from "cors"
import "dotenv/config"
import songRouter from "./src/routes/songRoute.js";
import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudinary.js";
import albumRouter from "./src/routes/albumRoute.js"
import userRouter from "./src/routes/userRoute.js"
import cookieParser from "cookie-parser"
import { adminLoginAuth } from "./src/middleware/adminAuth.js";

//App config
const app=express()
const port=process.env.PORT||4000
connectDB()
connectCloudinary()



//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(cors({
  origin:"https://spotify-music-admin.onrender.com", // Your frontend URL
  credentials: true // Allow cookies to be sent
}));



//Initializing routes
app.get("/",(req,res)=>res.send("Api working"))
app.use("/api/song",songRouter)
app.use("/api/album",albumRouter)
app.use("/api/user",userRouter)
app.get("/api/me",adminLoginAuth)
app.post("/api/adminlogout",(req,res)=>{
  res.clearCookie("token")
  res.json({success:true,message:"Logged Out"})
})




//connect port
app.listen(port,()=>console.log(`server started on ${port}`))