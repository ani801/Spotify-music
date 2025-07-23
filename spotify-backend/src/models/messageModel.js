// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat', // or Group
    required: true,
  },
  content: {
    type: String,
    default: '',
  },
  // messageType: {
  //   type: String,
  //   enum: ['text', 'song', 'album', 'image'],
  //   default: 'text',
  // },
  // song: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Song',
  //   default: null,
  // },
  // album: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Album',
  //   default: null,
  // },
  // imageUrl: {
  //   type: String,
  //   default: null, // This will store the uploaded image's URL or path
  // },
}, { timestamps: true });

export default mongoose.model('Message', messageSchema)