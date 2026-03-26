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

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";

// 🔥 HELPER: Get auth headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Sound Effect
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

// Notification Toast Component
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
              <img src={data.image} alt="" className="w-10 h-10 rounded-lg object-cover mt-2 border border-slate-200" />
            )}
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); toast.dismiss(t.id); }}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={14} className="text-slate-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Notification Bell Component
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
      socket.emit('join', `user_${user._id}`);
    });

    socket.on('new-product-added', (data) => {
      playNotificationSound('new_product');
      showToast(data.title || 'New Product!', data.message || 'Check it out!', 'new_product', data);
      addNotification(data);
    });

    socket.on('user-order-status', (data) => {
      playNotificationSound('order_update');
      const title = `Order ${data.status}`;
      showToast(title, data.message || `Your order is now ${data.status}`, data.status || 'order_update', data);
      addNotification({ ...data, title, type: 'order_update', createdAt: new Date() });
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
        credentials: 'include',
        headers: getAuthHeaders(), // 🔥 Added auth headers
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
      await fetch(`${backendUrl}/order/notifications/${notificationId}/read`, { 
        method: 'PUT',
        credentials: 'include',
        headers: getAuthHeaders(), // 🔥 Added auth headers
      });
      setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${backendUrl}/order/notifications/${user._id}/read-all`, { 
        method: 'PUT',
        credentials: 'include',
        headers: getAuthHeaders(), // 🔥 Added auth headers
      });
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-lg sm:rounded-xl bg-slate-50 hover:bg-violet-50 border border-transparent hover:border-violet-200 text-slate-600 hover:text-violet-600 transition-all shadow-sm relative"
      >
        <Bell size={18} strokeWidth={2} />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"
            />
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
          >
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                <p className="text-xs text-slate-500">{unreadCount} unread</p>
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1 px-2 py-1 rounded-full hover:bg-violet-100 transition-colors">
                  <Check size={12} /> Mark read
                </button>
              )}
            </div>

            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {notifications.map((notif) => (
                    <motion.div
                      key={notif._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.read ? 'bg-violet-50/30' : ''}`}
                      onClick={() => {
                        if (!notif.read) markAsRead(notif._id);
                        if (notif.data?.productId) window.location.href = `/product/${notif.data.productId}`;
                        else if (notif.data?.orderId) window.location.href = `/my-orders`;
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`p-1.5 rounded-lg ${!notif.read ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                          {getNotificationIcon(notif.type, notif.data?.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs text-slate-800 mb-0.5 flex items-center gap-1">
                            {notif.title}
                            {!notif.read && <span className="w-1.5 h-1.5 bg-violet-500 rounded-full" />}
                          </p>
                          <p className="text-[11px] text-slate-600 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Cart Badge Component
const CartBadge = ({ count }) => (
  <motion.span
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[9px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-lg border-2 border-white px-1"
  >
    {count > 99 ? "99+" : count}
  </motion.span>
);

// User Avatar Component
const UserAvatar = ({ user, onClick, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-9 h-9 sm:w-10 sm:h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${sizes[size]} rounded-full cursor-pointer relative overflow-hidden bg-gradient-to-tr from-violet-600 via-purple-600 to-fuchsia-500 ring-2 ring-white shadow-md`}
    >
      {user?.profilePic ? (
        <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white font-bold text-sm sm:text-base">
            {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </motion.div>
  );
};

// ===================== MAIN HEADER COMPONENT =====================
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

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const userMenuRef = useRef();
  const mobileMenuRef = useRef();

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch(`${backendUrl}/product/get-product-category`, {
        method: 'GET',
        credentials: 'include',
        headers: getAuthHeaders(), // 🔥 Added auth headers
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
  }, [location.pathname]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && isMobileMenuOpen) {
        if (e.target.classList.contains('mobile-overlay')) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/user/logout`, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(), // 🔥 Using helper for auth headers
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem("token"); // 🔥 Clear token on logout
        dispatch(setUserDetails(null));
        toast.success(data.message || "Logged out successfully");
        navigate("/login");
        setIsMobileMenuOpen(false);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Announcement Bar */}
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 text-white h-[28px] sm:h-[32px] flex items-center"
      >
        <div className="container mx-auto px-3">
          <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs">
            <Sparkles size={12} className="text-yellow-300 flex-shrink-0" />
            <span className="font-medium truncate">Free shipping on orders over $50!</span>
            <span className="hidden sm:inline text-white/70 flex-shrink-0">| Code: <span className="font-bold bg-white/20 px-1.5 rounded">FREESHIP</span></span>
          </div>
        </div>
      </motion.div>

      {/* Main Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-[28px] sm:top-[32px] left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/50"
            : "bg-white"
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">

            {/* Left: Menu & Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
              >
                <Menu size={20} />
              </motion.button>

              <Link to="/" className="flex-shrink-0">
                <span className="hidden md:inline-block">
                  <Logo className="w-20 lg:w-28 h-auto" />
                </span>
                <span className="md:hidden font-black text-xl bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
                  DITC
                </span>
              </Link>
            </div>

            {/* Center: Search - Desktop Only */}
            <div className="hidden lg:block flex-1 max-w-xl mx-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-violet-400 focus:bg-white focus:outline-none transition-all"
                />
                <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
                >
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/wishlist")}
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-500 transition-colors"
              >
                <Heart size={18} />
              </motion.button>

              {user?._id && <NotificationBell user={user} />}

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/cart")}
                className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors"
              >
                <ShoppingCart size={18} />
                {user?._id && context.cartProductCount > 0 && (
                  <CartBadge count={context.cartProductCount} />
                )}
              </motion.button>

              <div className="hidden md:block" ref={userMenuRef}>
                {user?._id ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-50 hover:bg-white border border-slate-200 transition-all"
                    >
                      <UserAvatar user={user} size="sm" />
                      <span className="text-sm font-semibold text-slate-700 hidden lg:block">
                        {user.name?.split(' ')[0] || "User"}
                      </span>
                      <ChevronDown size={14} className={`text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                        >
                          <div className="p-4 bg-gradient-to-br from-violet-600 to-fuchsia-500">
                            <div className="flex items-center gap-3">
                              <UserAvatar user={user} size="lg" />
                              <div className="text-white">
                                <p className="font-bold text-sm">{user.name || "User"}</p>
                                <p className="text-xs text-white/80 truncate w-32">{user.email}</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-2">
                            <DropdownItem to="/my-orders" icon={CreditCard} label="My Orders" />
                            <DropdownItem to="/wishlist" icon={Heart} label="Wishlist" />
                            <DropdownItem to="/manage-account" icon={Settings} label="Settings" />
                            {user.role === "ADMIN" && (
                              <DropdownItem to="/admin-panel" icon={Sparkles} label="Admin Panel" highlight />
                            )}
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors text-left"
                            >
                              <LogOut size={18} />
                              <span className="font-medium text-sm">Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold text-sm rounded-full hover:shadow-lg transition-all"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:block border-t border-slate-100">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-1 py-2">
              <NavLink to="/" icon={Home} label="Home" />
              <CategoriesDropdown categories={categories} loading={categoriesLoading} />
              <NavLink to="/all-products" icon={Box} label="Products" />
              <NavLink to="/hot-deals" icon={Zap} label="Deals" badge="HOT" />
              <NavLink to="/new-arrivals" icon={TrendingUp} label="New Arrivals" />
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Mobile/Tablet Search Bar - Positioned below header */}
      <div className="lg:hidden fixed top-[84px] sm:top-[96px] left-0 right-0 z-40 bg-white border-b border-slate-100 px-3 py-2 shadow-sm">
        <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-violet-400 focus:bg-white focus:outline-none transition-all"
          />
          <SearchIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          ) : (
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-violet-500 hover:text-violet-600"
            >
              <SearchIcon size={18} />
            </button>
          )}
        </form>
      </div>

      {/* Spacer for fixed elements */}
      {/* Mobile: announcement(28) + header(56) + search(60) = 144px */}
      {/* Tablet: announcement(32) + header(64) + search(60) = 156px */}
      {/* Desktop: announcement(32) + header(64) + nav(48) = 144px */}
      <div className="h-[144px] sm:h-[156px] lg:h-[144px]" />

      {/* ===================== MOBILE MENU ===================== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-overlay lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70]"
            />

            {/* Menu Panel */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 w-[280px] sm:w-[320px] h-full bg-white z-[80] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header with Close Button */}
              <div className="relative p-4 bg-gradient-to-br from-violet-600 to-fuchsia-500 flex-shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-lg text-white">Menu</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {user?._id ? (
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} size="lg" />
                    <div className="text-white">
                      <p className="font-bold text-sm">{user.name || "User"}</p>
                      <p className="text-xs text-white/80 truncate w-40 sm:w-48">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-violet-600 font-bold rounded-full text-sm"
                  >
                    <User size={16} /> Sign In
                  </Link>
                )}
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Quick Actions */}
                <div className="p-3 grid grid-cols-4 gap-2 border-b border-slate-100">
                  <QuickAction icon={Home} label="Home" to="/" onClick={() => setIsMobileMenuOpen(false)} />
                  <QuickAction icon={Box} label="Products" to="/all-products" onClick={() => setIsMobileMenuOpen(false)} />
                  <QuickAction icon={Heart} label="Wishlist" to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} />
                  <QuickAction icon={ShoppingCart} label="Cart" to="/cart" onClick={() => setIsMobileMenuOpen(false)} />
                </div>

                {/* Categories - COLUMN LAYOUT */}
                {categories.length > 0 && (
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</h3>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{categories.length}</span>
                    </div>

                    {/* 2 Column Grid Layout */}
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat, idx) => (
                        <Link
                          key={idx}
                          to={`/product-category/${cat?.category}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-violet-50 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white shadow-sm p-1.5 flex-shrink-0">
                            <img
                              src={cat.productImage}
                              alt={cat.category}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-700 capitalize line-clamp-2 leading-tight">
                            {cat.category}
                          </span>
                        </Link>
                      ))}
                    </div>

                    <Link
                      to="/categories"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="mt-3 flex items-center justify-center gap-1 py-2 text-xs font-semibold text-violet-600 bg-violet-50 rounded-lg"
                    >
                      View All <ChevronRight size={14} />
                    </Link>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="p-3 space-y-1 border-t border-slate-100">
                  <MobileNavLink to="/hot-deals" icon={Zap} label="Hot Deals" badge="HOT" onClick={() => setIsMobileMenuOpen(false)} />
                  <MobileNavLink to="/new-arrivals" icon={TrendingUp} label="New Arrivals" onClick={() => setIsMobileMenuOpen(false)} />
                  {user?._id && (
                    <>
                      <div className="my-2 border-t border-slate-100" />
                      <MobileNavLink to="/my-orders" icon={CreditCard} label="My Orders" onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavLink to="/manage-account" icon={Settings} label="Settings" onClick={() => setIsMobileMenuOpen(false)} />
                    </>
                  )}

                  {user?.role === "ADMIN" && (
                    <MobileNavLink to="/admin-panel" icon={Sparkles} label="Admin Panel" highlight onClick={() => setIsMobileMenuOpen(false)} />
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-slate-100 bg-slate-50 flex-shrink-0">
                {user?._id ? (
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-100 text-rose-600 rounded-xl font-semibold text-sm"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                ) : (
                  <div className="text-center text-xs text-slate-500">
                    Free shipping on orders over $50
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Desktop Nav Link
const NavLink = ({ to, icon: Icon, label, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
        isActive
          ? "bg-violet-50 text-violet-600"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
      {badge && (
        <span className="ml-1 px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
};

// Desktop Categories Dropdown
const CategoriesDropdown = ({ categories, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      <div className="flex items-center gap-2 px-3 py-2 text-slate-600">
        <Grid3X3 size={16} className="animate-pulse" />
        <span className="text-sm font-medium">Categories</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onMouseEnter={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
          isOpen ? "bg-violet-50 text-violet-600" : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        <Grid3X3 size={16} />
        <span>Categories</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onMouseLeave={() => setIsOpen(false)}
            className="absolute top-full left-0 mt-1 w-[600px] bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 p-4"
          >
            <div className="grid grid-cols-4 gap-3">
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={`/product-category/${cat?.category}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-100 p-2 group-hover:bg-white group-hover:shadow-md transition-all">
                    <img
                      src={cat.productImage}
                      alt={cat.category}
                      className="w-full h-full object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-600 capitalize text-center">
                    {cat.category}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Dropdown Item for User Menu
const DropdownItem = ({ to, icon: Icon, label, highlight }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-sm ${
      highlight ? "bg-violet-50 text-violet-700 font-medium" : "text-slate-700 hover:bg-slate-50"
    }`}
  >
    <Icon size={18} className={highlight ? "text-violet-500" : "text-slate-500"} />
    <span>{label}</span>
  </Link>
);

// Quick Action for Mobile Menu Top Grid
const QuickAction = ({ icon: Icon, label, to, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 hover:bg-violet-50 transition-colors"
  >
    <Icon size={20} className="text-violet-600" />
    <span className="text-[10px] font-medium text-slate-600">{label}</span>
  </Link>
);

// Mobile Nav Link
const MobileNavLink = ({ to, icon: Icon, label, onClick, badge, highlight }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
        isActive
          ? "bg-violet-500 text-white"
          : highlight
            ? "bg-violet-50 text-violet-700"
            : "hover:bg-slate-50 text-slate-700"
      }`}
    >
      <Icon size={18} />
      <span className="font-medium text-sm flex-1">{label}</span>
      {badge && <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full">{badge}</span>}
      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
    </Link>
  );
};

export default Header;