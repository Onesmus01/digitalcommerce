import React, { useState, useEffect, useRef, useContext } from "react";
import { 
  FaAngleLeft, 
  FaAngleRight, 
  FaStar, 
  FaStarHalfAlt, 
  FaHeart, 
  FaEye, 
  FaShoppingCart,
  FaFire,
  FaPercentage,
  FaBolt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import fetchCategoryWiseProducts from "@/helpers/fetchCategoryWiseProducts.js";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import addToCart from '@/helpers/addToCart.js'
import Context from "@/context/index.js";
import { Link } from 'react-router-dom'

// Skeleton Card Component - Smaller on mobile
const SkeletonCard = ({ isSmallMobile }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`${isSmallMobile ? 'min-w-[130px]' : 'min-w-[calc(50%-8px)] sm:min-w-[180px] md:min-w-[220px] lg:min-w-[260px]'} rounded-xl sm:rounded-2xl bg-white border border-slate-100 overflow-hidden`}
  >
    <div className={`${isSmallMobile ? 'h-[100px]' : 'h-[140px] sm:h-[180px] md:h-[200px] lg:h-[220px]'} bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse relative`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
    <div className="p-2 sm:p-4 space-y-1.5 sm:space-y-3">
      <div className="h-2 sm:h-4 bg-slate-200 rounded-lg w-4/5" />
      <div className="h-1.5 sm:h-3 bg-slate-100 rounded-lg w-2/5" />
      <div className="flex justify-between items-center pt-1 sm:pt-2">
        <div className="h-3 sm:h-5 bg-slate-200 rounded-lg w-1/3" />
        <div className="h-3 sm:h-5 bg-slate-100 rounded-lg w-1/4" />
      </div>
    </div>
  </motion.div>
);

// Product Card Component - Smaller on mobile
const ProductCard = ({ product, index, onAddToCart, isSmallMobile }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const discount = Math.round(((product?.price - product?.selling) / product?.price) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group ${isSmallMobile ? 'min-w-[130px]' : 'min-w-[calc(50%-8px)] sm:min-w-[180px] md:min-w-[220px] lg:min-w-[260px]'}`}
    >
      <Link 
        to={`product/${product._id}`}
        className="block bg-white rounded-xl sm:rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 relative"
      >
        {/* IMAGE CONTAINER */}
        <div className={`relative ${isSmallMobile ? 'h-[100px]' : 'h-[140px] sm:h-[180px] md:h-[200px] lg:h-[220px]'} bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
          
          {/* Product Image */}
          <motion.img
            src={product?.productImage?.[0]}
            alt={product?.productName}
            className="h-full w-full object-contain p-2 sm:p-4 relative z-10"
            animate={{ scale: isHovered ? 1.08 : 1, y: isHovered ? -5 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 z-20"
            >
              <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-[8px] sm:text-xs font-bold px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-full shadow-lg shadow-rose-500/30 flex items-center gap-0.5 sm:gap-1">
                <FaPercentage className="text-[6px] sm:text-[10px]" />
                {discount}%
              </div>
            </motion.div>
          )}
          
          {/* Premium Badge */}
          <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-20">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[7px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 sm:py-1 rounded-lg shadow-lg flex items-center gap-0.5 sm:gap-1">
              <FaFire className="text-[6px] sm:text-[10px]" />
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
                className="absolute inset-0 bg-black/5 backdrop-blur-[2px] z-10 flex items-center justify-center gap-1.5 sm:gap-3"
                onClick={(e) => e.preventDefault()}
              >
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 sm:p-3 bg-white text-slate-700 rounded-full shadow-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <FaEye size={isSmallMobile ? 12 : 16} className="sm:w-[18px] sm:h-[18px]" />
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
                  className={`p-1.5 sm:p-3 rounded-full shadow-lg transition-colors ${
                    isLiked ? 'bg-rose-500 text-white' : 'bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-500'
                  }`}
                >
                  <FaHeart size={isSmallMobile ? 12 : 16} className="sm:w-[18px] sm:h-[18px]" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CONTENT */}
        <div className="p-2 sm:p-4">
          {/* Category & Rating */}
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <span className={`font-semibold text-indigo-600 bg-indigo-50 rounded-full uppercase tracking-wider ${isSmallMobile ? 'text-[7px] px-1 py-0.5' : 'text-[9px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1'}`}>
              {product?.category}
            </span>
            
            <div className="flex items-center gap-0.5 sm:gap-1">
              <div className="flex">
                {[...Array(4)].map((_, i) => (
                  <FaStar key={i} className={`text-amber-400 ${isSmallMobile ? 'text-[5px]' : 'text-[8px] sm:text-[10px]'}`} />
                ))}
                <FaStarHalfAlt className={`text-amber-400 ${isSmallMobile ? 'text-[5px]' : 'text-[8px] sm:text-[10px]'}`} />
              </div>
              <span className={`font-medium text-slate-600 ml-0.5 sm:ml-1 ${isSmallMobile ? 'text-[7px]' : 'text-[9px] sm:text-xs'}`}>4.5</span>
            </div>
          </div>
          
          {/* Product Name */}
          <h3 className={`font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors ${isSmallMobile ? 'text-[9px]' : 'text-xs sm:text-sm'}`}>
            {product?.productName}
          </h3>
          
          {/* Description */}
          <p className="hidden sm:block text-xs text-slate-500 line-clamp-2 mb-2 sm:mb-3 leading-relaxed">
            {/* {product?.description} */}
          </p>
          
          {/* Price Section */}
          <div className="flex items-end justify-between mb-1.5 sm:mb-3">
            <div>
              <p className={`font-bold text-slate-800 ${isSmallMobile ? 'text-[10px]' : 'text-sm sm:text-lg'}`}>
                {displayKESCurrency(product?.selling)}
              </p>
              <p className={`text-slate-400 line-through ${isSmallMobile ? 'text-[8px]' : 'text-[10px] sm:text-xs'}`}>
                {displayKESCurrency(product?.price)}
              </p>
            </div>
            
            {product?.selling < product?.price && !isSmallMobile && (
              <span className="hidden sm:inline-block text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                Save {displayKESCurrency(product?.price - product?.selling)}
              </span>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(e, product?._id);
            }}
            className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 group/btn ${isSmallMobile ? 'text-[9px] py-1.5' : 'text-xs sm:text-sm py-2 sm:py-3'}`}
          >
            <FaShoppingCart className="group-hover/btn:animate-bounce" size={isSmallMobile ? 10 : 12} />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
};

const VerticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const railRef = useRef(null);
  
  const { fetchCountCart } = useContext(Context);

  useEffect(() => {
    const checkScreen = () => {
      setIsSmallMobile(window.innerWidth < 400);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchCountCart();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetchCategoryWiseProducts(category);
      setData(res?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  const checkScrollability = () => {
    if (railRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = railRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const rail = railRef.current;
    if (rail) {
      rail.addEventListener('scroll', checkScrollability);
      checkScrollability();
      return () => rail.removeEventListener('scroll', checkScrollability);
    }
  }, [data]);

  const scrollLeft = () => {
    railRef.current.scrollBy({ left: isSmallMobile ? -140 : -280, behavior: "smooth" });
  };

  const scrollRight = () => {
    railRef.current.scrollBy({ left: isSmallMobile ? 140 : 280, behavior: "smooth" });
  };

  return (
    <section className="py-8 sm:py-12 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
        >
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg">
                <FaBolt className="text-indigo-600 text-sm sm:text-base" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {heading}
              </h2>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm hidden sm:block">Discover our best-selling products in this category</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 sm:gap-2 text-indigo-600 font-semibold text-xs sm:text-sm hover:text-indigo-700 transition-colors group"
          >
            <span className="hidden sm:inline">View All Products</span>
            <span className="sm:hidden">View All</span>
            <FaAngleRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* SCROLL CONTAINER */}
        <div className="relative group">
          {/* Left Scroll Button */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-20 bg-white text-indigo-600 p-2 sm:p-3 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.3)] hover:scale-110 transition-all duration-300 border border-slate-100"
              >
                <FaAngleLeft size={isSmallMobile ? 16 : 20} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Right Scroll Button */}
          <AnimatePresence>
            {canScrollRight && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-20 bg-white text-indigo-600 p-2 sm:p-3 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.3)] hover:scale-110 transition-all duration-300 border border-slate-100"
              >
                <FaAngleRight size={isSmallMobile ? 16 : 20} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* PRODUCT RAIL */}
          <div
            ref={railRef}
            className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 sm:pb-6 px-0.5 sm:px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} isSmallMobile={isSmallMobile} />
              ))
            ) : data.length > 0 ? (
              data.map((product, index) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  index={index}
                  onAddToCart={handleAddToCart}
                  isSmallMobile={isSmallMobile}
                />
              ))
            ) : (
              <div className="w-full py-8 sm:py-16 text-center">
                <div className="w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <FaShoppingCart className="text-slate-400 text-lg sm:text-2xl" />
                </div>
                <p className="text-slate-500 font-medium text-xs sm:text-base">No products found in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerticalCardProduct;