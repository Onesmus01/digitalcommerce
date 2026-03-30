"use client";

import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { setUserDetails } from "../store/userSlice.js";
import { io } from "socket.io-client";
import { AnimatePresence } from "framer-motion";

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
import ScrollToTop from "@/components/ScrollToTop.jsx";
import PageTransitionWrapper from "@/components/PageTransitionWrapper.jsx";
import PageLoader from "@/components/PageLoader.jsx";
import usePageLoader from "@/hooks/usePageLoader.jsx";
import BackButton from "@/components/BackButton.jsx"
import AboutPage from "@/pages/AboutPage.jsx";
import FAQsPage from "@/pages/FAQsPage.jsx";
import PrivacyPage from "@/pages/PrivacyPage.jsx";
import TermsPage from "@/pages/TermsPage.jsx";
import CareersPage from "@/pages/CareersPage.jsx";

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
import AdminSettingsPage from "@/pages/AdminSettingsPage.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

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

  const hideHeaderAndFooter =
    location.pathname.startsWith("/admin") || location.pathname === "/admin-panel";

  const [cartProductCount, setCartProductCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineAdmins, setOnlineAdmins] = useState(0);
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
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      setCartProductCount(response.ok ? responseData.data || 0 : 0);
      console.log("✅ Cart count fetched:", responseData.data);
    } catch {
      setCartProductCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountCart();
  }, [user]);

  // ---------------- FETCH USER DETAILS ----------------
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${backendUrl}/user/user-details`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
      setSocket(null);
      return;
    }

    const socketClient = io(backendUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    setSocket(socketClient);

    socketClient.on("connect", () => console.log("🟢 Socket connected:", socketClient.id));
    socketClient.on("admins-online", (count) => setOnlineAdmins(count));
    socketClient.on("disconnect", (reason) => console.log("🔴 Socket disconnected:", reason));
    socketClient.on("error", (err) => console.error("⚠️ Socket error:", err));

    return () => socketClient.disconnect();
  }, [user]);


  // triggers PageLoader on route change
  usePageLoader();


  // ------------------- RENDER -------------------
  return (
    <Context.Provider
      value={{
        fetchUserDetails,
        cartProductCount,
        setCartProductCount,
        fetchCountCart,
        socket,
        backendUrl,
        getAuthHeaders,
      }}
    >
      <div className="flex flex-col min-h-screen ">
        <ScrollToTop />
        <Toaster
            position="top-center"
            toastOptions={{
              style: {
                maxWidth: "90%", // smaller on mobile
                width: "auto",    // let it fit content
                padding: "0.5rem 1rem", // smaller padding
                fontSize: "0.875rem",   // slightly smaller text
              },
            }}
          />
          <PageLoader loading={loading} /> {/* <-- PROGRESS BAR */}


        {!hideHeaderAndFooter && <PromotionBanner onVisibilityChange={setShowBanner} />}
        {!hideHeaderAndFooter && (
          <div className="sticky top-0 z-50">
            <Header />
          </div>
        )}

        <main className="flex-1">
          {/* ---------------- ANIMATEPRESENCE WRAP ---------------- */}
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* ---------------- Public Routes ---------------- */}
              <Route path="/" element={<PageTransitionWrapper><Home /></PageTransitionWrapper>} />
              <Route path="/login" element={<PageTransitionWrapper><Login /></PageTransitionWrapper>} />
              <Route path="/sign-up" element={<PageTransitionWrapper><SignUp /></PageTransitionWrapper>} />
              <Route path="/forgot-password" element={<PageTransitionWrapper><ForgotPassword /></PageTransitionWrapper>} />
              <Route path="/product-category/:categoryName?" element={<CategoryProduct />} />
              <Route path="/product/:id" element={<PageTransitionWrapper><ProductDetails /></PageTransitionWrapper>} />
              <Route path="/cart" element={<PageTransitionWrapper><Cart /></PageTransitionWrapper>} />
              <Route path="/search" element={<PageTransitionWrapper><SearchProduct /></PageTransitionWrapper>} />
              <Route path="/new-arrivals" element={<PageTransitionWrapper><NewArrivalsPage /></PageTransitionWrapper>} />
              <Route path="/hot-deals" element={<PageTransitionWrapper><HotDealsPage /></PageTransitionWrapper>} />
              <Route path="/all-products" element={<PageTransitionWrapper><ProductsPage /></PageTransitionWrapper>} />
              <Route path="/wishlist" element={<PageTransitionWrapper><WishlistPage /></PageTransitionWrapper>} />
              <Route path="/about" element={<PageTransitionWrapper><AboutPage /></PageTransitionWrapper>} />
              <Route path="/faqs" element={<PageTransitionWrapper><FAQsPage /></PageTransitionWrapper>} />
              <Route path="/privacy-policy" element={<PageTransitionWrapper><PrivacyPage /></PageTransitionWrapper>} />
              <Route path="/terms-and-conditions" element={<PageTransitionWrapper><TermsPage /></PageTransitionWrapper>} />
              <Route path="/careers" element={<PageTransitionWrapper><CareersPage /></PageTransitionWrapper>} />

              {/* ---------------- Protected User Routes ---------------- */}
              <Route path="/orders" element={<PrivateRoute user={user}><Orders /></PrivateRoute>} />
              <Route path="/checkout" element={<PrivateRoute user={user}><CheckoutPage /></PrivateRoute>} />
              <Route path="/payment" element={<PrivateRoute user={user}><Payment /></PrivateRoute>} />
              <Route path="/thank-you" element={<PrivateRoute user={user}><ThankYouPage /></PrivateRoute>} />
              <Route path="/my-orders" element={<PrivateRoute user={user}><MyOrdersPage /></PrivateRoute>} />

              {/* ---------------- Admin Routes ---------------- */}
              <Route path="/admin-panel" element={<PrivateAdminRoute user={user}><AdminPanel /></PrivateAdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="all-users" element={<AllUsers />} />
                <Route path="all-products" element={<AllProducts />} />
                <Route path="product" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="trending-products" element={<TrendingProducts />} />
                <Route path="promotions" element={<PromotionDashboard />} />
                <Route path="hot-admin" element={<HotDealsAdmin />} />
                <Route path="admin-revenue" element={<AdminRevenue />} />
                <Route path="admin-reports" element={<AdminReportPage />} />
                <Route path="admin-settings" element={<AdminSettingsPage />} />
              </Route>

              {/* ---------------- Fallback ---------------- */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </main>

        {!hideHeaderAndFooter && <Footer />}

        {user?.role === "ADMIN" && (
          <div className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-lg">
            Online admins: {onlineAdmins}
          </div>
        )}

        <BackButton />
      </div>
    </Context.Provider>
  );
};

export default App;