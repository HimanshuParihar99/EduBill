import mongoose from "mongoose";

export const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI environment variable is not set ❌");
        process.exit(1);
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`MongoDB connected ✅ [${mongoose.connection.host}]`);
    } catch (err) {
        console.error("MongoDB connection error ❌", err.message);
        process.exit(1);
    }
};
