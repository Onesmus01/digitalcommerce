import express from 'express'
import {getCategoryWiseProduct, uploadProduct,getAllProducts, updateProduct, deleteProduct, getProductCategory, getProductDetails, searchProduct,filterProduct } from '../controller/productController.js'
// import {userOrders} from '../controller/ordersController.js'
import  authToken  from '../middleware/authToken.js'

const productRouter = express.Router()

productRouter.post('/upload-product',authToken,uploadProduct)
productRouter.get('/all-products',authToken,getAllProducts)
productRouter.put('/update-product',authToken,updateProduct)
productRouter.delete('/delete-product',authToken,deleteProduct)
productRouter.get('/get-product-category',getProductCategory)
productRouter.post('/category-product',getCategoryWiseProduct)
productRouter.get('/get-product-details/:productId',getProductDetails)
productRouter.get('/search',searchProduct )
productRouter.post('/filter-category',filterProduct)
// productRouter.get('/orders',authToken,userOrders)
export default productRouter