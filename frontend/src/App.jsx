"use client";

import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { setUserDetails } from "../store/userSlice.js";
import { io } from "socket.io-client";

import Context from "@/context/index.js";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Login from "@/pages/Login.jsx";
import SignUp from "@/pages/SignUp.jsx";
import ForgotPassword from "@/pages/ForgotPassword.jsx";
import CategoryProduct from "@/pages/CategoryProduct.jsx";
import ProductDetails from "@/pages/ProductDetails.jsx";
import Cart from "@/pages/Cart.jsx";
import SearchProduct from "@/components/SearchProduct.jsx";
import Orders from "@/pages/Orders.jsx";
import CheckoutPage from "@/pages/CheckoutPage.jsx";
import Payment from "@/pages/Payment.jsx";
import ThankYouPage from "@/pages/ThankyouPage.jsx";
import MyOrdersPage from "@/pages/MyOrdersPage.jsx";
import NewArrivalsPage from "@/pages/NewArrivalPage.jsx";
import HotDealsPage from "@/pages/HotDealsPage.jsx";
import ProductsPage from "@/pages/ProductsPage.jsx";
import WishlistPage from "@/pages/WishlistPage.jsx";
import TrendingProducts from "@/pages/TrendingProducts.jsx";
import PromotionBanner from "@/components/PromotionBanner.jsx";
import PromotionToast from "@/components/PromotionToast.jsx";

// Admin pages
import AdminPanel from "@/pages/Adminpanel.jsx";
import AllUsers from "@/pages/AllUsers.jsx";
import AllProducts from "@/pages/AllProducts.jsx";
import Products from "@/pages/Product.jsx";
import AdminDashboard from "@/pages/AdminDashboard.jsx";
import PromotionDashboard from "@/pages/PromotionDashboard.jsx";
import HotDealsAdmin from "@/pages/HotDealsAdmin.jsx";
import AdminRevenue from '@/pages/AdminRevenue.jsx';
import AdminReportPage from "@/pages/AdminReportPage.jsx";
import AdminSettingsPage from "@/pages/AdminSettingsPage.jsx"


const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";

// ------------------- Protected Routes -------------------
const PrivateRoute = ({ user, children }) => {
  if (!user?._id) return <Navigate to="/login" />;
  return children;
};

const PrivateAdminRoute = ({ user, children }) => {
  if (!user?._id) return <Navigate to="/login" />;
  if (user?.role !== "ADMIN") return <Navigate to="/" />;
  return children;
};

// ------------------- App Component -------------------
const App = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();

  const location = useLocation();

  // ✅ Hide header/footer on admin pages
  const hideHeaderAndFooter =
    location.pathname.startsWith("/admin") || location.pathname === "/admin-panel";

  const [cartProductCount, setCartProductCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineAdmins, setOnlineAdmins] = useState(0);
  // 🔥 Track banner visibility for layout adjustments
  const [showBanner, setShowBanner] = useState(false);

  console.log("admin user role", user?.role);

  // ---------------- FETCH CART COUNT ----------------
  const fetchCountCart = async () => {
  if (!user?._id) return;
  
  const token = localStorage.getItem("token");
  if (!token) {
    setCartProductCount(0);
    return;
  }
  
  try {
    setLoading(true);
    const response = await fetch(`${backendUrl}/user/count-cart-products`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  // 🔥 ADD THIS LINE
      },
    });
    
    const responseData = await response.json();
    
    if (response.ok) {
      setCartProductCount(responseData.data || 0);
      console.log("✅ Cart count fetched:", responseData.data);
    } else {
      setCartProductCount(0);
    }
  } catch (error) {
    setCartProductCount(0);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCountCart();
  }, [user]);

  // ---------------- FETCH USER DETAILS ----------------
  // 
