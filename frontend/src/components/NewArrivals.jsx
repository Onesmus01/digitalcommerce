import React, { useState, useEffect, useRef, useContext } from "react";
import { 
  FaArrowRight, 
  FaStar, 
  FaHeart, 
  FaShoppingCart,
  FaBolt,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaFire
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import fetchCategoryWiseProducts from "@/helpers/fetchCategoryWiseProducts.js";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import addToCart from '@/helpers/addToCart.js';
import Context from "@/context/index.js";
import { Link } from 'react-router-dom';

// Colorful Skeleton Loader - Smaller on mobile
const SkeletonCard = ({ isSmallMobile }) => (
  <div className={`flex-shrink-0 ${isSmallMobile ? 'w-[130px]' : 'w-[calc(50%-8px)] sm:w-[180px] md:w-[220px] lg:w-[260px]'} rounded-lg sm:rounded-2xl bg-white border-2 border-indigo-100 overflow-hidden shadow-lg shadow-indigo-100/50`}>
    <div className={`${isSmallMobile ? 'h-[100px]' : 'h-[140px] sm:h-[180px] md:h-[200px]'} bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 animate-pulse`} />
    <div className="p-2 sm:p-4 space-y-1.5 sm:space-y-3">
      <div className="h-1.5 sm:h-3 bg-indigo-200 rounded w-1/3" />
      <div className="h-2 sm:h-4 bg-indigo-300 rounded w-3/4" />
      <div className="flex justify-between pt-1 sm:pt-2">
        <div className="h-3 sm:h-5 bg-indigo-200 rounded w-1/3" />
        <div className="h-5 sm:h-8 bg-indigo-100 rounded-full w-5 sm:w-8" />
      </div>
    </div>
  </div>
);

// Colorful Product Card - Smaller on mobile
const ProductCard = ({ product, index, onAddToCart, isSmallMobile }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const { AddWishlist } = useContext(Context);

  const discount = Math.round(((product?.price - product?.selling) / product?.price) * 100);
  
  const colors = [
    { primary: 'from-violet-500 to-purple-600', accent: 'violet', bg: 'bg-violet-50' },
    { primary: 'from-pink-500 to-rose-600', accent: 'rose', bg: 'bg-rose-50' },
    { primary: 'from-orange-400 to-red-500', accent: 'orange', bg: 'bg-orange-50' },
    { primary: 'from-cyan-400 to-blue-500', accent: 'cyan', bg: 'bg-cyan-50' },
    { primary: 'from-emerald-400 to-teal-500', accent: 'emerald', bg: 'bg-emerald-50' },
    { primary: 'from-amber-400 to-orange-500', accent: 'amber', bg: 'bg-amber-50' },
  ];
  const color = colors[index % colors.length];
  
  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isAddingToWishlist) return;
    
    setIsAddingToWishlist(true);
    
    try {
      await AddWishlist(product?._id);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.5, type: "spring" }}
      className={`flex-shrink-0 ${isSmallMobile ? 'w-[130px]' : 'w-[calc(50%-8px)] sm:w-[180px] md:w-[220px] lg:w-[260px]'} group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`bg-white rounded-lg sm:rounded-2xl border-2 ${isHovered ? 'border-transparent' : 'border-slate-100'} overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative`}>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 bg-gradient-to-r ${color.primary} rounded-lg sm:rounded-2xl -z-10 blur-sm`} 
            />
          )}
        </AnimatePresence>

        <div className={`relative ${isSmallMobile ? 'h-[100px]' : 'h-[140px] sm:h-[180px] md:h-[200px]'} ${color.bg} overflow-hidden`}>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8)_0%,transparent_50%)]" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -right-10 -top-10 w-24 sm:w-40 h-24 sm:h-40 bg-white/20 rounded-full blur-2xl"
            />
          </div>

          <motion.img
            src={product?.productImage?.[0]}
            alt={product?.productName}
            className="w-full h-full object-contain p-2 sm:p-4 relative z-10 drop-shadow-lg"
            animate={{ 
              scale: isHovered ? 1.1 : 1, 
              rotate: isHovered ? 2 : 0,
              y: isHovered ? -5 : 0
            }}
            transition={{ duration: 0.4, type: "spring" }}
          />
          
          <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2 z-20">
            {discount > 0 && (
              <motion.span 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`bg-gradient-to-r ${color.primary} text-white text-[8px] sm:text-xs font-bold px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-full shadow-lg flex items-center gap-0.5 sm:gap-1`}>
                <FaFire size={isSmallMobile ? 6 : 8} className="sm:w-[10px] sm:h-[10px] animate-pulse" />
                -{discount}%
              </motion.span>
            )}
            <motion.span 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white text-slate-800 text-[8px] sm:text-xs font-bold px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-full shadow-lg flex items-center gap-0.5 sm:gap-1 border border-slate-100">
              <FaBolt size={isSmallMobile ? 6 : 8} className="sm:w-[10px] sm:h-[10px] text-amber-500" />
              NEW
            </motion.span>
          </div>

          <motion.button
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.8 }}
            onClick={handleWishlistClick}
            disabled={isAddingToWishlist}
            className={`absolute top-1.5 right-1.5 sm:top-3 sm:right-3 p-1.5 sm:p-2.5 rounded-full shadow-lg transition-all z-20 ${
              isLiked 
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white' 
                : 'bg-white text-slate-400 hover:text-rose-500'
            } ${isAddingToWishlist ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.5, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isAddingToWishlist ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FaHeart size={isSmallMobile ? 10 : 12} className="sm:w-[14px] sm:h-[14px] opacity-50" />
                </motion.div>
              ) : (
                <FaHeart size={isSmallMobile ? 10 : 12} className="sm:w-[14px] sm:h-[14px]" />
              )}
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 bg-gradient-to-t ${color.primary} opacity-90 flex items-center justify-center gap-2 sm:gap-3 z-10`}
              >
                <motion.button 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-1.5 sm:p-3 bg-white rounded-full text-slate-800 shadow-xl hover:scale-110 transition-transform">
                  <FaEye size={isSmallMobile ? 12 : 16} className="sm:w-[18px] sm:h-[18px]" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-2 sm:p-4 relative">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <span className={`px-1 sm:px-2 py-0.5 rounded text-[7px] sm:text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${color.primary} text-white`}>
              {product?.category}
            </span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`text-amber-400 ${isSmallMobile ? 'text-[5px]' : 'text-[8px] sm:text-[10px]'}`} />
              ))}
              <span className={`text-slate-500 ml-0.5 sm:ml-1 font-bold ${isSmallMobile ? 'text-[7px]' : 'text-[9px] sm:text-[10px]'}`}>4.9</span>
            </div>
          </div>
          
          <h3 className={`font-bold text-slate-800 mb-1 sm:mb-2 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${color.primary} transition-all duration-300 ${isSmallMobile ? 'text-[9px]' : 'text-xs sm:text-sm'}`}>
            {product?.productName}
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className={`font-black bg-gradient-to-r ${color.primary} bg-clip-text text-transparent ${isSmallMobile ? 'text-xs' : 'text-sm sm:text-xl'}`}>
                {displayKESCurrency(product?.selling)}
              </p>
              {product?.selling < product?.price && (
                <p className={`text-slate-400 line-through font-medium ${isSmallMobile ? 'text-[8px]' : 'text-[10px] sm:text-xs'}`}>
                  {displayKESCurrency(product?.price)}
                </p>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => onAddToCart(e, product?._id)}
              className={`p-1.5 sm:p-3 bg-gradient-to-r ${color.primary} text-white rounded-md sm:rounded-xl shadow-lg transition-all ${isSmallMobile ? '' : 'shadow-' + color.accent + '-500/30 hover:shadow-xl'}`}>
              <FaShoppingCart size={isSmallMobile ? 12 : 14} className="sm:w-[16px] sm:h-[16px]" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const NewArrivals = ({ category = "new", heading = "New Arrivals" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const railRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    e.preventDefault();
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

  const checkScroll = () => {
    if (railRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = railRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const rail = railRef.current;
    if (rail) {
      rail.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => rail.removeEventListener('scroll', checkScroll);
    }
  }, [data]);

  const scroll = (direction) => {
    if (railRef.current) {
      const scrollAmount = isSmallMobile ? 140 : 280;
      railRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <section className="py-6 sm:py-16 bg-gradient-to-b from-indigo-50 via-white to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-20 left-10 w-32 sm:w-72 h-32 sm:h-72 bg-purple-300/30 rounded-full blur-[60px] sm:blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-40 sm:w-96 h-40 sm:h-96 bg-pink-300/30 rounded-full blur-[60px] sm:blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-32 sm:w-64 h-32 sm:h-64 bg-orange-300/20 rounded-full blur-[40px] sm:blur-[80px]" 
        />
      </div>

      <div className="container mx-auto px-2 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-end justify-between mb-4 sm:mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-3"
            >
              <span className="w-6 sm:w-12 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600 text-[9px] sm:text-xs font-black uppercase tracking-wider">
                ✨ Fresh Drops
              </motion.span>
              <span className="w-6 sm:w-12 h-0.5 bg-gradient-to-l from-violet-500 to-pink-500 rounded-full" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-lg sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              {heading}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500">.</span>
            </motion.h2>
            <p className="text-slate-500 mt-1 sm:mt-2 max-w-md text-xs sm:text-base hidden sm:block">Discover the latest trends with vibrant colors and exclusive deals!</p>
          </div>

          <div className="hidden sm:flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-3 sm:p-4 rounded-full shadow-lg transition-all ${
                canScrollLeft 
                  ? 'bg-white text-violet-600 shadow-violet-200 hover:shadow-violet-300 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-600 hover:text-white' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}>
              <FaChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-3 sm:p-4 rounded-full shadow-lg transition-all ${
                canScrollRight 
                  ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-pink-200 hover:shadow-pink-300' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}>
              <FaChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </motion.button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={railRef}
            className="flex gap-2 sm:gap-6 overflow-x-auto scrollbar-hide pb-3 sm:pb-6 px-0.5 sm:px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
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
              <div className="w-full py-8 sm:py-20 text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaBolt className="mx-auto text-2xl sm:text-5xl text-amber-400 mb-2 sm:mb-4" />
                </motion.div>
                <p className="text-slate-400 font-medium text-xs sm:text-base">New arrivals coming soon!</p>
              </div>
            )}
          </div>

          <div className="absolute right-0 top-0 bottom-3 sm:bottom-6 w-12 sm:w-32 bg-gradient-to-l from-indigo-50 to-transparent pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-3 sm:bottom-6 w-2 sm:w-8 bg-gradient-to-r from-indigo-50 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default NewArrivals