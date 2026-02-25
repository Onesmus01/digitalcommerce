"use client";

import { useState, useEffect, useContext, useMemo } from "react";
import { Context } from "../context/ProductContext.jsx";
import { toast } from "react-hot-toast";
import { FaDownload, FaShoppingCart, FaUsers, FaDollarSign, FaSearch } from "react-icons/fa";

export default function AdminDashboardOrders() {
  const { backendUrl } = useContext(Context);
const [orders, setOrders] = useState([]);
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("");

// 1️⃣ Fetch orders
const fetchOrders = async () => {
  try {
    setLoading(true);
    const res = await fetch(`${backendUrl}/order/all-orders`, { credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
    setOrders(data.orders || []);
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Error fetching orders");
  } finally {
    setLoading(false);
  }
};

// 2️⃣ Fetch users
const fetchUsers = async () => {
  try {
    const res = await fetch(`${backendUrl}/user/total-users`, { credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch users");
    setUsers(data.data || []);
    console.log("Total users:", data.data.users);
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Error fetching users");
  }
};

// 3️⃣ Fetch everything on mount
useEffect(() => {
  fetchOrders();
  fetchUsers();
}, [backendUrl]);

// 4️⃣ Filtered orders (search & status)
const filteredOrders = useMemo(() => {
  return orders.filter(o =>
    (!statusFilter || o.orderStatus === statusFilter) &&
    (!search ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(item => item.name?.toLowerCase().includes(search.toLowerCase()))
    )
  );
}, [orders, search, statusFilter]);

// 5️⃣ Compute stats
const stats = useMemo(() => {
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(o => o.paymentStatus === "success") // only successful payments
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalUsers = users.length; // total registered users

  return { totalOrders, totalRevenue, totalUsers };
}, [orders, users]);
  const exportCSV = () => {
    const rows = [
      [
        "Customer Name","Customer Email","Phone","User Role","Product Name",
        "Product Price","Quantity","Total Amount","Order Status",
        "Payment Method","Payment Status","Shipping Country","Shipping City",
        "Shipping Street","Shipping PostalCode",
      ],
      ...orders.map(o =>
        o.items.map(item => [
          o.user?.name || "Unknown",
          o.user?.email || "Unknown",
          o.shippingAddress?.phone || "N/A",
          o.user?.role || "GENERAL",
          item.name || "Unknown Product",
          item.price || 0,
          item.quantity || 0,
          o.totalAmount || 0,
          o.orderStatus || "Pending",
          o.paymentMethod || "N/A",
          o.paymentStatus || "pending",
          o.shippingAddress?.address?.country || "N/A",
          o.shippingAddress?.address?.city || "N/A",
          o.shippingAddress?.address?.street || "N/A",
          o.shippingAddress?.address?.postalCode || "N/A",
        ])
      ).flat(),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "all-orders.csv";
    document.body.appendChild(link);
    link.click();
  };

  
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${backendUrl}/order/update-status/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      toast.success("Order status updated!");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error updating status");
    }
  };

  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-lg animate-pulse">Loading orders...</p>
    </div>
  );

  const getStatusClasses = (status) => {
    switch(status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "shipped": return "bg-blue-100 text-blue-800 shadow-[0_0_10px_rgba(59,130,246,0.4)]";
      case "processing": return "bg-amber-100 text-amber-800 shadow-[0_0_10px_rgba(245,158,11,0.4)]";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ===== Header ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">All Orders</h2>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-lg font-semibold transition transform hover:scale-105"
        >
          <FaDownload /> Export CSV
        </button>
      </div>

      {/* ===== Search & Filter ===== */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-md w-full md:w-1/2">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer, email, or product..."
            className="w-full outline-none text-gray-700"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="p-2 rounded-lg shadow-md bg-white text-gray-700 w-full md:w-1/4"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {["pending","processing","shipped","delivered","cancelled"].map(status => (
            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  {[
    { title: "Total Orders", value: stats.totalOrders, icon: <FaShoppingCart className="text-blue-500 text-xl" /> },
    { title: "Total Users", value: stats.totalUsers, icon: <FaUsers className="text-purple-500 text-xl" /> },
    { title: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: <FaDollarSign className="text-green-500 text-xl" /> },
  ].map((card, idx) => (
    <div key={idx} className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-2 hover:shadow-xl transition transform hover:scale-105">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 font-medium">{card.title}</p>
        {card.icon}
      </div>
      <p className="text-2xl font-bold text-gray-800">{card.value}</p>
    </div>
  ))}
</div>

      {/* ===== Orders Card-Style for Mobile with Glow & Hover Effects ===== */}
      <div className="flex flex-col gap-4">
        {filteredOrders.map(order =>
          order.items.map((item, idx) => (
            <div
              key={`${order._id}-${idx}`}
              className={`bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row gap-4 md:items-center transition transform hover:scale-105 duration-300`}
            >
              {/* Customer */}
              <div className="flex items-center gap-3 flex-1">
                {order.user?.profilePic ? (
                  <img
                    src={order.user.profilePic}
                    alt={order.user?.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 hover:scale-110 transition transform duration-300"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                    {order.user?.name?.[0] || "U"}
                  </div>
                )}
                <div className="flex flex-col">
                  <p className="font-semibold text-gray-800">{order.user?.name}</p>
                  <p className="text-gray-500 text-xs">{order.user?.email}</p>
                  <p className="text-gray-500 text-xs font-medium">📞 {order.shippingAddress?.phone || "N/A"}</p>
                </div>
              </div>

              {/* Product */}
              <div className="flex-1 flex items-center gap-3">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg border shadow-sm hover:scale-105 transition transform duration-300"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-gray-500 text-xs rounded-lg">No Image</div>
                )}
                <div className="flex flex-col">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-600">${item.price} x {item.quantity}</p>
                  <p className="font-bold text-gray-800">Total: ${order.totalAmount}</p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col gap-2 md:gap-3 flex-1">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
                <select
                  className={`p-1 rounded-md border shadow-sm text-sm w-full ${getStatusClasses(order.orderStatus)}`}
                  value={order.orderStatus}
                  onChange={e => updateOrderStatus(order._id, e.target.value)}
                >
                  {["pending","processing","shipped","delivered","cancelled"].map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Payment & Shipping */}
              <div className="flex flex-col gap-1 flex-1 text-xs md:text-sm">
                <p>Payment: {order.paymentStatus} ({order.paymentMethod})</p>
                <p>Shipping: {order.shippingAddress?.address?.street}, {order.shippingAddress?.address?.city}, {order.shippingAddress?.address?.country}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}