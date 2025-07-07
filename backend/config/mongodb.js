import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("Database connected");
    });
    mongoose.connection.on('error', (err) => {
        console.error("MongoDB connection error:", err);
    });
    try {
        await mongoose.connect(process.env.MONGODB_URL);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;
