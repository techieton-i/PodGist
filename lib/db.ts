import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.info("Database is Connected");
    return;
  }
  await mongoose.connect(process.env.MONGO_URI!);
  isConnected = true;
}
