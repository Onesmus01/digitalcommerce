"use client";

import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
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

const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";

export default function AdminPanel() {
  const location = useLocation();
  const { backendUrl, user, setUserDetails } = useContext(Context);

  const socketRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [shake, setShake] = useState(false);
  const [onlineAdmins, setOnlineAdmins] = useState(0);

  /* ================= FETCH AUTH USER ================= */

  const fetchUser = useCallback(async () => {
    if (user) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/user/me`, {
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUserDetails(data.user);
    } catch (err) {
      console.error("Auth fetch failed:", err.message);
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  }, [backendUrl, user, setUserDetails]);

  /* ================= FETCH NOTIFICATIONS ================= */

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/order/notifications`, {
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Notification fetch error:", error.message);
    }
  }, [backendUrl]);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /* ================= SOCKET SETUP ================= */

  useEffect(() => {
    if (!user) return;
    if (socketRef.current) return;

    fetchNotifications();

    const socket = io(socketUrl, {
      transports: ["websocket"],
      withCredentials: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("new-order", (order) => {
      setNotifications((prev) => [
        { ...order, isRead: false },
        ...prev,
      ]);

      setUnreadCount((prev) => prev + 1);

      setShake(true);
      setTimeout(() => setShake(false), 600);

      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
    });

    socket.on("admins-online", (count) => {
      setOnlineAdmins(count);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    socket.on("unauthorized", () => {
      window.location.href = "/login";
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, fetchNotifications]);

  /* ================= TOGGLE NOTIFICATIONS ================= */

  const handleNotificationToggle = async () => {
    const isOpening = !notificationsOpen;
    setNotificationsOpen(isOpening);

    if (isOpening && unreadCount > 0) {
      try {
        await fetch(`${backendUrl}/order/notifications/read`, {
          method: "PUT",
          credentials: "include",
        });

        setUnreadCount(0);
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
      } catch (err) {
        console.error("Mark read failed:", err.message);
      }
    }
  };

  /* ================= NAVIGATION ================= */

  const navItems = [
    { icon: <FaHome />, label: "Dashboard", to: "/admin" },
    { icon: <FaUsers />, label: "Users", to: "/admin/all-users" },
    { icon: <FaBox />, label: "Products", to: "/admin/all-products" },
    { icon: <FaShoppingCart />, label: "Orders", to: "/admin/orders" },
    { icon: <FaDollarSign />, label: "Revenue", to: "/admin/revenue" },
    { icon: <FaFileAlt />, label: "Reports", to: "/admin/reports" },
  ];

  const getStatusColor = (status = "") => {
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

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* SIDEBAR */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"
          } bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        <div className="flex flex-col items-center gap-2 py-4 border-b">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-400 rounded-full border-2 border-white" />
          </div>

          {sidebarOpen && (
            <>
              <p className="font-semibold text-sm">{user?.name || "Admin"}</p>
              <p className="text-xs text-green-600">{user?.role || "Admin"}</p>
              <p className="text-xs text-gray-500">
                {onlineAdmins} admins online
              </p>
            </>
          )}
        </div>

        <nav className="mt-4 flex flex-col gap-1 text-sm">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className={`flex items-center px-3 py-2 rounded-md hover:bg-blue-50 transition ${location.pathname === item.to
                  ? "bg-blue-100 text-blue-700"
                  : ""
                }`}
            >
              {item.icon}
              {sidebarOpen && <span className="ml-2">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-2 text-center">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-between items-center relative">
          <h1 className="text-xl font-bold">Dashboard</h1>

          <div className="relative">
            <FaBell
              className={`text-xl cursor-pointer ${shake ? "animate-bounce" : ""
                }`}
              onClick={handleNotificationToggle}
            />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                {unreadCount}
              </span>
            )}

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-3 z-50">
                <h4 className="font-semibold mb-2">Notifications</h4>

                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <li
                        key={n._id || n.id}
                        className={`text-sm flex justify-between items-center p-2 rounded ${!n.isRead
                            ? "bg-gray-100 font-semibold"
                            : ""
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
        </header>

        <div className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}