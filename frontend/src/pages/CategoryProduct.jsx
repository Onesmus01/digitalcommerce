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
  FaSortAmountDown,
  FaLayerGroup,
  FaSlidersH,
  FaTimes
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import { Link } from 'react-router-dom';

// Product Card - Compact for mobile
const ProductCard = ({ product, index, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const discount = Math.round(((product?.price - product?.selling) / product?.price) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <Link 
        to={`/product/${product._id}`}
        className="block bg-white rounded-xl sm:rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      >
        {/* IMAGE CONTAINER - Smaller on mobile */}
        <div className="relative h-[100px] sm:h-[140px] md:h-[160px] lg:h-[180px] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
          
          <motion.img
            src={product?.productImage?.[0]}
            alt={product?.productName}
            className="h-full w-full object-contain p-1.5 sm:p-3 lg:p-4 relative z-10"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Discount Badge - Smaller */}
          {discount > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1.5 left-1.5 z-20"
            >
              <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
                <FaPercentage className="text-[7px] sm:text-[8px]" />
                {discount}%
              </div>
            </motion.div>
          )}
          
          {/* HOT Badge - Smaller */}
          <div className="absolute top-1.5 right-1.5 z-20">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[7px] sm:text-[9px] font-bold px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded shadow-md flex items-center gap-0.5">
              <FaFire className="text-[7px] sm:text-[8px]" />
              <span className="hidden sm:inline">HOT</span>
            </div>
          </div>
          
          {/* Quick Actions - Only on tablet+ */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/5 backdrop-blur-[2px] z-10 flex items-center justify-center gap-2"
                onClick={(e) => e.preventDefault()}
              >
                <motion.button
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white text-slate-700 rounded-full shadow-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <FaEye size={16} />
                </motion.button>
                
                <motion.button
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLiked(!isLiked);
                  }}
                  className={`p-2 rounded-full shadow-md transition-colors ${
                    isLiked ? 'bg-rose-500 text-white' : 'bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-500'
                  }`}
                >
                  <FaHeart size={16} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CONTENT - Compact padding */}
        <div className="p-2 sm:p-2.5 lg:p-4">
          <div className="flex justify-between items-center mb-1 sm:mb-1.5">
            <span className="text-[9px] sm:text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full uppercase tracking-wide truncate max-w-[50px] sm:max-w-[60px] lg:max-w-none">
              {product?.category}
            </span>
            
            <div className="flex items-center gap-0.5">
              <div className="flex">
                {[...Array(4)].map((_, i) => (
                  <FaStar key={i} className="text-amber-400 text-[7px] sm:text-[8px] lg:text-[10px]" />
                ))}
                <FaStarHalfAlt className="text-amber-400 text-[7px] sm:text-[8px] lg:text-[10px]" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium text-slate-600">4.5</span>
            </div>
          </div>
          
          <h3 className="font-bold text-slate-800 text-[11px] sm:text-xs lg:text-sm mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product?.productName}
          </h3>
          
          {/* Description - Hidden on mobile, 2 lines on large screens */}
          <p className="text-[9px] sm:text-[10px] text-slate-500 line-clamp-2 mb-1.5 sm:mb-2 lg:mb-3 leading-relaxed hidden lg:block">
            {/* {product?.description} */}
          </p>
          
          <div className="flex items-end justify-between mb-1.5 sm:mb-2 lg:mb-3">
            <div>
              <p className="text-xs sm:text-sm lg:text-base font-bold text-slate-800">
                {displayKESCurrency(product?.selling)}
              </p>
              <p className="text-[9px] sm:text-[10px] text-slate-400 line-through">
                {displayKESCurrency(product?.price)}
              </p>
            </div>
            
            {product?.selling < product?.price && (
              <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded hidden sm:inline-flex items-center">
                <FaStar className="inline text-[7px] mr-0.5 text-emerald-500" />
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
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] sm:text-xs lg:text-sm font-semibold py-1.5 sm:py-2 lg:py-3 rounded-md sm:rounded-lg lg:rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1 sm:gap-1.5 lg:gap-2"
          >
            <FaShoppingCart size={10} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline lg:hidden">Add</span>
            <span className="hidden lg:inline">Add to Cart</span>
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
};

