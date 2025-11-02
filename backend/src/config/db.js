import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDb() {
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(env.mongoUri, {
      autoIndex: env.nodeEnv !== "production",
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
}

export const disconnectDB = async () => {
  await mongoose.connection.close();
  console.log("MongoDB disconnected!");
};
