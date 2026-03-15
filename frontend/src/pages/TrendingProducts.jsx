import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaFire, FaArrowRight } from "react-icons/fa";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import { Context } from '@/context/ProductContext.jsx';
import { Link } from "react-router-dom";

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const { backendUrl } = useContext(Context);

  const getTrendingProducts = async () => {
    try {
      const res = await fetch(`${backendUrl}/wishlist/most-loved`,{
        method: 'GET',
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        console.log("Trending products:", data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTrendingProducts();
  }, []);

  // Color palette for ranking
  const rankColors = [
    { bg: 'from-amber-400 to-orange-500', text: 'text-orange-600', glow: 'shadow-orange-500/50' }, // #1 Gold
    { bg: 'from-slate-300 to-slate-400', text: 'text-slate-600', glow: 'shadow-slate-400/50' },    // #2 Silver
    { bg: 'from-orange-700 to-amber-800', text: 'text-amber-800', glow: 'shadow-amber-800/50' },  // #3 Bronze
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-pink-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-96 h-96 bg-purple-300/30 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-orange-300/20 rounded-full blur-[100px]" 
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-12 h-1 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600 text-xs font-black uppercase tracking-[0.3em]"
              >
                🔥 Most Loved
              </motion.span>
              <span className="w-12 h-1 bg-gradient-to-l from-violet-500 to-pink-500 rounded-full" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
              Trending Now
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500">.</span>
            </h2>
            <p className="text-slate-500 mt-2 max-w-md">
              Products everyone is adding to their wishlist
            </p>
          </div>

          <Link 
            to="/products" 
            className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg shadow-indigo-100 border border-indigo-50 text-slate-700 font-semibold hover:bg-gradient-to-r hover:from-violet-500 hover:to-pink-500 hover:text-white transition-all duration-300 group"
          >
            View All
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((item, index) => {
            const product = item.product;
            const rankColor = rankColors[index] || { 
              bg: 'from-violet-500 to-purple-600', 
              text: 'text-violet-600',
              glow: 'shadow-violet-500/30'
            };
            const isTop3 = index < 3;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                {/* Rank Badge for Top 3 */}
                {isTop3 && (
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                    className={`absolute -top-4 -left-4 z-20 w-12 h-12 rounded-full bg-gradient-to-br ${rankColor.bg} flex items-center justify-center shadow-lg ${rankColor.glow} text-white font-black text-lg border-4 border-white`}
                  >
                    #{index + 1}
                  </motion.div>
                )}

                {/* Glassmorphism Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:shadow-violet-200/50 transition-all duration-500 relative">
                  
                  {/* Gradient Border on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${rankColor.bg} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />

                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                    <motion.img
                      src={product.productImage?.[0]}
                      alt={product.productName}
                      className="w-full h-full object-contain p-6 drop-shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 2 }}
                      transition={{ duration: 0.4 }}
                    />
                    
                    {/* Wishlist Count Badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-rose-100">
                      <FaHeart className="text-rose-500 text-sm animate-pulse" />
                      <span className="text-sm font-bold text-slate-700">{item.wishlistCount}</span>
                    </div>

                    {/* Fire Badge for Hot Items */}
                    {item.wishlistCount > 10 && (
                      <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg shadow-orange-500/30"
                      >
                        <FaFire className="animate-bounce" />
                        HOT
                      </motion.div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 relative">
                    {/* Category Tag */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${rankColor.bg} text-white shadow-sm`}>
                        {product?.category || 'Trending'}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                        <span className="text-[10px] text-slate-500 ml-1 font-bold">4.9</span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-bold text-slate-800 text-sm mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-pink-600 transition-all duration-300">
                      {product.productName}
                    </h3>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xl font-black bg-gradient-to-r ${rankColor.bg} bg-clip-text text-transparent`}>
                          {displayKESCurrency(product.price)}
                        </p>
                        {product.selling < product.price && (
                          <p className="text-xs text-slate-400 line-through font-medium">
                            {displayKESCurrency(product.selling)}
                          </p>
                        )}
                      </div>

                      <Link to={`/product/${product._id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 bg-gradient-to-r ${rankColor.bg} text-white text-sm font-bold rounded-xl shadow-lg ${rankColor.glow} hover:shadow-xl transition-all`}
                        >
                          View
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-10 text-center sm:hidden">
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-full shadow-lg font-semibold"
          >
            View All Products
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;