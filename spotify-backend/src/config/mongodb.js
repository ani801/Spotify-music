import mongoose from "mongoose";
const connectDB=async()=>{
     try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/spotify`);
        console.log(`MongoDB Connected: ${conn.connection.host}`); // Shows which DB is connected
    } catch (error) {
        console.error(`Error: ${error.message}`);
        
    }
}
export default connectDB