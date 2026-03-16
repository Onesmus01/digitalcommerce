"use client";

import { useEffect, useContext } from 'react';
import { motion } from 'framer-motion'; // 🔥 Missing import
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { FiTag, FiArrowRight, FiX } from 'react-icons/fi'; // 🔥 FiX was missing
import { Context } from "@/context/ProductContext.jsx";

const PromotionToast = () => {
  const { backendUrl } = useContext(Context);

  useEffect(() => {
    // 🔥 Check if backendUrl exists
    if (!backendUrl) {
      console.log("⏸️ backendUrl not available");
      return;
    }

    console.log("🔌 Connecting toast socket to:", backendUrl);
    
    const socket = io(backendUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socket.on("connect", () => {
      console.log("🟢 Toast socket connected");
    });

    socket.on("promotion", (data) => {
      console.log("🔥 Toast received promotion:", data);

      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-[90vw] sm:max-w-md w-full bg-gradient-to-r from-rose-600 to-orange-500 shadow-2xl rounded-xl sm:rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden mx-4`}
        >
          <div className="p-3 sm:p-4 flex-1 min-w-0">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-white/20 rounded-full shrink-0">
                <FiTag className="text-white text-lg sm:text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm sm:text-lg leading-tight">
                  {data.data.title}
                </h4>
                <p className="text-amber-100 font-bold text-base sm:text-xl mt-0.5 sm:mt-1">
                  {data.data.discount}
                </p>
                <p className="text-white/80 text-xs sm:text-sm mt-0.5 sm:mt-1 line-clamp-2">
                  {data.message}
                </p>
                
                <a
                  href={data.data.link || '/hot-deals'}
                  onClick={() => toast.dismiss(t.id)}
                  className="inline-flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-rose-600 rounded-full font-bold text-xs sm:text-sm hover:shadow-lg transition-all"
                >
                  Shop Now 
                  <FiArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="p-2 sm:p-4 text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <FiX size={18} />
          </button>
        </motion.div>
      ), {
        duration: 10000,
        position: 'top-center', // 🔥 Better for mobile
      });
    });

    socket.on("connect_error", (err) => {
      console.log("⚠️ Toast socket error:", err.message);
    });

    return () => {
      console.log("🔌 Cleaning up toast socket");
      socket.disconnect();
    };
  }, [backendUrl]); // 🔥 Add dependency

  return null;
};

export default PromotionToast;