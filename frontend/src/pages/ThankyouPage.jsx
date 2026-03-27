import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  ShoppingBag, 
  Truck, 
  ArrowRight,
  Home,
  Package,
  Receipt
} from "lucide-react";
import { useEffect, useState } from "react";

const ConfettiPiece = ({ delay, left, color }) => (
  <motion.div
    initial={{ y: -10, opacity: 0 }}
    animate={{ 
      y: [0, 300, 600], 
      opacity: [0, 1, 0],
      rotate: [0, 180, 360],
      x: [0, Math.random() * 50 - 25, Math.random() * 100 - 50]
    }}
    transition={{ 
      duration: 2,
      delay: delay,
      ease: "easeOut"
    }}
    className="absolute w-2 h-2 rounded-sm"
    style={{ 
      left: `${left}%`,
      backgroundColor: color,
      top: '-10px'
    }}
  />
);

const Confetti = () => {
  const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: Math.random() * 1.5,
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

const OrderStatusItem = ({ icon: Icon, title, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
  >
    <div className={`w-7 h-7 ${color} rounded-lg flex items-center justify-center`}>
      <Icon className="w-3.5 h-3.5 text-white" />
    </div>
    <span className="font-medium text-slate-700 text-xs">{title}</span>
  </motion.div>
);

const ThankYouPage = () => {
  const navigate = useNavigate();
  const [orderNumber] = useState(`ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-3 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-5 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-60" />
        <div className="absolute top-20 right-5 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-60" />
        <div className="absolute bottom-10 left-1/2 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 -translate-x-1/2" />
      </div>

      {showConfetti && <Confetti />}

      {/* Main Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        className="relative bg-white rounded-2xl shadow-xl p-4 w-full max-w-xs border border-white/50"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.3 }}
          className="mb-4"
        >
          <div className="relative mx-auto w-16 h-16">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-green-400 rounded-full"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-4"
        >
          <h1 className="text-xl font-bold text-slate-900 mb-1">Thank You!</h1>
          <p className="text-slate-600 text-xs leading-relaxed mb-3">
            Your order has been placed successfully.
          </p>
          
          {/* Order Number */}
          <div className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
            <Receipt className="w-3 h-3 text-slate-500" />
            <span className="text-xs font-mono font-semibold text-slate-700">{orderNumber}</span>
          </div>
        </motion.div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-1.5 mb-4"
        >
          <OrderStatusItem 
            icon={CheckCircle2}
            title="Order Confirmed"
            color="bg-green-500"
            delay={0.8}
          />
          <OrderStatusItem 
            icon={Package}
            title="Processing"
            color="bg-blue-500"
            delay={0.9}
          />
          <OrderStatusItem 
            icon={Truck}
            title="Delivery 2-3 days"
            color="bg-purple-500"
            delay={1}
          />
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="space-y-2"
        >
          <button
            onClick={() => navigate("/my-orders")}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-4 h-4" />
            View Orders
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-1 py-2 px-3 bg-slate-100 text-slate-700 rounded-lg font-medium text-xs"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </button>
            <button
              onClick={() => navigate("/products")}
              className="flex items-center justify-center gap-1 py-2 px-3 bg-slate-100 text-slate-700 rounded-lg font-medium text-xs"
            >
              <Package className="w-3.5 h-3.5" />
              Shop
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center text-[10px] text-slate-400 mt-3"
        >
          Confirmation email sent
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;