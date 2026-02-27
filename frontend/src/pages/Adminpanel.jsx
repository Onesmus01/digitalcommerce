"use client";

import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaDollarSign,
  FaBell,
  FaHome,
  FaFileAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaCog,
  FaPlus,
  FaDownload,
  FaSearch,
} from "react-icons/fa";
import { Context } from "@/context/ProductContext.jsx";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";

export default function AdminPanel() {
  const location = useLocation();
  const { backendUrl, user, setUserDetails } = useContext(Context);

  const socketRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [shake, setShake] = useState(false);
  const [onlineAdmins, setOnlineAdmins] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  /* ================= FETCH AUTH USER ================= */
  const fetchUser = useCallback(async () => {
    if (user) return setLoading(false);

    try {
      const res = await fetch(`${backendUrl}/user/user-details`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUserDetails(data.user);
    } catch (err) {
      console.error("Auth fetch failed:", err.message);
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  }, [backendUrl, user, setUserDetails]);

  /* ================= FETCH NOTIFICATIONS ================= */
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/order/notifications`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Notification fetch error:", error.message);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /* ================= SOCKET SETUP ================= */
  useEffect(() => {
    if (!user || socketRef.current) return;

    fetchNotifications();

    const socket = io(socketUrl, {
      transports: ["websocket"],
      withCredentials: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on("connect", () => console.log("Socket connected:", socket.id));

    socket.on("new-order", (order) => {
      // Add to notification list
      setNotifications((prev) => [{ ...order, isRead: false }, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      
      // Play sound
      new Audio("/notification.mp3").play().catch(() => {});
      
      // SHOW TOAST NOTIFICATION - This is the key addition!
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-bold">🛒 New Order Received!</span>
          <span className="text-sm">{order.customer} ordered {order.product}</span>
          <span className="text-xs text-slate-500">KES {order.amount?.toLocaleString() || '0'}</span>
        </div>,
        {
          duration: 6000,
          position: 'top-right',
          icon: '🎉',
          style: {
            borderRadius: '12px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          },
        }
      );
    });

    socket.on("admins-online", (count) => setOnlineAdmins(count));
    socket.on("connect_error", (err) => console.error("Socket error:", err.message));
    socket.on("unauthorized", () => (window.location.href = "/login"));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, fetchNotifications]);

  /* ================= TOGGLE NOTIFICATIONS ================= */
  const handleNotificationToggle = async () => {
    const isOpening = !notificationsOpen;
    setNotificationsOpen(isOpening);

    if (isOpening && unreadCount > 0) {
      try {
        await fetch(`${backendUrl}/order/notifications/read`, {
          method: "PUT",
          credentials: "include",
        });
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } catch (err) {
        console.error("Mark read failed:", err.message);
      }
    }
  };

  /* ================= NAVIGATION ================= */
  const navItems = [
    { icon: FaHome, label: "Dashboard", to: "/admin-panel" },
    { icon: FaUsers, label: "Users", to: "/admin-panel/all-users" },
    { icon: FaBox, label: "Products", to: "/admin-panel/all-products" },
    { icon: FaShoppingCart, label: "Orders", to: "/admin-panel/orders" },
    { icon: FaDollarSign, label: "Revenue", to: "/admin-panel/revenue" },
    { icon: FaFileAlt, label: "Reports", to: "/admin-panel/reports" },
  ];

  const getStatusColor = (status = "") => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "processing":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin-panel") return "Dashboard Overview";
    if (path.includes("users")) return "User Management";
    if (path.includes("products")) return "Products Management";
    if (path.includes("orders")) return "Orders Management";
    if (path.includes("revenue")) return "Revenue Analytics";
    if (path.includes("reports")) return "Reports & Insights";
    return "Dashboard";
  };

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-600 font-medium">Loading...</span>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800">
      {/* TOASTER FOR NOTIFICATIONS */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            maxWidth: '400px',
          },
        }}
      />

      {/* SIDEBAR - Fixed Position */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen z-50 bg-white/80 backdrop-blur-xl border-r border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden"
      >
        {/* Glass overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/30 via-transparent to-purple-50/20 pointer-events-none" />
        
        {/* LOGO SECTION */}
        <div className="relative z-10 flex items-center justify-center py-6 border-b border-slate-100/80 shrink-0">
          <motion.div
            initial={false}
            animate={{ scale: sidebarOpen ? 1 : 0.85 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"
              />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    AdminPro
                  </h1>
                  <p className="text-xs text-slate-400">Management System</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* USER INFO CARD */}
        <div className="relative z-10 px-4 py-4 shrink-0">
          <motion.div
            initial={false}
            animate={{ 
              padding: sidebarOpen ? "16px" : "12px 8px",
              borderRadius: sidebarOpen ? "16px" : "12px"
            }}
            className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm border border-white/30">
                  {user?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="font-semibold text-sm text-white truncate">
                      {user?.name || "Admin"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-[10px] text-white/90 font-medium">
                        {user?.role || "Admin"}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/70 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      {onlineAdmins} online
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* NAVIGATION - Scrollable */}
        <nav className="relative z-10 flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent min-h-0">
          <div className="mb-4">
            <AnimatePresence>
              {sidebarOpen && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider"
                >
                  Main Menu
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
            const isHovered = hoveredItem === idx;
            
            return (
              <Link
                key={idx}
                to={item.to}
                onMouseEnter={() => setHoveredItem(idx)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative block"
              >
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: active 
                      ? "rgba(99, 102, 241, 0.1)" 
                      : isHovered 
                        ? "rgba(99, 102, 241, 0.05)" 
                        : "transparent",
                    x: isHovered ? 4 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    active 
                      ? "text-indigo-600" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {/* Active indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  {/* Icon container */}
                  <motion.div
                    animate={{
                      scale: isHovered ? 1.1 : 1,
                      rotate: isHovered ? 5 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={`relative flex items-center justify-center w-10 h-10 rounded-lg ${
                      active
                        ? "bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30"
                        : "bg-slate-100"
                    }`}
                  >
                    <Icon 
                      className={`text-lg ${active ? "text-white" : ""}`} 
                    />
                    {active && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 rounded-lg bg-white/20"
                      />
                    )}
                  </motion.div>
                  
                  {/* Label */}
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`font-medium text-sm whitespace-nowrap ${
                          active ? "font-semibold" : ""
                        }`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Active dot for collapsed state */}
                  {!sidebarOpen && active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM ACTIONS - Fixed at bottom */}
        <div className="relative z-10 p-3 border-t border-slate-100/80 space-y-1 shrink-0 bg-white/80 backdrop-blur-xl">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all duration-200 ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <FaCog className="text-lg" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm font-medium"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <FaSignOutAlt className="text-lg" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm font-medium"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* TOGGLE BUTTON */}
        <div className="relative z-10 p-3 border-t border-slate-100/80 shrink-0 bg-white/80 backdrop-blur-xl">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="flex items-center justify-center w-full py-2.5 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-xl text-slate-500 transition-all duration-200 shadow-sm"
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <FaChevronLeft className="text-sm" />
            </motion.div>
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT - Offset by sidebar width */}
      <div 
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 280 : 80 }}
      >
        {/* HEADER - Fixed Sticky Header Matching Dashboard Style */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.04)] px-6 py-4"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {getPageTitle()}
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                {location.pathname === "/admin-panel" 
                  ? "Welcome back! Here's what's happening with your store."
                  : "Manage and monitor your business operations efficiently."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Time Range Selector - Only show on Dashboard */}
              {location.pathname === "/admin-panel" && (
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
              )}

              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100/80 rounded-full">
                <FaSearch className="text-slate-400 text-sm" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent text-sm outline-none placeholder:text-slate-400 w-32"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNotificationToggle}
                  className="relative p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 transition-colors"
                >
                  <FaBell className={`text-lg text-slate-600 ${shake ? "animate-bounce" : ""}`} />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-1.5 rounded-full shadow-lg shadow-rose-500/30"
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="absolute right-0 mt-3 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/50 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-800">Notifications</h4>
                          <span className="text-xs text-slate-400">{notifications.length} new</span>
                        </div>
                      </div>
                      <ul className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                        {notifications.length === 0 ? (
                          <li className="p-8 text-center">
                            <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
                              <FaBell className="text-slate-400" />
                            </div>
                            <p className="text-sm text-slate-500">No notifications yet</p>
                          </li>
                        ) : (
                          notifications.map((n, i) => (
                            <motion.li
                              key={n._id || n.id || i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className={`p-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${
                                !n.isRead ? "bg-indigo-50/30" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm ${!n.isRead ? "font-medium text-slate-800" : "text-slate-600"}`}>
                                    <span className="text-indigo-600">{n.customer}</span> ordered{" "}
                                    <span className="truncate">{n.product}</span>
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">Just now</p>
                                </div>
                                <span
                                  className={`shrink-0 px-2 py-1 text-[10px] font-medium rounded-full border ${getStatusColor(
                                    n.status
                                  )}`}
                                >
                                  {n.status}
                                </span>
                              </div>
                            </motion.li>
                          ))
                        )}
                      </ul>
                      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                        <button className="w-full py-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Quick Access */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.[0]?.toUpperCase() || "A"}
                </div>
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* PAGE CONTENT - Scrollable */}
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}