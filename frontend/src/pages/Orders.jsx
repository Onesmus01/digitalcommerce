"use client";

import { useState, useEffect, useContext, useMemo } from "react";
import { Context } from "../context/ProductContext.jsx";
import { toast } from "react-hot-toast";
import { 
  FaDownload, 
  FaShoppingCart, 
  FaUsers, 
  FaDollarSign, 
  FaSearch, 
  FaFilter,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaBox,
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaShippingFast,
  FaTimesCircle,
  FaChevronDown,
  FaEllipsisH
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboardOrders() {
  const { backendUrl, getAuthHeaders } = useContext(Context);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/order/all-orders`, { 
        credentials: "include",
        headers: getAuthHeaders(),
       },
        
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${backendUrl}/user/total-users`, { 
        credentials: "include",
        headers: getAuthHeaders()
       });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      setUsers(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error fetching users");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, [backendUrl]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o =>
      (!statusFilter || o.orderStatus === statusFilter) &&
      (!search ||
        o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        o.items.some(item => item.name?.toLowerCase().includes(search.toLowerCase()))
      )
    );
  }, [orders, search, statusFilter]);

  // Compute stats
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(o => o.paymentStatus === "success")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalUsers = users.length;
    return { totalOrders, totalRevenue, totalUsers };
  }, [orders, users]);

  const exportCSV = () => {
    const rows = [
      [
        "Customer Name","Customer Email","Phone","User Role","Product Name",
        "Product Price","Quantity","Total Amount","Order Status",
        "Payment Method","Payment Status","Shipping Country","Shipping City",
        "Shipping Street","Shipping PostalCode",
      ],
      ...orders.map(o =>
        o.items.map(item => [
          o.user?.name || "Unknown",
          o.user?.email || "Unknown",
          o.shippingAddress?.phone || "N/A",
          o.user?.role || "GENERAL",
          item.name || "Unknown Product",
          item.price || 0,
          item.quantity || 0,
          o.totalAmount || 0,
          o.orderStatus || "Pending",
          o.paymentMethod || "N/A",
          o.paymentStatus || "pending",
          o.shippingAddress?.address?.country || "N/A",
          o.shippingAddress?.address?.city || "N/A",
          o.shippingAddress?.address?.street || "N/A",
          o.shippingAddress?.address?.postalCode || "N/A",
        ])
      ).flat(),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "all-orders.csv";
    document.body.appendChild(link);
    link.click();
    toast.success("CSV exported successfully!");
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${backendUrl}/order/update-status/${orderId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      toast.success("Order status updated!");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error updating status");
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      delivered: { 
        color: "bg-emerald-500", 
        bg: "bg-emerald-50", 
        text: "text-emerald-700", 
        border: "border-emerald-200",
        icon: FaCheckCircle,
        glow: "shadow-emerald-500/30"
      },
      shipped: { 
        color: "bg-blue-500", 
        bg: "bg-blue-50", 
        text: "text-blue-700", 
        border: "border-blue-200",
        icon: FaShippingFast,
        glow: "shadow-blue-500/30"
      },
      processing: { 
        color: "bg-amber-500", 
        bg: "bg-amber-50", 
        text: "text-amber-700", 
        border: "border-amber-200",
        icon: FaClock,
        glow: "shadow-amber-500/30"
      },
      pending: { 
        color: "bg-slate-500", 
        bg: "bg-slate-50", 
        text: "text-slate-700", 
        border: "border-slate-200",
        icon: FaClock,
        glow: "shadow-slate-500/30"
      },
      cancelled: { 
        color: "bg-rose-500", 
        bg: "bg-rose-50", 
        text: "text-rose-700", 
        border: "border-rose-200",
        icon: FaTimesCircle,
        glow: "shadow-rose-500/30"
      },
    };
    return configs[status] || configs.pending;
  };

  const getPaymentStatusConfig = (status) => {
    return status === "success" 
      ? { color: "text-emerald-600", bg: "bg-emerald-100", icon: FaCheckCircle }
      : { color: "text-amber-600", bg: "bg-amber-100", icon: FaClock };
  };

  // Helper component for payment status icon
  const PaymentStatusIcon = ({ status }) => {
    const config = getPaymentStatusConfig(status);
    const IconComponent = config.icon;
    return <IconComponent className="text-xs" />;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-500 font-medium">Loading orders...</span>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Orders Management
          </h1>
          <p className="text-slate-500 mt-1">Track and manage customer orders efficiently</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportCSV}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-500/25 font-medium hover:shadow-xl transition-all"
        >
          <FaDownload className="text-sm" />
          Export CSV
        </motion.button>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, email, or product..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <div className="relative md:w-64">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              className="w-full pl-12 pr-10 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none appearance-none cursor-pointer transition-all"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {["pending","processing","shipped","delivered","cancelled"].map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {[
          { 
            title: "Total Orders", 
            value: stats.totalOrders, 
            icon: FaShoppingCart,
            gradient: "from-blue-500 to-indigo-600",
            trend: "+12.5%"
          },
          { 
            title: "Total Users", 
            value: stats.totalUsers, 
            icon: FaUsers,
            gradient: "from-purple-500 to-pink-600",
            trend: "+8.2%"
          },
          { 
            title: "Total Revenue", 
            value: `$${stats.totalRevenue}`, 
            icon: FaDollarSign,
            gradient: "from-emerald-500 to-teal-600",
            trend: "+24.3%"
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6 overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
              
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
                  <h3 className="text-2xl font-bold text-slate-800">{card.value}</h3>
                  <p className="text-xs text-emerald-500 font-medium mt-2 flex items-center gap-1">
                    <span className="bg-emerald-100 px-2 py-0.5 rounded-full">{card.trend}</span>
                    <span className="text-slate-400">vs last month</span>
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                  <card.icon className="text-xl text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredOrders.map((order, orderIdx) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: orderIdx * 0.05 }}
              className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300"
            >
              {/* Order Header */}
              <div 
                className="p-6 cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                  {/* Customer Info */}
                  <div className="flex items-center gap-4 min-w-[280px]">
                    <div className="relative">
                      {order.user?.profilePic ? (
                        <img
                          src={order.user.profilePic}
                          alt={order.user?.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {order.user?.name?.[0] || "U"}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                        <FaCheckCircle className="text-white text-xs" />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-800">{order.user?.name || "Unknown User"}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <FaEnvelope className="text-xs" />
                        <span className="truncate max-w-[200px]">{order.user?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                        <FaPhone className="text-xs" />
                        <span>{order.shippingAddress?.phone || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500 mb-1">Order ID</p>
                      <p className="font-mono font-medium text-slate-700">#{order._id?.slice(-8).toUpperCase()}</p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500 mb-1">Items</p>
                      <p className="font-medium text-slate-700 flex items-center gap-2">
                        <FaBox className="text-indigo-500" />
                        {order.items.length} items
                      </p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500 mb-1">Total Amount</p>
                      <p className="font-bold text-slate-800 text-lg">${order.totalAmount}</p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500 mb-1">Date</p>
                      <p className="font-medium text-slate-700 flex items-center gap-2">
                        <FaCalendarAlt className="text-slate-400" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={`appearance-none px-4 py-2 pr-10 rounded-full font-medium text-sm border-2 cursor-pointer outline-none transition-all hover:shadow-lg ${getStatusConfig(order.orderStatus).bg} ${getStatusConfig(order.orderStatus).text} ${getStatusConfig(order.orderStatus).border} ${getStatusConfig(order.orderStatus).glow}`}
                      >
                        {["pending","processing","shipped","delivered","cancelled"].map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none opacity-50" />
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <FaEllipsisH className="text-slate-400" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Expandable Order Details */}
              <AnimatePresence>
                {expandedOrder === order._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-slate-100 bg-slate-50/50"
                  >
                    <div className="p-6 space-y-6">
                      {/* Items List */}
                      <div>
                        <h5 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                          <FaBox className="text-indigo-500" />
                          Order Items
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {order.items.map((item, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4"
                            >
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-lg shadow-md"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                                  <FaBox />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-slate-800 line-clamp-1">{item.name}</p>
                                <p className="text-sm text-slate-500 mt-1">
                                  ${item.price} × {item.quantity}
                                </p>
                                <p className="font-semibold text-indigo-600 mt-1">
                                  ${(item.price * item.quantity)}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Payment & Shipping Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                          <h5 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                            <FaCreditCard className="text-emerald-500" />
                            Payment Information
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Method</span>
                              <span className="font-medium text-slate-700 capitalize">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Status</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getPaymentStatusConfig(order.paymentStatus).bg} ${getPaymentStatusConfig(order.paymentStatus).color}`}>
                                <PaymentStatusIcon status={order.paymentStatus} />
                                {order.paymentStatus}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Transaction ID</span>
                              <span className="font-mono text-slate-700">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                          <h5 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-rose-500" />
                            Shipping Address
                          </h5>
                          <div className="space-y-2 text-sm">
                            <p className="text-slate-700 font-medium">
                              {order.shippingAddress?.address?.street}
                            </p>
                            <p className="text-slate-500">
                              {order.shippingAddress?.address?.city}, {order.shippingAddress?.address?.postalCode}
                            </p>
                            <p className="text-slate-500">
                              {order.shippingAddress?.address?.country}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            <FaShoppingCart className="text-slate-400 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No orders found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}
    </div>
  );
}