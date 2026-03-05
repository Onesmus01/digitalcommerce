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
  Flame
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { setUserDetails } from "../../store/userSlice.js";
import Context from "@/context/index.js";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ===================== Animated Cart Badge =====================
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

// ===================== User Avatar with Glow =====================
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

// ===================== Main Header =====================
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
  const userMenuRef = useRef();
  const searchRef = useRef();

  // Popular search suggestions
  const suggestions = [
    { text: "Wireless Headphones", icon: Tag },
    { text: "Smart Watch", icon: Star },
    { text: "Gaming Laptop", icon: Flame },
    { text: "Running Shoes", icon: Zap },
  ];

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
      {/* ===================== ANNOUNCEMENT BAR ===================== */}
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

      {/* ===================== MAIN HEADER ===================== */}
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
                  {/* Search Icon */}
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <SearchIcon size={20} className={`transition-colors ${isSearchFocused ? 'text-violet-500' : 'text-slate-400'}`} />
                  </div>

                  {/* Search Input */}
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

                  {/* Keyboard Shortcut Badge */}
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

                  {/* Search Suggestions Dropdown */}
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
                
                {/* Wishlist */}
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

                {/* Notifications */}
                {user?._id && (
                  <motion.button
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => navigate("/notifications")}
                    className="hidden md:flex w-11 h-11 items-center justify-center rounded-xl bg-slate-50 hover:bg-violet-50 border border-transparent hover:border-violet-200 text-slate-600 hover:text-violet-600 transition-all shadow-sm hover:shadow-md group relative"
                  >
                    <Bell size={20} strokeWidth={2} className="transition-transform group-hover:scale-110" />
                    <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Notifications
                    </span>
                  </motion.button>
                )}

                {/* Cart */}
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

                {/* User Menu */}
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

                      {/* User Dropdown */}
                      <AnimatePresence>
                        {isUserMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden z-50"
                          >
                            {/* Header */}
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

                            {/* Stats */}
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

                            {/* Menu */}
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
              <NavLink to="/all-products" icon={Box} label="Products" />
              <NavLink to="/deals" icon={Zap} label="Deals" badge="HOT" />
              <NavLink to="/new-arrivals" icon={TrendingUp} label="New Arrivals" />
              <NavLink to="/categories" icon={Tag} label="Categories" />
              {user?._id && <NavLink to="/my-orders" icon={CreditCard} label="My Orders" />}
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Spacer */}
      <div className="h-[110px] sm:h-[120px] lg:h-[145px]" />

      {/* ===================== MOBILE MENU ===================== */}
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
              className="lg:hidden fixed top-0 left-0 w-[300px] h-full bg-white z-[80] overflow-hidden shadow-2xl"
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

              {/* Nav */}
              <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-200px)]">
                <MobileNavLink to="/" icon={Home} label="Home" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink to="/all-products" icon={Box} label="Products" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink to="/deals" icon={Zap} label="Hot Deals" badge="NEW" onClick={() => setIsMobileMenuOpen(false)} />
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

// ===================== Nav Link =====================
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

// ===================== Dropdown Item =====================
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

// ===================== Mobile Nav Link =====================
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