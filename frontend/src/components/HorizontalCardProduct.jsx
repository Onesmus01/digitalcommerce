import React, { useState, useEffect, useRef, useContext } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaStar,
  FaEye,
  FaCheck,
  FaBox
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import fetchCategoryWiseProducts from "@/helpers/fetchCategoryWiseProducts.js";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import addToCart from "@/helpers/addToCart.js";
import Context from "@/context/index.js";
import { Title } from "./Title.jsx";

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState({});
  const [cartItem, setCartItem] = useState(null);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const railRef = useRef(null);
  const { fetchCountCart } = useContext(Context);
  const skeletons = Array.from({ length: 6 });

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
  }, []);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(e, product._id);
    fetchCountCart();
    toast.success("Added to cart!", {
      icon: "🛒",
      style: {
        borderRadius: "12px",
        background: "#1e293b",
        color: "#fff",
      },
    });
    setCartItem(product);
    setActiveCard(product._id);
    setShowMiniCart(true);
    setTimeout(() => {
      setShowMiniCart(false);
      setActiveCard(null);
    }, 3000);
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success(wishlist[id] ? "Removed from wishlist" : "Added to wishlist", {
      style: {
        borderRadius: "12px",
        background: wishlist[id] ? "#fef2f2" : "#fefce8",
        color: wishlist[id] ? "#dc2626" : "#ca8a04",
        border: `1px solid ${wishlist[id] ? "#fecaca" : "#fde047"}`,
      },
    });
  };

  const scrollLeft = () =>
    railRef.current.scrollBy({ left: -340, behavior: "smooth" });
  const scrollRight = () =>
    railRef.current.scrollBy({ left: 340, behavior: "smooth" });

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
    pop: {
      scale: [1, 1.08, 1],
      transition: { duration: 0.3 },
    },
  };

  return (
    <section className="relative py-8">
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* PREMIUM HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {heading}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Curated selection for you
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View all
              <FaAngleRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

        {/* SCROLL CONTAINER */}
        <div className="relative">
          {/* LEFT SCROLL BUTTON */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollLeft}
            className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-white/90 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/50 text-slate-600 hover:text-indigo-600 hover:shadow-lg transition-all"
          >
            <FaAngleLeft className="text-lg" />
          </motion.button>

          {/* RIGHT SCROLL BUTTON */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollRight}
            className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-white/90 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/50 text-slate-600 hover:text-indigo-600 hover:shadow-lg transition-all"
          >
            <FaAngleRight className="text-lg" />
          </motion.button>

          {/* PRODUCT RAIL */}
          <div
            ref={railRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* SKELETON LOADING */}
            <AnimatePresence>
              {loading &&
                skeletons.map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="min-w-[200px] sm:min-w-[240px] md:min-w-[280px] flex-shrink-0"
                  >
                    <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                      <div className="h-40 sm:h-48 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-slate-200 rounded-lg w-3/4 animate-pulse" />
                        <div className="h-3 bg-slate-200 rounded-lg w-1/2 animate-pulse" />
                        <div className="flex items-center gap-2 pt-2">
                          <div className="h-8 bg-slate-200 rounded-full w-24 animate-pulse" />
                          <div className="h-8 bg-slate-200 rounded-full flex-1 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>

            {/* PRODUCT CARDS */}
            {!loading &&
              data.map((product, index) => {
                const discountPercent = product?.price
                  ? Math.round(
                      ((product.price - product.selling) / product.price) * 100
                    )
                  : 0;
                const isHovered = hoveredCard === product._id;
                const isActive = activeCard === product._id;

                return (
                  <motion.div
                    key={product?._id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate={isActive ? "pop" : "visible"}
                    className="min-w-[200px] sm:min-w-[240px] md:min-w-[280px] flex-shrink-0"
                    onMouseEnter={() => setHoveredCard(product._id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Link to={`product/${product?._id}`} className="block h-full">
                      <motion.div
                        whileHover={{ y: -8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="group relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-shadow duration-500 h-full flex flex-col"
                      >
                        {/* GLOW EFFECT ON HOVER */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isHovered ? 1 : 0 }}
                          className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"
                        />

                        {/* DISCOUNT BADGE */}
                        <AnimatePresence>
                          {discountPercent > 0 && (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="absolute top-3 left-3 z-10"
                            >
                              <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-rose-500/30">
                                -{discountPercent}%
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* WISHLIST BUTTON */}
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product._id);
                          }}
                          className={`absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 ${
                            wishlist[product._id]
                              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                              : "bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white shadow-md"
                          }`}
                        >
                          {wishlist[product._id] ? (
                            <FaHeart className="text-sm" />
                          ) : (
                            <FaRegHeart className="text-sm" />
                          )}
                        </motion.button>

                        {/* QUICK VIEW BUTTON (SHOWS ON HOVER) */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                        >
                          <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-sm font-medium text-slate-700">
                            <FaEye className="text-indigo-500" />
                            Quick View
                          </div>
                        </motion.div>

                        {/* IMAGE CONTAINER */}
                        <div className="relative h-44 sm:h-52 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center overflow-hidden">
                          <motion.img
                            src={product?.productImage?.[0]}
                            alt={product?.productName}
                            className="h-32 sm:h-40 w-auto object-contain"
                            animate={{
                              scale: isHovered ? 1.1 : 1,
                              rotate: isHovered ? 2 : 0,
                            }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          />
                          
                          {/* IMAGE OVERLAY ON HOVER */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"
                          />
                        </div>

                        {/* PRODUCT INFO */}
                        <div className="relative flex-1 flex flex-col p-4 bg-white">
                          {/* RATING */}
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-xs ${
                                  i < 4 ? "text-amber-400" : "text-slate-200"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-slate-400 ml-1">(4.5)</span>
                          </div>

                          {/* PRODUCT NAME */}
                          <h3 className="text-sm sm:text-base font-semibold text-slate-800 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                            {product?.productName}
                          </h3>

                          {/* PRICE */}
                          <div className="flex items-center gap-2 mb-3">
                            {discountPercent > 0 && (
                              <span className="text-xs text-slate-400 line-through">
                                {displayKESCurrency(product?.price)}
                              </span>
                            )}
                            <span className="text-lg font-bold text-slate-900">
                              {displayKESCurrency(product?.selling)}
                            </span>
                          </div>

                          {/* ADD TO CART BUTTON */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => handleAddToCart(e, product)}
                            className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 bg-slate-100 text-slate-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white hover:shadow-lg hover:shadow-indigo-500/25"
                          >
                            <FaShoppingCart className="text-sm" />
                            Add to Cart
                          </motion.button>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}

            {/* EMPTY STATE */}
            {!loading && data.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 w-full"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <FaBox className="text-3xl text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No products found</p>
                <p className="text-sm text-slate-400 mt-1">
                  Check back later for new arrivals
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* PROGRESS INDICATOR */}
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: Math.min(5, Math.ceil(data.length / 3)) }).map(
            (_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === 0
                    ? "w-6 bg-gradient-to-r from-indigo-500 to-purple-500"
                    : "w-1.5 bg-slate-200"
                }`}
              />
            )
          )}
        </div>
      </div>

      {/* PREMIUM MINI CART SLIDE-IN */}
      <AnimatePresence>
        {showMiniCart && cartItem && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-4 w-80">
              {/* HEADER */}
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <FaCheck className="text-white text-xs" />
                </div>
                <span className="font-semibold text-slate-800">Added to cart!</span>
              </div>

              {/* PRODUCT DETAILS */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src={cartItem?.productImage?.[0]}
                    alt={cartItem?.productName}
                    className="h-14 w-auto object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {cartItem?.productName}
                  </p>
                  <p className="text-lg font-bold text-indigo-600 mt-1">
                    {displayKESCurrency(cartItem?.selling)}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-2 mt-4">
                <Link
                  to="/cart"
                  className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold rounded-xl text-center hover:shadow-lg hover:shadow-indigo-500/25 transition-shadow"
                >
                  View Cart
                </Link>
                <button
                  onClick={() => setShowMiniCart(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS FOR SCROLLBAR HIDE */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default HorizontalCardProduct