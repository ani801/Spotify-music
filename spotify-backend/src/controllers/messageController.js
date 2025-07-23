
import asyncHandler from 'express-async-handler';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import Chat from '../models/chatModel.js';
const getMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { before, limit = 20 } = req.query;

    if (!chatId) {
        return res.status(400).json({ success: false, message: 'Chat ID is required' });
    }

    try {
        const query = { chat: chatId };

        // If a `before` message ID is provided, only fetch messages older than that
        if (before) {
            query._id = { $lt: before };
        }

        // Fetch messages sorted by newest first
        const messages = await Message.find(query)
            .sort({ _id: -1 }) // Newest to oldest
            .limit(Number(limit))
            .populate('sender', 'name email')
            .populate('chat');

        // Check if there are more older messages
        const hasMore = messages.length === Number(limit);

        res.json({
            success: true,
            messages,
            hasMore,
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


const sendMessage = asyncHandler(async (req, res) => {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
        return res.status(400).json({ success: false, message: 'Chat ID and content are required' });
    }

    try {
        const newMessage = new Message({
            sender: req.user._id,
            chat: chatId,
            content
        });

        const savedMessage = await newMessage.save();
        // Populate the saved message with sender and chat details
     const populatedMessage = await Message.findById(savedMessage._id).populate('sender', 'name email').populate('chat');

        // Update the latest message in the chat
        await Chat.findByIdAndUpdate(chatId, { latestMessage: populatedMessage._id }, { new: true });

        res.json({ success: true, message: populatedMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export { getMessages, sendMessage };