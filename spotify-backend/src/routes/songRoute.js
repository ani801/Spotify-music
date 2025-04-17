import { addSong,listSong,removeSong } from "../controllers/songController.js";
import express from "express";
import upload from "../middleware/multer.js";
import { adminAuth } from "../middleware/adminAuth.js";

const songRouter=express.Router();
songRouter.post('/add',adminAuth,upload.fields([{name:'image',maxCount:1},{name:'audio',maxCount:1}]),addSong)
songRouter.get('/list',listSong)
songRouter.post('/remove',adminAuth,removeSong)

export default songRouter