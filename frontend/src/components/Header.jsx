"use client";

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
  Users,
  Bell,
  Heart,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { setUserDetails } from "../../store/userSlice.js";
import SearchBar from "./SearchBar.jsx";
import Context from "@/context/index.js";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Animated cart badge component
const CartBadge = ({ count }) => (
  <motion.span
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-rose-500/30"
  >
    {count > 99 ? "99+" : count}
  </motion.span>
);

// User avatar component with gradient fallback
const UserAvatar = ({ user, onClick, size = "md" }) => {
  const sizeClasses = size === "lg" ? "w-12 h-12" : "w-10 h-10";
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${sizeClasses} rounded-full cursor-pointer relative overflow-hidden bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/25 ring-2 ring-white`}
    >
      {user.profilePic ? (
        <img
          className="w-full h-full object-cover"
          src={user.profilePic}
          alt={user.name}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </motion.div>
  );
};

// Navigation link component with active state
const NavLink = ({ to, icon: Icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive 
          ? "bg-indigo-50 text-indigo-600 shadow-sm" 
          : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
      }`}
    >
      <Icon size={18} className={`${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"} transition-colors`} />
      <span className="font-medium text-sm">{label}</span>
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"
        />
      )}
    </Link>
  );
};

const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const context = useContext(Context);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-b border-slate-200/50" 
            : "bg-white shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex-shrink-0 group">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <span className="hidden md:inline-block">
                    <Logo className="w-[100px] h-[55px] cursor-pointer transition-transform" />
                  </span>
                  <span className="md:hidden font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    DITC
                  </span>
                </motion.div>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1 ml-8">
                <NavLink to="/" icon={Home} label="Home" />
                <NavLink to="/all-products" icon={Box} label="Products" />
                {user?._id && <NavLink to="/my-orders" icon={CreditCard} label="Orders" />}
              </nav>
            </div>

            {/* Desktop Search */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <SearchBar />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Wishlist - Hidden on mobile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-500 transition-colors relative"
              >
                <Heart size={20} />
              </motion.button>

              {/* Notifications - Hidden on mobile */}
              {user?._id && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors relative"
                >
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                </motion.button>
              )}

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/cart")}
                className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <ShoppingCart size={20} />
                {user?._id && context.cartProductCount > 0 && (
                  <CartBadge count={context.cartProductCount} />
                )}
              </motion.button>

              {/* Desktop User Menu */}
              <div className="hidden md:flex items-center gap-3 ml-2" ref={userMenuRef}>
                {user?._id ? (
                  <div className="relative">
                    <div
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <UserAvatar user={user} />
                      <div className="hidden lg:block">
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-slate-500">{user.role || "Customer"}</p>
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                      />
                    </div>

                    {/* Premium Dropdown */}
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 z-50 overflow-hidden"
                        >
                          {/* User Info Header */}
                          <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                              <UserAvatar user={user} size="lg" />
                              <div>
                                <p className="font-bold text-slate-800">{user.name || "User"}</p>
                                <p className="text-xs text-slate-500 truncate max-w-[140px]">{user.email}</p>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="p-2">
                            <Link
                              to="/my-orders"
                              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-slate-700"
                            >
                              <CreditCard size={18} className="text-indigo-500" />
                              <span className="font-medium text-sm">My Orders</span>
                            </Link>
                            
                            <Link
                              to="/manage-account"
                              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-slate-700"
                            >
                              <Settings size={18} className="text-slate-400" />
                              <span className="font-medium text-sm">Manage Account</span>
                            </Link>

                            {user.role === "ADMIN" && (
                              <Link
                                to="/admin-panel"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors text-indigo-700 border border-indigo-100"
                              >
                                <Sparkles size={18} className="text-indigo-500" />
                                <span className="font-medium text-sm">Admin Panel</span>
                              </Link>
                            )}

                            <hr className="my-2 border-slate-100" />

                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 transition-colors text-rose-600 w-full text-left"
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
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/login"
                      className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2"
                    >
                      <User size={18} />
                      <span className="hidden sm:inline">Sign In</span>
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <Menu size={20} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3 border-t border-slate-100">
          <SearchBar />
        </div>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-[72px] md:h-20" />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 left-0 w-[280px] h-full bg-white shadow-2xl z-50 overflow-y-auto"
            >
              {/* Mobile Menu Header */}
              <div className="p-5 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-xl">Menu</span>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
                
                {user?._id && (
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} size="lg" />
                    <div>
                      <p className="font-bold">{user.name || "User"}</p>
                      <p className="text-xs text-white/80">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Navigation */}
              <nav className="p-4 space-y-1">
                <NavLink 
                  to="/" 
                  icon={Home} 
                  label="Home" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                />
                <NavLink 
                  to="/all-products" 
                  icon={Box} 
                  label="Products" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                />
                
                {user?._id && (
                  <>
                    <NavLink 
                      to="/my-orders" 
                      icon={CreditCard} 
                      label="My Orders" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                    />
                    <NavLink 
                      to="/manage-account" 
                      icon={Settings} 
                      label="Manage Account" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                    />
                  </>
                )}

                {user?.role === "ADMIN" && (
                  <NavLink 
                    to="/admin-panel" 
                    icon={Sparkles} 
                    label="Admin Panel" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                  />
                )}

                <hr className="my-4 border-slate-100" />

                {!user?._id ? (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl"
                  >
                    <User size={18} />
                    Sign In
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-50 text-rose-600 w-full"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Sign Out</span>
                  </button>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;