const fetchUserDetails = async () => {
  try {
    const token = localStorage.getItem("token") || ""; // always a string

    console.log("Fetching from:", `${backendUrl}/user/user-details`);
    console.log("Sending token:", token);

    const res = await fetch(`${backendUrl}/user/user-details`, {
      method: "GET",
      credentials: "include", // send cookies
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // always present
      },
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.error("Response not OK:", errText);
      return;
    }

    const data = await res.json();
    if (data.data) dispatch(setUserDetails(data.data));
    console.log("User details fetched:", data.data);

  } catch (err) {
    console.error("Network error:", err.message);
  }
};
useEffect(() => {
  fetchUserDetails();
}, []);
  // ---------------- SOCKET.IO CONNECTION ----------------
  useEffect(() => {
    if (!user?._id) {
      console.log("⏸️ No user logged in, socket not connected");
      setSocket(null);
      return;
    }

    console.log("🔌 Connecting socket for user:", user._id);
    
    const socketClient = io(backendUrl, { 
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5
    });
    
    setSocket(socketClient);

    socketClient.on("connect", () => {
      console.log("🟢 Socket connected:", socketClient.id);
    });

    socketClient.on("admins-online", (count) => {
      setOnlineAdmins(count);
      console.log("👨‍💻 Online admins:", count);
    });

    socketClient.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
    });

    socketClient.on("error", (err) => {
      console.error("⚠️ Socket error:", err);
    });

    return () => {
      socketClient.disconnect();
    };
  }, [user]);

  return (
    <Context.Provider
      value={{
        fetchUserDetails,
        cartProductCount,
        setCartProductCount,
        fetchCountCart,
        socket,
        backendUrl,
      }}
    >
      <div className="flex flex-col min-h-screen">
        <Toaster position="top-center" />
        
        {/* 🔥 BANNER - Relative positioning, pushes header down */}
        {!hideHeaderAndFooter && (
          <PromotionBanner onVisibilityChange={setShowBanner} />
        )}
        
        {/* 🔥 HEADER - Sticky below banner */}
        {!hideHeaderAndFooter && (
          <div className="sticky top-0 z-50">
            <Header />
          </div>
        )}

        {/* 🔥 MAIN - Adjusted padding based on banner */}
        <main className={`flex-1 ${!hideHeaderAndFooter ? '' : ''}`}>
          <Routes>
            {/* ---------------- Public Routes ---------------- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/product-category/:categoryName?"
              element={<CategoryProduct />}
            />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/search" element={<SearchProduct />} />
            <Route path="/new-arrivals" element={<NewArrivalsPage />} />
            <Route path="/hot-deals" element={<HotDealsPage />} />
            <Route path="/all-products" element={<ProductsPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* ---------------- Protected User Routes ---------------- */}
            <Route
              path="/orders"
              element={
                <PrivateRoute user={user}>
                  <Orders />
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <PrivateRoute user={user}>
                  <CheckoutPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <PrivateRoute user={user}>
                  <Payment />
                </PrivateRoute>
              }
            />
            <Route
              path="/thank-you"
              element={
                <PrivateRoute user={user}>
                  <ThankYouPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <PrivateRoute user={user}>
                  <MyOrdersPage />
                </PrivateRoute>
              }
            />

            {/* ---------------- Admin Routes ---------------- */}
            <Route
              path="/admin-panel"
              element={
                <PrivateAdminRoute user={user}>
                  <AdminPanel />
                </PrivateAdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="all-users" element={<AllUsers />} />
              <Route path="all-products" element={<AllProducts />} />
              <Route path="product" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="trending-products" element={<TrendingProducts />} />
              <Route path={"promotions"} element={<PromotionDashboard />} />
              <Route path={"hot-admin"} element={<HotDealsAdmin />} />
              <Route path={"admin-revenue"} element={<AdminRevenue />} />
              <Route path={"admin-reports"} element={<AdminReportPage />} />
              <Route path={"admin-settings"} element={<AdminSettingsPage />} />

            </Route>

            {/* ---------------- Fallback ---------------- */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {!hideHeaderAndFooter && <Footer />}

        {user?.role === "ADMIN" && (
          <div className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-lg">
            Online admins: {onlineAdmins}
          </div>
        )}
      </div>
    </Context.Provider>
  );
};

export default App;