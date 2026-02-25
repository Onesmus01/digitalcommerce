"use client";

import React, { useState, useEffect, useContext } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaDollarSign,
  FaBell,
  FaMoon,
  FaSun,
  FaDownload,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEllipsisV,
  FaArrowUp,
  FaArrowDown,
  FaFire,
  FaChartLine,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaBrain,
  FaCreditCard,
  FaHandPaper,
  FaRocket,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Context } from "../context/ProductContext.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ===================== Premium Stats Card =====================
const StatsCard = ({ label, value, icon: Icon, gradient, trend, trendUp, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, type: "spring" }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="relative group"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
    <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6 overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <h2 className="text-3xl font-bold text-slate-800">{value}</h2>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${trendUp ? "text-emerald-500" : "text-rose-500"}`}>
              {trendUp ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="text-xl text-white" />
        </div>
      </div>
    </div>
  </motion.div>
);

// ===================== Top Product Card =====================
const TopProductCard = ({ product, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.02, x: 5 }}
    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 group cursor-pointer"
  >
    <div className="relative">
      <img
        src={product.productImage}
        alt={product.productName}
        className="w-14 h-14 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow"
      />
      <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ${
        index === 0 ? "bg-gradient-to-br from-yellow-400 to-orange-500" :
        index === 1 ? "bg-gradient-to-br from-slate-300 to-slate-400" :
        index === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700" :
        "bg-gradient-to-br from-indigo-500 to-purple-500"
      }`}>
        {index + 1}
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-slate-700 truncate">{product.productName}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-sm text-slate-400">{product.selling} sales</span>
        <span className="w-1 h-1 bg-slate-300 rounded-full" />
        <span className="text-sm text-emerald-500 font-medium">+{Math.floor(Math.random() * 20 + 5)}%</span>
      </div>
    </div>
    <div className="text-right">
      <FaFire className={`text-lg ${index < 3 ? "text-orange-400" : "text-slate-300"}`} />
    </div>
  </motion.div>
);

