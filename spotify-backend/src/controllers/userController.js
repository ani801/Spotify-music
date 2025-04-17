// Route for admin login
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password exist
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // Check credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'Lax', // Use 'None' with secure: true if cross-site cookie is needed
        secure:false, // true only on HTTPS: process.env.NODE_ENV === 'production'
        maxAge: 3600000 // 1 hour
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

export { adminLogin };
