import React, { useContext, useEffect, useState } from "react";
import { Context } from "@/context/ProductContext.jsx";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import { Trash2 } from "lucide-react";
import { Link,useNavigate } from "react-router-dom";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  const { backendUrl, fetchUserAddToCart } = useContext(Context);

  const loadingCart = new Array(4).fill(null);

  /* ================= FETCH CART ================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${backendUrl}/user/view-cart-product`,
        {
          method: "GET",
          credentials: "include",
          headers: { "content-type": "application/json" },
        }
      );

      const responseData = await response.json();
      if (responseData.success) {
        setData(responseData.data || []);
      }
    } catch (error) {
      console.error("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= QTY ================= */
  const increaseQty = async (_id, quantity) => {
    const res = await fetch(
      `${backendUrl}/user/update-cart-product`,
      {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _id, quantity: quantity + 1 }),
      }
    );
    const data = await res.json();
    if (data.success) fetchData();
  };

  const decreaseQty = async (_id, quantity) => {
    if (quantity < 2) return;
    const res = await fetch(
      `${backendUrl}/user/update-cart-product`,
      {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _id, quantity: quantity - 1 }),
      }
    );
    const data = await res.json();
    if (data.success) fetchData();
  };
  /* ================= DELETE ================= */
  const deleteCartProduct = async (_id) => {
    const res = await fetch(
      `${backendUrl}/user/delete-cart-product`,
      {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _id }),
      }
    );
    const data = await res.json();
    if (data.success) {
      fetchData();
      fetchUserAddToCart();
    }
  };

  /* ================= TOTALS ================= */
  const totalQty = data.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = data.reduce(
    (sum, i) => sum + i.quantity * (i?.productId?.selling || 0),
    0
  );

  return (
    <div className="container mx-auto px-3 sm:px-4">
      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <div className="text-center text-lg my-6">
          <p className="bg-white py-6 rounded">No Data</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 lg:justify-between">
        {/* ================= CART ITEMS ================= */}
        <div className="w-full max-w-3xl">
          {loading
            ? loadingCart.map((_, i) => (
                <div
                  key={i}
                  className="w-full bg-slate-200 h-32 my-3 border animate-pulse rounded"
                />
              ))
            : data.map((product) => (
                <div
                  key={product?._id}
                  className="
                    w-full bg-white my-3 border rounded 
                    grid grid-cols-[96px,1fr] sm:grid-cols-[128px,1fr]
                    hover:shadow-sm transition
                  "
                >
                  {/* IMAGE */}
                  <div className="bg-slate-200 flex items-center justify-center">
                    <img
                      src={
                        product?.productId?.productImage?.[0] ||
                        "/fallback-image.png"
                      }
                      className="w-20 h-20 sm:w-28 sm:h-28 object-contain mix-blend-multiply"
                      alt={product?.productId?.productName}
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="px-3 sm:px-4 py-2 relative">
                    {/* DELETE */}
                    <button
                      onClick={() => deleteCartProduct(product?._id)}
                      className="
                        absolute right-1 top-1 sm:right-2 sm:top-2
                        text-red-600 p-2 rounded-full
                        hover:bg-red-600 hover:text-white transition
                      "
                    >
                      <Trash2 size={18} />
                    </button>

                    <h2 className="text-sm sm:text-md font-medium line-clamp-1">
                      {product?.productId?.productName}
                    </h2>

                    <p className="capitalize text-slate-500 text-xs">
                      {product?.productId?.category}
                    </p>

                    {/* PRICE */}
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-gray-400 line-through text-xs">
                        {displayKESCurrency(product?.productId?.price)}
                      </p>
                      <p className="text-red-600 font-semibold text-sm">
                        {displayKESCurrency(
                          product?.productId?.selling *
                            product?.quantity
                        )}
                      </p>
                    </div>

                    {/* PRODUCT ID */}
                    <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1 font-mono break-all">
                      <span className="text-blue-500 font-semibold">
                        Product ID:
                      </span>{" "}
                      {product?.productId?._id}
                    </p>

                    {/* QTY */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        className="border border-blue-600 text-blue-500 hover:bg-blue-500 hover:text-white w-7 h-7 flex justify-center items-center rounded transition"
                        onClick={() =>
                          decreaseQty(product?._id, product?.quantity)
                        }
                      >
                        −
                      </button>

                      <span className="text-sm font-medium">
                        {product?.quantity}
                      </span>

                      <button
                        className="border border-blue-600 text-blue-500 hover:bg-blue-500 hover:text-white w-7 h-7 flex justify-center items-center rounded transition"
                        onClick={() =>
                          increaseQty(product?._id, product?.quantity)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
        {/* ================= SUMMARY ================= */}
        <div className="w-full max-w-sm lg:sticky lg:top-20 self-start">
          {loading ? (
            <div className="h-36 bg-slate-200 animate-pulse rounded" />
          ) : (
            <div className="bg-white border rounded">
              <h2 className="text-white bg-green-500 px-4 py-2 text-sm font-semibold">
                Summary
              </h2>

              <div className="px-4 py-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <p>Quantity</p>
                  <p>{totalQty}</p>
                </div>

                <div className="flex justify-between font-medium">
                  <p>Total Price</p>
                  <p>{displayKESCurrency(totalPrice)}</p>
                </div>

                <button 
                    onClick={() => navigate('/checkout', { state: { cartItems: data } })}
                    className="bg-blue-500 hover:bg-blue-600 p-3 text-white w-full rounded mt-2 transition"
                  >
                    Proceed to Payment
              </button>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
