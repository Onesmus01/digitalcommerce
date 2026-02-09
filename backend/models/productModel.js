import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productName:{type: String,required:true},
    brandName: {type: String},
    category: {type: String},
    productImage:{type: [String], default: []}, 
    description:{type: String},
    price: {type: Number, required:true},
    selling: {type: Number, required:true},
    createdAt: {type: Date, default: Date.now}
},{timestamps:true});

const Product = mongoose.models.Product || mongoose.model('Product',productSchema);
export default Product;