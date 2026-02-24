"use client";

import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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

// Admin pages
import AdminPanel from "@/pages/Adminpanel.jsx";
import AllUsers from "@/pages/AllUsers.jsx";
import AllProducts from "@/pages/AllProducts.jsx";
import Products from "@/pages/Product.jsx";
import AdminDashboard from "@/pages/AdminDashboard.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
  const user = useSelector((state) => state?.user?.user); // single user state
  const dispatch = useDispatch();

  const [cartProductCount, setCartProductCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineAdmins, setOnlineAdmins] = useState(0);

  console.log("admin user role", user?.role);

  // ---------------- FETCH CART COUNT ----------------
  const fetchCountCart = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/user/count-cart-products`, {
        method: "GET",
        credentials: "include",
      });
      const responseData = await response.json();
      if (response.ok) {
        setCartProductCount(responseData.data || 0);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
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
      const res = await fetch(`${backendUrl}/user/user-details`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) dispatch(setUserDetails(data.data));
    } catch (err) {
      console.error("Failed to fetch user details:", err.message);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // ---------------- SOCKET.IO CONNECTION ----------------
  useEffect(() => {
    if (!user?._id) return; // wait until user is loaded

    const socketClient = io(backendUrl, { withCredentials: true });
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
        socket, // optional: pass socket to children if needed
      }}
    >
      <div className="flex flex-col min-h-screen">
        <Toaster position="top-center" />
        <Header />

        <main className="flex-1 pt-[16px]">
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
            </Route>

            {/* ---------------- Fallback ---------------- */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />

        {/* Optional: show online admins badge for admin users */}
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