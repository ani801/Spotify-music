import {addAlbum,listAlbum,removeAlbum} from "../controllers/albumController.js"
import express from "express";
import upload from "../middleware/multer.js";
import { adminAuth } from "../middleware/adminAuth.js";


const albumRouter=express.Router();
albumRouter.post('/add',adminAuth,upload.single('image'),addAlbum)
albumRouter.get('/list',listAlbum)
albumRouter.post('/remove',adminAuth,removeAlbum)

export default albumRouter;