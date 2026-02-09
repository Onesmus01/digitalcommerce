import React, { useState, useRef, useEffect,useContext } from 'react';
import Logo from './Logo';
import { Search, User, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { setUserDetails } from '../../store/userSlice.js';
import  SearchBar  from './SearchBar.jsx';
import  Context from '@/context/index.js'

let backendUrl = import.meta.env.VITE_BACKEND_URL;

const Header = () => {
  const user = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef();

  const userData = useSelector(state => state?.user?.user);
   const context = useContext(Context)

   
  // Close dropdown if click outside
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
      const responseData = await fetch(`${backendUrl}/user/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      const logoutResponse = await responseData.json();
      console.log(logoutResponse);
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
    <header className="shadow-md h-16 bg-white">
      <div className="h-full container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <div>
          <Logo className="w-[90px] h-[50px] cursor-pointer" />
        </div>

        {/* Search */}
       <SearchBar />

        {/* User icons, cart & login */}
        <div className="flex items-center gap-4">
          {/* User Circle + Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors bg-orange-500"
              onClick={() => setIsUserMenuOpen(prev => !prev)}
            >
              {user?._id ? (
                user?.profilePic ? (
                  <img
                    className="w-10 h-10 rounded-full"
                    src={user.profilePic}
                    alt={user.name || 'User'}
                  />
                ) : (
                  <span className="text-white font-bold">
                    {user.name
                      ? user.name.charAt(0).toUpperCase()
                      : user.email.charAt(0).toUpperCase()}
                  </span>
                )
              ) : (
                <User size={20} />
              )}
            </div>

            {isUserMenuOpen && user?._id && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg border border-blue-500 z-50">
                <Link
                  to="/manage-account"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Manage Account
                </Link>
                {/* {user.isAdmin && ( */}
                  <Link
                    to="/admin-panel"
                    className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 ${userData?.role !== 'ADMIN' ? 'hidden' : ''}`}
                  >
                    Admin Panel
                  </Link>
                {/* )} */}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Cart */}
          
          <div className="relative">
            <button onClick={()=>navigate('/cart')} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <ShoppingCart size={20} />
            </button>
            
            {user?._id && context.cartProductCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {context.cartProductCount}
              </span>
            )}
          </div>


          {/* Login (if not logged in) */}
          {!user?._id && (
            <Link
              to="/login"
              className="px-4 py-1 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
