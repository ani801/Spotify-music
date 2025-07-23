
import express from "express";
import  {accessOrCreatePrivateChat,
createGroupChat,
getUserChats,
renameGroup,
addToGroup,
removeFromGroup,
deleteGroup} from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.route("/private").post(accessOrCreatePrivateChat);
chatRouter.route("/group").post(createGroupChat);
chatRouter.route("/user").get(getUserChats);
chatRouter.route("/rename").put(renameGroup);
chatRouter.route("/add").put(addToGroup);
chatRouter.route("/remove").put(removeFromGroup);
chatRouter.route("/delete/:chatId").delete(deleteGroup);

export default chatRouter;