import React, { useState, useEffect, useContext } from 'react';
import { 
  FaHeart, 
  FaShoppingCart, 
  FaTrash, 
  FaStar, 
  FaFilter, 
  FaSearch, 
  FaTimes, 
  FaChevronDown, 
  FaShareAlt, 
  FaBell, 
  FaSpinner, 
  FaExclamationCircle,
  FaFire,
  FaBolt,
  FaEye,
  FaCheck,
  FaExclamationTriangle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Context } from '@/context/ProductContext.jsx';
import { Link } from 'react-router-dom';
import displayKESCurrency from "@/helpers/displayCurrency.js";
import SEO from "@/components/Seo.jsx";

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, itemCount, type = 'danger' }) => {
  if (!isOpen) return null;

  const colors = {
    danger: 'from-red-500 to-rose-600',
    warning: 'from-amber-500 to-orange-600',
    info: 'from-blue-500 to-cyan-600'
  };

  return (
    
    <AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${colors[type]} p-6 text-white`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-white/80 text-sm">This action cannot be undone</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-slate-600 mb-6 leading-relaxed">{message}</p>
            
            {itemCount > 0 && (
              <div className="bg-slate-50 rounded-xl p-4 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  <FaHeart className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{itemCount} items</p>
                  <p className="text-sm text-slate-500">Will be removed from your wishlist</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-4 py-3 bg-gradient-to-r ${colors[type]} text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all`}
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Empty State Component
const EmptyState = ({ onExplore }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-16 px-4"
  >
    <div className="relative inline-block mb-8">
      <div className="w-32 h-32 bg-gradient-to-br from-violet-100 to-pink-100 rounded-full flex items-center justify-center">
        <FaHeart className="w-16 h-16 text-violet-300" />
      </div>
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center"
      >
        <span className="text-white text-lg">+</span>
      </motion.div>
    </div>
    
    <h3 className="text-3xl font-black text-slate-800 mb-3">Your wishlist is empty</h3>
    <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
      Discover amazing products and save your favorites here for later
    </p>
    
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onExplore}
      className="px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
    >
      <FaShoppingCart className="w-5 h-5" />
      Explore Products
    </motion.button>
  </motion.div>
);

// Bulk Actions Bar
const BulkActionsBar = ({ selectedCount, totalCount, onSelectAll, onClearSelection, onDeleteSelected, onClearAll }) => {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-white rounded-2xl shadow-2xl border border-violet-100 p-2 flex items-center gap-2 max-w-2xl w-[90%] mx-auto"
    >
      <div className="flex items-center gap-3 px-4 py-2 bg-violet-50 rounded-xl">
        <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          {selectedCount}
        </div>
        <span className="font-bold text-slate-700">items selected</span>
      </div>

      <div className="h-8 w-px bg-slate-200 mx-2" />

      <button
        onClick={onSelectAll}
        className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors flex items-center gap-2"
      >
        <FaCheck className="w-4 h-4" />
        {selectedCount === totalCount ? 'Deselect All' : 'Select All'}
      </button>

      <button
        onClick={onClearSelection}
        className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors"
      >
        Cancel
      </button>

      <div className="flex-1" />

      <button
        onClick={onDeleteSelected}
        className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:shadow-xl transition-all flex items-center gap-2"
      >
        <FaTrash className="w-4 h-4" />
        Delete
      </button>

      <button
        onClick={onClearAll}
        className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors flex items-center gap-2"
      >
        <FaTrash className="w-4 h-4" />
        Clear All
      </button>
    </motion.div>
  );
};

