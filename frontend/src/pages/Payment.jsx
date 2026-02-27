import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import { 
  FaCcVisa, 
  FaCcMastercard, 
  FaPaypal, 
  FaMoneyBillWave,
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaPhone,
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";
import { 
  Smartphone, 
  CreditCard, 
  Wallet, 
  Banknote,
  ChevronRight,
  ArrowLeft,
  Package,
  Menu,
  X
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

/* Enhanced Mpesa Icon */
const MpesaIcon = () => (
  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-green-200 flex-shrink-0">
    <span className="text-white font-bold text-[10px] sm:text-xs">M-PESA</span>
  </div>
);

/* Payment Method Config */
const paymentMethods = [
  {
    id: "mpesa",
    name: "M-Pesa",
    description: "Pay with mobile money",
    icon: <MpesaIcon />,
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
    textColor: "text-green-700"
  },
  {
    id: "card",
    name: "Card",
    description: "Visa, Mastercard",
    icon: (
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 flex-shrink-0">
        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
    ),
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
    textColor: "text-blue-700"
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Fast checkout",
    icon: (
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 flex-shrink-0">
        <FaPaypal className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
    ),
    color: "indigo",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-500",
    textColor: "text-indigo-700"
  },
  {
    id: "cash",
    name: "Cash",
    description: "Pay on delivery",
    icon: (
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 flex-shrink-0">
        <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
    ),
    color: "emerald",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-500",
    textColor: "text-emerald-700"
  }
];

const PaymentStatusBadge = ({ status }) => {
  const configs = {
    idle: { bg: "bg-gray-100", text: "text-gray-600", icon: null, label: "Ready" },
    pending: { bg: "bg-amber-100", text: "text-amber-700", icon: FaSpinner, label: "Processing" },
    success: { bg: "bg-green-100", text: "text-green-700", icon: FaCheckCircle, label: "Success" },
    failed: { bg: "bg-red-100", text: "text-red-700", icon: FaExclamationCircle, label: "Failed" },
    cancelled: { bg: "bg-gray-100", text: "text-gray-600", icon: FaExclamationCircle, label: "Cancelled" }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full ${config.bg} ${config.text} font-semibold text-xs sm:text-sm`}>
      {Icon && <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${status === 'pending' ? 'animate-spin' : ''}`} />}
      <span className="hidden sm:inline">{config.label}</span>
      <span className="sm:hidden">{config.label.charAt(0)}</span>
    </div>
  );
};

