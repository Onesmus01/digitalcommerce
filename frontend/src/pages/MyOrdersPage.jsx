import React, { useEffect, useState, useContext } from "react";
import { Context } from "@/context/ProductContext.jsx";

const getStatusColor = (status) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-700";
    case "shipped":
      return "bg-blue-100 text-blue-700";
    case "processing":
      return "bg-yellow-100 text-yellow-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const OrderProgress = ({ status }) => {
  const progress =
    status === "processing"
      ? "33%"
      : status === "shipped"
      ? "66%"
      : status === "delivered"
      ? "100%"
      : "0%";

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
        style={{ width: progress }}
      ></div>
    </div>
  );
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { backendUrl } = useContext(Context);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${backendUrl}/order/my-orders`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/order/${id}/cancel`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Cancel failed");

      fetchOrders(); // refresh orders
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🛍 My Orders</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6">{error}</div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center">
            <h2 className="text-xl font-semibold text-gray-700">No Orders Yet</h2>
            <p className="text-gray-500 mt-2">
              When you place an order, it will appear here.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg">
                    #{order._id.slice(-6).toUpperCase()}
                  </h2>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <p className="text-gray-500 mt-2 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <div className="flex items-center gap-2 mt-2 overflow-x-auto">
                  {order.items.map((item) => (
                    <img
                      key={item._id}
                      src={item.image || "/default-product.png"}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover border"
                      title={item.name}
                    />
                  ))}
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  Items: {order.items.length}
                </p>

                <p className="font-bold text-indigo-600 mt-3 text-lg">
                  KES {order.totalAmount}
                </p>

                <OrderProgress status={order.orderStatus} />

                <div className="flex flex-wrap gap-2 mt-5">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    View
                  </button>

                  {order.orderStatus === "processing" && (
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Order Details</h2>

            <p>
              <strong>Status:</strong> {selectedOrder.orderStatus}
            </p>
            <p>
              <strong>Payment:</strong> {selectedOrder.paymentStatus}
            </p>
            <p>
              <strong>Total:</strong> KES {selectedOrder.totalAmount}
            </p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Products Ordered:</h3>
              {selectedOrder.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b py-3"
                >
                  <img
                    src={item.image || "/default-product.png"}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × KES {item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <OrderProgress status={selectedOrder.orderStatus} />

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}