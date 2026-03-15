import React, { useState, useEffect, useRef, useContext } from "react";
import { 
  FaHeart, 
  FaShoppingCart,
  FaBolt,
  FaEye,
  FaFire,
  FaStar
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import fetchCategoryWiseProducts from "@/helpers/fetchCategoryWiseProducts.js";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import addToCart from '@/helpers/addToCart.js';
import { Context } from '@/context/ProductContext.jsx';
import { Link } from "react-router-dom";

const MultiCategoryConveyor = ({ 
  categories, 
  title = "Trending Now",
  speed = 30, // pixels per second - easier to understand
  pauseOnHover = true,
  showPrice = true,
  limit = 50
}) => {
  const [allProducts, setAllProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  
  // Use refs for smooth animation values (no re-renders)
  const positionRef = useRef(0);
  const velocityRef = useRef(speed);
  const lastTimeRef = useRef(0);
  const isPausedRef = useRef(false);
  
  const { fetchCountCart, AddWishlist } = useContext(Context);

  // Color palette
  const colors = [
    { primary: 'from-violet-500 to-purple-600', accent: 'violet', bg: 'bg-violet-50', text: 'text-violet-600' },
    { primary: 'from-pink-500 to-rose-600', accent: 'rose', bg: 'bg-rose-50', text: 'text-rose-600' },
    { primary: 'from-orange-400 to-red-500', accent: 'orange', bg: 'bg-orange-50', text: 'text-orange-600' },
    { primary: 'from-cyan-400 to-blue-500', accent: 'cyan', bg: 'bg-cyan-50', text: 'text-cyan-600' },
    { primary: 'from-emerald-400 to-teal-500', accent: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { primary: 'from-amber-400 to-orange-500', accent: 'amber', bg: 'bg-amber-50', text: 'text-amber-600' },
  ];

  // Fetch products
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          categories.map(async (cat) => {
            const res = await fetchCategoryWiseProducts(cat);
            return Array.isArray(res?.data) ? res.data : [];
          })
        );
        
        const flattened = results.flat().slice(0, limit);
        
        if (isMounted) {
          setAllProducts(flattened);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        if (isMounted) {
          setError("Failed to load products");
          setIsLoading(false);
        }
      }
    };

    fetchAll();
    return () => { isMounted = false; };
  }, [categories, limit]);

  // Screen detection
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // SMOOTH scroll animation using translate3d for GPU acceleration
  useEffect(() => {
    if (allProducts.length === 0 || isLoading) return;

    const track = trackRef.current;
    if (!track) return;

    // Fixed dimensions for smooth calculation
    const itemWidth = isMobile ? 260 : 300;
    const gap = isMobile ? 24 : 32;
    const totalWidth = (itemWidth + gap) * allProducts.length;
    
    // Reset position when products change
    positionRef.current = 0;
    lastTimeRef.current = performance.now();
    
    const animate = (currentTime) => {
      // Calculate delta time in seconds for consistent speed
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;
      
      // Only update if not paused (using ref for instant response)
      if (!isPausedRef.current) {
        // Move by velocity * deltaTime for frame-rate independent movement
        positionRef.current -= velocityRef.current * deltaTime;
        
        // Seamless loop reset
        if (Math.abs(positionRef.current) >= totalWidth) {
          positionRef.current = positionRef.current % totalWidth;
        }
        
        // Use translate3d for GPU acceleration - SMOOTH!
        track.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [allProducts, isMobile, isLoading, speed]);

  // Sync pause state with ref
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(e, id);
    fetchCountCart();
  };

  const handleWishlistClick = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    await AddWishlist(productId);
  };

  // Duplicate for seamless loop (triple for smoother visual)
  const items = [...allProducts, ...allProducts, ...allProducts];

  // Colorful Skeleton Loader
  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-indigo-50 via-white to-pink-50 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-48 bg-gradient-to-r from-indigo-200 to-pink-200 rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[260px] sm:w-[300px] rounded-2xl bg-white border-2 border-indigo-100 overflow-hidden shadow-lg shadow-indigo-100/50">
                <div className="h-[200px] bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-indigo-200 rounded w-1/3" />
                  <div className="h-4 bg-indigo-300 rounded w-3/4" />
                  <div className="flex justify-between pt-2">
                    <div className="h-5 bg-indigo-200 rounded w-1/3" />
                    <div className="h-8 bg-indigo-100 rounded-full w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || allProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-indigo-50 via-white to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/30 rounded-full blur-[100px]" 
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Colorful Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-3"
            >
              <span className="w-12 h-1 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600 text-xs font-black uppercase tracking-[0.3em]"
              >
                ✨ Live Updates
              </motion.span>
              <span className="w-12 h-1 bg-gradient-to-l from-violet-500 to-pink-500 rounded-full" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight"
            >
              {title}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500">.</span>
            </motion.h2>
          </div>

          {/* Live Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg shadow-indigo-100 border border-indigo-50">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-slate-600">Live</span>
          </div>
        </div>

        {/* Smooth Conveyor */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => pauseOnHover && setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            setHoveredIndex(null);
          }}
        >
          {/* Gradient Edge Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-indigo-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-pink-50 to-transparent z-10 pointer-events-none" />

          {/* Track - Using translate3d for GPU acceleration */}
          <div className="overflow-hidden py-4">
            <div
              ref={trackRef}
              className="flex gap-6 md:gap-8 will-change-transform"
              style={{ 
                width: 'max-content',
                transform: 'translate3d(0, 0, 0)', // Force GPU layer creation
                backfaceVisibility: 'hidden', // Prevent flickering
              }}
            >
              {items.map((product, idx) => {
                const isHovered = hoveredIndex === idx;
                const actualIndex = idx % allProducts.length;
                const color = colors[actualIndex % colors.length];
                const discount = Math.round(((product?.price - product?.selling) / product?.price) * 100);
                
                return (
                  <motion.div
                    key={`${product._id || idx}-${idx}`}
                    initial={false} // Don't animate on mount to prevent jitter
                    className={`flex-shrink-0 ${isMobile ? "w-[260px]" : "w-[300px]"} group`}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      transform: 'translate3d(0, 0, 0)', // GPU layer for each card
                    }}
                  >
                    {/* Card Container */}
                    <div className={`bg-white rounded-2xl border-2 ${isHovered ? 'border-transparent' : 'border-slate-100'} overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative`}>
                      {/* Animated Gradient Border on Hover */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`absolute inset-0 bg-gradient-to-r ${color.primary} rounded-2xl -z-10 blur-sm`} 
                          />
                        )}
                      </AnimatePresence>

                      {/* Image Container */}
                      <div className={`relative h-[200px] ${color.bg} overflow-hidden`}>
                        <motion.img
                          src={product.productImage?.[0]}
                          alt={product.productName}
                          loading="lazy"
                          className="w-full h-full object-contain p-4 relative z-10 drop-shadow-lg"
                          animate={{ 
                            scale: isHovered ? 1.1 : 1, 
                            y: isHovered ? -5 : 0
                          }}
                          transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
                          onError={(e) => {
                            e.target.src = '/placeholder-product.png';
                          }}
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
                          {discount > 0 && (
                            <span className={`bg-gradient-to-r ${color.primary} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1`}>
                              <FaFire size={10} className="animate-pulse" />
                              -{discount}%
                            </span>
                          )}
                          <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 border border-slate-100">
                            <FaBolt size={10} className="text-amber-500" />
                            TRENDING
                          </span>
                        </div>

                        {/* Wishlist */}
                        <motion.button
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          whileTap={{ scale: 0.8 }}
                          onClick={(e) => handleWishlistClick(e, product?._id)}
                          className="absolute top-3 right-3 p-2.5 rounded-full shadow-lg transition-all z-20 bg-white text-slate-400 hover:text-rose-500"
                        >
                          <FaHeart size={14} />
                        </motion.button>

                        {/* Quick View */}
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className={`absolute inset-0 bg-gradient-to-t ${color.primary} opacity-90 flex items-center justify-center z-10`}
                            >
                              <Link to={`product/${product?._id}`}>
                                <motion.button 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="p-3 bg-white rounded-full text-slate-800 shadow-xl"
                                >
                                  <FaEye size={18} />
                                </motion.button>
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-gradient-to-r ${color.primary} text-white`}>
                            {product?.category}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className="text-amber-400 text-[10px]" />
                            ))}
                            <span className="text-[10px] text-slate-500 ml-1 font-bold">4.9</span>
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-slate-800 text-sm mb-2 line-clamp-1">
                          {product?.productName}
                        </h3>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-xl font-black bg-gradient-to-r ${color.primary} bg-clip-text text-transparent`}>
                              {displayKESCurrency(product?.selling)}
                            </p>
                            {product?.selling < product?.price && (
                              <p className="text-xs text-slate-400 line-through font-medium">
                                {displayKESCurrency(product?.price)}
                              </p>
                            )}
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleAddToCart(e, product?._id)}
                            className={`p-3 bg-gradient-to-r ${color.primary} text-white rounded-xl shadow-lg hover:shadow-xl transition-all`}
                          >
                            <FaShoppingCart size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiCategoryConveyor;