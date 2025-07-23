import express from "express";
import { getMessages, sendMessage } from "../controllers/messageController.js";
const messageRouter = express.Router();

messageRouter.get("/:chatId",getMessages )
messageRouter.post("/", sendMessage)
export default messageRouter;