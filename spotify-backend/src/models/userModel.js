import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [20, "Name must be at most 20 characters long"],
      minlength: [3, "Name must be at least 3 characters long"],
    },
    // Either email or phone must be provided
    // username:{
    //   type: String,
    //   // required: [true, "Username is required"],
    //   unique: true,
    //   trim: true,
    // },
    contact: {
      type: String,
      trim: true,
      required: [true, "Contact is required"],
      
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
     pic:{type:String,
        default:"https://www.google.co.in/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fuser%2F&psig=AOvVaw1UcOgu9jcSqxXu1h_6le_6&ust=1737804336617000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPjWvNKfjosDFQAAAAAdAAAAABAJ"
    },
      groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  }],
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
  friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
  isArtist: {
    type: Boolean,
    default: false
  }},
  { timestamps: true }
);


const User = mongoose.model("User", userSchema);
export default User;
