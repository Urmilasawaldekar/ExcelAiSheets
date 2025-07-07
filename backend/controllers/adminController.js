import UserModel from "../models/userModel.js"
import UploadHistory from "../models/UploadHistory.js"
import ChartGeneration from "../models/ChartGeneration.js"
import { isAdmin } from '../middleware/verifyToken.js'

const Getuser = async (req, res) => {
    try {
        // Fetch all users
        const users = await UserModel.find();

        // Aggregate files uploaded count per user
        const filesUploadedCounts = await UploadHistory.aggregate([
            { $group: { _id: "$userId", count: { $sum: 1 } } }
        ]);

        // Aggregate charts created count per user
        const chartsCreatedCounts = await ChartGeneration.aggregate([
            { $group: { _id: "$userId", count: { $sum: 1 } } }
        ]);

        // Map counts by userId for quick lookup
        const filesUploadedMap = {};
        filesUploadedCounts.forEach(item => {
            filesUploadedMap[item._id.toString()] = item.count;
        });

        const chartsCreatedMap = {};
        chartsCreatedCounts.forEach(item => {
            chartsCreatedMap[item._id.toString()] = item.count;
        });

        // Enrich users with counts and lastActive (if available)
        const enrichedUsers = users.map(user => {
            const userIdStr = user._id.toString();
            return {
                ...user.toObject(),
                filesUploaded: filesUploadedMap[userIdStr] || 0,
                chartsCreated: chartsCreatedMap[userIdStr] || 0,
                lastActive: user.lastActive || 'N/A', // Assuming lastActive field exists in user model
            };
        });

        res.status(200).json({ users: enrichedUsers });
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
        console.log(error);
    }
}

const deletUser = async (req, res) => {
    try {
        const userId = req.params.id
        const checkAdmin = await UserModel.findById(userId)

        if (checkAdmin.role == 'admin') {
            return res.status(409).json({ message: "you can not delete yourself" })
        }
        const user = await UserModel.findByIdAndDelete(userId)
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        res.status(200).json({ message: "user deleted successfully ", user })
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
        console.log(error)
    }
}

const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }
        const newUser = new UserModel({ name, email, password, role: role || 'user' });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
        console.log(error);
    }
};

const getAdminDashboardStats = async (req, res) => {
    try {
        const totalUsers = await UserModel.countDocuments();
        const totalFilesUploaded = await UploadHistory.countDocuments();
        const chartsGenerated = await ChartGeneration.countDocuments();

        // Get recent activity from UploadHistory, latest 5 uploads with user info
        let recentUploads = [];
        try {
            recentUploads = await UploadHistory.find()
                .sort({ uploadDate: -1 })
                .limit(5)
                .populate('userId', 'name email');
        } catch (popError) {
            console.warn('Population error in recentUploads:', popError);
            recentUploads = await UploadHistory.find()
                .sort({ uploadDate: -1 })
                .limit(5);
        }

        recentUploads.forEach(upload => {
            console.log('Upload:', upload.originalName, 'UserId:', upload.userId);
        });

        const recentActivity = recentUploads.map(upload => ({
            user: upload.userId && upload.userId.name ? upload.userId.name : 'Unknown',
            action: `Uploaded file: ${upload.originalName}`,
            time: upload.uploadDate,
        }));

        res.status(200).json({
            totalUsers,
            totalFilesUploaded,
            chartsGenerated,
            recentActivity,
        });
    } catch (error) {
        console.error('Error in getAdminDashboardStats:', error);
        res.status(500).json({ message: "internal server error" });
    }
};

const createChartGeneration = async (req, res) => {
    try {
        const { chartType } = req.body;
        if (!chartType) {
            return res.status(400).json({ message: "chartType is required" });
        }
        const userId = req.user.id; // assuming user id is set in req.user by auth middleware
        const newChart = new ChartGeneration({ userId, chartType });
        await newChart.save();
        res.status(201).json({ message: "Chart generation recorded successfully", chart: newChart });
    } catch (error) {
        console.error('Error in createChartGeneration:', error);
        res.status(500).json({ message: "internal server error" });
    }
};

export { Getuser, deletUser, createUser, getAdminDashboardStats, createChartGeneration }
