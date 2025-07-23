// models/Group.js
import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
admin:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  description: {
    type: String,
  },
  image: {
    type: String,
    default: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fuser%2F&psig=AOvVaw1UcOgu9jcSqxXu1h_6le_6&ust=1737804336617000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPjWvNKfjosDFQAAAAAdAAAAABAJ',
  },
}, { timestamps: true });

export default mongoose.model('Group', groupSchema);
