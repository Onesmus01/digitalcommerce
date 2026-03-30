import React, { useState, useEffect, useContext } from "react";
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaHeart, 
  FaEye, 
  FaShoppingCart,
  FaFire,
  FaPercentage,
  FaBolt
} from "react-icons/fa";
import { motion } from "framer-motion";
import fetchCategoryWiseProducts from "@/helpers/fetchCategoryWiseProducts.js";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import addToCart from '@/helpers/addToCart.js'
import Context from "@/context/index.js";
import { Link } from 'react-router-dom'

// Skeleton Card Component - More compact for mobile
const SkeletonCard = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="rounded-lg sm:rounded-xl bg-white border border-slate-100 overflow-hidden"
  >
    <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
    <div className="p-1.5 sm:p-3 space-y-1.5 sm:space-y-2">
      <div className="h-2 sm:h-3 bg-slate-200 rounded w-3/4" />
      <div className="h-1.5 sm:h-2 bg-slate-100 rounded w-1/2" />
      <div className="flex justify-between items-center pt-0.5 sm:pt-1">
        <div className="h-2 sm:h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-5 w-5 sm:h-6 sm:w-6 bg-slate-200 rounded-full" />
      </div>
    </div>
  </motion.div>
);

// Product Card Component - Ultra compact for mobile
const ProductCard = ({ product, index, onAddToCart }) => {
  const [isLiked, setIsLiked] = useState(false);
  
  const discount = Math.round(((product?.price - product?.selling) / product?.price) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <Link 
        to={`product/${product._id}`}
        className="block bg-white rounded-lg sm:rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md sm:hover:shadow-lg transition-all duration-300 relative"
      >
        {/* IMAGE CONTAINER - Square aspect ratio, smaller on mobile */}
        <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
          {/* Product Image */}
          <motion.img
            src={product?.productImage?.[0]}
            alt={product?.productName}
            className="h-full w-full object-contain p-1 sm:p-3 md:p-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Discount Badge - Tiny on mobile */}
          {discount > 0 && (
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-20">
              <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-[7px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                <FaPercentage className="text-[6px] sm:text-[7px]" />
                <span className="hidden xs:inline">{discount}%</span>
                <span className="xs:hidden">{discount}</span>
              </div>
            </div>
          )}
          
          {/* Quick Action - Tiny heart on mobile */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className={`absolute top-1 right-1 sm:top-2 sm:right-2 z-20 p-1 sm:p-2 rounded-full transition-colors ${
              isLiked ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-600 hover:bg-rose-50 hover:text-rose-500'
            }`}
          >
            <FaHeart size={8} className="sm:w-3 sm:h-3" />
          </button>

          {/* Mobile Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors sm:hidden" />
        </div>

        {/* CONTENT - Ultra compact padding on mobile */}
        <div className="p-1.5 sm:p-3">
          {/* Category - Tiny pill on mobile */}
          <span className="text-[6px] sm:text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1 sm:px-2 py-0.5 rounded-full uppercase tracking-wider">
            {product?.category}
          </span>
          
          {/* Product Name - Single line, smaller text */}
          <h3 className="font-semibold text-slate-800 text-[9px] sm:text-sm mt-1 sm:mt-1.5 mb-0.5 sm:mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors leading-tight">
            {product?.productName}
          </h3>
          
          {/* Rating - Ultra compact */}
          <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-1.5">
            <div className="flex">
              {[...Array(4)].map((_, i) => (
                <FaStar key={i} className="text-amber-400 text-[5px] sm:text-[9px]" />
              ))}
              <FaStarHalfAlt className="text-amber-400 text-[5px] sm:text-[9px]" />
            </div>
            <span className="text-[6px] sm:text-[10px] text-slate-500">(4.5)</span>
          </div>
          
          {/* Price Section - Compact inline */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-0.5 sm:gap-2">
              <p className="text-[10px] sm:text-base font-bold text-slate-800">
                {displayKESCurrency(product?.selling)}
              </p>
              {product?.price > product?.selling && (
                <p className="text-[7px] sm:text-xs text-slate-400 line-through hidden sm:block">
                  {/* {displayKESCurrency(product?.price)} */}
                </p>
              )}
            </div>
            
            {/* Add to Cart - Tiny icon button on mobile */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(e, product?._id);
              }}
              className="bg-indigo-600 text-white rounded-md sm:rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors p-1 sm:px-3 sm:py-2 flex items-center justify-center"
            >
              <FaShoppingCart size={9} className="sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline ml-1.5 text-xs font-medium">Add</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ColumnProducts = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { fetchCountCart } = useContext(Context);

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

  return (
    <section className="py-4 sm:py-8 md:py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-1.5 sm:px-4 lg:px-8">
        {/* HEADER - Compact on mobile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 sm:mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="p-1 sm:p-2 bg-indigo-100 rounded-lg">
              <FaBolt className="text-indigo-600 text-[10px] sm:text-base" />
            </div>
            <div>
              <h2 className="text-sm sm:text-xl md:text-2xl font-bold text-slate-800">
                {heading}
              </h2>
              <p className="text-[8px] sm:text-sm text-slate-500 hidden sm:block">Best sellers in this category</p>
            </div>
          </div>
          
          <Link
            to={`/category/${category}`}
            className="text-[9px] sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 sm:gap-1"
          >
            See all
            <span className="hidden sm:inline">→</span>
          </Link>
        </motion.div>

        {/* PRODUCTS GRID - Responsive columns with smaller gaps on mobile */}
        {loading ? (
          // Skeleton Grid
          <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : data.length > 0 ? (
          // Product Grid - 3 columns on tiny screens, responsive gaps
          <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-4">
            {data.map((product, index) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                index={index}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="py-8 sm:py-16 text-center">
            <div className="w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <FaShoppingCart className="text-slate-400 text-lg sm:text-2xl" />
            </div>
            <p className="text-slate-500 text-xs sm:text-base font-medium">No products found</p>
          </div>
        )}
      </div>
      
      {/* Add custom xs breakpoint style */}
      <style>{`
        @media (max-width: 400px) {
          .xs\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .xs\\:inline {
            display: inline;
          }
          .xs\\:hidden {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default ColumnProducts;