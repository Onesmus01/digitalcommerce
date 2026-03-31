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
  FaCheck,
  FaExclamationTriangle,
  FaArrowLeft
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Context } from '@/context/ProductContext.jsx';
import { Link } from 'react-router-dom';
import displayKESCurrency from "@/helpers/displayCurrency.js";
import SEO from "@/components/Seo.jsx";

// Compact Confirmation Modal
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, itemCount, type = 'danger' }) => {
  if (!isOpen) return null;

  const colors = {
    danger: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
        >
          <div className={`${colors[type]} p-4 text-white`}>
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="w-5 h-5" />
              <h3 className="text-lg font-bold">{title}</h3>
            </div>
          </div>

          <div className="p-4">
            <p className="text-slate-600 text-sm mb-4">{message}</p>
            
            {itemCount > 0 && (
              <div className="bg-slate-50 rounded-lg p-3 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                  <FaHeart className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{itemCount} items</p>
                  <p className="text-xs text-slate-500">Will be removed</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 px-3 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-3 py-2.5 ${colors[type]} text-white rounded-xl font-semibold text-sm`}
              >
                Confirm
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Compact Empty State
const EmptyState = ({ onExplore }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-10 px-4"
  >
    <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <FaHeart className="w-10 h-10 text-violet-300" />
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-2">Wishlist is empty</h3>
    <p className="text-slate-500 text-sm mb-4">Save your favorite products</p>
    <button 
      onClick={onExplore}
      className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm"
    >
      Explore
    </button>
  </motion.div>
);

// Compact Bulk Actions Bar
const BulkActionsBar = ({ selectedCount, totalCount, onSelectAll, onClearSelection, onDeleteSelected, onClearAll }) => {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-4 left-4 right-4 z-40 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 flex items-center gap-2"
    >
      <div className="flex items-center gap-2 px-2 py-1 bg-violet-50 rounded-lg">
        <span className="text-xs font-bold text-violet-700">{selectedCount}</span>
        <span className="text-xs text-slate-600">selected</span>
      </div>

      <div className="flex-1" />

      <button onClick={onClearSelection} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
        <FaTimes size={14} />
      </button>

      <button onClick={onDeleteSelected} className="p-2 bg-rose-500 text-white rounded-lg">
        <FaTrash size={14} />
      </button>

      <button onClick={onClearAll} className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg">
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
  const [showClearModal, setShowClearModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Transform data
  useEffect(() => {
    if (contextWishlistItems?.length > 0) {
      const transformed = contextWishlistItems.map((item, index) => ({
        id: item.id || item._id || item.productId?._id,
        name: item.name || item.productName || item.productId?.productName,
        brand: item.brand || item.productId?.brand,
        price: item.price || item.selling || item.productId?.selling || 0,
        originalPrice: item.originalPrice || item.price || item.productId?.price || 0,
        rating: item.rating || item.productId?.rating || 4.5,
        image: item.image || item.productImage?.[0] || item.productId?.productImage?.[0],
        category: item.category || item.productId?.category || 'Other',
        inStock: item.inStock !== false && item.productId?.inStock !== false,
        discount: item.discount || Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) || 0,
        colorIndex: index % 6,
        rawData: item
      }));
      setWishlistItems(transformed);
    } else {
      setWishlistItems([]);
    }
  }, [contextWishlistItems]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      await GetWishlist();
    } catch (err) {
      setError(err.message);
      showToast('Failed to load', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setNotificationMessage({ text: message, type });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const removeFromWishlist = async (productId) => {
    try {
      await RemoveWishlist(productId);
      setSelectedItems(prev => prev.filter(id => id !== productId));
      showToast('Removed');
    } catch (err) {
      showToast('Failed to remove', 'error');
    }
  };

  const handleClearAll = () => setShowClearModal(true);

  const confirmClearAll = async () => {
    try {
      await ClearWishlist();
      setSelectedItems([]);
      setShowClearModal(false);
      showToast('Cleared');
    } catch (err) {
      showToast('Failed', 'error');
    }
  };

  const moveToCart = async (item) => {
    if (!item.inStock) {
      showToast('Out of stock', 'error');
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
        showToast('Added to cart');
      }
    } catch (err) {
      showToast('Failed', 'error');
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

  const clearSelection = () => setSelectedItems([]);

  const deleteSelected = async () => {
    try {
      await Promise.all(selectedItems.map(id => RemoveWishlist(id)));
      showToast(`${selectedItems.length} removed`);
      setSelectedItems([]);
    } catch (err) {
      showToast('Failed', 'error');
    }
  };

  const categories = ['All', ...new Set(wishlistItems.map(item => item.category).filter(Boolean))];
  
  const filteredItems = wishlistItems
    .filter(item => filterCategory === 'All' || item.category === filterCategory)
    .filter(item => item.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch(sortBy) {
        case 'priceLow': return (a.price || 0) - (b.price || 0);
        case 'priceHigh': return (b.price || 0) - (a.price || 0);
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        default: return 0;
      }
    });

  const totalValue = wishlistItems.reduce((sum, item) => sum + (item.price || 0), 0);

  if (loading || contextLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <FaSpinner className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Wishlist" description="Your saved items" url="/wishlist" />
      <div className="min-h-screen bg-slate-50 pb-20">
        
        {/* 🔥 FIXED HEADER - Now uses same container as content below */}
        <div className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                  <FaArrowLeft size={16} className="text-slate-600" />
                </button>
                <div>
                  <h1 className="font-bold text-slate-800 text-sm sm:text-base">Wishlist</h1>
                  <p className="text-[10px] sm:text-xs text-slate-500">{wishlistItems.length} items</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button 
                  onClick={() => navigate('/cart')}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-lg"
                >
                  <FaShoppingCart size={12} className="sm:w-4 sm:h-4" />
                  {cartProductCount || 0}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-16 left-4 right-4 z-50 px-3 py-2 rounded-lg text-white text-sm font-medium text-center ${notificationMessage.type === 'error' ? 'bg-rose-500' : 'bg-slate-900'}`}
            >
              {notificationMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clear Modal */}
        <ConfirmationModal
          isOpen={showClearModal}
          onClose={() => setShowClearModal(false)}
          onConfirm={confirmClearAll}
          title="Clear Wishlist?"
          message="Remove all items?"
          itemCount={wishlistItems.length}
          type="danger"
        />

        {/* 🔥 CONTAINER WRAPPER - Same as MyOrdersPage: max-w-7xl mx-auto px-3 sm:px-6 */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
          
          {/* Compact Stats */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-white rounded-xl p-2.5 border border-slate-100">
              <p className="text-lg font-bold text-slate-900">{wishlistItems.length}</p>
              <p className="text-[10px] text-slate-500">Items</p>
            </div>
            <div className="bg-white rounded-xl p-2.5 border border-slate-100">
              <p className="text-lg font-bold text-indigo-600">{displayKESCurrency(totalValue)}</p>
              <p className="text-[10px] text-slate-500">Total</p>
            </div>
          </div>

          {/* Compact Controls */}
          <div className="flex gap-2 mb-2">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
            >
              <FaFilter size={10} />
              Filter
            </button>
          </div>

          {/* 🔥 Same grid as ColumnProducts - 3 columns with responsive gaps, now inside container */}
          {filteredItems.length === 0 ? (
            <EmptyState onExplore={() => navigate('/products')} />
          ) : (
            <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-4">
              {filteredItems.map((item, index) => {
                const isSelected = selectedItems.includes(item.id);
                
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className={`group bg-white rounded-lg sm:rounded-xl border ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-100'} overflow-hidden shadow-sm hover:shadow-md sm:hover:shadow-lg transition-all duration-300`}
                  >
                    {/* Image - Same as ColumnProducts: aspect-square with p-1 sm:p-3 md:p-4 */}
                    <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                      <motion.img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-1 sm:p-3 md:p-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        loading="lazy"
                      />
                      
                      {/* Discount Badge - Same as ColumnProducts */}
                      {item.discount > 0 && (
                        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-20">
                          <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-[7px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                            <span className="hidden xs:inline">{item.discount}%</span>
                            <span className="xs:hidden">{item.discount}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Out of Stock Overlay */}
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-white text-[8px] sm:text-xs font-bold bg-black/60 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">Out of Stock</span>
                        </div>
                      )}

                      {/* Selection checkbox - Hidden on mobile, visible on sm+ */}
                      <button
                        onClick={() => toggleSelectItem(item.id)}
                        className={`absolute top-1 right-1 sm:top-2 sm:right-2 z-20 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-white/80 text-slate-400 hover:bg-rose-50 hover:text-rose-500 border border-slate-200'
                        } hidden sm:flex`}
                      >
                        {isSelected && <FaCheck size={10} className="sm:w-3 sm:h-3" />}
                      </button>

                      {/* Quick Actions - Same hover behavior as ColumnProducts */}
                      <div className="absolute bottom-1 left-1 right-1 sm:bottom-2 sm:left-2 sm:right-2 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFromWishlist(item.id);
                          }}
                          className="flex-1 py-1 sm:py-2 bg-rose-500 text-white rounded-md sm:rounded-xl text-[8px] sm:text-xs font-medium flex items-center justify-center gap-0.5 sm:gap-1"
                        >
                          <FaTrash size={8} className="sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            moveToCart(item);
                          }}
                          disabled={!item.inStock}
                          className={`flex-1 py-1 sm:py-2 rounded-md sm:rounded-xl text-[8px] sm:text-xs font-medium flex items-center justify-center gap-0.5 sm:gap-1 ${
                            item.inStock ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-300 text-slate-500'
                          }`}
                        >
                          <FaShoppingCart size={8} className="sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">Add</span>
                        </button>
                      </div>
                    </div>

                    {/* Content - Same text sizes as ColumnProducts */}
                    <div className="p-1.5 sm:p-3">
                      {/* Category - Same pill style */}
                      <span className="text-[6px] sm:text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1 sm:px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {item.category}
                      </span>
                      
                      {/* Product Name - Same: text-[9px] sm:text-sm */}
                      <h3 className="font-semibold text-slate-800 text-[9px] sm:text-sm mt-1 sm:mt-1.5 mb-0.5 sm:mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors leading-tight">
                        {item.name}
                      </h3>
                      
                      {/* Rating - Same: text-[5px] sm:text-[9px] */}
                      <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-1.5">
                        <div className="flex">
                          {[...Array(4)].map((_, i) => (
                            <FaStar key={i} className="text-amber-400 text-[5px] sm:text-[9px]" />
                          ))}
                          <FaStar className="text-amber-200 text-[5px] sm:text-[9px]" />
                        </div>
                        <span className="text-[6px] sm:text-[10px] text-slate-500">({item.rating})</span>
                      </div>
                      
                      {/* Price Section - Same: text-[10px] sm:text-base */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-0.5 sm:gap-2">
                          <p className="text-[10px] sm:text-base font-bold text-slate-900">
                            {displayKESCurrency(item.price)}
                          </p>
                          {item.originalPrice > item.price && (
                            <p className="text-[7px] sm:text-xs text-slate-400 line-through">
                              {displayKESCurrency(item.originalPrice)}
                            </p>
                          )}
                        </div>
                        
                        {/* Mobile-only add button (since hover actions don't work well on touch) */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            moveToCart(item);
                          }}
                          disabled={!item.inStock}
                          className={`sm:hidden p-1 rounded ${item.inStock ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-500'}`}
                        >
                          <FaShoppingCart size={10} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Filter Bottom Sheet */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 overflow-hidden max-h-[70vh]"
              >
                <div className="flex justify-center pt-2 pb-1">
                  <div className="w-8 h-1 bg-slate-300 rounded-full" />
                </div>
                
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="p-1.5 hover:bg-slate-100 rounded-full">
                    <FaTimes size={16} className="text-slate-500" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto max-h-[50vh]">
                  {/* Sort */}
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Sort By</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { val: 'dateAdded', label: 'Newest' },
                        { val: 'priceLow', label: 'Price ↑' },
                        { val: 'priceHigh', label: 'Price ↓' },
                        { val: 'rating', label: 'Rating' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          onClick={() => setSortBy(opt.val)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${sortBy === opt.val ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFilterCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filterCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 border-t border-slate-100 bg-white">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl"
                  >
                    Show {filteredItems.length} Items
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bulk Actions */}
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
