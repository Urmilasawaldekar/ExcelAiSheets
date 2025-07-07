import express from 'express';
const router = express.Router();

import RecentChart from '../models/RecentChart.js';
import ExcelRecord from '../models/ExcelRecord.js';
import { IsUser } from '../middleware/verifyToken.js';

// POST /api/recentCharts
router.post('/', IsUser, async (req, res) => {
  try {
    const { recordId, chartType } = req.body;

    const record = await ExcelRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    const recentChart = await RecentChart.create({
      userId: req.user._id,
      recordId,
      filename: record.filename,
      action: 'analyze', // or 'view'
      chartType,         // Store chart type like "Bar Chart", "Line Chart", etc.
    });

    res.status(201).json({ success: true, recentChart });
  } catch (err) {
    console.error('Error creating recent chart:', err.stack || err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/recentCharts
router.get('/', IsUser, async (req, res) => {
  try {
    console.log('req.user:', req.user);
    const recentCharts = await RecentChart.find({
      userId: req.user._id,
      // action: 'analyze', // temporarily removed filter to fetch all
    }).sort({ createdAt: -1 });
    console.log('recentCharts:', recentCharts);

    res.json(recentCharts);
  } catch (err) {
    console.error('Error fetching recent charts:', err.stack || err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
