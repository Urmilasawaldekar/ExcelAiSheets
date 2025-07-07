import mongoose from 'mongoose';

const recentChartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExcelRecord',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    enum: ['analyze', 'view'],
    default: 'analyze',
  },
  chartType: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('RecentChart', recentChartSchema);
