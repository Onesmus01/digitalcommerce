
import React, { useState, useEffect, useContext } from "react";
import { 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaSearch,
  FaFire,
  FaPercentage,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaEye,
  FaCheck,
  FaExclamationTriangle,
  FaBolt,
  FaTag,
  FaCalendarAlt,
  FaClock
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '@/context/ProductContext.jsx';
import displayKESCurrency from "@/helpers/displayCurrency.js";

// ===================== API ENDPOINTS (Backend Integration) =====================
// POST   /api/hot-deals              - Add product to hot deals
// GET    /api/hot-deals              - Get all hot deals
// PUT    /api/hot-deals/:id          - Update hot deal
// DELETE /api/hot-deals/:id          - Remove from hot deals
// GET    /api/products/search        - Search products

const AdminHotDeals = () => {
  const { backendUrl, toast, getAuthHeaders } = useContext(Context);
  const navigate = useNavigate();
  
  // ===================== STATE =====================
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'add', 'expired'
  const [hotDeals, setHotDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Add Deal Form State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(20);
  const [dealDuration, setDealDuration] = useState(24); // hours
  const [dealType, setDealType] = useState('percentage'); // 'percentage', 'fixed'
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit Deal State
  const [editingDeal, setEditingDeal] = useState(null);
  
  // ===================== FETCH HOT DEALS =====================
  const fetchHotDeals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/hot-deals`, {
        credentials: 'include',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setHotDeals(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching hot deals:', error);
      toast?.error('Failed to fetch hot deals');
    } finally {
      setLoading(false);
    }
  };

  // ===================== SEARCH PRODUCTS =====================
  const searchProducts = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setIsSearching(true);
      const res = await fetch(`${backendUrl}/product/search?q=${encodeURIComponent(query)}`, {
        credentials: 'include',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        // Filter out products already in hot deals
        const existingIds = hotDeals.map(d => d.productId?._id || d.productId);
        const filtered = (data.data || []).filter(p => !existingIds.includes(p._id));
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Initial fetch
  useEffect(() => {
    fetchHotDeals();
  }, []);

  // ===================== ADD PRODUCT TO HOT DEALS =====================
  const handleAddToHotDeals = async () => {
    if (!selectedProduct) {
      toast?.error('Please select a product');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const dealData = {
        productId: selectedProduct._id,
        discountPercent: discountPercent,
        dealType: dealType,
        duration: dealDuration,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + dealDuration * 60 * 60 * 1000).toISOString(),
        isActive: true
      };

      const res = await fetch(`${backendUrl}/hot-deals`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(dealData)
      });

      const data = await res.json();
      
      if (data.success) {
        toast?.success(`${selectedProduct.productName} added to Hot Deals!`);
        // Reset form
        setSelectedProduct(null);
        setSearchQuery('');
        setSearchResults([]);
        setDiscountPercent(20);
        setActiveTab('active');
        fetchHotDeals();
      } else {
        toast?.error(data.message || 'Failed to add hot deal');
      }
    } catch (error) {
      console.error('Error adding hot deal:', error);
      toast?.error('Failed to add hot deal');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===================== UPDATE HOT DEAL =====================
  const handleUpdateDeal = async (dealId, updates) => {
    try {
      const res = await fetch(`${backendUrl}/hot-deals/${dealId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(updates)
      });

      const data = await res.json();
      if (data.success) {
        toast?.success('Hot deal updated successfully');
        setEditingDeal(null);
        fetchHotDeals();
      } else {
        toast?.error(data.message || 'Failed to update');
      }
    } catch (error) {
      console.error('Error updating hot deal:', error);
      toast?.error('Failed to update hot deal');
    }
  };

  // ===================== REMOVE FROM HOT DEALS =====================
  const handleRemoveDeal = async (dealId, productName) => {
    if (!window.confirm(`Remove "${productName}" from Hot Deals?`)) return;

    try {
      const res = await fetch(`${backendUrl}/hot-deals/${dealId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders()

      });

      const data = await res.json();
      if (data.success) {
        toast?.success('Removed from Hot Deals');
        fetchHotDeals();
      } else {
        toast?.error(data.message || 'Failed to remove');
      }
    } catch (error) {
      console.error('Error removing hot deal:', error);
      toast?.error('Failed to remove hot deal');
    }
  };

  // ===================== CALCULATE DISCOUNTED PRICE =====================
  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    return Math.round(originalPrice * (1 - discountPercent / 100));
  };

  // ===================== FORMAT TIME REMAINING =====================
  const getTimeRemaining = (endTime) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    return `${hours}h ${minutes}m`;
  };

  // ===================== RENDER =====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-violet-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link 
                to="/admin-panel" 
                className="p-2 hover:bg-violet-100 rounded-full transition-colors"
              >
                <FaArrowLeft className="text-violet-600 text-lg" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <FaFire className="text-rose-500" />
                  <span className="text-rose-500 text-xs font-bold uppercase tracking-wider">
                    Admin Panel
                  </span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                  Hot Deals Manager
                </h1>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-xl">
                <p className="text-xs opacity-80">Active Deals</p>
                <p className="text-xl font-bold">
                  {hotDeals.filter(d => d.isActive && new Date(d.endTime) > new Date()).length}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('add')}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <FaPlus /> Add Deal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'active', label: 'Active Deals', icon: FaFire, count: hotDeals.filter(d => d.isActive && new Date(d.endTime) > new Date()).length },
            { key: 'add', label: 'Add New Deal', icon: FaPlus },
            { key: 'expired', label: 'Expired Deals', icon: FaClock, count: hotDeals.filter(d => new Date(d.endTime) <= new Date()).length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-white/20' : 'bg-violet-100 text-violet-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ===================== ADD NEW DEAL TAB ===================== */}
        {activeTab === 'add' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {/* Left: Search & Select Product */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FaSearch className="text-violet-500" />
                1. Select Product
              </h2>

              {/* Search Input */}
              <div className="relative mb-4">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                />
                {isSearching && (
                  <FaSpinner className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-500 animate-spin" />
                )}
              </div>

              {/* Search Results */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {searchResults.length === 0 && searchQuery && !isSearching && (
                  <p className="text-center text-slate-400 py-8">No products found</p>
                )}
                
                {searchResults.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedProduct(product)}
                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                      selectedProduct?._id === product._id
                        ? 'bg-violet-50 border-2 border-violet-500'
                        : 'bg-slate-50 hover:bg-violet-50 border-2 border-transparent'
                    }`}
                  >
                    <img
                      src={product.productImage?.[0]}
                      alt={product.productName}
                      className="w-16 h-16 object-contain bg-white rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 truncate">
                        {product.productName}
                      </h4>
                      <p className="text-sm text-slate-500">{product.category}</p>
                      <p className="text-violet-600 font-bold">
                        {displayKESCurrency(product.price)}
                      </p>
                    </div>
                    {selectedProduct?._id === product._id && (
                      <FaCheck className="text-violet-500 text-xl" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Configure Deal */}
            <div className="space-y-6">
              {/* Deal Configuration */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FaTag className="text-violet-500" />
                  2. Configure Deal
                </h2>

                {/* Discount Type */}
                <div className="mb-4">
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Discount Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDealType('percentage')}
                      className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                        dealType === 'percentage'
                          ? 'bg-violet-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <FaPercentage className="inline mr-2" />
                      Percentage
                    </button>
                    <button
                      onClick={() => setDealType('fixed')}
                      className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                        dealType === 'fixed'
                          ? 'bg-violet-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Fixed Amount
                    </button>
                  </div>
                </div>

                {/* Discount Percentage */}
                <div className="mb-4">
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Discount Percentage
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="5"
                      max="90"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                    <span className="text-2xl font-bold text-violet-600 w-16 text-center">
                      {discountPercent}%
                    </span>
                  </div>
                </div>

                {/* Duration */}
                <div className="mb-4">
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Deal Duration
                  </label>
                  <select
                    value={dealDuration}
                    onChange={(e) => setDealDuration(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400"
                  >
                    <option value={6}>6 Hours (Flash Sale)</option>
                    <option value={12}>12 Hours</option>
                    <option value={24}>24 Hours (1 Day)</option>
                    <option value={48}>48 Hours (2 Days)</option>
                    <option value={72}>72 Hours (3 Days)</option>
                    <option value={168}>1 Week</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              {selectedProduct && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white"
                >
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-80">
                    Deal Preview
                  </h3>
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedProduct.productImage?.[0]}
                      alt={selectedProduct.productName}
                      className="w-20 h-20 object-contain bg-white/20 rounded-xl"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg line-clamp-1">
                        {selectedProduct.productName}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-2xl font-bold">
                          {displayKESCurrency(calculateDiscountedPrice(selectedProduct.price, discountPercent))}
                        </span>
                        <span className="text-white/60 line-through">
                          {displayKESCurrency(selectedProduct.price)}
                        </span>
                      </div>
                      <span className="inline-block mt-2 bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                        Save {discountPercent}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleAddToHotDeals}
                disabled={!selectedProduct || isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  selectedProduct && !isSubmitting
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Adding to Hot Deals...
                  </>
                ) : (
                  <>
                    <FaBolt />
                    Create Hot Deal
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* ===================== ACTIVE DEALS TAB ===================== */}
        {activeTab === 'active' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4"
          >
            {hotDeals.filter(d => d.isActive && new Date(d.endTime) > new Date()).length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                <FaFire className="mx-auto text-6xl text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Active Hot Deals</h3>
                <p className="text-slate-500 mb-4">Add products to Hot Deals to boost sales!</p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-semibold"
                >
                  Add Your First Deal
                </button>
              </div>
            ) : (
              hotDeals
                .filter(d => d.isActive && new Date(d.endTime) > new Date())
                .map((deal) => (
                  <motion.div
                    key={deal._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-100 p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                      {/* Product Image */}
                      <div className="relative">
                        <div className="w-full lg:w-32 h-48 lg:h-32 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl overflow-hidden">
                          <img
                            src={deal.productId?.productImage?.[0] || deal.productImage?.[0]}
                            alt={deal.productId?.productName || deal.productName}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                        <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{deal.discountPercent}%
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-2">
                          <h3 className="font-bold text-lg text-slate-800">
                            {deal.productId?.productName || deal.productName}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                              Active
                            </span>
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1">
                              <FaClock />
                              {getTimeRemaining(deal.endTime)}
                            </span>
                          </div>
                        </div>

                        <p className="text-slate-500 text-sm mb-3 line-clamp-2">
                          {deal.productId?.description || deal.description}
                        </p>

                        {/* Price Info */}
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-2xl font-bold text-rose-600">
                            {displayKESCurrency(calculateDiscountedPrice(
                              deal.productId?.price || deal.price,
                              deal.discountPercent
                            ))}
                          </span>
                          <span className="text-slate-400 line-through">
                            {displayKESCurrency(deal.productId?.price || deal.price)}
                          </span>
                          <span className="text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                            Save {displayKESCurrency(
                              (deal.productId?.price || deal.price) - 
                              calculateDiscountedPrice(deal.productId?.price || deal.price, deal.discountPercent)
                            )}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link
                            to={`/product/${deal.productId?._id || deal.productId}`}
                            className="flex-1 lg:flex-none px-4 py-2 bg-violet-50 text-violet-600 rounded-xl font-medium hover:bg-violet-100 transition-colors flex items-center justify-center gap-2"
                          >
                            <FaEye /> View Product
                          </Link>
                          <button
                            onClick={() => setEditingDeal(deal)}
                            className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl font-medium hover:bg-amber-100 transition-colors flex items-center gap-2"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleRemoveDeal(deal._id, deal.productId?.productName || deal.productName)}
                            className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-medium hover:bg-rose-100 transition-colors flex items-center gap-2"
                          >
                            <FaTrash /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
            )}
          </motion.div>
        )}

        {/* ===================== EXPIRED DEALS TAB ===================== */}
        {activeTab === 'expired' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4"
          >
            {hotDeals.filter(d => new Date(d.endTime) <= new Date()).length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                <FaCheck className="mx-auto text-6xl text-emerald-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Expired Deals</h3>
                <p className="text-slate-500">All your hot deals are still active!</p>
              </div>
            ) : (
              hotDeals
                .filter(d => new Date(d.endTime) <= new Date())
                .map((deal) => (
                  <motion.div
                    key={deal._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/50 rounded-2xl border border-slate-200 p-4 lg:p-6 opacity-75"
                  >
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                      <div className="w-full lg:w-32 h-48 lg:h-32 bg-slate-100 rounded-xl overflow-hidden grayscale">
                        <img
                          src={deal.productId?.productImage?.[0] || deal.productImage?.[0]}
                          alt={deal.productId?.productName || deal.productName}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg text-slate-600">
                            {deal.productId?.productName || deal.productName}
                          </h3>
                          <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-bold">
                            Expired
                          </span>
                        </div>

                        <p className="text-slate-400 text-sm mb-3">
                          Expired on: {new Date(deal.endTime).toLocaleDateString()}
                        </p>

                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-slate-600">
                            {displayKESCurrency(deal.productId?.price || deal.price)}
                          </span>
                          <span className="text-sm text-slate-400">
                            Was: -{deal.discountPercent}% off
                          </span>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => {
                              setSelectedProduct(deal.productId);
                              setDiscountPercent(deal.discountPercent);
                              setActiveTab('add');
                            }}
                            className="px-4 py-2 bg-violet-500 text-white rounded-xl font-medium hover:bg-violet-600 transition-colors flex items-center gap-2"
                          >
                            <FaBolt /> Reactivate
                          </button>
                          <button
                            onClick={() => handleRemoveDeal(deal._id, deal.productId?.productName || deal.productName)}
                            className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-300 transition-colors flex items-center gap-2"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
            )}
          </motion.div>
        )}
      </div>

      {/* ===================== EDIT DEAL MODAL ===================== */}
      <AnimatePresence>
        {editingDeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Edit Hot Deal</h3>
                <button
                  onClick={() => setEditingDeal(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mb-4">
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Discount Percentage
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="90"
                    value={editingDeal.discountPercent}
                    onChange={(e) => setEditingDeal({...editingDeal, discountPercent: Number(e.target.value)})}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                  <span className="text-2xl font-bold text-violet-600 w-16 text-center">
                    {editingDeal.discountPercent}%
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Extend Duration
                </label>
                <select
                  value={dealDuration}
                  onChange={(e) => setDealDuration(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400"
                >
                  <option value={6}>+6 Hours</option>
                  <option value={12}>+12 Hours</option>
                  <option value={24}>+24 Hours</option>
                  <option value={48}>+48 Hours</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingDeal(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateDeal(editingDeal._id, {
                    discountPercent: editingDeal.discountPercent,
                    duration: dealDuration
                  })}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <FaSave className="inline mr-2" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminHotDeals;