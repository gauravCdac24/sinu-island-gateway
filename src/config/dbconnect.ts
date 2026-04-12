import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sinu_files";
console.log(MONGO_URI);

export const connectDB = async () => {
  try {
    await mongoose.connect(`${MONGO_URI}`);
    console.log("MongoDB Connected ✔");
  } catch (err) {
    console.error("MongoDB Error:", err);
  }
};