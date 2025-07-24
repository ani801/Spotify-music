import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();    
import User from '../models/userModel.js'; // Assuming you have a User model defined

const userAuth = async (req, res,next) => {
    const token = req.cookies.token;
    console.log("Token ",token)
    
    if (!token) {
        return res.status(401).json({ success:false,message: 'Not logged in' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId=decoded.id; // Assuming the token contains the user ID
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(401).json({ success: false,message: 'User not found' });
        }
        req.user = user; // Attach user to request object
        next()
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
}

const userLoginAuth = async (req, res) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({success:false, message: 'Not logged in' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id); // Assuming the token contains the user ID
      if(user)  {return res.json({ success: true, message: "Logged In" })
      }
        else{res.json({success:false,message:"Not Authorized Login Again"})} ;
    } catch (err) {
        console.log("UserLoginAuth error:", err);
      return  res.status(401).json({ message: 'Invalid token' });
    }
}

const userLogout = async (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: "Logged Out" });
}

export { userAuth, userLoginAuth, userLogout };
