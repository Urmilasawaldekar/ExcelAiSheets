import express from 'express';
import { getUserDashboardStats } from '../controllers/userController.js';
import { IsUser } from '../middleware/verifyToken.js';
import { getMyUploads } from '../controllers/recordController.js';

const router = express.Router();

// Route to get user dashboard stats
router.get('/dashboard', IsUser, getUserDashboardStats);

// Route to get user uploads
router.get('/uploads', IsUser, getMyUploads);

export default router;
