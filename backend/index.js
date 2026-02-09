import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import connectDb from './config/db.js'
import userRouter from './routes/userRoute.js'
import cookieParser from 'cookie-parser'
import productRouter from './routes/productRoutes.js'
import orderRouter from './routes/orderRoutes.js'
import personalDetailsRouter from './routes/personalDetailsRoutes.js'
import paymentRouter from './routes/paymentRoute.js'
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))
connectDb()

app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/order',orderRouter)
app.use('/api/personal-details',personalDetailsRouter)

app.use('/api/payment', paymentRouter)


const PORT = process.env.PORT || 8080;

app.listen(PORT,()=> console.log(`server is running at port ${PORT}`))