const ProgressStep = ({ number, title, active, completed, isMobile }) => (
  <div className="flex items-center gap-2 sm:gap-3">
    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
      completed ? "bg-green-500 text-white" : 
      active ? "bg-indigo-600 text-white ring-2 sm:ring-4 ring-indigo-100" : 
      "bg-gray-200 text-gray-500"
    }`}>
      {completed ? <FaCheckCircle size={isMobile ? 12 : 16} /> : number}
    </div>
    <span className={`font-medium text-xs sm:text-sm ${active ? "text-gray-900" : "text-gray-400"} hidden sm:block`}>
      {title}
    </span>
  </div>
);

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";

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
  const [transactionId, setTransactionId] = useState(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  /* ---------------- REFS ---------------- */
  const pollRef = useRef(null);
  const lastRequestTime = useRef(0);
  const isMounted = useRef(true);
  const txIdRef = useRef(null);

  const REQUEST_DELAY = 60000;
  const POLL_INTERVAL = 3000;
  const MAX_POLLS = 20;

  /* ---------------- RESPONSIVE CHECK ---------------- */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ---------------- SAFETY ---------------- */
  useEffect(() => {
    if (!orderId) navigate("/cart");

    return () => {
      isMounted.current = false;
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [orderId, navigate]);

  /* ---------------- DEBUG ---------------- */
  useEffect(() => {
    console.log("[STATE] paymentStatus changed to:", paymentStatus);
  }, [paymentStatus]);

  /* ---------------- FORMAT PHONE ---------------- */
  const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) return "254" + cleaned.slice(1);
    if (cleaned.startsWith("254")) return cleaned;
    return null;
  };

  /* ---------------- POLLING ---------------- */
  const startPolling = useCallback((txId) => {
    // Store txId in ref to avoid closure issues
    txIdRef.current = txId;
    setTransactionId(txId);
    let count = 0;
    
    // Clear any existing interval first
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    const checkStatus = async () => {
      const currentTxId = txIdRef.current;
      if (!currentTxId) return false;
      
      count++;
      console.log(`[POLLING] Attempt ${count}/${MAX_POLLS} for tx: ${currentTxId}`);

      try {
        const res = await fetch(
          `${backendUrl}/payment/mpesa/status/${currentTxId}?_cb=${Date.now()}`,
          { 
            credentials: "include",
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        console.log("[POLLING] Response:", data);

        if (!isMounted.current) return true;

        // Check if we have a final status
        if (data.success && ["success", "failed", "cancelled"].includes(data.status)) {
          console.log("[POLLING] ✅ Final status detected:", data.status);
          
          // Stop polling
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }

          // Update all states
          setProcessing(false);
          toast.dismiss("mpesa");
          
          // Force status update
          setPaymentStatus(data.status);

          // Handle success/failure
          if (data.status === "success") {
            toast.success(data.message || "Payment successful! 🎉", { duration: 4000 });
            setTimeout(() => navigate("/thank-you"), 2000);
          } else if (data.status === "failed") {
            toast.error(data.message || "Payment failed. Please try again.");
          } else if (data.status === "cancelled") {
            toast.error(data.message || "Payment was cancelled.");
          }
          
          return true; // Stop polling
        }

        // Timeout check
        if (count >= MAX_POLLS) {
          console.log("[POLLING] ⏰ Timeout reached");
          
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
          
          setProcessing(false);
          toast.dismiss("mpesa");
          setPaymentStatus("failed");
          toast.error("Payment timeout. Please check your M-Pesa messages.");
          return true;
        }

        return false; // Continue polling
      } catch (err) {
        console.error("[POLLING ERROR]", err);
        return false; // Continue polling on error
      }
    };

    // Start polling immediately, then every 3 seconds
    checkStatus().then(shouldStop => {
      if (!shouldStop) {
        pollRef.current = setInterval(() => {
          checkStatus().then(stop => {
            if (stop && pollRef.current) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
          });
        }, POLL_INTERVAL);
      }
    });
  }, [backendUrl, navigate]);

  /* ---------------- VISIBILITY CHECK (Emergency Fallback) ---------------- */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && txIdRef.current && processing) {
        console.log("[VISIBILITY] Tab visible, forcing status check for:", txIdRef.current);
        
        fetch(`${backendUrl}/payment/mpesa/status/${txIdRef.current}?_cb=${Date.now()}`, {
          credentials: "include",
          headers: { 'Cache-Control': 'no-cache' }
        })
        .then(res => res.json())
        .then(data => {
          console.log("[VISIBILITY] Forced check result:", data);
          if (data.success && ["success", "failed", "cancelled"].includes(data.status)) {
            // Stop any existing polling
            if (pollRef.current) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
            
            setPaymentStatus(data.status);
            setProcessing(false);
            toast.dismiss("mpesa");
            
            if (data.status === "success") {
              toast.success("Payment successful! 🎉");
              setTimeout(() => navigate("/thank-you"), 1500);
            } else if (data.status === "failed") {
              toast.error(data.message || "Payment failed");
            } else {
              toast.error(data.message || "Payment cancelled");
            }
          }
        })
        .catch(err => console.error("[VISIBILITY] Check failed:", err));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [processing, backendUrl, navigate]);

  /* ---------------- PAY ---------------- */
  const handleMpesaPayment = async () => {
    const now = Date.now();

    if (now - lastRequestTime.current < REQUEST_DELAY) {
      const remaining = Math.ceil((REQUEST_DELAY - (now - lastRequestTime.current)) / 1000);
      toast.error(`Wait ${remaining}s`);
      return;
    }

    const phone = formatPhone(mpesaPhone);

    if (!phone || phone.length !== 12) {
      toast.error("Enter valid M-Pesa number");
      return;
    }

    lastRequestTime.current = now;
    setProcessing(true);
    setPaymentStatus("pending");

    toast.loading("Sending prompt...", { 
      id: "mpesa",
      duration: Infinity
    });

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
        toast.error(data.message || "Failed");
        setProcessing(false);
        setPaymentStatus("failed");
        return;
      }

      toast.dismiss("mpesa");
      toast.success("Enter M-Pesa PIN", { duration: 6000 });
      startPolling(data.transaction_id);
    } catch (err) {
      console.error(err);
      toast.dismiss("mpesa");
      toast.error("Network error");
      setProcessing(false);
      setPaymentStatus("failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20 sm:pb-0">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            maxWidth: '90vw',
          },
        }}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2 sm:ml-0"
            >
              <ArrowLeft size={isMobile ? 18 : 20} />
              <span className="font-medium text-sm sm:text-base">Back</span>
            </button>
            
            <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
              <ProgressStep number={1} title="Cart" completed={true} isMobile={isMobile} />
              <div className="w-4 sm:w-8 h-0.5 bg-gray-200" />
              <ProgressStep number={2} title="Details" completed={true} isMobile={isMobile} />
              <div className="w-4 sm:w-8 h-0.5 bg-gray-200" />
              <ProgressStep number={3} title="Payment" active={true} isMobile={isMobile} />
            </div>

            <div className="flex items-center gap-1 sm:gap-2 text-green-600">
              <FaShieldAlt size={isMobile ? 14 : 18} />
              <span className="text-xs sm:text-sm font-semibold hidden sm:inline">Secure</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
          {/* LEFT SIDE - Main Content */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* Customer Details Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50/50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaUser className="text-indigo-600 text-sm sm:text-base" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">Customer Details</h2>
                    <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Review your information</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 sm:p-6">
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {[
                    { label: "First Name", value: personalDetails.firstName, icon: FaUser },
                    { label: "Last Name", value: personalDetails.lastName, icon: FaUser },
                    { label: "Email", value: personalDetails.email, icon: FaEnvelope },
                    { label: "Phone", value: personalDetails.phone, icon: FaPhone },
                  ].map((field, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:block">
                        {field.label}
                      </label>
                      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                        <field.icon className="text-gray-400 flex-shrink-0" size={isMobile ? 12 : 14} />
                        <span className="font-medium text-gray-700 text-xs sm:text-sm truncate">
                          {field.value || "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50/50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                      <Wallet className="text-indigo-600" size={isMobile ? 16 : 20} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">Payment Method</h2>
                      <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Choose how to pay</p>
                    </div>
                  </div>
                  <PaymentStatusBadge status={paymentStatus} />
                </div>
              </div>

              <div className="p-3 sm:p-6 space-y-2 sm:space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => !processing && setSelectedMethod(method.id)}
                      className={`relative group cursor-pointer rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 transition-all duration-200 ${
                        selectedMethod === method.id
                          ? `${method.borderColor} ${method.bgColor} shadow-md`
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      } ${processing ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {method.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className={`font-bold text-sm sm:text-base truncate ${selectedMethod === method.id ? method.textColor : 'text-gray-900'}`}>
                              {method.name}
                            </h3>
                            {selectedMethod === method.id && (
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <FaCheckCircle className="text-white text-xs" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{method.description}</p>
                        </div>
                      </div>

                      {/* M-Pesa Input Field */}
                      {method.id === "mpesa" && selectedMethod === "mpesa" && (
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200/50 animate-in slide-in-from-top-2">
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                            M-Pesa Number
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
                              <Smartphone size={isMobile ? 16 : 18} />
                            </div>
                            <input
                              type="tel"
                              value={mpesaPhone}
                              onChange={(e) => setMpesaPhone(e.target.value)}
                              placeholder="07XX XXX XXX"
                              disabled={processing}
                              className="w-full pl-10 sm:pl-12 pr-16 sm:pr-20 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-medium text-sm sm:text-base placeholder:text-gray-400 disabled:bg-gray-100"
                            />
                            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
                              <span className="text-[10px] sm:text-xs text-gray-400 font-medium">KE</span>
                            </div>
                          </div>
                          <p className="mt-2 text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                            <FaLock size={10} />
                            <span className="hidden sm:inline">You'll receive an STK push on your phone</span>
                            <span className="sm:hidden">STK push will be sent</span>
                          </p>
                        </div>
                      )}

                      {/* Coming Soon Badge */}
                      {method.id !== "mpesa" && selectedMethod === method.id && (
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200/50">
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 sm:p-3 flex items-center gap-2 text-amber-800 text-xs">
                            <FaExclamationCircle size={isMobile ? 12 : 14} />
                            <span className="hidden sm:inline">This payment method will be available soon</span>
                            <span className="sm:hidden">Coming soon</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pay Button */}
                {selectedMethod === "mpesa" && (
                  <button
                    onClick={handleMpesaPayment}
                    disabled={processing || paymentStatus === "success" || !mpesaPhone}
                    className={`w-full mt-2 sm:mt-4 py-3 sm:py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                      processing || paymentStatus === "success"
                        ? "bg-gray-400 cursor-not-allowed shadow-none"
                        : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 hover:shadow-xl active:scale-[0.98]"
                    }`}
                  >
                    {processing ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span className="text-sm sm:text-base">Processing...</span>
                      </>
                    ) : paymentStatus === "success" ? (
                      <>
                        <FaCheckCircle />
                        <span className="text-sm sm:text-base">Complete</span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm sm:text-base">Pay {displayKESCurrency(totalAmount)}</span>
                        <ChevronRight size={isMobile ? 18 : 20} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Security Note - Desktop */}
            <div className="hidden sm:flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FaLock className="text-green-600" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-blue-600" />
                <span>PCI Compliant</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Order Summary */}
          <div className="lg:col-span-5">
            {/* Mobile Order Summary Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowOrderSummary(!showOrderSummary)}
                className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-900">Order Summary</span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {cartItems.length} items
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{displayKESCurrency(totalAmount)}</span>
                  {showOrderSummary ? <X size={20} /> : <ChevronRight size={20} className="rotate-90" />}
                </div>
              </button>
            </div>

            {/* Order Summary Card */}
            <div className={`
              bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-24 overflow-hidden
              ${showOrderSummary ? 'block' : 'hidden lg:block'}
            `}>
              <div className="bg-gray-900 text-white px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                  <h2 className="text-base sm:text-lg font-bold">Order Summary</h2>
                </div>
              </div>

              <div className="p-3 sm:p-6">
                {/* Items */}
                <div className="space-y-3 mb-4 sm:mb-6 max-h-48 sm:max-h-64 overflow-y-auto">
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={item.image || "/fallback-image.png"} 
                          alt={item.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover bg-white"
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-indigo-600 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{item.name}</h4>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                          {displayKESCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900 text-xs sm:text-sm">
                          {displayKESCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="space-y-2 py-3 sm:py-4 border-t border-gray-100 text-sm">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{displayKESCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">Included</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-0.5">Total</p>
                      <p className="text-[10px] sm:text-xs text-gray-400">Inc. VAT</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl sm:text-3xl font-bold text-gray-900">{displayKESCurrency(totalAmount)}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">KES</p>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 sm:gap-4 text-center">
                  <div className="text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                      <FaCcVisa className="text-blue-600 text-lg sm:text-xl" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500">Visa</span>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                      <FaCcMastercard className="text-red-600 text-lg sm:text-xl" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500">MC</span>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                      <FaShieldAlt className="text-green-600 text-lg sm:text-xl" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500">Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500">Total to pay</p>
            <p className="text-xl font-bold text-gray-900">{displayKESCurrency(totalAmount)}</p>
          </div>
          {selectedMethod === "mpesa" && (
            <button
              onClick={handleMpesaPayment}
              disabled={processing || paymentStatus === "success" || !mpesaPhone}
              className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
                processing || paymentStatus === "success" || !mpesaPhone
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-green-500 active:scale-95"
              }`}
            >
              {processing ? <FaSpinner className="animate-spin" /> : "Pay Now"}
            </button>
          )}
        </div>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><FaLock size={10} /> SSL</span>
          <span className="flex items-center gap-1"><FaShieldAlt size={10} /> Secure</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;