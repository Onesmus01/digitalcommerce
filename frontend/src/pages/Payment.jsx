import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import { FaCcVisa, FaCcMastercard, FaPaypal, FaMoneyBillWave } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

/* Mpesa Icon */
const MpesaIcon = () => (
  <img src="/icons/mpesa.png" alt="Mpesa" className="w-7 h-7" />
);

/* Payment Icons */
const paymentIcons = {
  mpesa: <MpesaIcon />,
  card: (
    <div className="flex gap-2 items-center">
      <FaCcVisa size={22} color="#1a1f71" />
      <FaCcMastercard size={22} color="#eb001b" />
    </div>
  ),
  paypal: <FaPaypal size={22} color="#003087" />,
  cash: <FaMoneyBillWave size={22} color="#16a34a" />,
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";

  const {
    orderId,
    cartItems = [],
    totalAmount = 0,
    paymentMethod = "mpesa",
    personalDetails = {},
  } = location.state || {};

  /* STATE */
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod);
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle | pending | success | failed | cancelled

  /* REFS */
  const pollRef = useRef(null);
  const isMounted = useRef(true);
  const lastRequestTime = useRef(0);
  const REQUEST_DELAY = 60000;

  /* SAFETY */
  useEffect(() => {
    if (!orderId) navigate("/cart");

    return () => {
      isMounted.current = false;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [orderId, navigate]);

  /* PHONE FORMAT */
  const formatPhone = (phone) => {
    const p = phone.replace(/\D/g, "");
    if (p.startsWith("0")) return "254" + p.slice(1);
    if (p.startsWith("254")) return p;
    return null;
  };

  /* POLLING */
  const startPolling = (txId) => {
    let count = 0;
    const MAX = 100;

    pollRef.current = setInterval(async () => {
      count++;
      try {
        const res = await fetch(
          `${backendUrl}/payment/mpesa/status/${txId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (!isMounted.current) return;

        if (["success", "failed", "cancelled"].includes(data.status)) {
          clearInterval(pollRef.current);
          setProcessing(false);
          toast.dismiss("mpesa");

          if (data.status === "success") {
            setPaymentStatus("success");
            toast.success("Payment successful 🎉");
          }

          if (data.status === "cancelled") {
            setPaymentStatus("cancelled");
            toast.error("Payment cancelled. Please retry ❌");
          }

          if (data.status === "failed") {
            setPaymentStatus("failed");
            toast.error("Payment failed. Try again ❌");
          }
        }

        if (count >= MAX) {
          clearInterval(pollRef.current);
          setProcessing(false);
          toast.dismiss("mpesa");
          toast.error("Payment timeout. Try again ⏳");
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);
  };

  /* PAY */
  const handleMpesaPayment = async () => {
    const now = Date.now();
    if (now - lastRequestTime.current < REQUEST_DELAY) {
      toast.error("Please wait before retrying ⏳");
      return;
    }

    const phone = formatPhone(mpesaPhone);
    if (!phone || phone.length !== 12) {
      toast.error("Enter a valid Mpesa number");
      return;
    }

    lastRequestTime.current = now;
    setProcessing(true);
    setPaymentStatus("pending");
    toast.loading("Sending Mpesa prompt... 📲", { id: "mpesa" });

    try {
      const res = await fetch(`${backendUrl}/payment/mpesa/pay`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount: totalAmount,
          orderId,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.dismiss("mpesa");
        toast.error(data.message || "Failed to initiate payment");
        setProcessing(false);
        return;
      }

      toast.dismiss("mpesa");
      toast.success("Enter your Mpesa PIN 📲");
      startPolling(data.transaction_id);
    } catch (err) {
      console.error(err);
      toast.dismiss("mpesa");
      toast.error("Mpesa error ❌");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 relative">
      <Toaster position="top-right" />

      {/* SUCCESS MODAL */}
      {paymentStatus === "success" && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-3">
              Payment Successful 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Your order has been paid successfully.
            </p>
            <button
              onClick={() => navigate("/thank-you")}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          {/* CUSTOMER */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Customer Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input readOnly value={personalDetails.firstName || ""} className="input-readonly" />
              <input readOnly value={personalDetails.lastName || ""} className="input-readonly" />
              <input readOnly value={personalDetails.email || ""} className="input-readonly" />
              <input readOnly value={personalDetails.phone || ""} className="input-readonly" />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

            {["mpesa", "card", "paypal", "cash"].map((method) => (
              <div
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`border-2 rounded-xl p-5 mb-4 cursor-pointer ${
                  selectedMethod === method
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    {paymentIcons[method]}
                    <span className="capitalize font-semibold">{method}</span>
                  </div>
                  {selectedMethod === method && (
                    <span className="text-blue-600 text-sm">Selected</span>
                  )}
                </div>

                {method === "mpesa" && selectedMethod === "mpesa" && (
                  <input
                    type="tel"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    placeholder="07XXXXXXXX"
                    className="mt-4 w-full border rounded-xl px-4 py-3"
                  />
                )}
              </div>
            ))}

            {selectedMethod === "mpesa" && (
              <button
                onClick={handleMpesaPayment}
                disabled={processing || paymentStatus === "success"}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                {processing
                  ? "Waiting for Mpesa..."
                  : paymentStatus === "success"
                  ? "Paid ✅"
                  : "Pay Now"}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-3xl shadow-xl p-6 h-fit">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          {cartItems.map((item, i) => (
            <div key={i} className="flex justify-between mb-4">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">
                {displayKESCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
          <div className="border-t pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>{displayKESCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
