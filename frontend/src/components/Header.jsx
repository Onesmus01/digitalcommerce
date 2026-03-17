

import React, { useState, useRef, useEffect, useContext } from "react";
import Logo from "./Logo";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  Home,
  Box,
  Settings,
  CreditCard,
  LogOut,
  Bell,
  Heart,
  ChevronDown,
  Sparkles,
  Zap,
  TrendingUp,
  Shield,
  MapPin,
  Search as SearchIcon,
  ArrowRight,
  Tag,
  Star,
  Flame,
  Package,
  Truck,
  CheckCircle,
  Check,
  Grid3X3,
  Layers,
  ChevronRight
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { setUserDetails } from "../../store/userSlice.js";
import Context from "@/context/index.js";
import { io } from "socket.io-client";
import { formatDistanceToNow } from "date-fns";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ===================== NEW: Sound Effect =====================
const playNotificationSound = (type) => {
  const sounds = {
    new_product: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
    order_update: 'https://assets.mixkit.co/active_storage/sfx/2868/2868-preview.mp3',
    default: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
  };
  
  const audio = new Audio(sounds[type] || sounds.default);
  audio.volume = 0.4;
  audio.play().catch(err => console.log('Audio play failed:', err));
};

// ===================== NEW: Notification Toast =====================
const NotificationToast = ({ t, title, message, type, data }) => {
  const icons = {
    new_product: <Sparkles className="w-5 h-5 text-violet-500" />,
    order_update: <Package className="w-5 h-5 text-amber-500" />,
    shipped: <Truck className="w-5 h-5 text-blue-500" />,
    delivered: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    processing: <Package className="w-5 h-5 text-amber-500" />,
    default: <Bell className="w-5 h-5 text-slate-500" />
  };

  const gradients = {
    new_product: 'from-violet-500/20 to-pink-500/20 border-violet-200',
    order_update: 'from-blue-500/20 to-cyan-500/20 border-blue-200',
    delivered: 'from-emerald-500/20 to-teal-500/20 border-emerald-200',
    shipped: 'from-blue-500/20 to-indigo-500/20 border-blue-200',
    processing: 'from-amber-500/20 to-orange-500/20 border-amber-200',
    default: 'from-slate-500/20 to-gray-500/20 border-slate-200'
  };

  const handleClick = () => {
    if (data?.productId) {
      window.location.href = `/product/${data.productId}`;
    } else if (data?.orderId) {
      window.location.href = `/my-orders`;
    }
    toast.dismiss(t.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100 }}
      onClick={handleClick}
      className={`max-w-sm w-full bg-white rounded-2xl shadow-2xl border-2 overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform bg-gradient-to-br ${gradients[type] || gradients.default}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-xl shadow-lg">
            {icons[type] || icons.default}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 text-sm mb-1">{title}</h4>
            <p className="text-slate-600 text-xs line-clamp-2">{message}</p>
            {data?.image && (
              <img 
                src={data.image} 
                alt="" 
                className="w-10 h-10 rounded-lg object-cover mt-2 border border-slate-200"
              />
            )}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toast.dismiss(t.id);
            }}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={14} className="text-slate-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ===================== NEW: Notification Bell Component =====================
const NotificationBell = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return;

    const socket = io(backendUrl, {
      withCredentials: true,
      query: { userId: user._id }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔔 Notification socket connected');
      socket.emit('join', `user_${user._id}`);
    });

    socket.on('new-product-added', (data) => {
      console.log('🛍️ New product:', data);
      playNotificationSound('new_product');
      showToast(data.title || 'New Product!', data.message || 'Check it out!', 'new_product', data);
      addNotification(data);
    });

    socket.on('user-order-status', (data) => {
      console.log('📦 Order status:', data);
      playNotificationSound('order_update');
      const title = `Order ${data.status}`;
      showToast(title, data.message || `Your order is now ${data.status}`, data.status || 'order_update', data);
      addNotification({
        ...data,
        title,
        type: 'order_update',
        createdAt: new Date()
      });
    });

    fetchNotifications();

    return () => socket.close();
  }, [user?._id]);

  const showToast = (title, message, type, data) => {
    toast.custom((t) => (
      <NotificationToast t={t} title={title} message={message} type={type} data={data} />
    ), { duration: 6000, position: 'top-right' });
  };

  const addNotification = (data) => {
    setNotifications(prev => [{
      _id: Date.now(),
      title: data.title,
      message: data.message,
      type: data.type || 'general',
      data: data,
      read: false,
      createdAt: new Date()
    }, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${backendUrl}/order/user-notifications`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`${backendUrl}/order/notifications/${notificationId}/read`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${backendUrl}/order/notifications/${user._id}/read-all`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type, status) => {
    if (type === 'new_product') return <Sparkles className="w-4 h-4 text-violet-500" />;
    if (status === 'shipped') return <Truck className="w-4 h-4 text-blue-500" />;
    if (status === 'delivered') return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (status === 'processing') return <Package className="w-4 h-4 text-amber-500" />;
    return <Bell className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex w-11 h-11 items-center justify-center rounded-xl bg-slate-50 hover:bg-violet-50 border border-transparent hover:border-violet-200 text-slate-600 hover:text-violet-600 transition-all shadow-sm hover:shadow-md group relative"
      >
        <Bell size={20} strokeWidth={2} className="transition-transform group-hover:scale-110" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"
            />
          )}
        </AnimatePresence>
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Notifications
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden z-50"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div>
                <h3 className="font-bold text-slate-800">Notifications</h3>
                <p className="text-xs text-slate-500">{unreadCount} unread</p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-violet-50 transition-colors"
                >
                  <Check size={12} /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[350px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {notifications.map((notif) => (
                    <motion.div
                      key={notif._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.read ? 'bg-violet-50/30' : ''}`}
                      onClick={() => {
                        if (!notif.read) markAsRead(notif._id);
                        if (notif.data?.productId) {
                          window.location.href = `/product/${notif.data.productId}`;
                        } else if (notif.data?.orderId) {
                          window.location.href = `/my-orders`;
                        }
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl ${!notif.read ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                          {getNotificationIcon(notif.type, notif.data?.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-800 mb-1 flex items-center gap-2">
                            {notif.title}
                            {!notif.read && <span className="w-2 h-2 bg-violet-500 rounded-full" />}
                          </p>
                          <p className="text-xs text-slate-600 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50">
              <Link 
                to="/notifications" 
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm font-semibold text-violet-600 hover:text-violet-700 py-2 rounded-xl hover:bg-white transition-colors"
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===================== NEW: Categories Dropdown Component (SHOWS ALL) =====================
const CategoriesDropdown = ({ categories, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-600">
        <div className="p-1.5 rounded-lg bg-slate-100">
          <Grid3X3 size={16} className="text-slate-400 animate-pulse" />
        </div>
        <span className="font-semibold text-sm">Categories</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => setIsOpen(true)}
        className={`hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
          isOpen 
            ? "bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-600" 
            : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
        }`}
      >
        <div className={`p-1.5 rounded-lg transition-all ${
          isOpen
            ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/30"
            : "bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600"
        }`}>
          <Grid3X3 size={16} strokeWidth={2} />
        </div>
        <span className="font-semibold text-sm">Categories</span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onMouseLeave={() => setIsOpen(false)}
            className="absolute top-full left-0 mt-3 w-[700px] bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-md shadow-violet-500/30">
                  <Layers size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Browse All Categories</h3>
                  <p className="text-xs text-slate-500">{categories.length} categories available</p>
                </div>
              </div>
              <Link 
                to="/categories"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-violet-50 transition-colors"
              >
                View All <ArrowRight size={12} />
              </Link>
            </div>

            {/* ALL Categories Grid - 4 columns, ALL items */}
            <div className="p-5 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-4 gap-4">
                {categories.map((cat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Link
                      to={`/product-category/${cat?.category}`}
                      onClick={() => setIsOpen(false)}
                      className="flex flex-col items-center gap-3 p-3 rounded-2xl transition-all duration-300 group hover:bg-slate-50"
                    >
                      <div className={`relative w-16 h-16 rounded-2xl overflow-hidden transition-all duration-300 ${
                        hoveredIndex === index 
                          ? 'scale-110 shadow-xl shadow-gray-400/20 ring-2 ring-violet-500 ring-offset-2' 
                          : 'scale-100 shadow-md shadow-gray-200/50'
                      }`}>
                        <div className={`absolute inset-0 transition-all duration-300 ${
                          hoveredIndex === index 
                            ? 'bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-500' 
                            : 'bg-gradient-to-br from-gray-50 to-gray-100'
                        }`} />
                        <img
                          src={cat.productImage}
                          alt={cat.category}
                          className={`relative w-full h-full p-3 object-contain transition-all duration-300 ${
                            hoveredIndex === index 
                              ? 'scale-110 drop-shadow-lg brightness-110' 
                              : 'scale-100 grayscale-[20%]'
                          }`}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-x-[-100%] transition-transform duration-700 ${
                          hoveredIndex === index ? 'translate-x-[100%]' : ''
                        }`} />
                      </div>
                      <span className={`text-xs font-medium text-center capitalize transition-all duration-300 px-2 py-1 rounded-full whitespace-nowrap ${
                        hoveredIndex === index 
                          ? 'text-violet-700 bg-violet-50 font-semibold' 
                          : 'text-slate-600 group-hover:text-slate-800'
                      }`}>
                        {cat.category}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                <Sparkles size={14} className="text-violet-500" />
                <span>Discover {categories.length} amazing categories</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===================== Animated Cart Badge (ORIGINAL) =====================
const CartBadge = ({ count }) => (
  <motion.span
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 500, damping: 15 }}
    className="absolute -top-2 -right-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[10px] font-bold min-w-[22px] h-[22px] flex items-center justify-center rounded-full shadow-lg shadow-rose-500/40 border-2 border-white px-1"
  >
    {count > 99 ? "99+" : count}
  </motion.span>
);

// ===================== User Avatar with Glow (ORIGINAL) =====================
const UserAvatar = ({ user, onClick, size = "md" }) => {
  const sizes = {
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-14 h-14",
    xl: "w-20 h-20"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${sizes[size]} rounded-full cursor-pointer relative overflow-hidden bg-gradient-to-tr from-violet-600 via-purple-600 to-fuchsia-500 shadow-[0_0_25px_rgba(139,92,246,0.5)] ring-[3px] ring-white`}
    >
      {user?.profilePic ? (
        <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">
            {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <div className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
    </motion.div>
  );
};

// ===================== Main Header (ORIGINAL STYLING PRESERVED) =====================
const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const context = useContext(Context);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  
  // ===================== NEW: Categories State =====================
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  
  const userMenuRef = useRef();
  const searchRef = useRef();

  // Popular search suggestions
  const suggestions = [
    { text: "Wireless Headphones", icon: Tag },
    { text: "Smart Watch", icon: Star },
    { text: "Gaming Laptop", icon: Flame },
    { text: "Running Shoes", icon: Zap },
  ];

  // ===================== NEW: Fetch Categories =====================
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch(`${backendUrl}/product/get-product-category`, {
        method: 'GET',
        credentials: 'include',
      });
      const responseData = await response.json();

      if (responseData.success) {
        setCategories(responseData.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    setShowSearchSuggestions(false);
  }, [location.pathname]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearchSuggestions(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${backendUrl}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(setUserDetails(null));
        toast.success(data.message || "Logged out successfully");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <>
      {/* ===================== ANNOUNCEMENT BAR (ORIGINAL) ===================== */}
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-violet-600 via-purple-600 via-pink-500 to-rose-500 text-white"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 py-2 text-xs sm:text-sm">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={14} className="text-yellow-300" />
            </motion.div>
            <span className="font-semibold">🎉 Free shipping on orders over $50!</span>
            <span className="hidden sm:inline text-white/70">| Use code:</span>
            <span className="hidden sm:inline px-2 py-0.5 bg-white/20 rounded-md font-bold">FREESHIP</span>
          </div>
        </div>
      </motion.div>

      {/* ===================== MAIN HEADER (ORIGINAL STYLING) ===================== */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-9 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border-b border-slate-200/50"
            : "bg-white"
        }`}
      >
        {/* Top Row - Logo, Search, Actions */}
        <div className="border-b border-slate-100">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 gap-2 sm:gap-4">
              
              {/* LEFT: Logo & Mobile Menu */}
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-white border border-slate-200 text-slate-700 hover:text-violet-600 hover:border-violet-200 transition-all shadow-sm"
                >
                  <Menu size={20} strokeWidth={2} />
                </motion.button>

                <Link to="/" className="flex-shrink-0">
                  <motion.div whileHover={{ scale: 1.02 }} className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 blur-2xl opacity-0 hover:opacity-100 transition-opacity rounded-full" />
                    <span className="hidden md:inline-block">
                      <Logo className="w-[85px] lg:w-[110px] h-auto" />
                    </span>
                    <span className="md:hidden font-black text-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                      DITC
                    </span>
                  </motion.div>
                </Link>
              </div>

              {/* CENTER: Prominent Search Bar */}
              <div ref={searchRef} className="flex-1 max-w-2xl mx-2 sm:mx-4 lg:mx-8 relative">
                <form onSubmit={handleSearch} className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <SearchIcon size={20} className={`transition-colors ${isSearchFocused ? 'text-violet-500' : 'text-slate-400'}`} />
                  </div>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      setIsSearchFocused(true);
                      setShowSearchSuggestions(true);
                    }}
                    placeholder="Search for products, brands, categories..."
                    className={`w-full pl-12 pr-28 sm:pr-32 py-3 sm:py-3.5 bg-slate-50 hover:bg-white border-2 ${
                      isSearchFocused ? 'border-violet-400 bg-white shadow-lg shadow-violet-500/10' : 'border-slate-200'
                    } rounded-2xl text-sm sm:text-base transition-all duration-300 outline-none placeholder:text-slate-400`}
                  />

                  <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                    <span className="hidden sm:flex px-2 py-1 bg-slate-200 rounded-lg text-[10px] font-bold text-slate-500">
                      ⌘K
                    </span>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl shadow-md shadow-violet-500/30"
                    >
                      <ArrowRight size={18} />
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {showSearchSuggestions && isSearchFocused && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50"
                      >
                        <div className="p-4">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Popular Searches
                          </p>
                          <div className="space-y-2">
                            {suggestions.map((item, idx) => (
                              <motion.button
                                key={idx}
                                type="button"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => {
                                  setSearchQuery(item.text);
                                  navigate(`/search?q=${encodeURIComponent(item.text)}`);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                              >
                                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600 group-hover:from-violet-500 group-hover:to-purple-600 group-hover:text-white transition-all">
                                  <item.icon size={16} />
                                </div>
                                <span className="text-slate-700 font-medium">{item.text}</span>
                                <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-violet-500 transition-colors" />
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>

              {/* RIGHT: Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                
                <motion.button
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => navigate("/wishlist")}
                  className="hidden sm:flex w-11 h-11 items-center justify-center rounded-xl bg-slate-50 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-slate-600 hover:text-rose-500 transition-all shadow-sm hover:shadow-md group relative"
                >
                  <Heart size={20} strokeWidth={2} className="transition-transform group-hover:scale-110" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Wishlist
                  </span>
                </motion.button>

                {user?._id && <NotificationBell user={user} />}

                <motion.button
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => navigate("/cart")}
                  className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 border border-violet-100 text-violet-600 hover:text-violet-700 transition-all shadow-sm hover:shadow-md group"
                >
                  <ShoppingCart size={21} strokeWidth={2} className="transition-transform group-hover:scale-110" />
                  {user?._id && context.cartProductCount > 0 && (
                    <CartBadge count={context.cartProductCount} />
                  )}
                </motion.button>

                <div className="hidden md:flex items-center ml-1" ref={userMenuRef}>
                  {user?._id ? (
                    <div className="relative">
                      <motion.button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-2 lg:gap-3 p-1.5 pr-3 lg:pr-4 rounded-full bg-slate-50 hover:bg-white border border-slate-200 hover:border-violet-200 transition-all shadow-sm hover:shadow-md"
                      >
                        <UserAvatar user={user} size="sm" />
                        <div className="hidden lg:block text-left">
                          <p className="text-sm font-bold text-slate-800 leading-tight">
                            {user.name?.split(' ')[0] || "User"}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">
                            {user.role || "Member"}
                          </p>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`text-slate-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                        />
                      </motion.button>

                      <AnimatePresence>
                        {isUserMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden z-50"
                          >
                            <div className="relative p-6 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 overflow-hidden">
                              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                              <div className="relative flex items-center gap-4">
                                <UserAvatar user={user} size="lg" />
                                <div className="text-white">
                                  <p className="font-bold text-lg">{user.name || "User"}</p>
                                  <p className="text-sm text-white/80 truncate max-w-[150px]">{user.email}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold uppercase">
                                      {user.role || "Customer"}
                                    </span>
                                    {user.role === "ADMIN" && <Shield size={12} className="text-yellow-300" />}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-px bg-slate-100">
                              {[
                                { label: "Orders", value: "12" },
                                { label: "Points", value: "2.5K" },
                                { label: "Saved", value: "8" },
                              ].map((stat, i) => (
                                <div key={i} className="bg-white p-4 text-center">
                                  <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                </div>
                              ))}
                            </div>

                            <div className="p-3 space-y-1">
                              <DropdownItem to="/my-orders" icon={CreditCard} label="My Orders" desc="Track purchases" color="violet" />
                              <DropdownItem to="/wishlist" icon={Heart} label="Wishlist" desc="Saved items" color="rose" />
                              <DropdownItem to="/manage-account" icon={Settings} label="Settings" desc="Account settings" color="slate" />
                              
                              {user.role === "ADMIN" && (
                                <>
                                  <div className="my-2 border-t border-slate-100" />
                                  <DropdownItem to="/admin-panel" icon={Sparkles} label="Admin Panel" desc="Manage store" color="purple" highlight />
                                </>
                              )}
                              
                              <div className="my-2 border-t border-slate-100" />
                              <motion.button
                                whileHover={{ x: 4 }}
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 text-rose-600 transition-all"
                              >
                                <div className="p-2 rounded-lg bg-rose-100">
                                  <LogOut size={18} />
                                </div>
                                <div className="text-left">
                                  <p className="font-semibold text-sm">Sign Out</p>
                                  <p className="text-xs text-rose-400">See you soon!</p>
                                </div>
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        to="/login"
                        className="px-5 py-2.5 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-violet-500/30 transition-all flex items-center gap-2"
                      >
                        <User size={18} strokeWidth={2.5} />
                        <span className="hidden sm:inline">Sign In</span>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Navigation (Desktop) */}
        <div className="hidden lg:block border-t border-slate-100">
          <div className="container mx-auto px-4 lg:px-6">
            <nav className="flex items-center gap-1 py-2">
              <NavLink to="/" icon={Home} label="Home" />
              
              {/* ===================== CATEGORIES DROPDOWN (ALL CATEGORIES) ===================== */}
              <CategoriesDropdown categories={categories} loading={categoriesLoading} />
              
              <NavLink to="/all-products" icon={Box} label="Products" />
              <NavLink to="/hot-deals" icon={Zap} label="Deals" badge="HOT" />
              <NavLink to="/new-arrivals" icon={TrendingUp} label="New Arrivals" />
              {user?._id && <NavLink to="/my-orders" icon={CreditCard} label="My Orders" />}
            </nav>
          </div>
        </div>
      </motion.header>

      <div className="h-[110px] sm:h-[120px] lg:h-[145px]" />

      {/* ===================== MOBILE MENU (ALL CATEGORIES DISPLAYED) ===================== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 w-[320px] h-full bg-white z-[80] overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="relative p-5 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="flex justify-between items-start mb-4">
                  <span className="font-black text-2xl text-white tracking-tight">MENU</span>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <X size={20} className="text-white" />
                  </motion.button>
                </div>
                {user?._id ? (
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} size="lg" />
                    <div className="text-white">
                      <p className="font-bold">{user.name || "User"}</p>
                      <p className="text-xs text-white/80">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-violet-600 font-bold rounded-full shadow-lg">
                    <User size={18} /> Sign In
                  </Link>
                )}
              </div>

              {/* Nav - Scrollable */}
              <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-180px)] pb-20">
                <MobileNavLink to="/" icon={Home} label="Home" onClick={() => setIsMobileMenuOpen(false)} />
                
                {/* ===================== ALL CATEGORIES SECTION (MOBILE) ===================== */}
                {categories.length > 0 && (
                  <>
                    <div className="my-4 px-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">All Categories</p>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{categories.length}</span>
                      </div>
                      
                      {/* Scrollable horizontal categories */}
                      <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {categories.map((cat, idx) => (
                          <Link
                            key={idx}
                            to={`/product-category/${cat?.category}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-violet-50 transition-all group snap-start w-[85px]"
                          >
                            <div className="w-14 h-14 rounded-xl bg-white shadow-sm p-2 flex items-center justify-center group-hover:shadow-md transition-all group-hover:scale-105">
                              <img
                                src={cat.productImage}
                                alt={cat.category}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                            <span className="text-[10px] font-medium text-slate-600 text-center capitalize line-clamp-2 leading-tight">
                              {cat.category}
                            </span>
                          </Link>
                        ))}
                      </div>
                      
                      <Link
                        to="/categories"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="mt-3 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors"
                      >
                        View All Categories <ChevronRight size={16} />
                      </Link>
                    </div>
                    <div className="my-3 border-t border-slate-100" />
                  </>
                )}
                
                <MobileNavLink to="/all-products" icon={Box} label="Products" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink to="/hot-deals" icon={Zap} label="Hot Deals" badge="NEW" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink to="/new-arrivals" icon={TrendingUp} label="New Arrivals" onClick={() => setIsMobileMenuOpen(false)} />
                {user?._id && (
                  <>
                    <div className="my-4 border-t border-slate-100" />
                    <MobileNavLink to="/my-orders" icon={CreditCard} label="My Orders" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavLink to="/wishlist" icon={Heart} label="Wishlist" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavLink to="/manage-account" icon={Settings} label="Settings" onClick={() => setIsMobileMenuOpen(false)} />
                  </>
                )}
                
                {user?.role === "ADMIN" && (
                  <>
                    <div className="my-4 border-t border-slate-100" />
                    <MobileNavLink to="/admin-panel" icon={Sparkles} label="Admin Panel" highlight onClick={() => setIsMobileMenuOpen(false)} />
                  </>
                )}
                
                {user?._id && (
                  <>
                    <div className="my-4 border-t border-slate-100" />
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 font-semibold"
                    >
                      <div className="p-2.5 rounded-xl bg-rose-100"><LogOut size={20} /></div>
                      Sign Out
                    </motion.button>
                  </>
                )}
              </nav>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100">
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <MapPin size={16} />
                  <span className="text-xs">Free shipping worldwide</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ===================== Nav Link (ORIGINAL) =====================
const NavLink = ({ to, icon: Icon, label, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
        isActive
          ? "bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-600"
          : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
      }`}
    >
      <div className={`p-1.5 rounded-lg transition-all ${
        isActive
          ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/30"
          : "bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600"
      }`}>
        <Icon size={16} strokeWidth={2} />
      </div>
      <span className="font-semibold text-sm">{label}</span>
      {badge && (
        <span className="ml-1 px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full">
          {badge}
        </span>
      )}
      {isActive && (
        <motion.div
          layoutId="navIndicator"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-violet-500 rounded-full"
        />
      )}
    </Link>
  );
};

// ===================== Dropdown Item (ORIGINAL) =====================
const DropdownItem = ({ to, icon: Icon, label, desc, color, highlight }) => {
  const colors = {
    violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-100",
    rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-100",
    slate: "bg-slate-100 text-slate-600 group-hover:bg-slate-200",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
  };

  return (
    <motion.div whileHover={{ x: 4 }}>
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
          highlight ? "bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100" : "hover:bg-slate-50"
        }`}
      >
        <div className={`p-2 rounded-lg transition-colors ${colors[color]}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <p className={`font-semibold text-sm ${highlight ? "text-violet-700" : "text-slate-700"}`}>{label}</p>
          <p className="text-xs text-slate-400">{desc}</p>
        </div>
        {highlight && <Sparkles size={14} className="text-violet-400" />}
      </Link>
    </motion.div>
  );
};

// ===================== Mobile Nav Link (ORIGINAL) =====================
const MobileNavLink = ({ to, icon: Icon, label, onClick, badge, highlight }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
          isActive
            ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25"
            : highlight
              ? "bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 border border-violet-100"
              : "hover:bg-slate-50 text-slate-700"
        }`}
      >
        <div className={`p-2.5 rounded-xl ${isActive ? "bg-white/20" : highlight ? "bg-violet-100" : "bg-slate-100"}`}>
          <Icon size={20} className={isActive ? "text-white" : ""} />
        </div>
        <span className="font-semibold flex-1">{label}</span>
        {badge && <span className="px-2 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-full">{badge}</span>}
        {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
      </Link>
    </motion.div>
  );
};

export default Header;