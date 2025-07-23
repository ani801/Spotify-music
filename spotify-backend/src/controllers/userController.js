// Route for admin login
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import  User  from '../models/userModel.js'; // Assuming you have a User model defined
dotenv.config();

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password exist
    if (!email || !password) {
      return res.status(400).json({ success: false, message:"Email and password are required." });
    }

    // Check credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'Lax', // Use 'None' with secure: true if cross-site cookie is needed
        secure:false, // true only on HTTPS: process.env.NODE_ENV === 'production'
        maxAge: 3*3600000 // 1 hour
      });

      return res.status(200).json({ success: true, message: "Logged In" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const userLogin = async (req, res) => 
  {
    try {
        const { contact, password } = req.body;
    
        // Validate email and password exist
        if (!contact || !password) {
          return res.status(400).json({ success: false, message: "Email and password are required." });
        }
    
        // Check credentials (this is just a placeholder, replace with actual user validation)
        const user = await User.findOne({ contact });
        if (!user) {
          return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        // Check password (this is just a placeholder, replace with actual password validation)
        

        if ( user.password === password) {
          const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET, { expiresIn: "3h" });
    
          res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Lax', // Use 'None' with secure: true if cross-site cookie is needed
            secure:false, // true only on HTTPS: process.env.NODE_ENV === 'production'
            maxAge: 3*3600000 // 1 hour
          });
    
          return res.status(200).json({ success: true, message: "Logged In" });
        } else {
          return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    
      } catch (error) {
        console.error("User login error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
      }
  }

  const userSignup = async (req, res) => {
    try {
        const { name, contact, password,pic } = req.body;
    
        // Validate email and password exist
        if (!name || !contact || !password) {
          return res.status(400).json({ success: false, message: "Name, Contact and Password are required." });
        }
        const existingUser = await User.findOne({ contact });

    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists with this contact." });
    }
     let newUser ={};
    if(pic.length > 0){

         newUser = new User({ name, contact, password, pic });
    }else{
         newUser = new User({ name, contact, password });
    }
        await newUser.save();
    
        return res.status(201).json({ success: true, message: "User signed up successfully" });
    
      } catch (error) {
        console.error("User signup error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
      }
  }

  const userDetails = async (req, res) => {
    try {
        const token = req.cookies.token;
    
        if (!token) {
          return res.status(401).json({ success: false, message: "Not logged in" });
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // Assuming the token contains the user ID
    
        const user = await User.findById(userId).select("-password"); // Exclude password from the response
    
        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
      } catch (error) {
        console.error("User details error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
      }

  }

//fetch users friends list
const getFriends = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const userId = req.user.id; // Assuming user ID is available in req.user

    const user = await User.findById(userId).populate({
      path: 'friends',
      options: { skip: parseInt(skip), limit: parseInt(limit) },
      select: '_id name username pic',

    });
    
    res.status(200).json({
      success: true,
      friends: user.friends,
      totalFriends: user.friends.length,
      hasMore: user.friends.length === parseInt(limit),
    });

  } catch (error) {
    console.error("Get friends error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const userId = req.user.id; // Assuming user ID is available in req.user

    const user = await User.findById(userId).populate({
      path: 'friendRequests',
      options: { skip: parseInt(skip), limit: parseInt(limit) },
      select: '_id name username pic',

    });
    console.log("User friend requests:", user.friendRequests);
    res.status(200).json({
      success: true,
      friendRequests: user.friendRequests,
      totalFriendRequests: user.friendRequests.length,
      hasMore: user.friendRequests.length === parseInt(limit),
    });

  } catch (error) {
    console.error("Get friend requests error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getSuggestions = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Find the user and populate friends
    const user = req.user; // Assuming user is already populated in req.user

    // Get the IDs of the user's friends
    const friendIds = user.friends.map(friend => friend._id);

    // Find users who are not friends
    const nonFriends = await User.find({ _id: { $ne: userId, $nin: friendIds } })
      .select('_id name username pic')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      suggestions: nonFriends,
      totalSuggestions: nonFriends.length,
      hasMore: nonFriends.length === parseInt(limit),
    });

  } catch (error) {
    console.error("Get non-friends error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const acceptFriend = async (req, res) => {
 try {
    // Assuming the friend ID is sent in the request body
    if (!req.body.friendId) {
      return res.status(400).json({ success: false, message: "Friend ID is required" });
    }
  
   const userId = req.user.id; // Assuming user ID is available in req.user
   const friendId = req.body.friendId; // Friend ID to be added
  
    // Find the user and check if they are already friends
  
    const user = req.user;
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      //remove from friend requests
     if(user.friendRequests.includes(friendId)) user.friendRequests = user.friendRequests.filter(request => request.toString() !== friendId);
      // Find the friend and add the user to their friends list
      await user.save();
      const friend = await User.findById(friendId);
      if (friend) {
        if(friend.friendRequests.includes(userId)) {
          friend.friendRequests = friend.friendRequests.filter(request => request.toString() !== userId);
          await friend.save();
        }
        if (!friend.friends.includes(userId)) {
          friend.friends.push(userId);
          await friend.save();
        }
      }
       console.log("friend Added")
      res.status(200).json({ success: true, message: "Friend added successfully" });
    } else {
      res.status(200).json({ success: true, message: "Already friends" });
    }
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const addFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const user= req.user; // Assuming user is already populated in req.user

    if (!friendId) {
      return res.status(400).json({ success: false, message: "Friend ID is required" });
    }
    // Check if the user is already friends with the requested friend
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ success: false, message: "Already friends" });
    }
    // Check if the friend request already exists
    // if (user.friendRequests.includes(friendId)) {
    //   return res.status(400).json({ success: false, message: "Friend request already sent" });
    // }

    // Find the user and check if they are already friends
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    // Send friend request
    if (friend.friendRequests.includes(user._id)) {
      return res.status(200).json({ success: true, message: "Existing friend request" });
    }
    friend.friendRequests.push(user._id);
    await friend.save();
    res.status(200).json({ success: true,message: "Friend request sent" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { adminLogin, userLogin ,userSignup,userDetails,getFriends,getFriendRequests, getSuggestions, acceptFriend, addFriendRequest };