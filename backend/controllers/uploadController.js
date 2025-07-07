import multer from 'multer';
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // use absolute path for uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: function (req, file, cb) {
    const filetypes = /xlsx|xls/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xls, .xlsx) are allowed'));
    }
  }
}).single('file');

import UploadHistory from '../models/UploadHistory.js';

export const handleUpload = (req, res) => {
  upload(req, res, async function (err) {
    console.log('handleUpload - req.file:', req.file);
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
      const workbook = xlsx.readFile(req.file.path);
      const sheetNames = workbook.SheetNames;
      const data = {};

      sheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        data[sheetName] = xlsx.utils.sheet_to_json(worksheet);
      });

      // Save upload history
      if (req.user && req.user._id) {
        console.log('Saving upload history for userId:', req.user._id);
        await UploadHistory.create({
          userId: req.user._id,
          filename: req.file.filename,
          originalName: req.file.originalname,
        });
        console.log('Upload history saved successfully');
      } else {
        console.warn('No req.user or req.user._id found, upload history not saved');
      }

      // Do not delete the file after reading to keep it for history and analysis
      // fs.unlinkSync(req.file.path);

      res.json({ success: true, data });
    } catch (error) {
      console.error('Processing error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });
};

// Function to get upload history
export const getUploadHistory = async (req, res) => {
  try {
    console.log('getUploadHistory - req.user:', req.user);

    if (!req.user || !req.user._id) {
      return res.status(400).json({ success: false, message: 'User not authenticated' });
    }

    // Fetch upload history from DB filtered by userId
    // Removed any limit to fetch all records
    const historyRecords = await UploadHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const historyData = [];

    for (const record of historyRecords) {
      const filePath = path.join(uploadsDir, record.filename);
      const stats = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
      const uploadDate = stats ? (stats.birthtime || stats.ctime || new Date()) : new Date();

      let sheetsData = {};
      try {
        if (stats) {
          const workbook = xlsx.readFile(filePath);
          const sheetNames = workbook.SheetNames;
          sheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            sheetsData[sheetName] = xlsx.utils.sheet_to_json(worksheet);
          });
        }
      } catch (err) {
        console.warn(`Error reading Excel file ${record.filename}:`, err);
      }

      historyData.push({
        id: record._id.toString(),
        displayName: record.originalName,
        filename: record.filename,
        sheetsData,
        fileMissing: !stats,
        uploadDate,
      });
    }

    return res.json({ success: true, data: historyData });
  } catch (error) {
    console.error('Error fetching upload history:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Function to download a file by filename
export const downloadFile = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsDir, filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, err => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ success: false, message: 'Error sending file' });
      }
    });
  } else {
    res.status(404).json({ success: false, message: 'File not found' });
  }
};

// Function to delete a file by filename
export const deleteFile = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsDir, filename);

  try {
    if (fs.existsSync(filePath)) {
      // Delete the file from filesystem
      fs.unlinkSync(filePath);

      // Remove the upload history record for this file and user
      if (req.user && req.user._id) {
        await UploadHistory.deleteOne({ userId: req.user._id, filename });
      }

      return res.json({ success: true, message: 'File deleted successfully' });
    } else {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ success: false, message: 'Error deleting file' });
  }
};
