import mongoose from 'mongoose';

const excelRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  fileUrl: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('ExcelRecord', excelRecordSchema);
