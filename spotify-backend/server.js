import express from "express";
import "dotenv/config"
import cors from "cors";
import songRouter from "./src/routes/songRoute.js";
import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudinary.js";
import albumRouter from "./src/routes/albumRoute.js"
import userRouter from "./src/routes/userRoute.js"
import cookieParser from "cookie-parser"
import { adminLoginAuth } from "./src/middleware/adminAuth.js";
import {userAuth, userLoginAuth} from "./src/middleware/userAuth.js";
import messageRouter from "./src/routes/messageRoute.js";
import chatRouter from "./src/routes/chatRoute.js";
import http from 'http';
import { Server } from 'socket.io';


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
  origin: "https://spotify-music-frontend.onrender.com", // or '*' to allow all origins (not recommended for production)
  credentials: true // only needed if you're using cookies/auth
}));
// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: 
  {
    origin: "https://spotify-music-frontend.onrender.com",
    credentials: true
  }
});

//Initializing routes
app.get("/",(req,res)=>res.send("Api working"))
app.use("/api/song",songRouter)
app.use("/api/album",albumRouter)
app.use("/api/user",userRouter)
app.get("/api/me",adminLoginAuth)
app.get("/api/userauth",userLoginAuth)
app.post("/api/adminlogout",(req,res)=>{
  res.clearCookie("token")
  res.json({success:true,message:"Logged Out"})
})

//message routes 
app.use("/api/message",userAuth,messageRouter);
//chat routes
app.use("/api/chat",userAuth,chatRouter)

//connect port

//Socket.IO connection
const onlineUsers = new Map(); // userId -> socket.id

io.on("connection", (socket) => {
  console.log(`🔌 New connection: ${socket.id}`);

  // Setup user
  socket.on("setup", (userData) => {
    const userId = userData._id;
    if (!userId) return;

    socket.userId = userId;
    socket.join(userId);
    onlineUsers.set(userId, socket.id);

    console.log(`✅ User ${userId} joined their personal room`);
    socket.emit("connected");

    // Notify all users about updated online status
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  // Join a specific chat room (for real-time group/single chat)
  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log(`💬 User ${socket.userId} joined chat room: ${chatId}`);
  });

  // Typing indicators
  socket.on("typing", (chatId) => {
    socket.in(chatId).emit("typing");
  });

  socket.on("stop typing", (chatId) => {
    socket.in(chatId).emit("stop typing");
  });

  // Handle new message
  socket.on("new message", (newMessage) => {
    const chat = newMessage.chat;
    if (!chat?.users) return;

    console.log(`📨 Message from ${newMessage.sender._id} -> Chat: ${chat._id}`);

    // Emit to all users in chat except sender
    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;

      // Send live message and refresh chats
      socket.in(user._id).emit("message received", newMessage);
      socket.in(user._id).emit("refresh chats");
    });

    // Also broadcast to the chat room (optional for group chats)
    socket.in(chat._id).emit("message received", newMessage);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${socket.id}`);

    if (socket.userId) {
      socket.leave(socket.userId);
      onlineUsers.delete(socket.userId);
      console.log("onlineUsers after disconnect:", Array.from(onlineUsers.keys()));
      io.emit("online-users", Array.from(onlineUsers.keys()));
    }
  });

  // Clean up on setup removal (just in case)
  socket.off("setup", () => {
    console.log(`🚫 Setup removed for ${socket.userId}`);
    if (socket.userId) {
      socket.leave(socket.userId);
      onlineUsers.delete(socket.userId);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    }
  });
});



server.listen(port,()=>console.log(`server started on ${port}`))
