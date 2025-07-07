import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import AdminRouter from './routes/adminRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import userRouter from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import recentChartsRouter from './routes/recentcharts.js';

const app = express();

const PORT = process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173','http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:3000']
}));

//api endpoint
app.get('/', (req, res) => {
    res.send("api working");
});
app.use('/api/auth', authRouter);
app.use('/api/admin', AdminRouter);
app.use('/api', uploadRouter);
app.use('/api/user', userRouter);
app.use('/api/ai', aiRoutes);
app.use('/api/recentCharts', recentChartsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
});
