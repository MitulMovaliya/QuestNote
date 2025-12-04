import mongoose from "mongoose";
import logger from "../utils/logger.js";

export async function connectDB() {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/questnote";

    await mongoose.connect(mongoURI);

    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected");
  } catch (error) {
    logger.error("MongoDB disconnection error:", error);
  }
}

// Handle MongoDB connection events
mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});
