import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UploadHistory from '../models/UploadHistory.js';
import UserModel from '../models/userModel.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function addSampleUpload() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Find a user to associate the upload with
    const user = await UserModel.findOne();
    if (!user) {
      console.log('No user found in database. Please create a user first.');
      process.exit(1);
    }

    // Create a sample upload history record
    const sampleUpload = new UploadHistory({
      userId: user._id,
      originalName: 'sample_upload.xlsx',
      uploadDate: new Date(),
      filePath: '/uploads/sample_upload.xlsx',
    });

    await sampleUpload.save();
    console.log('Sample upload history record added successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Error adding sample upload history:', error);
    process.exit(1);
  }
}

addSampleUpload();