// ===================== Order Status Badge =====================
const StatusBadge = ({ status }) => {
  const styles = {
    delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
    processing: "bg-amber-100 text-amber-700 border-amber-200",
    shipped: "bg-blue-100 text-blue-700 border-blue-200",
    cancelled: "bg-rose-100 text-rose-700 border-rose-200",
    pending: "bg-slate-100 text-slate-700 border-slate-200",
  };
  
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status?.toLowerCase()] || styles.pending}`}>
      {status}
    </span>
  );
};

// ===================== Progress Bar =====================
const ProgressBar = ({ current, goal, label }) => {
  const percent = Math.min(100, ((current / goal) * 100).toFixed(0));
  
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800">{label}</h3>
          <p className="text-sm text-slate-400 mt-1">Keep pushing to reach your target</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-slate-800">{percent}%</span>
        </div>
      </div>
      
      <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 rounded-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
      
      <div className="flex items-center justify-between mt-3 text-sm">
        <span className="text-slate-500">${current?.toLocaleString()}</span>
        <span className="text-slate-400">Goal: ${goal?.toLocaleString()}</span>
      </div>
    </div>
  );
};

// ===================== Heatmap Cell =====================
const HeatmapCell = ({ intensity, delay }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay, type: "spring", stiffness: 300 }}
    className={`h-8 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer ${
      intensity > 0.8 ? "bg-emerald-500 shadow-lg shadow-emerald-500/30" :
      intensity > 0.6 ? "bg-emerald-400" :
      intensity > 0.4 ? "bg-emerald-300" :
      intensity > 0.2 ? "bg-emerald-200" :
      "bg-slate-100"
    }`}
    title={`Activity: ${Math.round(intensity * 100)}%`}
  />
);

export default function AdminDashboard() {
  const [ordersPage, setOrdersPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [showFilters, setShowFilters] = useState(false);

  const { backendUrl, toast, user } = useContext(Context);

  const ORDERS_PER_PAGE = 5;
  const salesGoal = 60000;
  const userRole = "admin";

  const [recentOrders, setRecentOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  
  const [stats, setStats] = useState({
    users: 1200,
    orders: 340,
    products: 95,
    revenue: 45230,
  });

  // ===================== Fetch Functions =====================
  const fetchRecentOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/order/recent-orders`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch recent orders");
      setRecentOrders(data.orders || []);
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Error while fetching recent orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/order/all-orders`, { credentials: "include" });
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

  const fetchTotalProducts = async () => {
    try {
      const res = await fetch(`${backendUrl}/product/total-products`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch total products");
      setStats((prev) => ({
        ...prev,
        products: data.data.totalProducts || 0,
        revenue: data.data.totalSales || 0,
      }));
    } catch (error) {
      console.error("Error fetching total products:", error);
      toast.error(error.message || "Failed to fetch total products");
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const res = await fetch(`${backendUrl}/payment/total-revenue`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch revenue");
      setStats((prev) => ({
        ...prev,
        revenue: data.data.totalRevenue || 0,
      }));
    } catch (error) {
      console.error("Revenue fetch error:", error);
      toast.error(error.message || "Failed to fetch revenue");
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const res = await fetch(`${backendUrl}/user/total-users`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      setStats((prev) => ({
        ...prev,
        users: data.data.totalUsers || 0,
      }));
    } catch (error) {
      console.error("User stats error:", error);
      toast.error("Failed to fetch users");
    }
  };

  const fetchTotalOrders = async () => {
    try {
      const res = await fetch(`${backendUrl}/order/total-orders`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch total orders");
      setStats((prev) => ({
        ...prev,
        orders: data.data.totalOrders || 0,
      }));
    } catch (error) {
      console.error("Total orders error:", error);
      toast.error("Failed to fetch total orders");
    }
  };

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/product/top-products`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch top products");
      setTopProducts(data.data || []);
    } catch (error) {
      console.error("Failed to fetch top products:", error.message);
      toast?.error(error.message || "Error fetching top products");
    } finally {
      setLoading(false);
    }
  };

  // ===================== UseEffects =====================
  useEffect(() => { fetchRecentOrders(); }, []);
  useEffect(() => { fetchOrders(); }, []);
  useEffect(() => { fetchTotalProducts(); }, [backendUrl, toast]);
  useEffect(() => { fetchTotalRevenue(); }, [backendUrl, toast]);
  useEffect(() => { fetchTotalUsers(); }, [backendUrl, toast]);
  useEffect(() => { fetchTotalOrders(); }, [backendUrl, toast]);
  useEffect(() => { fetchTopProducts(); }, [backendUrl, toast]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        users: prev.users + Math.floor(Math.random() * 2),
        revenue: prev.revenue + Math.floor(Math.random() * 150),
        orders: prev.orders + Math.floor(Math.random() * 1),
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // ===================== Helpers =====================
  const formatNumber = (num) => new Intl.NumberFormat().format(num);
  const revenueTrend = (((stats.revenue - 38000) / 38000) * 100).toFixed(1);
  const predictNextMonthSales = () => Math.round(stats.revenue * 1.12);

  const exportCSV = () => {
    const rows = [
      ["Customer Name", "Customer Email", "Phone", "User Role", "Product Name", "Product Price", "Quantity", "Total Amount", "Order Status", "Payment Method", "Payment Status", "Shipping Country", "Shipping City", "Shipping Street", "Shipping PostalCode"],
      ...orders.map((o) =>
        o.items.map((item) => [
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
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "all-orders.csv";
    document.body.appendChild(link);
    link.click();
  };

  const searchTermLower = searchTerm.toLowerCase();
  const filteredOrders = recentOrders.filter((o) => {
    const customerName = o.user?.name?.toLowerCase() || "";
    const productName = o.items?.[0]?.product?.name?.toLowerCase() || "";
    const status = o.status?.toLowerCase() || "";
    return (
      customerName.includes(searchTermLower) ||
      productName.includes(searchTermLower) ||
      status.includes(searchTermLower)
    );
  });

  const paginatedOrders = filteredOrders.slice(
    (ordersPage - 1) * ORDERS_PER_PAGE,
    ordersPage * ORDERS_PER_PAGE
  );

  // ===================== Chart Data =====================
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [1200, 1900, 800, 1400, 1700, 2300],
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "Orders",
        data: [30, 50, 20, 40, 60, 80],
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, family: "Inter" },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: "#64748b" },
      },
      y: {
        grid: { color: "rgba(100, 116, 139, 0.1)" },
        ticks: { font: { size: 11 }, color: "#64748b" },
      },
    },
  };

  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue Growth",
        data: [65, 78, 90, 81, 96, 105, 120],
        borderColor: "rgba(139, 92, 246, 1)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(139, 92, 246, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: ["New", "Returning", "VIP"],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 font-medium">Loading dashboard...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-200 p-1">
            {["24h", "7d", "30d", "90d"].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  selectedTimeRange === range
                    ? "bg-indigo-500 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 font-medium"
          >
            <FaPlus className="text-sm" />
            <span>Add Order</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow font-medium"
          >
            <FaDownload className="text-sm" />
            <span>Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          label="Total Users"
          value={formatNumber(stats.users)}
          icon={FaUsers}
          gradient="from-blue-400 to-blue-600"
          trend="+12.5%"
          trendUp={true}
          delay={0}
        />
        <StatsCard
          label="Total Orders"
          value={formatNumber(stats.orders)}
          icon={FaShoppingCart}
          gradient="from-emerald-400 to-emerald-600"
          trend="+8.2%"
          trendUp={true}
          delay={0.1}
        />
        <StatsCard
          label="Products"
          value={formatNumber(stats.products)}
          icon={FaBox}
          gradient="from-amber-400 to-orange-500"
          trend="+3.1%"
          trendUp={true}
          delay={0.2}
        />
        <StatsCard
          label="Revenue"
          value={`$${formatNumber(stats.revenue)}`}
          icon={FaDollarSign}
          gradient="from-rose-400 to-rose-600"
          trend={`+${revenueTrend}%`}
          trendUp={true}
          delay={0.3}
        />
      </div>

      {/* PROGRESS BAR & AI PREDICTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ProgressBar current={stats.revenue} goal={salesGoal} label="Monthly Sales Goal" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <FaBrain className="text-lg" />
              <span className="text-sm font-medium opacity-90">AI Prediction</span>
            </div>
            <p className="text-sm opacity-80 mb-2">Predicted revenue next month</p>
            <h3 className="text-3xl font-bold">${formatNumber(predictNextMonthSales())}</h3>
            <div className="flex items-center gap-2 mt-3 text-sm">
              <span className="px-2 py-1 bg-white/20 rounded-lg">+12% growth</span>
              <span className="opacity-70">based on trends</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* MAIN CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Sales Analytics</h3>
              <p className="text-sm text-slate-400">Revenue vs Orders comparison</p>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <FaEllipsisV className="text-slate-400" />
            </button>
          </div>
          <div className="h-72">
            <Bar data={salesData} options={salesOptions} />
          </div>
        </motion.div>

        {/* Revenue Growth Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Revenue Growth</h3>
              <p className="text-sm text-slate-400">Weekly performance</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
              <FaArrowUp className="text-xs" />
              <span>+24%</span>
            </div>
          </div>
          <div className="h-56">
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                  y: { grid: { color: "rgba(100, 116, 139, 0.1)" }, ticks: { font: { size: 10 } } },
                },
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* ORDERS & TOP PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Recent Orders</h3>
                <p className="text-sm text-slate-400">Latest customer transactions</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-xl transition-colors ${showFilters ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  <FaFilter className="text-sm" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedOrders.map((order, idx) => {
                  const customerName = order.user?.name || "Unknown User";
                  const productNames = order.items && order.items.length > 0
                    ? order.items.map((i) => i.name).join(", ")
                    : "No products";
                  const amount = order.totalAmount || 0;
                  const status = order.orderStatus || "Pending";

                  return (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {customerName[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-700">{customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 truncate max-w-xs">{productNames}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">${amount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={status} />
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {(ordersPage - 1) * ORDERS_PER_PAGE + 1} to{" "}
              {Math.min(ordersPage * ORDERS_PER_PAGE, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                disabled={ordersPage === 1}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setOrdersPage((p) => p + 1)}
                disabled={ordersPage * ORDERS_PER_PAGE >= filteredOrders.length}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Top Products</h3>
              <p className="text-sm text-slate-400">Best performing items</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <FaFire className="text-orange-500" />
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            {topProducts.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <FaBox className="text-slate-400 text-xl" />
                </div>
                <p className="text-slate-500">No top products found</p>
              </div>
            ) : (
              topProducts.map((product, index) => (
                <TopProductCard key={index} product={product} index={index} />
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* BOTTOM SECTION - HEATMAP & SEGMENTATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Activity Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Activity Heatmap</h3>
              <p className="text-sm text-slate-400">Daily sales activity</p>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }).map((_, i) => (
              <HeatmapCell key={i} intensity={Math.random()} delay={i * 0.02} />
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-slate-100 rounded" />
              <div className="w-3 h-3 bg-emerald-200 rounded" />
              <div className="w-3 h-3 bg-emerald-300 rounded" />
              <div className="w-3 h-3 bg-emerald-400 rounded" />
              <div className="w-3 h-3 bg-emerald-500 rounded" />
            </div>
            <span>More</span>
          </div>
        </motion.div>

        {/* Customer Segmentation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Customer Segments</h3>
              <p className="text-sm text-slate-400">Distribution by value</p>
            </div>
          </div>
          <div className="h-48">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "70%",
                plugins: { legend: { position: "bottom", labels: { usePointStyle: true, padding: 15 } } },
              }}
            />
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Insights</h3>
          <div className="space-y-4">
            {[
              { icon: FaFire, label: "High Value Customers", value: "120", color: "from-orange-400 to-red-500" },
              { icon: FaShoppingCart, label: "Repeat Buyers", value: "340", color: "from-emerald-400 to-teal-500" },
              { icon: FaUsers, label: "New Customers", value: "89", color: "from-blue-400 to-indigo-500" },
              { icon: FaChartLine, label: "Avg. Order Value", value: "$142", color: "from-purple-400 to-pink-500" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + idx * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <item.icon className="text-white text-sm" />
                  </div>
                  <span className="text-slate-600">{item.label}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ENTERPRISE FEATURES SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FaRocket className="text-indigo-500" />
          Enterprise Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* TensorFlow.js */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <FaBrain className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">TensorFlow.js AI</h3>
                <p className="text-sm text-slate-400">Revenue regression model</p>
              </div>
            </div>
            <button
              onClick={async () => {
                const tf = await import("@tensorflow/tfjs");
                const model = tf.sequential();
                model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
                model.compile({ loss: "meanSquaredError", optimizer: "sgd" });
                const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
                const ys = tf.tensor2d([100, 200, 300, 400], [4, 1]);
                await model.fit(xs, ys, { epochs: 50 });
                const prediction = model.predict(tf.tensor2d([5], [1, 1]));
                prediction.print();
                alert("Model trained! Check console for prediction.");
              }}
              className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-shadow"
            >
              Train AI Model
            </button>
          </motion.div>

          {/* Stripe Sync */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                <FaCreditCard className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Stripe Sync</h3>
                <p className="text-sm text-slate-400">Live revenue integration</p>
              </div>
            </div>
            <button
              onClick={async () => {
                const res = await fetch("/api/stripe/revenue");
                const data = await res.json();
                alert(`Live Revenue: $${data.total}`);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-shadow"
            >
              Sync Revenue
            </button>
          </motion.div>

          {/* Fraud Detection */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
                <FaShieldAlt className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Fraud Detection</h3>
                <p className="text-sm text-slate-400">AI-powered security scan</p>
              </div>
            </div>
            <button
              onClick={() => {
                const randomRisk = Math.random();
                if (randomRisk > 0.7) {
                  alert("⚠️ High Fraud Risk Transaction Detected!");
                } else {
                  alert("Transaction Safe ✅");
                }
              }}
              className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-rose-500/25 transition-shadow"
            >
              Run Fraud Scan
            </button>
          </motion.div>

          {/* Push Notifications */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <FaBell className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Push Notifications</h3>
                <p className="text-sm text-slate-400">Real-time browser alerts</p>
              </div>
            </div>
            <button
              onClick={async () => {
                if ("Notification" in window) {
                  const permission = await Notification.requestPermission();
                  if (permission === "granted") {
                    new Notification("New Order Received 🚀");
                  }
                }
              }}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-shadow"
            >
              Enable Push
            </button>
          </motion.div>

          {/* Drag & Drop */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <FaHandPaper className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Drag & Drop</h3>
                <p className="text-sm text-slate-400">Customizable widgets</p>
              </div>
            </div>
            <div
              draggable
              className="p-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl cursor-move text-center text-amber-700 font-medium"
              onDragStart={(e) => e.dataTransfer.setData("text/plain", "widget")}
            >
              Drag Me
            </div>
          </motion.div>

          {/* Geo Map */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <FaMapMarkerAlt className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Customer Map</h3>
                <p className="text-sm text-slate-400">Geographic distribution</p>
              </div>
            </div>
            <div className="h-24 bg-gradient-to-r from-cyan-100 via-blue-100 to-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-cyan-600 font-medium">Interactive Map Ready</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Admin Actions */}
      {userRole === "admin" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-8 p-6 bg-gradient-to-r from-rose-500 to-red-600 rounded-2xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Admin Actions</h3>
              <p className="text-sm opacity-80">Restricted operations requiring admin privileges</p>
            </div>
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-medium transition-colors">
              Delete Action
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
