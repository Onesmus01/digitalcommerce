import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "@/context/ProductContext.jsx";
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaHeart, 
  FaEye, 
  FaShoppingCart,
  FaFire,
  FaPercentage,
  FaFilter,
  FaSortAmountDown,
  FaLayerGroup
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import { Link } from 'react-router-dom'

// Product Card for pre-fetched data
const ProductCard = ({ product, index, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const discount = Math.round(((product?.price - product?.selling) / product?.price) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <Link 
        to={`/product/${product._id}`}
        className="block bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500"
      >
        {/* IMAGE CONTAINER */}
        <div className="relative h-[200px] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
          
          <motion.img
            src={product?.productImage?.[0]}
            alt={product?.productName}
            className="h-full w-full object-contain p-4 relative z-10"
            animate={{ scale: isHovered ? 1.08 : 1, y: isHovered ? -5 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 z-20"
            >
              <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-rose-500/30 flex items-center gap-1">
                <FaPercentage className="text-[10px]" />
                {discount}% OFF
              </div>
            </motion.div>
          )}
          
          {/* Premium Badge */}
          <div className="absolute top-3 right-3 z-20">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
              <FaFire className="text-[10px]" />
              HOT
            </div>
          </div>
          
          {/* Quick Actions Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/5 backdrop-blur-[2px] z-10 flex items-center justify-center gap-3"
                onClick={(e) => e.preventDefault()}
              >
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white text-slate-700 rounded-full shadow-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <FaEye size={18} />
                </motion.button>
                
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLiked(!isLiked);
                  }}
                  className={`p-3 rounded-full shadow-lg transition-colors ${
                    isLiked ? 'bg-rose-500 text-white' : 'bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-500'
                  }`}
                >
                  <FaHeart size={18} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CONTENT */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {product?.category}
            </span>
            
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(4)].map((_, i) => (
                  <FaStar key={i} className="text-amber-400 text-[10px]" />
                ))}
                <FaStarHalfAlt className="text-amber-400 text-[10px]" />
              </div>
              <span className="text-xs font-medium text-slate-600 ml-1">4.5</span>
            </div>
          </div>
          
          <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product?.productName}
          </h3>
          
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {product?.description}
          </p>
          
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-lg font-bold text-slate-800">
                {displayKESCurrency(product?.selling)}
              </p>
              <p className="text-xs text-slate-400 line-through">
                {displayKESCurrency(product?.price)}
              </p>
            </div>
            
            {product?.selling < product?.price && (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <FaStar className="inline text-[10px] mr-1 text-emerald-500" />
                Save {displayKESCurrency(product?.price - product?.selling)}
              </span>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(e, product?._id);
            }}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
          >
            <FaShoppingCart className="group-hover/btn:animate-bounce" size={14} />
            Add to Cart
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
};

