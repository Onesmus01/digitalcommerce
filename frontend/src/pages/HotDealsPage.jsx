import React, { useState, useEffect, useContext } from "react";
import { 
  FaArrowLeft, 
  FaHeart, 
  FaShoppingCart,
  FaFire,
  FaPercentage,
  FaClock,
  FaStar,
  FaEye,
  FaSearch,
  FaThLarge,
  FaList,
  FaSpinner,
  FaRegSadTear,
  FaBolt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import fetchCategoryWiseProducts from "@/helpers/fetchCategoryWiseProducts.js";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import addToCart from '@/helpers/addToCart.js';
import Context from "@/context/index.js";
import SEO from "@/components/Seo.jsx";

// Countdown Timer
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-white">
      {['hours', 'minutes', 'seconds'].map((unit, idx) => (
        <React.Fragment key={unit}>
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold bg-white/20 rounded-lg px-2 sm:px-3 py-1 min-w-[40px] sm:min-w-[50px] text-center backdrop-blur-sm">
              {String(timeLeft[unit]).padStart(2, '0')}
            </span>
            <span className="text-[8px] sm:text-[10px] uppercase tracking-wider mt-1 opacity-80">{unit}</span>
          </div>
          {idx < 2 && <span className="text-xl sm:text-2xl font-bold">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

// Hero Deal Card - Clean & Responsive
const HeroDeal = ({ product, onAddToCart }) => {
  const [isLiked, setIsLiked] = useState(false);
  const discount = Math.round(((product?.price - product?.selling) / product?.price) * 100) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-rose-400 via-pink-500 to-orange-400 p-1 shadow-xl"
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-[22px] p-4 sm:p-6 lg:p-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Content */}
          <div className="text-white space-y-3 sm:space-y-4 order-2 md:order-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 sm:px-3 py-1 bg-white/20 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-sm">
                <FaFire className="text-amber-200" size={10} />
                Deal of the Day
              </span>
              <span className="px-2 sm:px-3 py-1 bg-amber-300 text-amber-900 rounded-full text-[10px] sm:text-xs font-bold">
                -{discount}% OFF
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold leading-tight line-clamp-2">
              {product?.productName || 'Mega Deal'}
            </h2>
            
            <p className="text-white/80 text-sm sm:text-base line-clamp-2 hidden sm:block">
              {product?.description || 'Limited time offer - Grab it before it ends!'}
            </p>

            <div className="flex items-baseline gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {displayKESCurrency(product?.selling || 0)}
              </span>
              <span className="text-sm sm:text-lg text-white/60 line-through">
                {displayKESCurrency(product?.price || 0)}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1 sm:pt-2">
              <CountdownTimer />
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => onAddToCart(e, product?._id)}
                className="px-4 sm:px-8 py-2.5 sm:py-4 bg-white text-rose-500 font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <FaShoppingCart size={16} />
                <span className="hidden sm:inline">Grab Deal Now</span>
                <span className="sm:hidden">Buy Now</span>
              </motion.button>
              
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all ${isLiked ? 'bg-white text-rose-500' : 'bg-white/20 text-white hover:bg-white/30'}`}
              >
                <FaHeart size={18} className={isLiked ? 'animate-pulse' : ''} />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-1 md:order-2">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <img
                src={product?.productImage?.[0] || '/placeholder.png'}
                alt={product?.productName}
                className="w-full max-w-[200px] sm:max-w-xs mx-auto drop-shadow-2xl"
              />
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 sm:w-64 h-40 sm:h-64 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Clean Deal Card - No color change on hover
const DealCard = ({ product, index, viewMode, onAddToCart }) => {
  const [isLiked, setIsLiked] = useState(false);
  
  const discount = Math.round(((product?.price - product?.selling) / product?.price) * 100) || 0;
  
  // Softer, dimmed colors
  const colors = [
    { primary: 'from-rose-400 to-pink-500', bg: 'bg-rose-50', badge: 'bg-rose-500' },
    { primary: 'from-orange-400 to-red-400', bg: 'bg-orange-50', badge: 'bg-orange-500' },
    { primary: 'from-amber-400 to-orange-400', bg: 'bg-amber-50', badge: 'bg-amber-500' },
    { primary: 'from-red-400 to-rose-500', bg: 'bg-red-50', badge: 'bg-red-500' },
  ];
  const color = colors[index % colors.length];

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 p-3 sm:p-4 hover:shadow-lg transition-shadow"
      >
        <div className="flex gap-3 sm:gap-4">
          <div className={`w-24 sm:w-32 h-24 sm:h-32 ${color.bg} rounded-lg sm:rounded-xl flex-shrink-0 overflow-hidden relative`}>
            <img 
              src={product?.productImage?.[0] || '/placeholder.png'} 
              alt={product?.productName} 
              className="w-full h-full object-contain p-2"
            />
            <div className={`absolute top-0 left-0 ${color.badge} text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-br-lg`}>
              -{discount}%
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                  <FaFire className="text-rose-500 text-xs" />
                  <span className="text-rose-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Hot Deal</span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate">
                  {product?.productName || 'Unnamed Product'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 line-clamp-1 sm:line-clamp-2">{product?.description || 'No description'}</p>
              </div>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${isLiked ? 'text-rose-500' : 'text-slate-300 hover:text-rose-500'}`}
              >
                <FaHeart size={16} />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-4">
              <span className={`text-lg sm:text-2xl font-bold bg-gradient-to-r ${color.primary} bg-clip-text text-transparent`}>
                {displayKESCurrency(product?.selling || 0)}
              </span>
              <span className="text-xs sm:text-sm text-slate-400 line-through">
                {displayKESCurrency(product?.price || 0)}
              </span>
              <span className={`text-[10px] sm:text-xs font-bold ${color.badge} text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded hidden sm:inline-block`}>
                SAVE {displayKESCurrency((product?.price || 0) - (product?.selling || 0))}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => onAddToCart(e, product?._id)}
              className={`mt-2 sm:mt-3 w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r ${color.primary} text-white rounded-lg sm:rounded-xl font-bold shadow-md hover:shadow-lg transition-shadow text-sm sm:text-base flex items-center justify-center gap-2`}
            >
              <FaShoppingCart size={14} />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 overflow-hidden shadow-md hover:shadow-xl transition-shadow">
        {/* Badge */}
        <div className={`absolute top-0 left-0 z-10 ${color.badge} text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-br-lg sm:rounded-br-xl flex items-center gap-1`}>
          <FaFire size={10} />
          -{discount}%
        </div>

        {/* Image - Clean hover, no color change */}
        <div className={`relative h-40 sm:h-48 ${color.bg} overflow-hidden`}>
          <img
            src={product?.productImage?.[0] || '/placeholder.png'}
            alt={product?.productName}
            className="w-full h-full object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Savings Badge */}
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 z-10">
            <span className="bg-slate-800 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md">
              Save {displayKESCurrency((product?.price || 0) - (product?.selling || 0))}
            </span>
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-2 rounded-full shadow-md transition-all z-10 ${
              isLiked ? 'bg-rose-500 text-white' : 'bg-white text-slate-400 hover:text-rose-500'
            }`}
          >
            <FaHeart size={12} />
          </button>

          {/* Quick View - Subtle overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Link to={`/product/${product._id}`}>
              <button className="p-2 sm:p-3 bg-white rounded-full text-slate-700 shadow-lg hover:scale-110 transition-transform">
                <FaEye size={16} />
              </button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <FaFire className="text-rose-500 text-[10px]" />
            <span className="text-rose-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Limited Time</span>
          </div>
          
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-1">
            {product?.productName || 'Unnamed Product'}
          </h3>
          
          <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-amber-400 text-[8px] sm:text-[10px]" />
            ))}
            <span className="text-[8px] sm:text-[10px] text-slate-500 ml-0.5 sm:ml-1">(4.9)</span>
          </div>

          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className={`text-base sm:text-xl font-bold bg-gradient-to-r ${color.primary} bg-clip-text text-transparent`}>
              {displayKESCurrency(product?.selling || 0)}
            </span>
            <span className="text-xs sm:text-sm text-slate-400 line-through">
              {displayKESCurrency(product?.price || 0)}
            </span>
          </div>

          <button
            onClick={(e) => onAddToCart(e, product?._id)}
            className={`w-full py-2 sm:py-2.5 bg-gradient-to-r ${color.primary} text-white font-bold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2`}
          >
            <FaShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Stats Bar - Responsive
const StatsBar = ({ totalDeals, avgDiscount }) => (
  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
    {[
      { icon: FaFire, value: `${totalDeals}+`, label: 'Hot Deals', gradient: 'from-rose-400 to-pink-500' },
      { icon: FaPercentage, value: `Up to ${avgDiscount}%`, label: 'Off', gradient: 'from-orange-400 to-red-400' },
      { icon: FaClock, value: '24H', label: 'Limited', gradient: 'from-amber-400 to-orange-400' },
    ].map((stat, idx) => (
      <div key={idx} className={`bg-gradient-to-r ${stat.gradient} rounded-xl sm:rounded-2xl p-2 sm:p-4 text-white text-center`}>
        <stat.icon className="mx-auto text-lg sm:text-2xl mb-1 sm:mb-2" />
        <p className="text-sm sm:text-2xl font-bold truncate">{stat.value}</p>
        <p className="text-[8px] sm:text-xs uppercase tracking-wider opacity-80">{stat.label}</p>
      </div>
    ))}
  </div>
);

const HotDealsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('discount');
  const [filterDiscount, setFilterDiscount] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { fetchCountCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    if (!id) return;
    await addToCart(e, id);
    fetchCountCart();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categories = ['airpodes', 'camera', 'earphones', 'mobiles', 'mouse', 'printers', 'processor', 'refrigerator', 'speakers', 'trimmers', 'televisions', 'watches'];
      const promises = categories.map(cat => fetchCategoryWiseProducts(cat));
      
      const results = await Promise.all(promises);
      
      let allProducts = [];
      results.forEach(res => {
        if (res?.data && Array.isArray(res.data)) {
          allProducts = [...allProducts, ...res.data];
        }
      });
      
      const deals = allProducts.filter(p => {
        const discount = ((p.price - p.selling) / p.price) * 100;
        return discount > 10;
      }).sort((a, b) => {
        const discountA = ((a.price - a.selling) / a.price) * 100;
        const discountB = ((b.price - b.selling) / b.price) * 100;
        return discountB - discountA;
      });
      
      const seen = new Set();
      const uniqueDeals = deals.filter(p => {
        const duplicate = seen.has(p._id);
        seen.add(p._id);
        return !duplicate;
      });
      
      setData(uniqueDeals);
    } catch (error) {
      console.error('Error fetching:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data
    .filter(item => {
      if (!item) return false;
      const discount = ((item.price - item.selling) / item.price) * 100;
      
      if (filterDiscount === 'all') return true;
      if (filterDiscount === 'mega') return discount >= 50;
      if (filterDiscount === 'big') return discount >= 30 && discount < 50;
      if (filterDiscount === 'medium') return discount >= 20 && discount < 30;
      if (filterDiscount === 'small') return discount >= 10 && discount < 20;
      
      return (item.productName || '').toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'discount') {
        const discountA = ((a.price - a.selling) / a.price) * 100;
        const discountB = ((b.price - b.selling) / b.price) * 100;
        return discountB - discountA;
      }
      if (sortBy === 'price-low') return (a.selling || 0) - (b.selling || 0);
      if (sortBy === 'price-high') return (b.selling || 0) - (a.selling || 0);
      return 0;
    });

  const heroDeal = filteredData[0];
  const otherDeals = filteredData.slice(1);
  
  const avgDiscount = data.length > 0 
    ? Math.round(data.reduce((acc, p) => acc + ((p.price - p.selling) / p.price) * 100, 0) / data.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50">
      <SEO 
        title="Hot Deals | Best Discounts Online"
        description="Discover the latest hot deals and discounts on electronics and more."
        url="/hot-deals"
      />
            {/* Subtle Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-rose-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-64 sm:w-[500px] h-64 sm:h-[500px] bg-orange-200/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
          <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <Link to="/" className="p-2 hover:bg-rose-100 rounded-full transition-colors">
                  <FaArrowLeft className="text-rose-500 text-lg" />
                </Link>
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <FaFire className="text-rose-500 text-xs sm:text-sm" />
                    <span className="text-rose-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      Limited Time
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                    Hot Deals
                    <span className="text-rose-500 ml-1">🔥</span>
                  </h1>
                </div>
              </div>

              <div className="relative w-full sm:max-w-xs lg:max-w-md">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 sm:py-3 bg-white border border-rose-200 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
          {/* Error */}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center text-sm">
              <p className="font-medium mb-2">Failed to load deals</p>
              <button onClick={fetchData} className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium">
                Try Again
              </button>
            </div>
          )}

          {/* Stats */}
          {!loading && data.length > 0 && (
            <StatsBar totalDeals={data.length} avgDiscount={avgDiscount} />
          )}

          {/* Hero Deal */}
          {!loading && heroDeal && (
            <div className="mb-6 sm:mb-10">
              <HeroDeal product={heroDeal} onAddToCart={handleAddToCart} />
            </div>
          )}

          {/* Filter Tabs - Scrollable on mobile */}
          <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { key: 'all', label: 'All Deals', color: 'from-slate-500 to-slate-600' },
              { key: 'mega', label: '🔥 50%+', color: 'from-rose-400 to-pink-500' },
              { key: 'big', label: '💰 30-50%', color: 'from-orange-400 to-red-400' },
              { key: 'medium', label: '⭐ 20-30%', color: 'from-amber-400 to-orange-400' },
              { key: 'small', label: '🏷️ 10-20%', color: 'from-emerald-400 to-teal-400' },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterDiscount(filter.key)}
                className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  filterDiscount === filter.key
                    ? `bg-gradient-to-r ${filter.color} text-white shadow-md`
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
            <p className="text-slate-500 text-xs sm:text-sm">
              Showing <span className="font-bold text-slate-800">{otherDeals.length}</span> deals
            </p>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-rose-400"
              >
                <option value="discount">Highest Discount</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-rose-100 text-rose-600' : 'text-slate-400'}`}
                >
                  <FaThLarge size={14} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 sm:p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-rose-100 text-rose-600' : 'text-slate-400'}`}
                >
                  <FaList size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Deals Grid */}
          {loading ? (
            <div className={`grid gap-3 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-56 sm:h-80 bg-white rounded-xl sm:rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="h-32 sm:h-48 bg-slate-100 animate-pulse" />
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="h-3 sm:h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 sm:h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-6 sm:h-8 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : otherDeals.length > 0 ? (
            <div className={`grid gap-3 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {otherDeals.map((product, index) => (
                <DealCard 
                  key={product?._id || index}
                  product={product}
                  index={index}
                  viewMode={viewMode}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-20">
              <FaRegSadTear className="mx-auto text-4xl sm:text-6xl text-slate-300 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-2xl font-bold text-slate-800 mb-2">No deals found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotDealsPage;