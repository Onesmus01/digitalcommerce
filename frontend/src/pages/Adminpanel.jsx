"use client";

import React, { useState } from "react";
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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminPanel() {
  const user = useSelector((state) => state?.user?.user);
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const ORDERS_PER_PAGE = 3;

  const stats = { users: 1200, orders: 340, products: 95, revenue: 45230 };
  const recentOrders = [
    { id: 1, customer: "John Doe", product: "Gaming Mouse", amount: 120, status: "Shipped" },
    { id: 2, customer: "Jane Smith", product: "Keyboard", amount: 80, status: "Processing" },
    { id: 3, customer: "Bob Marley", product: "Monitor", amount: 250, status: "Delivered" },
    { id: 4, customer: "Alice Cooper", product: "Laptop", amount: 1200, status: "Delivered" },
    { id: 5, customer: "Mike Tyson", product: "Headset", amount: 90, status: "Shipped" },
    { id: 6, customer: "Sarah Connor", product: "Webcam", amount: 150, status: "Processing" },
  ];

  const filteredOrders = recentOrders.filter(
    (o) =>
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(
    (ordersPage - 1) * ORDERS_PER_PAGE,
    ordersPage * ORDERS_PER_PAGE
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [1200, 1900, 800, 1400, 1700, 2300],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: "#fff", titleColor: "#000", bodyColor: "#000" },
    },
    scales: {
      x: { ticks: { color: "#374151" } },
      y: { ticks: { color: "#374151" } },
    },
  };

  const navItems = [
    { icon: <FaHome />, label: "Dashboard", to: "admin-dashboard" },
    { icon: <FaUsers />, label: "Users", to: "all-users" },
    { icon: <FaBox />, label: "Products", to: "all-products" },
    { icon: <FaShoppingCart />, label: "Orders", to: "orders" },
    { icon: <FaDollarSign />, label: "Revenue", to: "revenue" },
    { icon: <FaFileAlt />, label: "Reports", to: "reports" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        <div className="flex flex-col items-center gap-2 py-4 border-b border-gray-200">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
              {user?.profilePic ? (
                <img src={user.profilePic} alt={user?.name || "User"} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <span className="text-white font-bold text-lg">
                  {(user?.name || user?.email || "U")[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-400 rounded-full border-2 border-white shadow" />
          </div>
          <p className={`${sidebarOpen ? "capitalize font-semibold text-sm" : "hidden"}`}>
            {user?.name || "Admin"}
          </p>
          <p className={`${sidebarOpen ? "text-[10px] px-2 py-0.5 bg-green-400 text-white rounded-full tracking-wide" : "hidden"}`}>
            {user?.role || "Admin"}
          </p>
        </div>

        <nav className="mt-4 flex flex-col gap-1 text-sm">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className={`flex items-center px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition ${
                location.pathname.includes(item.to) ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700" : ""
              }`}
              title={sidebarOpen ? "" : item.label}
            >
              {item.icon}
              <span className={`${sidebarOpen ? "ml-2 transition-all" : "hidden"}`}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-2 p-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded">
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-between items-center relative rounded-b-lg">
          <h1 className="text-2xl font-bold text-gray-700">Dashboard</h1>

          <div className="flex items-center space-x-4 relative">
            <div className="relative">
              <FaBell className="text-xl cursor-pointer text-gray-600" onClick={() => setNotificationsOpen(!notificationsOpen)} />
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg p-3 z-50">
                  <h4 className="font-semibold mb-2 text-gray-700">Notifications</h4>
                  <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {recentOrders.slice(0, 5).map((n) => (
                      <li key={n.id} className="text-sm flex justify-between items-center">
                        <span>{n.customer} ordered {n.product}</span>
                        <span className={`px-2 py-0.5 text-xs rounded ${getStatusColor(n.status)}`}>{n.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-tr from-blue-300 to-blue-500 h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shadow-md">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* REPLACE INNER CONTENT WITH OUTLET */}
        <div className="p-6 overflow-y-auto flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}