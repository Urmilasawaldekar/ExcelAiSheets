import express from 'express'
import { Getuser, deletUser, createUser, getAdminDashboardStats, createChartGeneration } from '../controllers/adminController.js'
import { isAdmin, IsUser } from '../middleware/verifyToken.js'

const AdminRouter = express.Router()
AdminRouter.get('/getuser', isAdmin, Getuser)
AdminRouter.delete('/delete/:id', isAdmin, deletUser)
AdminRouter.post('/create', isAdmin, createUser)
AdminRouter.get('/dashboard', isAdmin, getAdminDashboardStats)
// Change the chart-generated route to use IsUser middleware to allow authenticated users, not just admins
AdminRouter.post('/chart-generated', IsUser, createChartGeneration)

export default AdminRouter;
