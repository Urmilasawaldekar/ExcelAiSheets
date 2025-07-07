import express from 'express';
import { handleUpload, getUploadHistory, downloadFile, deleteFile } from '../controllers/uploadController.js';
import { IsUser } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/upload', IsUser, handleUpload);
router.get('/history', IsUser, getUploadHistory);
router.get('/download/:filename', IsUser, downloadFile);

router.delete('/delete/:filename', IsUser, deleteFile);

export default router;
