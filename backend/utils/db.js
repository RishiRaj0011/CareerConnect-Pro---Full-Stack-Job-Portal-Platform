import mongoose from "mongoose";
import logger from "./logger.js";

// Build a direct (non-SRV) fallback URI from the SRV URI
// SRV: mongodb+srv://user:pass@cluster.mongodb.net/db
// Direct: mongodb://user:pass@shard-00-00:27017,shard-00-01:27017,shard-00-02:27017/db?ssl=true&authSource=admin
const buildDirectURI = (srvURI) => {
    try {
        // Extract credentials and cluster id from SRV URI
        const match = srvURI.match(
            /mongodb\+srv:\/\/([^:]+):([^@]+)@([^.]+)\.([^/]+)\.mongodb\.net\/([^?]+)/
        );
        if (!match) return null;
        const [, user, pass, clusterName, clusterId, dbName] = match;
        const base = `${clusterName}.${clusterId}.mongodb.net`;
        return (
            `mongodb://${user}:${pass}` +
            `@ac-uvlj3nv-shard-00-00.${clusterId}.mongodb.net:27017` +
            `,ac-uvlj3nv-shard-00-01.${clusterId}.mongodb.net:27017` +
            `,ac-uvlj3nv-shard-00-02.${clusterId}.mongodb.net:27017` +
            `/${dbName}?ssl=true&replicaSet=atlas-c2f7k8-shard-0&authSource=admin&retryWrites=true&w=majority`
        );
    } catch {
        return null;
    }
};

const MONGOOSE_OPTS = {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS:         10000,
    socketTimeoutMS:          45000,
    family: 4,                        // force IPv4 — fixes Windows/hotspot DNS issues
    maxPoolSize: 10,
};

const connectDB = async () => {
    const srvURI    = process.env.MONGO_URI;
    const directURI = buildDirectURI(srvURI);

    // Strategy 1 — SRV URI (standard, works on most networks)
    try {
        await mongoose.connect(srvURI, MONGOOSE_OPTS);
        logger.info("MongoDB connected successfully (SRV)");
        return;
    } catch (srvError) {
        logger.warn(`SRV connection failed: ${srvError.message}`);
        logger.warn("Retrying with direct shard connection...");
    }

    // Strategy 2 — Direct shard URI (bypasses SRV DNS lookup, works on restricted networks)
    if (directURI) {
        try {
            await mongoose.connect(directURI, MONGOOSE_OPTS);
            logger.info("MongoDB connected successfully (Direct)");
            return;
        } catch (directError) {
            logger.error(`Direct connection also failed: ${directError.message}`);
        }
    }

    // Both failed — log actionable steps and exit
    logger.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.error("MongoDB connection FAILED. Check the following:");
    logger.error("  1. Atlas Dashboard → cluster is not PAUSED (Resume if paused)");
    logger.error("  2. Atlas → Network Access → Add 0.0.0.0/0 (Allow from anywhere)");
    logger.error("  3. Atlas → Database Access → verify username/password in .env");
    logger.error("  4. Windows DNS → set to 8.8.8.8 (Google DNS) manually");
    logger.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    process.exit(1);
};

export default connectDB;
