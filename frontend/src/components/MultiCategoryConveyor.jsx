import React, { useState, useEffect, useRef, useCallback } from "react";
import fetchCategoryWiseProducts from "@/helpers/fetchCategoryWiseProducts.js";
import { Link } from "react-router-dom";  
const MultiCategoryConveyor = ({ 
  categories, 
  title = "Trending Now",
  speed = 1000,
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
  const positionRef = useRef(0);

  // Fetch products with error handling
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

  // Smooth scroll animation using requestAnimationFrame
  useEffect(() => {
    if (allProducts.length === 0 || isLoading) return;

    const track = trackRef.current;
    if (!track) return;

    const itemWidth = isMobile ? 160 : 220; // w-40 or w-56 approx
    const gap = isMobile ? 16 : 24; // gap-4 or gap-6
    const totalWidth = (itemWidth + gap) * allProducts.length;
    
    let lastTime = performance.now();
    
    const animate = (currentTime) => {
      if (!isPaused) {
        const delta = currentTime - lastTime;
        positionRef.current -= (totalWidth / (speed * 1000)) * delta * 16;
        
        // Seamless loop reset
        if (Math.abs(positionRef.current) >= totalWidth) {
          positionRef.current = 0;
        }
        
        track.style.transform = `translateX(${positionRef.current}px)`;
      }
      lastTime = currentTime;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [allProducts, isMobile, isPaused, speed, isLoading]);

  // Duplicate for seamless loop
  const items = [...allProducts, ...allProducts];

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full py-8 bg-white">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`flex-shrink-0 ${isMobile ? "w-36" : "w-44"} h-36 bg-gray-100 rounded-lg animate-pulse`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || allProducts.length === 0) {
    return null; // Silent fail for cleaner UI
  }

  return (
    <section className="w-full py-6 md:py-8 bg-white border-y border-gray-100">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Clean Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 tracking-tight">
            {title}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="hidden sm:inline">Live updates</span>
          </div>
        </div>

        {/* Conveyor */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => pauseOnHover && setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            setHoveredIndex(null);
          }}
        >
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Track */}
          <div className="overflow-hidden py-2">
            <div
              ref={trackRef}
              className="flex gap-4 md:gap-6 will-change-transform"
              style={{ width: 'max-content' }}
            >
              {items.map((product, idx) => {
                const isHovered = hoveredIndex === idx;
                const actualIndex = idx % allProducts.length;
                
                return (
                  <div
                    key={`${product._id || idx}-${idx}`}
                    className={`
                      group relative flex-shrink-0 cursor-pointer
                      ${isMobile ? "w-36 h-40" : "w-44 h-48"}
                      transition-all duration-300 ease-out
                      ${isHovered ? 'scale-105 z-10' : 'scale-100'}
                    `}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Card */}
                    <div className={`
                      absolute inset-0 rounded-xl bg-white
                      border border-gray-100
                      shadow-sm hover:shadow-lg
                      transition-all duration-300
                      ${isHovered ? 'border-gray-200 shadow-gray-200/50' : ''}
                    `} />

                    {/* Content */}
                    <div className="relative h-full flex flex-col p-3">
                      {/* Image */}
                      <Link to={`product/${product?._id}`}  className="relative flex-1 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                        <img
                          src={product.productImage?.[0]}
                          alt={product.productName}
                          loading="lazy"
                          className={`
                            object-contain max-h-[85%] max-w-[90%]
                            transition-transform duration-500 ease-out
                            ${isHovered ? 'scale-110' : 'scale-100'}
                            mix-blend-multiply
                          `}
                          onError={(e) => {
                            e.target.src = '/placeholder-product.png'; // Fallback image
                          }}
                        />
                      </Link>

                      {/* Info - Always visible, emphasized on hover */}
                      <div className="mt-2 space-y-1">
                        <p className={`
                          text-xs font-medium text-gray-900 truncate
                          transition-all duration-200
                          ${isHovered ? 'text-gray-900' : 'text-gray-600'}
                        `}>
                          {product.productName}
                        </p>
                        
                        {showPrice && product.price && (
                          <p className="text-sm font-bold text-gray-900">
                            ${Number(product.price).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick view indicator */}
                    <div className={`
                      absolute inset-x-0 bottom-0 h-1 bg-blue-500 rounded-b-xl
                      transform origin-left transition-transform duration-300
                      ${isHovered ? 'scale-x-100' : 'scale-x-0'}
                    `} />
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