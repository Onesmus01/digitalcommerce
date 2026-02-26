import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  ShoppingBag, 
  Truck, 
  Clock, 
  ArrowRight,
  Home,
  Package,
  Receipt
} from "lucide-react";
import { useEffect, useState } from "react";

const ConfettiPiece = ({ delay, left, color }) => (
  <motion.div
    initial={{ y: -20, opacity: 0, rotate: 0 }}
    animate={{ 
      y: [0, 400, 800], 
      opacity: [0, 1, 0],
      rotate: [0, 360, 720],
      x: [0, Math.random() * 100 - 50, Math.random() * 200 - 100]
    }}
    transition={{ 
      duration: 3,
      delay: delay,
      ease: "easeOut"
    }}
    className="absolute w-3 h-3 rounded-sm"
    style={{ 
      left: `${left}%`,
      backgroundColor: color,
      top: '-20px'
    }}
  />
);

const Confetti = () => {
  const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 2,
    left: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.id} {...piece} />
      ))}
    </div>
  );
};

const OrderStatusItem = ({ icon: Icon, title, description, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
  >
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const ThankYouPage = () => {
  const navigate = useNavigate();
  const [orderNumber] = useState(`ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Main Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: 0.2
        }}
        className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 max-w-md w-full border border-white/50"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 10,
            delay: 0.5 
          }}
          className="mb-8"
        >
          <div className="relative mx-auto w-28 h-28">
            {/* Ripple Effects */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-green-400 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              className="absolute inset-0 bg-green-300 rounded-full"
            />
            
            {/* Main Circle */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
              <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2.5} />
            </div>
            
            {/* Sparkles */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-sm"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 60}deg) translateX(60px) translateY(-50%)`
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
            Thank You!
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">
            Your order has been placed successfully. We're preparing your items for shipment.
          </p>
          
          {/* Order Number */}
          <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
            <Receipt className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-mono font-semibold text-gray-700">{orderNumber}</span>
          </div>
        </motion.div>

        {/* Order Status Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-3 mb-8"
        >
          <OrderStatusItem 
            icon={CheckCircle2}
            title="Order Confirmed"
            description="Your payment was received successfully"
            color="bg-green-500"
            delay={1.2}
          />
          <OrderStatusItem 
            icon={Package}
            title="Processing"
            description="We're preparing your items for shipment"
            color="bg-blue-500"
            delay={1.4}
          />
          <OrderStatusItem 
            icon={Truck}
            title="Delivery"
            description="Estimated delivery in 2-3 business days"
            color="bg-purple-500"
            delay={1.6}
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="space-y-3"
        >
          <button
            onClick={() => navigate("/my-orders")}
            className="group w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <ShoppingBag className="w-5 h-5" />
            View My Orders
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Home</span>
            </button>
            <button
              onClick={() => navigate("/products")}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200"
            >
              <Package className="w-4 h-4" />
              <span className="text-sm">Shop More</span>
            </button>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-xs text-gray-400 mt-6"
        >
          A confirmation email has been sent to your inbox
        </motion.p>
      </motion.div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30"
            animate={{
              y: [0, -100],
              x: [0, Math.random() * 50 - 25],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-20px'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ThankYouPage;