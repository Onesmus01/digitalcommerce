import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import isAdmin from '../helpers/permission.js';
export const uploadProduct = async (req,res)=> {
    try {
        let {
        productName,
        brandName,
        category,
        productImage,
        description,
        price,
        selling
        }=req.body;

        const sessionUserId = req.userId;
         const adminAllowed = await isAdmin(sessionUserId);
        if (!adminAllowed) {
        return res.status(403).json({
            success: false
      });
    }
        


        productName = productName.trim();
        description=description.trim();
        brandName=brandName.trim();
        category=category.trim();
        let parsedPrice=Number(price);
        let parsedSelling=Number(selling);

            let images = [];
            try {
            images = typeof productImage === 'string' ? JSON.parse(productImage) : productImage;
            if (!Array.isArray(images)) images = [images];
            } catch (err) {
            images = [productImage];
            }

        if(!productName || !parsedPrice || !parsedSelling){
            return res.status(400).json({message:"Required fields are missing"})
        }

        const newProduct = new Product({
            productName,
            brandName,
            category,
            productImage: images,
            description,
            price:parsedPrice,
            selling:parsedSelling
        });
        const savedProduct = await newProduct.save();
        return res.status(201).json({message:"Product uploaded successfully",data:savedProduct});

    } catch (error) {
        return res.status(500).json({message:error.message});
        console.log("Upload product error:",error);           
    }
}

export const getAllProducts = async (req,res)=> {
    try {
        const products = await Product.find().sort({createdAt:-1}); 
        return  res.status(200).json({message:"Products fetched successfully",data:products});
    } catch (error) {
        console.log("Get all products error:",error);           

        return res.status(500).json({message:error.message});
    }
}

export const updateProduct = async (req, res) => {
  try {
    const {
      productId,
      productName,
      brandName = "",
      category = "",
      productImage = [],
      description = "",
      price,
      selling,
    } = req.body

    const sessionUserId = req.userId

    // ADMIN CHECK
    const adminAllowed = await isAdmin(sessionUserId)
    if (!adminAllowed) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      })
    }

    // REQUIRED FIELD CHECK
    if ( !productName || price === undefined || selling === undefined) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      })
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid productId" });
    }


    // SANITIZE
    const cleanName = productName.trim()
    const cleanBrand = brandName.trim()
    const cleanCategory = category.trim()
    const cleanDescription = description.trim()

    const parsedPrice = Number(price)
    const parsedSelling = Number(selling)

    if (Number.isNaN(parsedPrice) || Number.isNaN(parsedSelling)) {
      return res.status(400).json({
        success: false,
        message: "Price and selling must be valid numbers",
      })
    }

    // NORMALIZE IMAGES
    let images = productImage
    if (typeof images === "string") {
      try {
        images = JSON.parse(images)
      } catch {
        images = [images]
      }
    }
    if (!Array.isArray(images)) images = [images]

    // UPDATE PRODUCT
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        productName: cleanName,
        brandName: cleanBrand,
        category: cleanCategory,
        productImage: images,
        description: cleanDescription,
        price: parsedPrice,
        selling: parsedSelling,
      },
      { new: true }
    )

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    })

  } catch (error) {
    console.error("Update product error:", error)
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params
    const sessionUserId = req.userId

    // ADMIN CHECK
    const adminAllowed = await isAdmin(sessionUserId)
    if (!adminAllowed) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      })
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      })
    }

    const deletedProduct = await Product.findByIdAndDelete(productId)

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    })

  } catch (error) {
    console.error("Delete product error:", error)
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    })
  }
}

export const getProductCategory = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $match: {
          category: { $ne: "" }
        }
      },
      {
        $group: {
          _id: "$category",
          productImage: { $first: "$productImage" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          productImage: { $arrayElemAt: ["$productImage", 0] }
        }
      }
    ])

    res.status(200).json({
      success: true,
      data: categories
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getCategoryWiseProduct = async (req, res) => {
  try {
    const { category } = req?.body || req?.query

    const product = await Product.find({ category })

    res.status(200).json({
      data: product,
      success: true,
      message: "Category extracted successfully"
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
    console.log('intenal server error',error)
    
  }
}

export const getProductDetails = async(req,res)=> {
  try {
    const {productId} = req.params

    const product = await Product.findById(productId)

    if(!product){
      return res.status(400).json({success: false,message: "Product not Found"})
    }
    await res.status(200).json({
      success: true,
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const searchProduct = async (req, res) => {
  try {
    const { q } = req.query;

    // 🔒 Empty search
    if (!q || q.trim() === "") {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const products = await Product.find({
      $or: [
        { productName: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { brandName: { $regex: q, $options: "i" } },
      ],
    })
      .limit(20)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Search error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const filterProduct = async (req, res) => {
  try {
    const categoryList = req?.body?.category || [];
    console.log("Received categories:", categoryList);

    if (!Array.isArray(categoryList) || categoryList.length === 0) {
      return res.status(400).json({
        data: [],
        message: "No categories provided",
        error: true,
        success: false,
      });
    }

    // Fetch products that match the categories
    let products = await Product.find({
      category: { $in: categoryList },
    }).lean(); // Use lean() for plain JS objects (better performance)

    // Ensure productImage is always an array
    products = products.map((p) => ({
      ...p,
      productImage: Array.isArray(p.productImage)
        ? p.productImage
        : p.productImage
        ? [p.productImage]
        : [],
    }));

    console.log("Fetched products:", products);

    res.status(200).json({
      data: products,
      message: "Products fetched successfully",
      error: false,
      success: true,
    });
  } catch (err) {
    console.error("filterProduct error:", err);
    res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};



