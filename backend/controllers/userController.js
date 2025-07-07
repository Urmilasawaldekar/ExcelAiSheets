import UserModel from "../models/userModel.js";
import UploadHistory from "../models/UploadHistory.js";
import ChartGeneration from "../models/ChartGeneration.js";

const getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id) ? (req.user.id || req.user._id) : null; // ensure userId is valid

    console.log("Dashboard stats request for userId:", userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in request" });
    }

    const totalUsers = await UserModel.countDocuments();
    const totalFilesUploaded = await UploadHistory.countDocuments({ userId: userId });
    const chartsGenerated = await ChartGeneration.countDocuments({ userId: userId });

    // Get recent activity from UploadHistory, latest 5 uploads with user info
    let recentUploads = [];
    try {
      recentUploads = await UploadHistory.find({ userId: userId })
        .sort({ uploadDate: -1 })
        .limit(5)
        .populate('userId', 'name email');
    } catch (popError) {
      console.warn('Population error in recentUploads:', popError);
      recentUploads = await UploadHistory.find({ userId: userId })
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
    console.error("Error in getUserDashboardStats:", error);
    res.status(500).json({ message: "Internal server error" });
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

export { getUserDashboardStats,  createChartGeneration };
