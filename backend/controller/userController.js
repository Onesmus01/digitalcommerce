import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import addTocart from '../models/cartProductModel.js'
import addToCart from '../models/cartProductModel.js'
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email)
      return res.status(400).json({ success: false, message: "Please provide email" });

    if (!password)
      return res.status(400).json({ success: false, message: "Please provide password" });

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist please register",
      });
    }

    const passwordExist = await bcrypt.compare(password, user.password);

    if (!passwordExist) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const tokenData = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
    path: "/", // 🔥 important
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const signUp = async (req,res) => {
    try {
        const {name,email,password} = req.body
           if (!name) return res.status(400).json({ success: false, message: "Please provide username" });
            if (!email) return res.status(400).json({ success: false, message: "Please provide email" });
            if (!password) return res.status(400).json({ success: false, message: "Please provide password" });
        const userData = await User.findOne({email})
        if(userData){
            return res.status(400).json({success: false,message: "User has already registered"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        if(!hashedPassword){
            throw new Error("Something is wrong")
        }

        const savedUser = new User({
            name: name,
            role: 'GENERAL',
            email: email,
            password: hashedPassword
        })

        await savedUser.save()
        res.status(201).json({success: true,message: "User created successfully",data: savedUser})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.json({
      success: true,
      message: "Logged out successfully",
      data: [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getAllUsers = async(req,res)=> {
    try {
        const users =await User.find().select("-password")
        await res.status(200).json({
            success:true,
            message:"user fetched Successfully",
            data: users
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });

    }
}

export const updateUser = async(req,res)=> {
    try {
        const {userId,name,email,role} = req.body
        const payload = {
            ...(email && {email: email}),
            ...(name && {name: name}),
            ...(role && {role: role})
        }

        const updatedUser = await User.findByIdAndUpdate(userId,payload,{new:true}).select("-password")
            if (!updatedUser) {
            return res.status(404).json({
            success: false,
            message: "User not found",
        });
        }
          return res.status(200).json({
          success: true,
          message: "User updated successfully",
          data: updatedUser
    });
    

    } catch (error) {
         return res.status(500).json({
         success: false,
         message: "Server error"
    });
  }
    
}

export const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    return res.status(200).json({
      success: true,
      message: "Total users fetched successfully",
      data: {
        totalUsers,
      },
    });
  } catch (error) {
    console.error("Get total users error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const addTocartController = async (req, res) => {
  try {
    const { productId } = req.body;
    const currentUser = req.userId;

    // 1️⃣ Auth check
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Login first",
      });
    }

    // 2️⃣ Validate input
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // 3️⃣ Check if already in cart
    const existingProduct = await addTocart.findOne({
      productId,
      userId: currentUser,
    });

    if (existingProduct) {
        existingProduct.quantity += 1;
        await existingProduct.save();

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            data: existingProduct,
        });
}

    // 4️⃣ Add to cart
    const newAddToCart = new addTocart({
      productId,
      quantity: 1,
      userId: currentUser,
    });

    const savedProduct = await newAddToCart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: savedProduct,
    });

  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//count addToCart
export const countAddToCartProduct = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const count = await addTocart.countDocuments({
      userId,
    });

    return res.status(200).json({
      success: true,
      data: count, // ✅ return number directly
      message: "Ok",
    });

  } catch (error) {
    console.error("Count cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const addToCartView = async (req, res) => {
  try {
    const currentUser = req.userId;

    // 1️⃣ Auth check
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 2️⃣ Fetch cart products
    const allProduct = await addToCart.find({ userId: currentUser })
  .populate({
    path: "productId",
    match: { _id: { $exists: true } } // only populate if product exists
  });


    // 3️⃣ Response
    return res.status(200).json({
      success: true,
      data: allProduct,
    });

  } catch (error) {
    console.error("View cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateAddToCart = async (req, res) => {
  try {
    const currentUser = req?.userId;
    const addToCartProductId = req.body._id;
    const qty = req.body.quantity;

    if (!currentUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!addToCartProductId) {
      return res.status(400).json({ success: false, message: "Cart item ID is required" });
    }

    const updateProduct = await addToCart.updateOne(
      { _id: addToCartProductId, userId: currentUser }, // filter
      { ...(qty && { quantity: qty }) } // update
    );

    if (updateProduct.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: "Cart item not found or quantity unchanged" });
    }

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      data: updateProduct,
    });
  } catch (error) {
    console.error("Update cart error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCartProduct = async (req, res) => {
  try {
    const currentUserId = req?.userId;
    const addToCartProductId = req.body._id;

    // 1️⃣ Auth check
    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 2️⃣ Check if the product exists in the user's cart
    const cartItem = await addToCart.findOne({
      _id: addToCartProductId,
      userId: currentUserId,
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // 3️⃣ Delete the product
    await addToCart.deleteOne({ _id: addToCartProductId });

    // 4️⃣ Respond
    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    console.error("Delete cart product error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
