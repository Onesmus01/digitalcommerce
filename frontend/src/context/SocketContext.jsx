"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within a SocketProvider");
  return context;
};

// Dedicated socket URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";

export const SocketProvider = ({ children }) => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineAdmins, setOnlineAdmins] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Disconnect socket if user logs out
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    // Only connect once per user
    if (socketRef.current) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true, // let Socket.IO handle reconnection automatically
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("⚠️ Socket connection failed:", err.message);
    });

    socket.on("new-order", (order) => {
      setNotifications((prev) => [{ ...order, isRead: false }, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    socket.on("admins-online", (count) => setOnlineAdmins(count));

    socket.on("unauthorized", () => {
      console.warn("🔒 Unauthorized socket access. Redirecting...");
      navigate("/login");
    });

    return () => {
      // ⚠️ Do NOT disconnect here unless user becomes null
    };
  }, [user, navigate]);

  const markNotificationsAsRead = () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("notifications-read");
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connected,
        notifications,
        unreadCount,
        onlineAdmins,
        markNotificationsAsRead,
        setNotifications,
        setUnreadCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};