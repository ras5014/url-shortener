import mongoose from "mongoose";
import logger from "../utils/logger";

export const connectToMongoDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
