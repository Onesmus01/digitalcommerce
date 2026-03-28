import React, { useEffect, useState, useContext } from "react";
import { Package, Truck, CheckCircle, XCircle, Clock, MapPin, CreditCard, Calendar, ChevronRight, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {Link} from 'react-router-dom'
import {Context} from '@/context/ProductContext.jsx'

const getStatusConfig = (status) => {
  const configs = {
    delivered: {
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: CheckCircle,
      label: "Delivered",
      gradient: "from-emerald-400 to-teal-500"
    },
    shipped: {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: Truck,
      label: "Shipped",
      gradient: "from-blue-400 to-indigo-500"
    },
    processing: {
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: Package,
      label: "Processing",
      gradient: "from-amber-400 to-orange-500"
    },
    cancelled: {
      color: "bg-rose-100 text-rose-700 border-rose-200",
      icon: XCircle,
      label: "Cancelled",
      gradient: "from-rose-400 to-red-500"
    },
    default: {
      color: "bg-slate-100 text-slate-600 border-slate-200",
      icon: Clock,
      label: "Pending",
      gradient: "from-slate-400 to-gray-500"
    }
  };
  return configs[status] || configs.default;
};

const OrderProgress = ({ status }) => {
  const steps = [
    { key: "processing", label: "Processing", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle }
  ];

  const currentStep = steps.findIndex(s => s.key === status);
  const progress = status === "cancelled" ? 0 : ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="mt-2 sm:mt-4">
      <div className="flex justify-between mb-1 sm:mb-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx <= currentStep && status !== "cancelled";
          const isCurrent = idx === currentStep && status !== "cancelled";
          
          return (
            <div key={step.key} className="flex flex-col items-center gap-0.5 sm:gap-1">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                  : "bg-gray-200 text-gray-400"
              } ${isCurrent ? "ring-2 sm:ring-4 ring-indigo-100 scale-110" : ""}`}>
                <Icon size={12} className="sm:w-4 sm:h-4" />
              </div>
              <span className={`text-[8px] sm:text-xs font-medium ${isActive ? "text-indigo-600" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out ${
            status === "cancelled" ? "bg-gradient-to-r from-rose-400 to-red-500" : ""
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-16 text-center">
    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
      <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 text-indigo-300" />
    </div>
    <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">No Orders Yet</h2>
    <p className="text-gray-500 text-xs sm:text-base max-w-sm mx-auto mb-4 sm:mb-8">
      Your order history is empty. Start shopping to see your orders here!
    </p>
    <Link to={'/'} className="bg-indigo-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-0.5">
      Start Shopping
    </Link>
  </div>
);

const OrderCard = ({ order, onView, onCancel }) => {
  const statusConfig = getStatusConfig(order.orderStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden">
      <div className="p-3 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-2 sm:mb-4">
          <div>
            <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
              <span className="text-[8px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Order</span>
              <span className="font-mono text-[10px] sm:text-sm font-bold text-gray-700 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                #{order._id.slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-gray-500">
              <Calendar size={12} className="sm:w-4 sm:h-4" />
              {new Date(order.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
          </div>
          <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-xs font-semibold border ${statusConfig.color}`}>
            <StatusIcon size={12} className="sm:w-4 sm:h-4" />
            {statusConfig.label}
          </div>
        </div>

        {/* Products Preview */}
        <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
          <div className="flex -space-x-2 sm:-space-x-3">
            {order.items.slice(0, 3).map((item, idx) => (
              <div key={item._id} className="relative group/item">
                <img
                  src={item.image || "/default-product.png"}
                  alt={item.name}
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-md sm:rounded-lg object-cover border-2 border-white shadow-md transition-transform group-hover/item:scale-110"
                />
                {idx === 2 && order.items.length > 3 && (
                  <div className="absolute inset-0 bg-black/50 rounded-md sm:rounded-lg flex items-center justify-center text-white text-[8px] sm:text-xs font-bold">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex-1">
            <p className="text-[10px] sm:text-sm text-gray-600 font-medium">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </p>
            <p className="text-[8px] sm:text-xs text-gray-400 truncate max-w-[120px] sm:max-w-[200px]">
              {order.items.map(i => i.name).join(', ')}
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-baseline gap-1 mb-2 sm:mb-4">
          <span className="text-[10px] sm:text-sm text-gray-500">KES</span>
          <span className="text-lg sm:text-2xl font-bold text-gray-800">{order.totalAmount.toLocaleString()}</span>
        </div>

        {/* Progress */}
        <OrderProgress status={order.orderStatus} />

        {/* Actions */}
        <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
          <button
            onClick={() => onView(order)}
            className="flex-1 bg-gray-900 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-base font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-1 sm:gap-2 group/btn"
          >
            View Details
            <ChevronRight size={14} className="sm:w-4 sm:h-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
          
          {order.orderStatus === "processing" && (
            <button
              onClick={() => onCancel(order._id)}
              className="px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors text-xs sm:text-base"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const OrderModal = ({ order, onClose, onCancel }) => {
  if (!order) return null;
  const statusConfig = getStatusConfig(order.orderStatus);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 sm:p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-100 text-[10px] sm:text-sm font-medium mb-0.5 sm:mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
              <h2 className="text-lg sm:text-2xl font-bold">Order Details</h2>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <XCircle size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-3 sm:p-6">
          {/* Status Banner */}
          <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-4 rounded-lg sm:rounded-xl mb-3 sm:mb-6 ${statusConfig.color}`}>
            <statusConfig.icon size={18} className="sm:w-6 sm:h-6" />
            <div>
              <p className="font-semibold text-sm sm:text-base">{statusConfig.label}</p>
              <p className="text-[10px] sm:text-sm opacity-80">
                {order.orderStatus === "delivered" 
                  ? "Your order has been delivered successfully" 
                  : order.orderStatus === "shipped" 
                  ? "Your order is on the way"
                  : "We're preparing your order"}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4 sm:mb-8">
            <OrderProgress status={order.orderStatus} />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-gray-50 p-2 sm:p-4 rounded-lg sm:rounded-xl">
              <div className="flex items-center gap-1 sm:gap-2 text-gray-500 text-[10px] sm:text-sm mb-0.5 sm:mb-1">
                <Calendar size={14} className="sm:w-4 sm:h-4" />
                Order Date
              </div>
              <p className="font-semibold text-gray-800 text-xs sm:text-base">
                {new Date(order.createdAt).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="bg-gray-50 p-2 sm:p-4 rounded-lg sm:rounded-xl">
              <div className="flex items-center gap-1 sm:gap-2 text-gray-500 text-[10px] sm:text-sm mb-0.5 sm:mb-1">
                <CreditCard size={14} className="sm:w-4 sm:h-4" />
                Payment
              </div>
              <p className="font-semibold text-gray-800 text-xs sm:text-base capitalize">{order.paymentStatus}</p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-4 sm:mb-6">
            <h3 className="font-bold text-gray-800 mb-2 sm:mb-4 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-lg">
              <Package size={16} className="sm:w-5 sm:h-5 text-indigo-600" />
              Items Ordered
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-2 sm:gap-4 p-2 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors">
                  <img
                    src={item.image || "/default-product.png"}
                    alt={item.name}
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-md sm:rounded-lg object-cover bg-white shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-xs sm:text-base mb-0.5 sm:mb-1 truncate">{item.name}</h4>
                    <p className="text-[10px] sm:text-sm text-gray-500 mb-1 sm:mb-2">Qty: {item.quantity}</p>
                    <p className="font-bold text-indigo-600 text-xs sm:text-base">KES {item.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-xs sm:text-base">KES {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-3 sm:pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-lg">Total Amount</span>
              <span className="text-xl sm:text-2xl font-bold text-gray-800">KES {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-6 border-t bg-gray-50 flex gap-2 sm:gap-3">
          {order.orderStatus === "processing" && (
            <button
              onClick={() => {
                onCancel(order._id);
                onClose();
              }}
              className="flex-1 bg-rose-100 text-rose-700 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-rose-200 transition-colors text-xs sm:text-base"
            >
              Cancel Order
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-gray-900 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-800 transition-colors text-xs sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { backendUrl, getAuthHeaders } = useContext(Context);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem('token');
      
      const res = await fetch(`${backendUrl}/order/my-orders`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch orders");
      }

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/order/${id}/cancel`, {
        method: "PUT",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Cancel failed");

      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-500 mt-0.5 sm:mt-1 text-xs sm:text-base">Track and manage your purchases</p>
            </div>
            <div className="bg-indigo-50 text-indigo-700 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 sm:px-6 py-2 sm:py-4 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 text-xs sm:text-base">
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onView={setSelectedOrder}
                onCancel={cancelOrder}
              />
            ))}
          </div>
        )}
      </div>

      <OrderModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)}
        onCancel={cancelOrder}
      />
    </div>
  );
}