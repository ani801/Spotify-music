// models/Chat.js
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  name: {
   type: String,
    trim: true,
  },
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null,
  },
  groupAvatar: {
    type: String, // URL to image
    default:"https://www.google.co.in/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fuser%2F&psig=AOvVaw1UcOgu9jcSqxXu1h_6le_6&ust=1737804336617000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPjWvNKfjosDFQAAAAAdAAAAABAJ",
  }
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);
