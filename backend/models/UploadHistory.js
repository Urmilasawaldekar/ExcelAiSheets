import mongoose from 'mongoose';

const uploadHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

const UploadHistory = mongoose.model('UploadHistory', uploadHistorySchema);

export default UploadHistory;
