import express from 'express'
import {signIn,signUp,logout, getAllUsers, updateUser,addTocartController, countAddToCartProduct, addToCartView, updateAddToCart, deleteCartProduct } from '../controller/userController.js'
import {userDetails} from '../controller/userDetails.js'
import authToken from '../middleware/authToken.js'
const userRouter = express.Router()

userRouter.post('/signin',signIn)
userRouter.post('/signup',signUp)
userRouter.get('/user-details',authToken,userDetails)
userRouter.post('/logout',logout)
userRouter.get('/all-users',authToken,getAllUsers)
userRouter.put('/update-user',authToken,updateUser)

//user addToCart
userRouter.post('/add-to-cart',authToken,addTocartController)
userRouter.get('/count-cart-products',authToken,countAddToCartProduct)
userRouter.get('/view-cart-product',authToken,addToCartView)
userRouter.post('/update-cart-product',authToken,updateAddToCart)
userRouter.post('/delete-cart-product',authToken,deleteCartProduct)
export default userRouter