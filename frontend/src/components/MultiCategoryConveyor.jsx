import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
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
import Context from "@/context/index.js";
import { Link } from "react-router-dom";

const MultiCategoryConveyor = ({ 
  categories, 
  title = "Trending Now",
  speed = 25,
  pauseOnHover = true,
  showPrice = true,
  limit = 50
}) => {
  const [allProducts, setAllProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  
  const positionRef = useRef(0);
  const isPausedRef = useRef(false);
  const velocityRef = useRef(speed);
  
  const { fetchCountCart, AddWishlist } = useContext(Context);

  const colors = [
    { primary: 'from-violet-500 to-purple-600', accent: 'violet', bg: 'bg-violet-50', text: 'text-violet-600' },
    { primary: 'from-pink-500 to-rose-600', accent: 'rose', bg: 'bg-rose-50', text: 'text-rose-600' },
    { primary: 'from-orange-400 to-red-500', accent: 'orange', bg: 'bg-orange-50', text: 'text-orange-600' },
    { primary: 'from-cyan-400 to-blue-500', accent: 'cyan', bg: 'bg-cyan-50', text: 'text-cyan-600' },
    { primary: 'from-emerald-400 to-teal-500', accent: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { primary: 'from-amber-400 to-orange-500', accent: 'amber', bg: 'bg-amber-50', text: 'text-amber-600' },
  ];

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

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      setIsSmallMobile(width < 400);
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    if (allProducts.length === 0 || isLoading) return;

    const track = trackRef.current;
    if (!track) return;

    const getDimensions = () => {
      if (window.innerWidth < 400) {
        return { width: 120, gap: 12 };
      } else if (window.innerWidth < 640) {
        return { width: 140, gap: 14 };
      } else if (window.innerWidth < 1024) {
        return { width: 180, gap: 18 };
      } else {
        return { width: 260, gap: 22 };
      }
    };

    let { width: itemWidth, gap } = getDimensions();
    const totalWidth = (itemWidth + gap) * allProducts.length;
    
    positionRef.current = 0;
    velocityRef.current = isMobile ? speed * 0.6 : speed;
    
    let lastTime = performance.now();
    
    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      if (!isPausedRef.current) {
        positionRef.current -= velocityRef.current * deltaTime;
        
        if (Math.abs(positionRef.current) >= totalWidth) {
          positionRef.current = positionRef.current % totalWidth;
        }
        
        track.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    const handleResize = () => {
      const newDims = getDimensions();
      itemWidth = newDims.width;
      gap = newDims.gap;
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [allProducts, isLoading, speed, isMobile]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      isPausedRef.current = true;
      const decelerate = () => {
        if (!isPausedRef.current) return;
        velocityRef.current *= 0.95;
        if (velocityRef.current > 5) requestAnimationFrame(decelerate);
      };
      decelerate();
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    isPausedRef.current = false;
    const accelerate = () => {
      if (isPausedRef.current) return;
      if (velocityRef.current < speed) {
        velocityRef.current *= 1.05;
        if (velocityRef.current > speed) velocityRef.current = speed;
        requestAnimationFrame(accelerate);
      }
    };
    accelerate();
  }, [speed]);

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

  const items = [...allProducts, ...allProducts, ...allProducts];

  const getCardWidth = () => {
    if (isSmallMobile) return "w-[120px]";
    if (isMobile) return "w-[140px]";
    if (isTablet) return "w-[180px]";
    return "w-[260px]";
  };

  const getImageHeight = () => {
    if (isSmallMobile) return "h-[90px]";
    if (isMobile) return "h-[110px]";
    if (isTablet) return "h-[140px]";
    return "h-[170px]";
  };

  const getBadgeSize = () => {
    if (isSmallMobile) return { text: "text-[7px]", icon: 6, padding: "px-1 py-0.5" };
    if (isMobile) return { text: "text-[8px]", icon: 7, padding: "px-1.5 py-0.5" };
    return { text: "text-[10px]", icon: 8, padding: "px-2 py-0.5" };
  };

  const badgeSize = getBadgeSize();

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 bg-gradient-to-b from-indigo-50 via-white to-pink-50 relative overflow-hidden">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="h-5 sm:h-6 w-28 sm:w-32 bg-gradient-to-r from-indigo-200 to-pink-200 rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-3 sm:gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`flex-shrink-0 ${getCardWidth()} rounded-lg sm:rounded-xl bg-white border border-indigo-100 overflow-hidden shadow-md`}
              >
                <div className={`${getImageHeight()} bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 animate-pulse`} />
                <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
                  <div className="h-1.5 sm:h-2 bg-indigo-200 rounded w-1/3" />
                  <div className="h-2 sm:h-3 bg-indigo-300 rounded w-3/4" />
                  <div className="flex justify-between pt-0.5 sm:pt-1">
                    <div className="h-3 sm:h-4 bg-indigo-200 rounded w-1/3" />
                    <div className="h-5 sm:h-6 bg-indigo-100 rounded-full w-5 sm:w-6" />
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
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-indigo-50 via-white to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200/20 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-200/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-2 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-1 sm:mb-2"
            >
              <span className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                ✨ Live Updates
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 leading-tight"
            >
              {title}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500">.</span>
            </motion.h2>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur rounded-full shadow-sm border border-indigo-100">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600">Live</span>
          </div>
        </div>

        <div 
          className="relative overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-20 bg-gradient-to-r from-indigo-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-20 bg-gradient-to-l from-pink-50 to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden py-2">
            <div
              ref={trackRef}
              className="flex gap-3 sm:gap-4 md:gap-5 will-change-transform"
              style={{ 
                width: 'max-content',
                transform: 'translate3d(0, 0, 0)',
              }}
            >
              {items.map((product, idx) => {
                const actualIndex = idx % allProducts.length;
                const color = colors[actualIndex % colors.length];
                const discount = Math.round(((product?.price - product?.selling) / product?.price) * 100);
                
                return (
                  <div
                    key={`${product._id || idx}-${idx}`}
                    className={`flex-shrink-0 ${getCardWidth()} group cursor-pointer`}
                    style={{ transform: 'translate3d(0, 0, 0)' }}
                  >
                    <div className="bg-white rounded-lg sm:rounded-xl border border-slate-100 overflow-hidden shadow-md hover:shadow-lg sm:hover:shadow-xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-0.5 sm:hover:-translate-y-1 relative">
                      
                      <div className={`relative ${getImageHeight()} ${color.bg} overflow-hidden`}>
                        <img
                          src={product.productImage?.[0]}
                          alt={product.productName}
                          loading={idx < 6 ? "eager" : "lazy"}
                          decoding="async"
                          fetchpriority={idx < 6 ? "high" : "low"}
                          className="w-full h-full object-contain p-1.5 sm:p-3 transition-transform duration-700 ease-out group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f1f5f9"/><text x="50" y="50" font-family="Arial" font-size="10" fill="%2394a3b8" text-anchor="middle" dy=".3em">No Image</text></svg>';
                            e.target.onerror = null;
                          }}
                        />
                        
                        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col gap-0.5 sm:gap-1">
                          {discount > 0 && (
                            <span className={`bg-gradient-to-r ${color.primary} text-white ${badgeSize.text} font-bold ${badgeSize.padding} rounded-full shadow-md flex items-center gap-0.5`}>
                              <FaFire size={badgeSize.icon} />
                              -{discount}%
                            </span>
                          )}
                          <span className="bg-white/90 backdrop-blur text-slate-700 text-[7px] sm:text-[9px] font-bold px-1 sm:px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                            <FaBolt size={isSmallMobile ? 6 : 8} className="text-amber-500" />
                            HOT
                          </span>
                        </div>

                        <button
                          onClick={(e) => handleWishlistClick(e, product?._id)}
                          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1 sm:p-1.5 rounded-full bg-white/90 backdrop-blur shadow-md transition-all duration-300 text-slate-400 hover:text-rose-500 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
                        >
                          <FaHeart size={isSmallMobile ? 10 : 12} />
                        </button>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2 sm:pb-3">
                          <Link to={`product/${product?._id}`} className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <button className="p-1.5 sm:p-2 bg-white rounded-full text-slate-800 shadow-lg hover:bg-slate-50">
                              <FaEye size={isSmallMobile ? 12 : 14} />
                            </button>
                          </Link>
                        </div>
                      </div>

                      <div className="p-2 sm:p-3">
                        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                          <span className={`px-1 sm:px-1.5 py-0.5 rounded text-[7px] sm:text-[9px] font-bold uppercase bg-gradient-to-r ${color.primary} text-white`}>
                            {product?.category}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <FaStar className="text-amber-400 text-[6px] sm:text-[8px]" />
                            <span className="text-[7px] sm:text-[9px] text-slate-500 font-bold">4.9</span>
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-slate-800 text-[9px] sm:text-xs mb-1 sm:mb-1.5 line-clamp-1 leading-tight">
                          {product?.productName}
                        </h3>

                        <div className="flex items-center justify-between">
                          <div className="leading-none">
                            <p className={`text-[11px] sm:text-sm font-black bg-gradient-to-r ${color.primary} bg-clip-text text-transparent`}>
                              {displayKESCurrency(product?.selling)}
                            </p>
                            {product?.selling < product?.price && (
                              <p className="text-[8px] sm:text-[10px] text-slate-400 line-through font-medium">
                                {displayKESCurrency(product?.price)}
                              </p>
                            )}
                          </div>
                          
                          <button
                            onClick={(e) => handleAddToCart(e, product?._id)}
                            className={`p-1.5 sm:p-2 bg-gradient-to-r ${color.primary} text-white rounded-md sm:rounded-lg shadow-md hover:shadow-lg transition-all active:scale-90`}
                          >
                            <FaShoppingCart size={isSmallMobile ? 10 : 12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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