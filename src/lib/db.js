import mongoose from "mongoose";

const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI;

if (!MONGO_URI) throw new Error("MONGO_URI is missing...");
let isConnected = false;

export const dbConnet = async () => {
    if(isConnected) return;

    try {
        await mongoose.connect(MONGO_URI);
        isConnected = true;
        console.log('mongoDB connected successfully!')
    } catch (error) {
        console.error("mongoDB connection error", error);
    }
}