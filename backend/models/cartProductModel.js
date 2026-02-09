import mongoose from 'mongoose';

const addTocartProductSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // <-- important
    quantity: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },       // optional, but recommended
}, { timestamps: true });

const addToCart = mongoose.models.addToCart || mongoose.model('addToCart', addTocartProductSchema);
export default addToCart;
