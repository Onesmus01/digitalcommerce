import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import { FaCcVisa, FaCcMastercard, FaPaypal, FaMoneyBillWave } from "react-icons/fa";

const MpesaIcon = () => <img src="/icons/mpesa.png" alt="Mpesa" className="w-6 h-6" />;

const paymentIcons = {
  mpesa: <MpesaIcon />,
  card: (
    <div className="flex gap-2">
      <FaCcVisa size={20} color="#1a1f71" />
      <FaCcMastercard size={20} color="#eb001b" />
    </div>
  ),
  paypal: <FaPaypal size={20} color="#003087" />,
  cash: <FaMoneyBillWave size={20} color="#16a34a" />,
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [personalDetails, setPersonalDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    street: "",
    postalCode: "",
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";

  // Fetch cart items
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/user/view-cart-product`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        const validItems = (data.data || []).filter(item => item.productId?._id);
        setCartItems(validItems);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (!loading && cartItems.length === 0) navigate("/cart");
  }, [loading, cartItems, navigate]);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + (item.productId?.selling || 0) * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    setPersonalDetails({ ...personalDetails, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    const { firstName, lastName, email, phone, country, city, street } = personalDetails;
    if (!firstName || !lastName || !email || !phone || !country || !city || !street) {
      alert("Please fill all required personal details!");
      return;
    }

    if (cartItems.length === 0) {
      alert("No items in your cart!");
      return;
    }

    try {
      // Format personal/shipping details to match backend schema
      const payload = {
        ...personalDetails,
        address: {
          country: personalDetails.country,
          city: personalDetails.city,
          street: personalDetails.street,
          postalCode: personalDetails.postalCode,
        },
      };

      const personalRes = await fetch(`${backendUrl}/personal-details/add-personal-details`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const personalData = await personalRes.json();
      if (!personalData.success || !personalData.personalDetails?._id) {
        alert("Failed to save personal details: " + (personalData.message || "Unknown error"));
        return;
      }

      const shippingAddressId = personalData.personalDetails._id;

      // Prepare items for order
      const items = cartItems.map(item => ({
        product: item.productId._id,
        name: item.productId.productName,
        price: item.productId.selling,
        quantity: item.quantity,
        image: item.productId.productImage?.[0] || "",
      }));

      // Place order
      const orderRes = await fetch(`${backendUrl}/order/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress: shippingAddressId,
          paymentMethod,
          totalAmount,
        }),
      });

      const orderData = await orderRes.json();
      if (orderData.success) {
        // Navigate to payment page with all data carried over
        navigate("/payment", {
          state: {
            orderId: orderData.order._id,
            cartItems: items,
            totalAmount,
            paymentMethod,
            personalDetails,
          },
        });
      } else {
        alert("Order failed: " + orderData.message);
      }
    } catch (err) {
      console.error("Place order error:", err);
      alert("Something went wrong while placing the order.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-8">
          {/* PERSONAL DETAILS */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Personal & Shipping Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="firstName"
                value={personalDetails.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="peer w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
              />
              <input
                name="lastName"
                value={personalDetails.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="peer w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="email"
                value={personalDetails.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="peer w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
              />
              <input
                name="phone"
                value={personalDetails.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="peer w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="country"
                value={personalDetails.country}
                onChange={handleInputChange}
                placeholder="Country"
                className="peer w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
              />
              <input
                name="city"
                value={personalDetails.city}
                onChange={handleInputChange}
                placeholder="City"
                className="peer w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <input
                name="street"
                value={personalDetails.street}
                onChange={handleInputChange}
                placeholder="Street Address"
                className="peer w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
              />
              <input
                name="postalCode"
                value={personalDetails.postalCode}
                onChange={handleInputChange}
                placeholder="Postal Code (optional)"
                className="peer w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
              />
            </div>
          </div>

          {/* PAYMENT METHODS */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["mpesa", "card", "paypal", "cash"].map((method) => (
                <label
                  key={method}
                  className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition duration-300 hover:shadow-lg
                    ${paymentMethod === method ? "border-blue-600 bg-blue-50 shadow" : "border-gray-300"}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="accent-blue-600"
                    />
                    <span className="capitalize font-medium text-gray-700">{method}</span>
                  </div>
                  <div>{paymentIcons[method]}</div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – ORDER SUMMARY */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 h-fit">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Order Summary</h2>
          {loading ? (
            <p>Loading cart...</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={item?.productId?.productImage?.[0] || "/fallback-image.png"}
                      alt={item?.productId?.productName || "Product"}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-contain"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item?.productId?.productName || "Product"}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-lg text-gray-900">
                    {displayKESCurrency(item.quantity * (item?.productId?.selling || 0))}
                  </p>
                </div>
              ))}
              <div className="border-t mt-6 pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{displayKESCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>{displayKESCurrency(totalAmount)}</span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Place Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