// Product Grid Component
const ProductGrid = ({ data, loading, onAddToCart }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
            <div className="h-[200px] bg-slate-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-8 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
          <FaShoppingCart className="text-slate-400 text-2xl" />
        </div>
        <p className="text-slate-500 font-medium">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((product, index) => (
        <ProductCard 
          key={product._id} 
          product={product} 
          index={index}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

// ===================== NEW: Category Item Component =====================
const CategoryItem = ({ cat, isSelected, onChange, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.label 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`flex items-center gap-3 cursor-pointer group p-3 rounded-xl transition-all duration-200 ${
        isSelected ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-slate-50'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex items-center">
        <input 
          type="checkbox" 
          value={cat.category} 
          checked={isSelected}
          onChange={onChange}
          className="peer sr-only"
        />
        <div className={`w-5 h-5 border-2 rounded transition-all ${
          isSelected 
            ? 'border-indigo-600 bg-indigo-600' 
            : 'border-slate-300 group-hover:border-indigo-400'
        }`}>
          {isSelected && (
            <svg className="w-5 h-5 text-white p-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      
      {/* Category Image */}
      <div className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
        isHovered || isSelected ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
      }`}>
        <img 
          src={cat.productImage} 
          alt={cat.category}
          className="w-full h-full object-contain p-1 bg-slate-100"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
      
      {/* Category Name */}
      <span className={`text-sm font-medium transition-colors break-words leading-tight flex-1 ${
        isSelected 
          ? 'text-indigo-700 font-semibold' 
          : 'text-slate-700 group-hover:text-indigo-600'
      }`}>
        {cat.category}
      </span>
      
      {/* Selection indicator */}
      {isSelected && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-2 h-2 bg-indigo-500 rounded-full"
        />
      )}
    </motion.label>
  );
};

const CategoryProduct = () => {
  const { backendUrl, addToCart, fetchCountCart } = useContext(Context);
  const navigate = useNavigate();
  const { categoryName } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({});
  
  // ===================== NEW: Categories State =====================
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Handle add to cart
  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (addToCart) {
      await addToCart(e, id);
      fetchCountCart?.();
    } else {
      try {
        const { default: addToCartHelper } = await import('@/helpers/addToCart.js');
        await addToCartHelper(e, id);
        fetchCountCart?.();
      } catch (err) {
        console.error('Failed to add to cart:', err);
      }
    }
  };

  // ===================== NEW: Fetch All Categories =====================
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch(`${backendUrl}/product/get-product-category`, {
        method: 'GET',
        credentials: 'include',
      });
      const responseData = await response.json();

      if (responseData.success) {
        setCategories(responseData.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch products
  const fetchData = async (categories) => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/product/filter-category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: categories }),
      });
      const result = await res.json();
      setData(result?.data || []);
      console.log("Fetched products:", result);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Update from URL
  useEffect(() => {
    if (!categoryName) return;
    const categories = categoryName.split(",");
    const categoryObj = {};
    categories.forEach((cat) => (categoryObj[cat] = true));
    setSelectedCategory(categoryObj);
    fetchData(categories);
  }, [categoryName, backendUrl]);

  // Handle category change
  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    const updated = { ...selectedCategory, [value]: checked };
    setSelectedCategory(updated);

    const activeCategories = Object.keys(updated).filter((key) => updated[key]);
    if (activeCategories.length > 0) {
      navigate(`/product-category/${activeCategories.join(",")}`);
    } else {
      setData([]);
    }
  };

  // Handle sort
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    if (value === "asc") {
      setData((prev) => [...prev].sort((a, b) => a.selling - b.selling));
    }
    if (value === "dsc") {
      setData((prev) => [...prev].sort((a, b) => b.selling - a.selling));
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Desktop Layout - Wider sidebar */}
      <div className="hidden lg:grid grid-cols-[320px,1fr] gap-6">
        {/* Filters Sidebar - Wider and better text visibility */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm min-h-[calc(100vh-120px)] h-fit sticky top-24">
          {/* Sort Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <FaSortAmountDown className="text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Sort By</h3>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-indigo-50 transition-all duration-200">
                <div className="relative flex items-center">
                  <input 
                    type="radio" 
                    name="sortBy" 
                    value="asc" 
                    checked={sortBy === "asc"} 
                    onChange={handleSortChange}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition-colors whitespace-nowrap">
                  Price: Low to High
                </span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-indigo-50 transition-all duration-200">
                <div className="relative flex items-center">
                  <input 
                    type="radio" 
                    name="sortBy" 
                    value="dsc" 
                    checked={sortBy === "dsc"} 
                    onChange={handleSortChange}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition-colors whitespace-nowrap">
                  Price: High to Low
                </span>
              </label>
            </div>
          </div>

          {/* ===================== ALL CATEGORIES SECTION ===================== */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <FaLayerGroup className="text-indigo-600" />
              <div className="flex items-center justify-between flex-1">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">All Categories</h3>
                {categories.length > 0 && (
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {categories.length}
                  </span>
                )}
              </div>
            </div>
            
            {/* Loading State */}
            {categoriesLoading && (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            )}
            
            {/* ALL Categories List - Scrollable */}
            {!categoriesLoading && categories.length > 0 && (
              <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {categories.map((cat, index) => (
                  <CategoryItem 
                    key={cat.category}
                    cat={cat}
                    isSelected={!!selectedCategory[cat.category]}
                    onChange={handleSelectCategory}
                    index={index}
                  />
                ))}
              </div>
            )}
            
            {/* View All Categories Link */}
            {!categoriesLoading && categories.length > 0 && (
              <Link 
                to="/categories"
                className="mt-4 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                View All Categories <FaLayerGroup size={14} />
              </Link>
            )}
          </div>

          {/* Clear Filters Button */}
          {Object.keys(selectedCategory).length > 0 && (
            <button
              onClick={() => {
                setSelectedCategory({});
                navigate('/product-category/');
                setData([]);
              }}
              className="w-full mt-6 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <p className="font-bold text-slate-800 text-lg">
                {data.length} <span className="text-slate-500 font-normal">Products</span>
              </p>
            </div>
            {categoryName && (
              <div className="flex flex-wrap gap-2">
                {categoryName.split(',').map((cat, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs font-medium text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="min-h-[calc(100vh-200px)]">
            <ProductGrid 
              data={data} 
              loading={loading} 
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        {/* Mobile Filter Toggle could go here */}
        <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-xl border border-slate-100">
          <p className="font-bold text-slate-800">
            {data.length} <span className="text-slate-500 font-normal text-sm">Products</span>
          </p>
          {categoryName && (
            <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
              {categoryName.replace(/,/g, ', ')}
            </span>
          )}
        </div>
        
        {/* Mobile Categories Horizontal Scroll */}
        {!categoriesLoading && categories.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
              Categories ({categories.length})
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {categories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => {
                    const isSelected = selectedCategory[cat.category];
                    const updated = { ...selectedCategory, [cat.category]: !isSelected };
                    setSelectedCategory(updated);
                    const activeCategories = Object.keys(updated).filter((key) => updated[key]);
                    if (activeCategories.length > 0) {
                      navigate(`/product-category/${activeCategories.join(",")}`);
                    }
                  }}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    selectedCategory[cat.category] 
                      ? 'bg-indigo-50 ring-2 ring-indigo-500' 
                      : 'bg-white border border-slate-200'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-50">
                    <img 
                      src={cat.productImage} 
                      alt={cat.category}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <span className={`text-[10px] font-medium text-center capitalize ${
                    selectedCategory[cat.category] ? 'text-indigo-700' : 'text-slate-600'
                  }`}>
                    {cat.category.length > 8 ? cat.category.slice(0, 8) + '...' : cat.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <ProductGrid 
          data={data} 
          loading={loading} 
          onAddToCart={handleAddToCart}
        />
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryProduct;