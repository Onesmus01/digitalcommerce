// import { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import displayKESCurrency from "@/helpers/displayCurrency.js";
// import { FaCcVisa, FaCcMastercard, FaPaypal, FaMoneyBillWave } from "react-icons/fa";
// import toast, { Toaster } from "react-hot-toast";

// // Mpesa icon
// const MpesaIcon = () => <img src="/icons/mpesa.png" alt="Mpesa" className="w-7 h-7" />;

// // Payment icons
// const paymentIcons = {
//   mpesa: <MpesaIcon />,
//   card: (
//     <div className="flex gap-2 items-center">
//       <FaCcVisa size={22} color="#1a1f71" />
//       <FaCcMastercard size={22} color="#eb001b" />
//     </div>
//   ),
//   paypal: <FaPaypal size={22} color="#003087" />,
//   cash: <FaMoneyBillWave size={22} color="#16a34a" />,
// };

// const PaymentPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";

//   const { orderId, cartItems = [], totalAmount = 0, paymentMethod = "mpesa", personalDetails = {} } =
//     location.state || {};

//   // State
//   const [selectedMethod, setSelectedMethod] = useState(paymentMethod);
//   const [mpesaPhone, setMpesaPhone] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const [transactionId, setTransactionId] = useState(null);
//   const [paymentStatus, setPaymentStatus] = useState("pending");

//   // Refs
//   const lastRequestTime = useRef(0);
//   const REQUEST_DELAY = 60000; // 1 min
//   const pollIntervalRef = useRef(null);
//   const isMounted = useRef(true);

//   useEffect(() => {
//     if (!orderId) navigate("/cart");

//     return () => {
//       isMounted.current = false;
//       if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
//     };
//   }, [orderId, navigate]);

//   // Format Kenyan phone
//   const formatPhone = (phone) => {
//     const sanitized = phone.replace(/\D/g, "");
//     if (sanitized.startsWith("0")) return "254" + sanitized.slice(1);
//     if (sanitized.startsWith("254")) return sanitized;
//     return null;
//   };

//   // Poll backend for payment status
//   const startPolling = (txId) => {
//     if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
//     let count = 0;
//     const maxPoll = 100; // ~5 minutes

//     pollIntervalRef.current = setInterval(async () => {
//       count++;
//       try {
//         const res = await fetch(`${backendUrl}/payment/mpesa/status/${txId}`, { credentials: "include" });
//         const data = await res.json();

//         if (!isMounted.current) return;

//         if (data.success) setPaymentStatus(data.status);

//         if (["success", "failed", "cancelled"].includes(data.status)) {
//           clearInterval(pollIntervalRef.current);
//           setProcessing(false);

//           if (data.status === "success") {
//             toast.success("Payment Successful! ✅");
//             navigate("/thank-you");
//           } else if (data.status === "failed") {
//             toast.error("Payment failed ❌");
//           } else {
//             toast.error("Payment cancelled 😅");
//           }
//         }

//         if (count >= maxPoll) {
//           clearInterval(pollIntervalRef.current);
//           setProcessing(false);
//           toast.error("Payment timeout. Try again.");
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     }, 3000);
//   };

//   // Handle Mpesa payment
//   const handleMpesaPayment = async () => {
//     const now = Date.now();
//     if (now - lastRequestTime.current < REQUEST_DELAY) {
//       toast.warn("Please wait a moment before trying again ⏳");
//       return;
//     }

//     const phone = formatPhone(mpesaPhone);
//     if (!phone || phone.length !== 12) {
//       toast.error("Enter a valid Mpesa phone number (07XXXXXXXX or 2547XXXXXXXX)");
//       return;
//     }

//     lastRequestTime.current = now;
//     setProcessing(true);
//     setPaymentStatus("pending");
//     toast.loading("Sending Mpesa prompt... 📲", { id: "mpesa" });

//     try {
//       const res = await fetch(`${backendUrl}/payment/mpesa/pay`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone, amount: totalAmount, orderId }),
//       });
//       const data = await res.json();

//       if (!data.success) {
//         toast.dismiss("mpesa");
//         toast.error(data.message || "Failed to initiate Mpesa payment");
//         setProcessing(false);
//         return;
//       }

//       setTransactionId(data.transaction_id);
//       toast.dismiss("mpesa");
//       toast.success("Mpesa prompt sent! Enter your PIN 📲");

//       startPolling(data.transaction_id);
//     } catch (err) {
//       console.error(err);
//       toast.dismiss("mpesa");
//       toast.error("Mpesa payment error ❌");
//       setProcessing(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-10 relative">
//       <Toaster position="top-right" />
//       <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* LEFT SIDE */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* CUSTOMER INFO */}
//           <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
//             <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Details</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <input readOnly value={personalDetails.firstName || ""} className="input-readonly" placeholder="First Name" />
//               <input readOnly value={personalDetails.lastName || ""} className="input-readonly" placeholder="Last Name" />
//               <input readOnly value={personalDetails.email || ""} className="input-readonly" placeholder="Email" />
//               <input readOnly value={personalDetails.phone || ""} className="input-readonly" placeholder="Phone" />
//             </div>
//           </div>

//           {/* PAYMENT METHOD */}
//           <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
//             <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Method</h2>
//             {["mpesa", "card", "paypal", "cash"].map((method) => (
//               <div
//                 key={method}
//                 className={`border-2 rounded-2xl p-5 mb-4 transition-all ${
//                   selectedMethod === method
//                     ? "border-blue-600 bg-blue-50"
//                     : "border-gray-200 bg-white hover:border-blue-400 cursor-pointer"
//                 }`}
//                 onClick={() => setSelectedMethod(method)}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     {paymentIcons[method]}
//                     <span className="capitalize font-semibold text-gray-800">{method}</span>
//                   </div>
//                   {selectedMethod === method && <span className="text-sm text-blue-600 font-medium">Selected</span>}
//                 </div>

//                 {method === "mpesa" && selectedMethod === "mpesa" && (
//                   <div className="mt-5">
//                     <label className="block text-sm font-medium mb-2">Mpesa Phone Number</label>
//                     <input
//                       type="tel"
//                       placeholder="07XXXXXXXX or 2547XXXXXXXX"
//                       value={mpesaPhone}
//                       onChange={(e) => setMpesaPhone(e.target.value)}
//                       className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
//                     />
//                   </div>
//                 )}
//               </div>
//             ))}

//             {selectedMethod === "mpesa" && (
//               <div className="flex gap-4">
//                 <button
//                   onClick={handleMpesaPayment}
//                   disabled={processing || ["success"].includes(paymentStatus)}
//                   className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
//                 >
//                   {processing
//                     ? "Waiting for Mpesa..."
//                     : paymentStatus === "success"
//                     ? "Paid ✅"
//                     : "Pay Now"}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* RIGHT SIDE – ORDER SUMMARY */}
//         <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 h-fit">
//           <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>
//           <div className="space-y-4">
//             {cartItems.map((item, i) => (
//               <div key={i} className="flex items-center justify-between gap-4">
//                 <div className="flex items-center gap-3">
//                   <img src={item.image || "/fallback-image.png"} className="w-16 h-16 rounded-lg object-contain" />
//                   <div>
//                     <p className="font-medium">{item.name}</p>
//                     <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                   </div>
//                 </div>
//                 <p className="font-semibold">{displayKESCurrency(item.price * item.quantity)}</p>
//               </div>
//             ))}
//             <div className="border-t pt-4 flex justify-between font-bold">
//               <span>Total</span>
//               <span>{displayKESCurrency(totalAmount)}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;

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

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";

  const {
    orderId,
    cartItems = [],
    totalAmount = 0,
    paymentMethod = "mpesa",
    personalDetails = {},
  } = location.state || {};

  /* ---------------- STATE ---------------- */
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod);
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle"); 
  // idle | pending | success | failed | cancelled

  /* ---------------- REFS ---------------- */
  const pollRef = useRef(null);
  const lastRequestTime = useRef(0);
  const isMounted = useRef(true);

  const REQUEST_DELAY = 60000; // 1 minute
  const POLL_INTERVAL = 3000;  // 3 seconds
  const MAX_POLLS = 20;        // 20 x 3s = 60 seconds

  /* ---------------- SAFETY ---------------- */
  useEffect(() => {
    if (!orderId) navigate("/cart");

    return () => {
      isMounted.current = false;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [orderId, navigate]);

  /* ---------------- FORMAT PHONE ---------------- */
  const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) return "254" + cleaned.slice(1);
    if (cleaned.startsWith("254")) return cleaned;
    return null;
  };

  /* ---------------- POLLING ---------------- */
  const startPolling = (txId) => {
    let count = 0;

    pollRef.current = setInterval(async () => {
      count++;

      try {
        const res = await fetch(
          `${backendUrl}/payment/mpesa/status/${txId}?t=${Date.now()}`,
          { credentials: "include" }
        );

        const data = await res.json();
        if (!isMounted.current) return;

        if (["success", "failed", "cancelled"].includes(data.status)) {
          clearInterval(pollRef.current);
          setProcessing(false);
          toast.dismiss("mpesa");

          setPaymentStatus(data.status);

          if (data.status === "success") {
            toast.success("Payment successful 🎉");
            setTimeout(() => navigate("/thank-you"), 1500);
          }

          if (data.status === "failed") {
            toast.error("Payment failed ❌ Try again.");
          }

          if (data.status === "cancelled") {
            toast.error("Payment cancelled ❌ Try again.");
          }
        }

        /* TIMEOUT */
        if (count >= MAX_POLLS) {
          clearInterval(pollRef.current);
          setProcessing(false);
          toast.dismiss("mpesa");
          setPaymentStatus("failed");
          toast.error("Payment timeout. Please retry ❌");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, POLL_INTERVAL);
  };

  /* ---------------- PAY ---------------- */
  const handleMpesaPayment = async () => {
    const now = Date.now();

    if (now - lastRequestTime.current < REQUEST_DELAY) {
      toast.error("Please wait before retrying ⏳");
      return;
    }

    const phone = formatPhone(mpesaPhone);

    if (!phone || phone.length !== 12) {
      toast.error("Enter valid Mpesa number (07XXXXXXXX)");
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

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
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

          {/* PAYMENT METHOD */}
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

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-3xl shadow-xl p-6 h-fit">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          {cartItems.map((item, i) => (
            <div key={i} className="flex justify-between mb-4">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>
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