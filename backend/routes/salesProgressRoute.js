import express from 'express'
import { getDashboardProgress,getMonthlyRevenue,getAIPrediction } from '../controller/salesProgressController.js'

const salesProgressRoute = express.Router()

salesProgressRoute.get('/sales-progress', getDashboardProgress)
salesProgressRoute.get('/monthly-revenue', getMonthlyRevenue)
salesProgressRoute.get('/ai-prediction', getAIPrediction)



export default salesProgressRoute