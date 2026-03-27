import React, { useContext, useEffect, useState } from "react";
import { Context } from "@/context/ProductContext.jsx";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Package,
  Heart,
  ChevronLeft,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();

  const { backendUrl, fetchUserAddToCart, getAuthHeaders } = useContext(Context);

  /* ================= FETCH CART ================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${backendUrl}/user/view-cart-product`,
        {
          method: "GET",
          credentials: "include",
          headers: getAuthHeaders()
        }
      );

      const responseData = await response.json();
      if (responseData.success) {
        setData(responseData.data || []);
      }
    } catch (error) {
      console.error("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= QTY ================= */
  const updateQty = async (_id, quantity) => {
    setIsUpdating(_id);
    try {
      const res = await fetch(
        `${backendUrl}/user/update-cart-product`,
        {
          method: "POST",
          credentials: "include",
          headers: getAuthHeaders(),
          body: JSON.stringify({ _id, quantity }),
        }
      );
      const result = await res.json();
      if (result.success) {
        // Update local state quietly without full reload
        setData(prev => prev.map(item => 
          item._id === _id ? { ...item, quantity } : item
        ));
      }
    } finally {
      setIsUpdating(null);
    }
  };

  const increaseQty = (_id, quantity) => {
    updateQty(_id, quantity + 1);
  };

  const decreaseQty = (_id, quantity) => {
    if (quantity < 2) return;
    updateQty(_id, quantity - 1);
  };

  /* ================= DELETE SINGLE PRODUCT - NO LOADING ================= */
  const deleteCartProduct = async (_id) => {
    if (!window.confirm("Remove this item from your cart?")) return;
    
    try {
      const res = await fetch(
        `${backendUrl}/user/delete-cart-product`,
        {
          method: "POST",
          credentials: "include",
          headers: getAuthHeaders(),
          body: JSON.stringify({ _id }),
        }
      );
      const result = await res.json();
      if (result.success) {
        // Remove from local state quietly - NO loading, NO fetchData()
        setData(prev => prev.filter(item => item._id !== _id));
        fetchUserAddToCart(); // Just update cart count
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  /* ================= CLEAR ALL - NEW API ================= */
  const clearAllCart = async () => {
  try {
    const res = await fetch(
      `${backendUrl}/user/clear-cart`, // ✅ backendUrl already has /api
      {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      }
    );
    const result = await res.json();
    if (result.success) {
      setData([]);
      fetchUserAddToCart();
      setShowClearConfirm(false);
    }
  } catch (error) {
    console.error("Clear all error:", error);
  }
};

  /* ================= TOTALS ================= */
  const totalQty = data.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = data.reduce(
    (sum, i) => sum + i.quantity * (i?.productId?.selling || 0),
    0
  );
  const originalTotal = data.reduce(
    (sum, i) => sum + i.quantity * (i?.productId?.price || 0),
    0
  );
  const savings = originalTotal - totalPrice;

  /* ================= SKELETON LOADER ================= */
  const CartSkeleton = () => (
    <div className="space-y-2 sm:space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 animate-pulse">
          <div className="flex gap-3 sm:gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg sm:rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2 sm:space-y-3 py-1 sm:py-2">
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-24 sm:w-32 mt-2 sm:mt-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  /* ================= EMPTY STATE ================= */
  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
      <div className="w-20 h-20 sm:w-32 sm:h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
        <ShoppingBag className="w-10 h-10 sm:w-16 sm:h-16 text-indigo-300" />
      </div>
      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Your cart is empty</h2>
      <p className="text-gray-500 text-center max-w-sm mb-4 sm:mb-8 text-xs sm:text-base">
        Looks like you haven't added anything to your cart yet. Explore our products and find something you love!
      </p>
      <Link 
        to="/"
        className="bg-indigo-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 flex items-center gap-2"
      >
        <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
        Continue Shopping
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/" className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  Shopping Cart
                  {!loading && data.length > 0 && (
                    <span className="text-xs sm:text-sm font-medium text-gray-500 bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                      {totalQty} {totalQty === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </h1>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Free Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {!loading && data.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 lg:gap-12">
            {/* ================= CART ITEMS ================= */}
            <div className="flex-1 max-w-4xl">
              {/* Clear All Button - Top */}
              {!loading && data.length > 0 && (
                <div className="flex justify-end mb-2 sm:mb-4">
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-medium text-xs sm:text-sm transition-colors"
                  >
                    <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    Clear All
                  </button>
                </div>
              )}

              {loading ? (
                <CartSkeleton />
              ) : (
                <div className="space-y-2 sm:space-y-4">
                  {data.map((product) => (
                    <div
                      key={product?._id}
                      className="group bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-3 sm:p-6">
                        <div className="flex gap-3 sm:gap-6">
                          {/* IMAGE */}
                          <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden border border-gray-100">
                              <img
                                src={product?.productId?.productImage?.[0] || "/fallback-image.png"}
                                className="w-full h-full object-contain p-1.5 sm:p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                                alt={product?.productId?.productName}
                              />
                            </div>
                            {/* Mobile Delete Button */}
                            <button
                              onClick={() => deleteCartProduct(product?._id)}
                              className="sm:hidden absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-sm hover:bg-red-500 hover:text-white transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {/* DETAILS */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2 sm:gap-4">
                              <div className="flex-1">
                                <Link 
                                  to={`/product/${product?.productId?._id}`}
                                  className="text-sm sm:text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2"
                                >
                                  {product?.productId?.productName}
                                </Link>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 capitalize">
                                  {product?.productId?.category}
                                </p>
                              </div>
                              
                              {/* Desktop Delete Button */}
                              <button
                                onClick={() => deleteCartProduct(product?._id)}
                                className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-red-500 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-red-50 transition-all"
                              >
                                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                              </button>
                            </div>

                            {/* PRICE SECTION */}
                            <div className="mt-2 sm:mt-3 flex items-baseline gap-2 sm:gap-3">
                              <span className="text-base sm:text-2xl font-bold text-gray-900">
                                {displayKESCurrency(product?.productId?.selling * product?.quantity)}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-400 line-through">
                                {displayKESCurrency(product?.productId?.price * product?.quantity)}
                              </span>
                              {product?.productId?.price > product?.productId?.selling && (
                                <span className="text-[10px] sm:text-xs font-semibold text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                                  Save {Math.round((1 - product?.productId?.selling / product?.productId?.price) * 100)}%
                                </span>
                              )}
                            </div>

                            {/* ACTIONS ROW */}
                            <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
                              {/* QTY CONTROLS */}
                              <div className="flex items-center gap-2 sm:gap-3">
                                <button
                                  onClick={() => decreaseQty(product?._id, product?.quantity)}
                                  disabled={isUpdating === product?._id || product?.quantity <= 1}
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                                >
                                  <Minus size={14} className="sm:w-[18px] sm:h-[18px]" />
                                </button>
                                
                                <div className="w-8 sm:w-12 text-center">
                                  {isUpdating === product?._id ? (
                                    <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                  ) : (
                                    <span className="text-base sm:text-lg font-bold text-gray-900">{product?.quantity}</span>
                                  )}
                                </div>

                                <button
                                  onClick={() => increaseQty(product?._id, product?.quantity)}
                                  disabled={isUpdating === product?._id}
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                                >
                                  <Plus size={14} className="sm:w-[18px] sm:h-[18px]" />
                                </button>
                              </div>

                              {/* UNIT PRICE */}
                              <div className="text-right">
                                <p className="text-[10px] sm:text-xs text-gray-500">Unit Price</p>
                                <p className="text-sm sm:text-base font-semibold text-gray-900">
                                  {displayKESCurrency(product?.productId?.selling)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Continue Shopping */}
              {!loading && data.length > 0 && (
                <Link 
                  to="/"
                  className="inline-flex items-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors text-sm sm:text-base"
                >
                  <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                  Continue Shopping
                </Link>
              )}
            </div>

            {/* ================= ORDER SUMMARY ================= */}
            <div className="w-full lg:w-96 lg:sticky lg:top-24 self-start space-y-3 sm:space-y-4">
              {/* Summary Card */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-3 sm:py-4">
                  <h2 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                    Order Summary
                  </h2>
                </div>

                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  {/* Price Breakdown */}
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({totalQty} items)</span>
                      <span className="font-medium">{displayKESCurrency(originalTotal)}</span>
                    </div>
                    
                    {savings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">-{displayKESCurrency(savings)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center gap-1.5 sm:gap-2">
                        <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                        Shipping
                      </span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span className="font-medium">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 sm:pt-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-gray-600 font-medium text-sm sm:text-base">Total</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">Including VAT</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl sm:text-3xl font-bold text-gray-900">
                          {displayKESCurrency(totalPrice)}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">KES</p>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => navigate('/checkout', { state: { cartItems: data, totalAmount: totalPrice } })}
                    disabled={loading || data.length === 0}
                    className="w-full bg-gray-900 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-gray-200 flex items-center justify-center gap-2 group"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                  </button>

                  {/* Secure Note */}
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 pt-1 sm:pt-2">
                    <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    <span>Secure SSL Encrypted Checkout</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                  <div className="space-y-1 sm:space-y-2">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                      <Truck className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-medium text-gray-600">Free Delivery</p>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-medium text-gray-600">Secure Payment</p>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto">
                      <Package className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-medium text-gray-600">Easy Returns</p>
                  </div>
                </div>
              </div>

              {/* Promo Code (Visual Only) */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6">
                <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 block">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-600 transition-colors"
                  />
                  <button className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 text-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Clear Cart?</h3>
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={18} className="sm:w-5 sm:h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
              Are you sure you want to remove all {totalQty} items from your cart? This action cannot be undone.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={clearAllCart}
                className="flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors text-xs sm:text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;