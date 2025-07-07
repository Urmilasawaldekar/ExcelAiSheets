// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// const DbCon = async () => {
//     try {
//         console.log("MONGODB_URL:", process.env.MONGODB_URL);
//         await mongoose.connect(process.env.MONGODB_URL, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//         console.log(" MongoDB Connected Successfully");
//     } catch (error) {
//         console.error(" MongoDB Connection Error:", error.message);
//         process.exit(1); // Stop execution if DB connection fails
//     }
// };

// export default DbCon;