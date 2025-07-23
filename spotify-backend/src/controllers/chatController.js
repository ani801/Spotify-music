import expressAsyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

 const accessOrCreatePrivateChat = expressAsyncHandler(async (req, res) => {
    const { friendId } = req.body;
    const userId = req.user._id;

    if (!friendId) return res.status(400).json({ success: false, error: 'friendId is required' });

    try {
      // Check if friendId is in user's friends list
      const user = await User.findById(userId);
      if (!user.friends.includes(friendId)) return res.status(403).json({ success: false, error: 'Not a friend' });

      // Search for existing chat
      let chat = await Chat.findOne({
        isGroupChat: false,
        users: { $all: [userId, friendId], $size: 2 },
      }).populate('users', '-password').populate('latestMessage');
  
      if (chat) return res.status(200).json({success: true, chat});
  
      // Create new chat
      chat = await Chat.create({
        users: [userId, friendId],
      });
  
      const fullChat = await Chat.findById(chat._id).populate('users', '-password');
      return res.status(201).json( { success: true, fullChat });
    } catch (err) {
      res.status(500).json({success: false, error: err.message });
    }
  });

  // Get All Chats for User
  const getUserChats = expressAsyncHandler(async (req, res) => {
    try {
      const chats = await Chat.find({ users: req.user._id })
        .populate('users', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 });

      res.status(200).json({ success: true, chats });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Create Group Chat
 const createGroupChat = expressAsyncHandler(async (req, res) => {
    const { name, users } = req.body; // users = array of friend IDs
    const userId = req.user._id;
  
    if (!users || users.length < 2) {
      return res.status(400).json({ success: false, error: 'At least 2 friends required to create a group' });
    }
  
    try {
      const currentUser = await User.findById(userId);
      for (let id of users) {
        if (!currentUser.friends.includes(id)) {
          return res.status(403).json({ success: false, error: `User ${id} is not your friend` });
        }
      }
  
      const chat = await Chat.create({
        name,
        users: [...users, userId],
        isGroupChat: true,
      });
  
      const fullGroup = await Chat.findById(chat._id).populate('users', '-password');
      res.status(201).json({ success: true, fullGroup });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Rename Group
  const renameGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, newName } = req.body;
    try {
      const chat = await Chat.findByIdAndUpdate(
        chatId,
        { name: newName },
        { new: true }
      ).populate('users', '-password');

      if (!chat) return res.status(404).json({ success: false, error: 'Group not found' });
      res.status(200).json({ success: true, chat });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Add to Group
  const addToGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userIdToAdd } = req.body;
  
    try {
      const currentUser = await User.findById(req.user._id);
      if (!currentUser.friends.includes(userIdToAdd)) {
        return res.status(403).json({ success: false, error: 'Can only add friends to group' });
      }
  
      const chat = await Chat.findByIdAndUpdate(
        chatId,
        { $addToSet: { users: userIdToAdd } },
        { new: true }
      ).populate('users', '-password');

      if (!chat) return res.status(404).json({ success: false, error: 'Group not found' });
      res.status(200).json({ success: true, chat });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Remove from Group
 const removeFromGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userIdToRemove } = req.body;
  
    try {
      const chat = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userIdToRemove } },
        { new: true }
      ).populate('users', '-password');

      if (!chat) return res.status(404).json({ success: false, error: 'Group not found' });
      res.status(200).json({ success: true, chat });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });


   const deleteGroup = expressAsyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user._id;
  
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) return res.status(404).json({ success: false, error: 'Group not found' });
  
      if (!chat.users.includes(userId))
        return res.status(403).json({ success: false, error: 'You are not a member of this group' });

      // Optional: Only allow group creator/admin to delete (requires groupAdmin field)
      // if (chat.groupAdmin.toString() !== userId.toString()) {
      //   return res.status(403).json({ error: 'Only admin can delete group' });
      // }
  
      // Delete messages associated with this group
      await Message.deleteMany({ chat: chatId });
  
      // Delete the group chat
      await Chat.findByIdAndDelete(chatId);

      res.status(200).json({ success: true, message: 'Group deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

export {
  accessOrCreatePrivateChat,
  createGroupChat,
  getUserChats,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteGroup,
};
