import mongoose from 'mongoose'

const connectDb = async()=> {
    try {
        mongoose.connect(process.env.MONGODB_URI)
        console.log("db connected successfully")
    } catch (error) {
        console.log(error)
        process.exit(0)
    }
}

export default connectDb