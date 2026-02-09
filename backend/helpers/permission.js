import User from '../models/userModel.js'

const isAdmin = async (userId) => {
  if (!userId) return false

  const user = await User.findById(userId)
  if (!user) return false

  return user.role === 'ADMIN'
}

export default isAdmin
