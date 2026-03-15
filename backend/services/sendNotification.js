import Notification from "../models/notificationModel.js"
import { getIO } from "./socketService.js"

const sendNotification = async ({
  userId,
  type,
  title,
  message,
  link
}) => {

  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    link
  })

  const io = getIO()

  io.to(userId.toString()).emit("new_notification", notification)

  return notification
}

export default sendNotification