// Product Grid - Responsive columns (3 on mobile, 2 on sm, 3 on lg, 4 on xl)
const ProductGrid = ({ data, loading, onAddToCart }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 sm:gap-3 lg:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
            <div className="h-[100px] sm:h-[140px] md:h-[160px] lg:h-[180px] bg-slate-200" />
            <div className="p-2 sm:p-2.5 lg:p-4 space-y-1.5 sm:space-y-2">
              <div className="h-2.5 sm:h-3 lg:h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-2 sm:h-2.5 bg-slate-100 rounded w-1/2" />
              <div className="h-5 sm:h-6 lg:h-8 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 lg:py-16">
        <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-2 sm:mb-3 lg:mb-4 bg-slate-100 rounded-full flex items-center justify-center">
          <FaShoppingCart className="text-slate-400 text-lg sm:text-xl lg:text-2xl" />
        </div>
        <p className="text-slate-500 font-medium text-xs sm:text-sm lg:text-base">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 sm:gap-3 lg:gap-4">
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

// Category Item - Compact
const CategoryItem = ({ cat, isSelected, onChange, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.label 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className={`flex items-center gap-2 sm:gap-3 cursor-pointer group p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${
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
        <div className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded transition-all ${
          isSelected 
            ? 'border-indigo-600 bg-indigo-600' 
            : 'border-slate-300 group-hover:border-indigo-400'
        }`}>
          {isSelected && (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white p-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      
      <div className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
        isHovered || isSelected ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
      }`}>
        <img 
          src={cat.productImage} 
          alt={cat.category}
          className="w-full h-full object-contain p-0.5 sm:p-1 bg-slate-100"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
      
      <span className={`text-[11px] sm:text-xs lg:text-sm font-medium transition-colors break-words leading-tight flex-1 ${
        isSelected 
          ? 'text-indigo-700 font-semibold' 
          : 'text-slate-700 group-hover:text-indigo-600'
      }`}>
        {cat.category}
      </span>
      
      {isSelected && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full"
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

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
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!categoryName) return;
    const categories = categoryName.split(",");
    const categoryObj = {};
    categories.forEach((cat) => (categoryObj[cat] = true));
    setSelectedCategory(categoryObj);
    fetchData(categories);
  }, [categoryName, backendUrl]);

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

  // Mobile Filter Drawer Content
  const FilterContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800">Filters</h3>
        <button 
          onClick={() => setShowMobileFilters(false)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <FaTimes size={20} className="text-slate-600" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Sort Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaSortAmountDown className="text-indigo-600 text-sm" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Sort By</h3>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 cursor-pointer group p-2.5 rounded-lg hover:bg-indigo-50 transition-all">
              <div className="relative flex items-center">
                <input 
                  type="radio" 
                  name="sortBy" 
                  value="asc" 
                  checked={sortBy === "asc"} 
                  onChange={handleSortChange}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 border-2 border-slate-300 rounded-full peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>
              <span className="text-sm font-medium text-slate-700">Price: Low to High</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group p-2.5 rounded-lg hover:bg-indigo-50 transition-all">
              <div className="relative flex items-center">
                <input 
                  type="radio" 
                  name="sortBy" 
                  value="dsc" 
                  checked={sortBy === "dsc"} 
                  onChange={handleSortChange}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 border-2 border-slate-300 rounded-full peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>
              <span className="text-sm font-medium text-slate-700">Price: High to Low</span>
            </label>
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaLayerGroup className="text-indigo-600 text-sm" />
            <div className="flex items-center justify-between flex-1">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Categories</h3>
              {categories.length > 0 && (
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {categories.length}
                </span>
              )}
            </div>
          </div>
          
          {categoriesLoading && (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                  <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          )}
          
          {!categoriesLoading && categories.length > 0 && (
            <div className="flex flex-col gap-1">
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
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        {Object.keys(selectedCategory).length > 0 && (
          <button
            onClick={() => {
              setSelectedCategory({});
              navigate('/product-category/');
              setData([]);
              setShowMobileFilters(false);
            }}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors"
          >
            Clear All Filters
          </button>
        )}
        <button
          onClick={() => setShowMobileFilters(false)}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Show {data.length} Products
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-1.5 sm:p-3 lg:p-4">
      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-[260px,1fr] gap-4 xl:gap-6">
        {/* Filters Sidebar */}
        <div className="bg-white p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-slate-100 shadow-sm h-fit sticky top-20">
          {/* Sort Section */}
          <div className="mb-5 lg:mb-6">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <FaSortAmountDown className="text-indigo-600 text-sm" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Sort By</h3>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-3 cursor-pointer group p-2 lg:p-2.5 rounded-xl hover:bg-indigo-50 transition-all">
                <div className="relative flex items-center">
                  <input 
                    type="radio" 
                    name="sortBy" 
                    value="asc" 
                    checked={sortBy === "asc"} 
                    onChange={handleSortChange}
                    className="peer sr-only"
                  />
                  <div className="w-4 h-4 border-2 border-slate-300 rounded-full peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
                <span className="text-xs lg:text-sm font-medium text-slate-700 group-hover:text-indigo-700">Price: Low to High</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group p-2 lg:p-2.5 rounded-xl hover:bg-indigo-50 transition-all">
                <div className="relative flex items-center">
                  <input 
                    type="radio" 
                    name="sortBy" 
                    value="dsc" 
                    checked={sortBy === "dsc"} 
                    onChange={handleSortChange}
                    className="peer sr-only"
                  />
                  <div className="w-4 h-4 border-2 border-slate-300 rounded-full peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
                <span className="text-xs lg:text-sm font-medium text-slate-700 group-hover:text-indigo-700">Price: High to Low</span>
              </label>
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <FaLayerGroup className="text-indigo-600 text-sm" />
              <div className="flex items-center justify-between flex-1">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">All Categories</h3>
                {categories.length > 0 && (
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {categories.length}
                  </span>
                )}
              </div>
            </div>
            
            {categoriesLoading && (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-200 rounded-lg" />
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            )}
            
            {!categoriesLoading && categories.length > 0 && (
              <div className="flex flex-col gap-1 max-h-[350px] lg:max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
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
            
            {!categoriesLoading && categories.length > 0 && (
              <Link 
                to="/categories"
                className="mt-3 flex items-center justify-center gap-2 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                View All Categories <FaLayerGroup size={12} className="lg:w-4 lg:h-4" />
              </Link>
            )}
          </div>

          {Object.keys(selectedCategory).length > 0 && (
            <button
              onClick={() => {
                setSelectedCategory({});
                navigate('/product-category/');
                setData([]);
              }}
              className="w-full mt-3 lg:mt-4 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs lg:text-sm font-medium rounded-xl transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-3 lg:mb-4 bg-white p-2.5 lg:p-3 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2">
              <p className="font-bold text-slate-800 text-sm lg:text-base">
                {data.length} <span className="text-slate-500 font-normal text-xs lg:text-sm">Products</span>
              </p>
            </div>
            {categoryName && (
              <div className="flex flex-wrap gap-1 lg:gap-1.5">
                {categoryName.split(',').map((cat, idx) => (
                  <span 
                    key={idx} 
                    className="text-[10px] lg:text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full border border-indigo-100"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>

          <ProductGrid 
            data={data} 
            loading={loading} 
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      {/* Mobile/Tablet View */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 bg-white p-2 sm:p-2.5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <p className="font-bold text-slate-800 text-xs sm:text-sm">
              {data.length} <span className="text-slate-500 font-normal text-[10px] sm:text-xs">Products</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {categoryName && (
              <span className="text-[10px] sm:text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-lg truncate max-w-[80px] sm:max-w-[100px]">
                {categoryName.replace(/,/g, ', ')}
              </span>
            )}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-indigo-600 text-white text-[10px] sm:text-xs font-semibold rounded-lg"
            >
              <FaSlidersH size={10} className="sm:w-3 sm:h-3" />
              Filters
            </button>
          </div>
        </div>
        
        {/* Mobile Categories Horizontal Scroll */}
        {!categoriesLoading && categories.length > 0 && (
          <div className="mb-2 sm:mb-3">
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 sm:mb-1.5 px-1">
              Categories ({categories.length})
            </p>
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
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
                  className={`flex-shrink-0 flex flex-col items-center gap-0.5 sm:gap-1 p-1 sm:p-1.5 rounded-lg transition-all ${
                    selectedCategory[cat.category] 
                      ? 'bg-indigo-50 ring-2 ring-indigo-500' 
                      : 'bg-white border border-slate-200'
                  }`}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-slate-50">
                    <img 
                      src={cat.productImage} 
                      alt={cat.category}
                      className="w-full h-full object-contain p-0.5 sm:p-1"
                    />
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-medium text-center capitalize max-w-[40px] sm:max-w-[50px] truncate ${
                    selectedCategory[cat.category] ? 'text-indigo-700' : 'text-slate-600'
                  }`}>
                    {cat.category}
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

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[85vw] max-w-[360px] bg-white z-50 lg:hidden shadow-2xl"
            >
              <FilterContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryProduct;