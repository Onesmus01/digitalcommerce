import { useState, useEffect,useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import { Context } from "@/context/ProductContext.jsx";

import { 
  FaCcVisa, 
  FaCcMastercard, 
  FaPaypal, 
  FaMoneyBillWave,
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaTruck,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaFlag,
  FaCity,
  FaRoad,
  FaMapPin,
  FaExclamationCircle
} from "react-icons/fa";
import { 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Package, 
  CreditCard, 
  Wallet, 
  Banknote, 
  Smartphone,
  AlertCircle,
  Loader2,
  ArrowRight,
  X,
  ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced M-Pesa Icon
const MpesaIcon = ({ size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-10 h-10 rounded-xl",
    lg: "w-12 h-12 rounded-xl"
  };
  return (
    <div className={`${sizes[size]} bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-200 flex-shrink-0`}>
      <span className="text-white font-bold text-[10px] sm:text-xs tracking-tight">M-PESA</span>
    </div>
  );
};

const paymentMethods = [
  {
    id: "mpesa",
    name: "M-Pesa",
    description: "Mobile money",
    fullDescription: "Pay via M-Pesa mobile money",
    icon: (size) => <MpesaIcon size={size} />,
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
    textColor: "text-green-700",
    popular: true
  },
  {
    id: "card",
    name: "Card",
    fullName: "Credit Card",
    description: "Visa, Mastercard",
    icon: (size) => {
      const sizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12" };
      return (
        <div className={`${sizes[size]} bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 flex-shrink-0`}>
          <CreditCard className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
        </div>
      );
    },
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
    textColor: "text-blue-700"
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Fast checkout",
    fullDescription: "Fast & secure checkout",
    icon: (size) => {
      const sizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12" };
      return (
        <div className={`${sizes[size]} bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 flex-shrink-0`}>
          <FaPaypal className={`${size === 'sm' ? 'text-sm' : 'text-lg'} text-white`} />
        </div>
      );
    },
    color: "indigo",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-500",
    textColor: "text-indigo-700"
  },
  {
    id: "cash",
    name: "Cash",
    fullName: "Cash on Delivery",
    description: "Pay on delivery",
    fullDescription: "Pay when you receive",
    icon: (size) => {
      const sizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12" };
      return (
        <div className={`${sizes[size]} bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 flex-shrink-0`}>
          <Banknote className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
        </div>
      );
    },
    color: "emerald",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-500",
    textColor: "text-emerald-700"
  }
];

const InputField = ({ 
  name, 
  value, 
  onChange, 
  placeholder, 
  type = "text", 
  icon: Icon, 
  required = false,
  half = false,
  error = null,
  isMobile = false
}) => (
  <div className={`relative group ${half ? '' : 'sm:col-span-2'}`}>
    <div className={`absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors`}>
      <Icon size={isMobile ? 14 : 16} />
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full bg-gray-50 border-2 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-600 focus:ring-indigo-100'} rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-3 outline-none transition-all duration-200 font-medium ${isMobile ? 'pl-9 pr-2.5 py-2.5 text-xs' : 'pl-10 pr-3 py-3 text-sm'}`}
    />
    {required && !value && (
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-red-400 font-medium">
        *
      </span>
    )}
    {error && (
      <span className="absolute -bottom-4 left-0 text-[10px] text-red-500 font-medium flex items-center gap-1">
        <FaExclamationCircle size={9} /> {error}
      </span>
    )}
  </div>
);

const ProgressStep = ({ number, title, active, completed, isMobile }) => (
  <div className="flex items-center gap-1.5 sm:gap-2">
    <div className={`${isMobile ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'} rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
      completed ? "bg-green-500 text-white shadow-md shadow-green-200" : 
      active ? "bg-indigo-600 text-white ring-2 ring-indigo-100 shadow-md shadow-indigo-200" : 
      "bg-gray-200 text-gray-500"
    }`}>
      {completed ? <FaCheckCircle size={isMobile ? 12 : 14} /> : number}
    </div>
    {!isMobile && (
      <span className={`font-semibold text-xs ${active ? "text-gray-900" : "text-gray-400"}`}>
        {title}
      </span>
    )}
  </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle, gradient, isMobile }) => (
  <div className={`bg-gradient-to-r ${gradient} ${isMobile ? 'px-3 py-2.5' : 'px-4 py-3'}`}>
    <div className="flex items-center gap-2">
      <div className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
        <Icon className="text-white text-xs sm:text-sm" size={isMobile ? 14 : 16} />
      </div>
      <div className="min-w-0">
        <h2 className="text-white font-bold text-xs sm:text-sm truncate">{title}</h2>
        <p className={`${isMobile ? 'text-[9px]' : 'text-xs'} text-white/80 truncate hidden sm:block`}>{subtitle}</p>
      </div>
    </div>
  </div>
);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [errors, setErrors] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  
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

   const { backendUrl, getAuthHeaders } = useContext(Context);
 
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/user/view-cart-product`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
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

  const originalTotal = cartItems.reduce(
    (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
    0
  );

  const savings = originalTotal - totalAmount;

  const validateForm = () => {
    const newErrors = {};
    const required = ['firstName', 'lastName', 'email', 'phone', 'country', 'city', 'street'];
    
    required.forEach(field => {
      if (!personalDetails[field]?.trim()) {
        newErrors[field] = "Required";
      }
    });

    if (personalDetails.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(personalDetails.email)) {
      newErrors.email = "Invalid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails({ ...personalDetails, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      const firstError = document.querySelector('.error-field');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (cartItems.length === 0) {
      alert("No items in your cart!");
      return;
    }

    setPlacingOrder(true);

    try {
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
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const personalData = await personalRes.json();
      if (!personalData.success || !personalData.personalDetails?._id) {
        alert("Failed to save personal details: " + (personalData.message || "Unknown error"));
        setPlacingOrder(false);
        return;
      }

      const shippingAddressId = personalData.personalDetails._id;

      const items = cartItems.map(item => ({
        product: item.productId._id,
        name: item.productId.productName,
        price: item.productId.selling,
        quantity: item.quantity,
        image: item.productId.productImage?.[0] || "",
      }));

      const orderRes = await fetch(`${backendUrl}/order/create`, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          items,
          shippingAddress: shippingAddressId,
          paymentMethod,
          totalAmount,
        }),
      });

      const orderData = await orderRes.json();
      if (orderData.success) {
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
        setPlacingOrder(false);
      }
    } catch (err) {
      console.error("Place order error:", err);
      alert("Something went wrong while placing the order.");
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 animate-spin" />
          <p className="text-gray-600 font-medium text-xs sm:text-sm">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20 sm:pb-0">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
            <Link to="/cart" className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors p-1 -ml-1">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-xs sm:text-sm hidden sm:inline">Back</span>
            </Link>
            
            <div className="flex items-center gap-1.5 sm:gap-3">
              <ProgressStep number={1} title="Cart" completed={true} isMobile={isMobile} />
              <div className="w-2 sm:w-4 h-0.5 bg-gray-200" />
              <ProgressStep number={2} title="Details" active={true} isMobile={isMobile} />
              <div className="w-2 sm:w-4 h-0.5 bg-gray-200 hidden sm:block" />
              <ProgressStep number={3} title="Payment" isMobile={isMobile} />
            </div>

            <div className="flex items-center gap-1 text-green-600">
              <FaShieldAlt size={isMobile ? 12 : 14} />
              <span className="text-[10px] sm:text-xs font-semibold hidden sm:inline">Secure</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
          {/* LEFT SIDE - Forms */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            
            {/* Personal Details */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <SectionHeader 
                icon={FaUser} 
                title="Personal Details" 
                subtitle="Enter your contact information"
                gradient="from-indigo-600 to-purple-600"
                isMobile={isMobile}
              />

              <div className={`${isMobile ? 'p-3' : 'p-4 sm:p-5'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <InputField
                    name="firstName"
                    value={personalDetails.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    icon={FaUser}
                    required
                    half
                    error={errors.firstName}
                    isMobile={isMobile}
                  />
                  <InputField
                    name="lastName"
                    value={personalDetails.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    icon={FaUser}
                    required
                    half
                    error={errors.lastName}
                    isMobile={isMobile}
                  />
                  <InputField
                    name="email"
                    type="email"
                    value={personalDetails.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    icon={FaEnvelope}
                    required
                    half
                    error={errors.email}
                    isMobile={isMobile}
                  />
                  <InputField
                    name="phone"
                    type="tel"
                    value={personalDetails.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    icon={FaPhone}
                    required
                    half
                    error={errors.phone}
                    isMobile={isMobile}
                  />
                </div>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <SectionHeader 
                icon={FaMapMarkerAlt} 
                title="Shipping Address" 
                subtitle="Where should we deliver?"
                gradient="from-blue-600 to-cyan-600"
                isMobile={isMobile}
              />

              <div className={`${isMobile ? 'p-3' : 'p-4 sm:p-5'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <InputField
                    name="country"
                    value={personalDetails.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    icon={FaFlag}
                    required
                    half
                    error={errors.country}
                    isMobile={isMobile}
                  />
                  <InputField
                    name="city"
                    value={personalDetails.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    icon={FaCity}
                    required
                    half
                    error={errors.city}
                    isMobile={isMobile}
                  />
                  <InputField
                    name="street"
                    value={personalDetails.street}
                    onChange={handleInputChange}
                    placeholder="Street Address"
                    icon={FaRoad}
                    required
                    error={errors.street}
                    isMobile={isMobile}
                  />
                  <InputField
                    name="postalCode"
                    value={personalDetails.postalCode}
                    onChange={handleInputChange}
                    placeholder="Postal Code (Optional)"
                    icon={FaMapPin}
                    isMobile={isMobile}
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <SectionHeader 
                icon={Wallet} 
                title="Payment Method" 
                subtitle="Choose your preferred payment"
                gradient="from-green-600 to-teal-600"
                isMobile={isMobile}
              />

              <div className={`${isMobile ? 'p-3' : 'p-4 sm:p-5'}`}>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`relative cursor-pointer rounded-lg sm:rounded-xl border-2 p-2 sm:p-3 transition-all duration-200 ${
                        paymentMethod === method.id
                          ? `${method.borderColor} ${method.bgColor} shadow-md`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {method.popular && !isMobile && (
                        <span className="absolute -top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                          POPULAR
                        </span>
                      )}
                      
                      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-1.5 sm:gap-3">
                        <div className="flex-shrink-0">
                          {method.icon(isMobile ? 'sm' : 'md')}
                        </div>
                        <div className="flex-1 min-w-0 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-between gap-1 sm:mb-0.5">
                            <h3 className={`font-bold text-[11px] sm:text-sm ${paymentMethod === method.id ? method.textColor : 'text-gray-900'}`}>
                              {isMobile ? method.name : method.fullName || method.name}
                            </h3>
                            {paymentMethod === method.id && (
                              <FaCheckCircle className={`${method.textColor} flex-shrink-0 text-xs sm:text-base`} />
                            )}
                          </div>
                          <p className="text-[9px] sm:text-xs text-gray-500 hidden sm:block leading-tight">{method.fullDescription}</p>
                          <p className="text-[9px] text-gray-500 sm:hidden leading-tight">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE - Order Summary */}
          <div className="lg:col-span-5">
            {/* Mobile Order Summary Toggle */}
            <div className="lg:hidden mb-2">
              <button
                onClick={() => setShowOrderSummary(!showOrderSummary)}
                className="w-full bg-white rounded-lg shadow-sm border border-gray-100 p-2.5 flex items-center justify-between active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-900 text-xs">Order Summary</span>
                  <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full">
                    {cartItems.length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-gray-900 text-xs">{displayKESCurrency(totalAmount)}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showOrderSummary ? 'rotate-180' : ''}`} />
                </div>
              </button>
            </div>

            {/* Order Summary Card */}
            <motion.div 
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-20 overflow-hidden ${showOrderSummary ? 'block' : 'hidden lg:block'}`}
            >
              <div className="bg-gray-900 text-white px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <h2 className="font-bold text-xs sm:text-sm">Order Summary</h2>
                </div>
              </div>

              <div className={`${isMobile ? 'p-3' : 'p-4'}`}>
                {/* Items */}
                <div className="space-y-2 mb-3 sm:mb-4 max-h-40 sm:max-h-52 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex gap-2 p-2 bg-gray-50 rounded-lg sm:rounded-xl">
                      <div className="relative flex-shrink-0">
                        <img
                          src={item?.productId?.productImage?.[0] || "/fallback-image.png"}
                          alt={item?.productId?.productName}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover bg-white"
                        />
                        <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-indigo-600 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-[11px] sm:text-xs truncate leading-tight">
                          {item?.productId?.productName}
                        </h4>
                        <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5">
                          {displayKESCurrency(item?.productId?.selling)} each
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900 text-[11px] sm:text-xs">
                          {displayKESCurrency(item.quantity * (item?.productId?.selling || 0))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="space-y-1.5 py-2 sm:py-3 border-t border-gray-100">
                  <div className="flex justify-between text-[11px] sm:text-xs">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{displayKESCurrency(originalTotal)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-[11px] sm:text-xs">
                      <span className="text-green-600">Discount</span>
                      <span className="font-medium text-green-600">-{displayKESCurrency(savings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px] sm:text-xs">
                    <span className="text-gray-600 flex items-center gap-1">
                      <FaTruck className="text-blue-600 text-[10px]" />
                      Shipping
                    </span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-[11px] sm:text-xs">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">Calculated later</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-2 sm:pt-3 mt-2 sm:mt-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[11px] sm:text-xs text-gray-600 font-medium">Total</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400">Inc. VAT</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{displayKESCurrency(totalAmount)}</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5">KES</p>
                    </div>
                  </div>
                </div>

                {/* Desktop Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="hidden sm:flex w-full mt-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 rounded-xl font-bold text-sm hover:from-gray-800 hover:to-gray-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg items-center justify-center gap-2 group"
                >
                  {placingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                {/* Security Badges */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] text-gray-500">
                    <div className="flex items-center gap-0.5">
                      <FaLock className="text-green-600" size={10} />
                      <span>SSL</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <FaShieldAlt className="text-blue-600" size={10} />
                      <span>Protected</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Desktop Trust Badges */}
            <div className="hidden sm:grid mt-3 grid-cols-3 gap-2">
              <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
                <FaCcVisa className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                <span className="text-[10px] text-gray-600">Visa</span>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
                <FaCcMastercard className="w-6 h-6 mx-auto text-red-600 mb-1" />
                <span className="text-[10px] text-gray-600">Mastercard</span>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
                <FaShieldAlt className="w-6 h-6 mx-auto text-green-600 mb-1" />
                <span className="text-[10px] text-gray-600">Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2.5 shadow-lg z-50 safe-area-bottom">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div>
            <p className="text-[9px] text-gray-500">Total to pay</p>
            <p className="text-base font-bold text-gray-900">{displayKESCurrency(totalAmount)}</p>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className={`flex-1 max-w-[180px] py-2.5 rounded-lg font-bold text-white shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 text-xs ${
              placingOrder
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-gray-900 to-gray-800"
            }`}
          >
            {placingOrder ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>Place Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
        <div className="flex items-center justify-center gap-3 text-[9px] text-gray-500">
          <span className="flex items-center gap-0.5"><FaLock size={9} className="text-green-600" /> SSL Secure</span>
          <span className="flex items-center gap-0.5"><FaShieldAlt size={9} className="text-blue-600" /> Protected</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;