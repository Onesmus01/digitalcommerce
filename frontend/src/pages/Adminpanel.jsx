"use client";

import React, { useState, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaDollarSign,
  FaBell,
  FaHome,
  FaFileAlt,
} from "react-icons/fa";
import { Context } from "@/context/ProductContext.jsx";
import { io } from "socket.io-client";

export default function AdminPanel() {
  const user = useSelector((state) => state?.user?.user);
  const location = useLocation();
  const { backendUrl } = useContext(Context);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  let socket;

  // Fetch notifications from backend initially
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${backendUrl}/order/notifications`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch notifications");

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Notification fetch error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Initialize Socket.io
    socket = io(backendUrl, { withCredentials: true });

    // Listen for new order notifications
    socket.on("new-order", (order) => {
      setNotifications((prev) => [{ ...order, isRead: false }, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Toggle notifications dropdown & mark as read
  const handleNotificationToggle = async () => {
    const newState = !notificationsOpen;
    setNotificationsOpen(newState);

    if (newState && unreadCount > 0) {
      try {
        await fetch(`${backendUrl}/order/notifications/read`, {
          method: "PUT",
          credentials: "include",
        });
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } catch (err) {
        console.error("Mark notifications as read failed:", err);
      }
    }
  };

  const navItems = [
    { icon: <FaHome />, label: "Dashboard", to: "admin-dashboard" },
    { icon: <FaUsers />, label: "Users", to: "all-users" },
    { icon: <FaBox />, label: "Products", to: "all-products" },
    { icon: <FaShoppingCart />, label: "Orders", to: "orders" },
    { icon: <FaDollarSign />, label: "Revenue", to: "revenue" },
    { icon: <FaFileAlt />, label: "Reports", to: "reports" },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        <div className="flex flex-col items-center gap-2 py-4 border-b border-gray-200">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user?.name || "User"}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {(user?.name || user?.email || "U")[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-400 rounded-full border-2 border-white shadow" />
          </div>
          {sidebarOpen && (
            <>
              <p className="capitalize font-semibold text-sm">{user?.name || "Admin"}</p>
              <p className="text-[10px] px-2 py-0.5 bg-green-400 text-white rounded-full tracking-wide">
                {user?.role || "Admin"}
              </p>
            </>
          )}
        </div>

        <nav className="mt-4 flex flex-col gap-1 text-sm">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className={`flex items-center px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition ${
                location.pathname.includes(item.to)
                  ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700"
                  : ""
              }`}
              title={sidebarOpen ? "" : item.label}
            >
              {item.icon}
              {sidebarOpen && <span className="ml-2 transition-all">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-2 p-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-between items-center relative rounded-b-lg">
          <h1 className="text-2xl font-bold text-gray-700">Dashboard</h1>

          <div className="flex items-center space-x-4 relative">
            {/* Notifications */}
            <div className="relative">
              <FaBell
                className="text-xl cursor-pointer text-gray-600"
                onClick={handleNotificationToggle}
              />

              {/* 🔴 Unread Badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg p-3 z-50">
                  <h4 className="font-semibold mb-2 text-gray-700">Notifications</h4>
                  <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-gray-500">No new notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <li
                          key={n.id}
                          className={`text-sm flex justify-between items-center p-2 rounded ${
                            !n.isRead ? "bg-gray-100 font-semibold" : ""
                          }`}
                        >
                          <span>
                            {n.customer} ordered {n.product}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs rounded ${getStatusColor(
                              n.status
                            )}`}
                          >
                            {n.status}
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-tr from-blue-300 to-blue-500 h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shadow-md">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Main Outlet */}
        <div className="p-6 overflow-y-auto flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}