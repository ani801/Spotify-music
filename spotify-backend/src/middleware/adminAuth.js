
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const adminLoginAuth = async(req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({success:false,message:"Not Authorized Login Again"})
        }

        res.json({success:true,message:"Logged In"})
   
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
 };

 const adminAuth=async(req,res,next)=>{
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Not logged in' });
      }
    
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
                return res.json({success:false,message:"Not Authorized Login Again"})
            }
            next()
       
      } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
      }

 }

 export{adminLoginAuth,adminAuth}
