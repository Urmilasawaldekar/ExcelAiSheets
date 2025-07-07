import ExcelRecord from '../models/ExcelRecord.js';

export const getMyUploads = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find Excel records uploaded by this user, sorted by most recent
    const records = await ExcelRecord.find({ userId }).sort({ uploadedAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching user uploads:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
