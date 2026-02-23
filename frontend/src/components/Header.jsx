"use client";

import React, { useState, useRef, useEffect, useContext } from 'react';
import Logo from './Logo';
import { Search, User, ShoppingCart, Menu, X, Home, Box, Settings, CreditCard, LogOut, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { setUserDetails } from '../../store/userSlice.js';
import SearchBar from './SearchBar.jsx';
import Context from '@/context/index.js';

let backendUrl = import.meta.env.VITE_BACKEND_URL;

const Header = () => {
  const user = useSelector(state => state?.user?.user);
  const userData = useSelector(state => state?.user?.user);
  const context = useContext(Context);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef();

  useEffect(() => {
    const handleClickOutside = e => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const responseData = await fetch(`${backendUrl}/user/logout`, { method: 'POST', credentials: 'include' });
      const logoutResponse = await responseData.json();
      if (responseData.ok) {
        dispatch(setUserDetails(null));
        toast.success(logoutResponse.message || 'Logged out');
        window.location.reload();
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <span className="hidden md:inline-block">
                <Logo className="w-[90px] h-[50px] cursor-pointer" />
              </span>
              <span className="md:hidden font-bold text-xl text-blue-600">DITC</span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="flex-1 mx-4 hidden md:block">
            <SearchBar />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">

            {/* Cart always visible */}
            <div className="relative">
              <button
                onClick={() => navigate('/cart')}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ShoppingCart size={20} />
              </button>
              {user?._id && context.cartProductCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {context.cartProductCount}
                </span>
              )}
            </div>

            {/* Desktop User & Login */}
            <div className="hidden md:flex items-center gap-2">
              {user?._id && (
                <div className="relative" ref={userMenuRef}>
                  <div
                    onClick={() => setIsUserMenuOpen(prev => !prev)}
                    className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-tr from-blue-500 to-indigo-500"
                  >
                    {user?.profilePic ? (
                      <img className="w-10 h-10 rounded-full object-cover" src={user.profilePic} alt={user.name} />
                    ) : (
                      <span className="text-white font-bold">{user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white shadow-2xl rounded-xl border border-gray-200 z-50 overflow-hidden animate-fadeIn">
                      <div className="p-4 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-800">{user.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="flex flex-col">
                        <Link to="/my-orders" className="px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700">My Orders</Link>
                        <Link to="/manage-account" className="px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700">Manage Account</Link>
                        {userData?.role === 'ADMIN' && <Link to="/admin-panel/admin-dashboard" className="px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700">Admin Panel</Link>}
                        <button onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700 text-left w-full">Logout</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!user?._id && (
                <Link to="/login" className="px-4 py-1 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 py-2">
          <SearchBar />
        </div>

        {/* Mobile Sidebar Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-0 left-0 w-64 h-full bg-white shadow-2xl z-50 animate-slideIn overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <span className="font-bold text-xl text-blue-600">DITC Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-4">
              <Link to="/" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded transition-colors">
                <Home size={18} /> Home
              </Link>
              <Link to="/all-products" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded transition-colors">
                <Box size={18} /> Products
              </Link>
              {user?._id && (
                <Link to="/my-orders" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded transition-colors">
                  <CreditCard size={18} /> My Orders
                </Link>
              )}
              {userData?.role === 'ADMIN' && (
                <Link to="/admin-panel/admin-dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded transition-colors">
                  <Users size={18} /> Admin Panel
                </Link>
              )}
              {user?._id && (
                <Link to="/manage-account" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded transition-colors">
                  <Settings size={18} /> Manage Account
                </Link>
              )}

              {/* Divider */}
              <hr className="my-2 border-gray-200" />

              {/* User Info */}
              {user?._id ? (
                <div className="flex items-center gap-2 px-4 py-2">
                  {user.profilePic ? (
                    <img className="w-10 h-10 rounded-full object-cover" src={user.profilePic} alt={user.name} />
                  ) : (
                    <User size={20} className="text-gray-700" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors text-center">
                  Login
                </Link>
              )}

              {/* Logout button */}
              {user?._id && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 mt-2 hover:bg-gray-100 rounded transition-colors w-full text-left text-gray-700"
                >
                  <LogOut size={18} /> Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;