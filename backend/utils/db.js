import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info("MongoDB connected successfully");
    } catch (error) {
        logger.error("MongoDB connection failed", { error: error.message });
        process.exit(1); // fatal — can't run without DB
    }
};

export default connectDB;
