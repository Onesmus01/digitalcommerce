import express from "express";
import {
addToWishlist,
getWishlist,
removeFromWishlist,
checkWishlist,
clearWishlist
} from "../controller/wishlistController.js";
import authToken from '../middleware/authToken.js'

const wishlistRouter = express.Router();

wishlistRouter.post("/add", authToken, addToWishlist);
wishlistRouter.get("/get", authToken, getWishlist);
wishlistRouter.post("/remove", authToken, removeFromWishlist);
wishlistRouter.get("/check/:productId", authToken, checkWishlist);
wishlistRouter.delete("/clear", authToken, clearWishlist);

export default wishlistRouter;