const WishlistPage = () => {
  const { 
    wishlistItems: contextWishlistItems, 
    wishlistCount,
    GetWishlist, 
    RemoveWishlist, 
    ClearWishlist,
    fetchCountCart,
    cartProductCount,
    backendUrl,
    navigate,
    loading: contextLoading 
  } = useContext(Context);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [showClearModal, setShowClearModal] = useState(false);

  // Transform context data
  useEffect(() => {
    if (contextWishlistItems && contextWishlistItems.length > 0) {
      const transformed = contextWishlistItems.map((item, index) => ({
        id: item.id || item._id || item.productId?._id,
        name: item.name || item.productName || item.productId?.productName,
        brand: item.brand || item.productId?.brand,
        price: item.price || item.selling || item.productId?.selling || 0,
        originalPrice: item.originalPrice || item.price || item.productId?.price || 0,
        rating: item.rating || item.productId?.rating || 4.5,
        reviews: item.reviews || item.productId?.reviews || 0,
        image: item.image || item.productImage?.[0] || item.productId?.productImage?.[0],
        category: item.category || item.productId?.category,
        inStock: item.inStock !== false && item.productId?.inStock !== false,
        addedDate: item.addedDate || item.addedAt || new Date().toISOString(),
        discount: item.discount || Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) || 0,
        isNew: item.isNew || false,
        wishlistId: item.wishlistId || item._id,
        colorIndex: index % 6,
        rawData: item
      }));
      setWishlistItems(transformed);
    } else {
      setWishlistItems([]);
    }
  }, [contextWishlistItems]);

  useEffect(() => {
    setCartCount(cartProductCount || 0);
  }, [cartProductCount]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      await GetWishlist();
    } catch (err) {
      setError(err.message || 'Failed to load wishlist');
      showToast('Failed to load wishlist', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setNotificationMessage({ text: message, type });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const removeFromWishlist = async (productId) => {
    try {
      await RemoveWishlist(productId);
      setSelectedItems(prev => prev.filter(id => id !== productId));
      showToast('Removed from wishlist');
    } catch (err) {
      showToast(err.message || 'Failed to remove', 'error');
    }
  };

  const handleClearAll = () => {
    setShowClearModal(true);
  };

  const confirmClearAll = async () => {
    try {
      await ClearWishlist();
      setSelectedItems([]);
      setShowClearModal(false);
      showToast('Wishlist cleared successfully');
    } catch (err) {
      showToast(err.message || 'Failed to clear', 'error');
    }
  };

  const moveToCart = async (item) => {
    if (!item.inStock) {
      showToast('Item is out of stock', 'error');
      return;
    }
    
    try {
      const res = await fetch(`${backendUrl}/cart/add`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.id })
      });
      
      if (res.ok) {
        await fetchCountCart();
        setCartCount(prev => prev + 1);
        showToast(`${item.name} added to cart!`);
      }
    } catch (err) {
      showToast('Failed to add to cart', 'error');
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const deleteSelected = async () => {
    try {
      await Promise.all(selectedItems.map(id => RemoveWishlist(id)));
      showToast(`${selectedItems.length} items removed`);
      setSelectedItems([]);
    } catch (err) {
      showToast('Failed to remove some items', 'error');
    }
  };

  // Color palette
  const colors = [
    { primary: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', light: 'bg-violet-100' },
    { primary: 'from-pink-500 to-rose-600', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', light: 'bg-rose-100' },
    { primary: 'from-orange-400 to-red-500', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', light: 'bg-orange-100' },
    { primary: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', light: 'bg-cyan-100' },
    { primary: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', light: 'bg-emerald-100' },
    { primary: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', light: 'bg-amber-100' },
  ];

  const categories = ['All', ...new Set(wishlistItems.map(item => item.category).filter(Boolean))];
  
  const filteredItems = wishlistItems
    .filter(item => filterCategory === 'All' || item.category === filterCategory)
    .filter(item => item.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch(sortBy) {
        case 'priceLow': return (a.price || 0) - (b.price || 0);
        case 'priceHigh': return (b.price || 0) - (a.price || 0);
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'dateAdded': return new Date(b.addedDate || 0) - new Date(a.addedDate || 0);
        default: return 0;
      }
    });

  const totalValue = wishlistItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const totalSavings = wishlistItems.reduce((sum, item) => sum + ((item.originalPrice || 0) - (item.price || 0)), 0);

  if (loading || contextLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-pink-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/30 rounded-full blur-[100px]" />
        </div>
        <div className="flex flex-col items-center gap-4 relative z-10">
          <FaSpinner className="w-12 h-12 text-violet-600 animate-spin" />
          <p className="text-slate-600 font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <SEO 
        title="Wishlist | Your Saved Items"
        description="View and manage your favorite products in your wishlist."
        url="/wishlist"
      />
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-pink-50 font-sans text-slate-800 relative overflow-hidden pb-24">
      
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/30 rounded-full blur-[100px]" />
      </div>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${notificationMessage.type === 'error' ? 'bg-red-600' : 'bg-slate-900'} text-white`}
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${notificationMessage.type === 'error' ? 'bg-red-300' : 'bg-green-400'}`} />
            <span className="font-medium">{notificationMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear All Modal */}
      <ConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={confirmClearAll}
        title="Clear Entire Wishlist?"
        message="Are you sure you want to remove all items from your wishlist? This action is permanent and cannot be undone."
        itemCount={wishlistItems.length}
        type="danger"
      />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaHeart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900">
                  My Wishlist
                  <span className="text-pink-500">.</span>
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  {wishlistCount || wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-3 bg-white rounded-xl shadow-md text-slate-600 hover:text-violet-600 transition-colors relative">
                <FaBell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full" />
              </button>
              <button className="p-3 bg-white rounded-xl shadow-md text-slate-600 hover:text-violet-600 transition-colors">
                <FaShareAlt className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/cart')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                <FaShoppingCart className="w-4 h-4" />
                {cartCount}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-8 z-10">
        {/* Section Header */}
        <div className="mb-8 flex items-center gap-3">
          <span className="w-8 h-1 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
          <span className="text-violet-600 text-xs font-black uppercase tracking-widest">Your Collection</span>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
            <FaExclamationCircle className="w-5 h-5" />
            <span>{error}</span>
            <button onClick={loadWishlist} className="ml-auto text-sm font-bold px-3 py-1 bg-red-100 rounded-lg hover:bg-red-200">
              Retry
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-violet-100 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                <FaHeart className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{wishlistItems.length}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Saved Items</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <FaShoppingCart className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{displayKESCurrency(totalValue)}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Value</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <FaStar className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-600">-{displayKESCurrency(totalSavings)}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">You Save</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-4 mb-6 border border-slate-100 shadow-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl w-56 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 text-sm"
              />
            </div>

            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400 text-sm font-medium appearance-none"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <FaChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400 text-sm font-medium appearance-none"
              >
                <option value="dateAdded">Newest First</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <FaChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {wishlistItems.length > 0 && !selectedItems.length && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
              >
                <FaTrash className="w-4 h-4" />
                Clear All
              </button>
            )}
            
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setIsGridView(true)}
                className={`p-2 rounded-md transition-all ${isGridView ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
              >
                <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                  <div className="bg-current rounded-sm" />
                  <div className="bg-current rounded-sm" />
                  <div className="bg-current rounded-sm" />
                  <div className="bg-current rounded-sm" />
                </div>
              </button>
              <button
                onClick={() => setIsGridView(false)}
                className={`p-2 rounded-md transition-all ${!isGridView ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
              >
                <div className="flex flex-col gap-0.5 w-3.5 h-3.5 justify-center">
                  <div className="h-0.5 bg-current rounded-full" />
                  <div className="h-0.5 bg-current rounded-full" />
                  <div className="h-0.5 bg-current rounded-full" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Items Grid - NORMAL CARDS (no zoom) */}
        {filteredItems.length === 0 ? (
          <EmptyState onExplore={() => navigate('/products')} />
        ) : (
          <div className={`grid gap-4 ${isGridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {filteredItems.map((item, index) => {
              const color = colors[item.colorIndex || 0];
              const isSelected = selectedItems.includes(item.id);
              
              return (
                <div
                  key={item.id}
                  className={`group bg-white rounded-2xl border-2 ${isSelected ? color.border : 'border-slate-100'} shadow-sm hover:shadow-md transition-all overflow-hidden relative`}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color.primary}`} />
                  )}

                  {/* Image */}
                  <div className={`relative h-48 ${color.bg} overflow-hidden`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-4"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {item.discount > 0 && (
                        <span className={`${color.light} ${color.text} text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1`}>
                          <FaFire size={8} />
                          -{item.discount}%
                        </span>
                      )}
                      {item.isNew && (
                        <span className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                          <FaBolt size={8} />
                          NEW
                        </span>
                      )}
                      {!item.inStock && (
                        <span className="bg-slate-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>

                    {/* Selection Checkbox */}
                    <button
                      onClick={() => toggleSelectItem(item.id)}
                      className={`absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center transition-all border-2 ${isSelected ? `bg-gradient-to-r ${color.primary} border-transparent text-white` : 'bg-white/90 border-slate-200 text-slate-400 hover:border-violet-400'}`}
                    >
                      {isSelected ? <FaCheck className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5" />}
                    </button>

                    {/* Hover Actions */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2">
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-2 bg-white rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Remove"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveToCart(item)}
                        disabled={!item.inStock}
                        className={`p-2 rounded-lg transition-colors ${item.inStock ? 'bg-white text-slate-900 hover:bg-violet-50' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                        title={item.inStock ? 'Add to Cart' : 'Out of Stock'}
                      >
                        <FaShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${color.text} bg-opacity-20 ${color.bg} px-2 py-0.5 rounded`}>
                        {item.category}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <FaStar className="text-amber-400 text-[10px]" />
                        <span className="text-[10px] text-slate-500 font-bold">{item.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-800 text-sm mb-3 line-clamp-2 leading-snug min-h-[2.5rem]">
                      {item.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-black text-slate-900">
                          {displayKESCurrency(item.price)}
                        </p>
                        {item.originalPrice > item.price && (
                          <p className="text-xs text-slate-400 line-through">
                            {displayKESCurrency(item.originalPrice)}
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => moveToCart(item)}
                        disabled={!item.inStock}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${item.inStock ? `bg-gradient-to-r ${color.primary} text-white shadow-md hover:shadow-lg` : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                      >
                        {item.inStock ? 'Add to Cart' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Bulk Actions */}
      <BulkActionsBar
        selectedCount={selectedItems.length}
        totalCount={filteredItems.length}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
        onDeleteSelected={deleteSelected}
        onClearAll={handleClearAll}
      />
    </div>
    </>
  );
};

export default WishlistPage;