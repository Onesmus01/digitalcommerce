import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    type: {
        type: String,
        enum: ["order", "product", "system"],
        required: true
    },

    title: String,

    message: String,

    link: String,

    isRead: {
        type: Boolean,
        default: false
    }

},
{ timestamps: true }
)

export default mongoose.model("notification", notificationSchema)