"use client";

import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTag, FiClock, FiArrowRight, FiBell, FiTrendingUp } from 'react-icons/fi';
import Context from "@/context/index.js";

const PromotionBanner = () => {
  const [promotion, setPromotion] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const [isNew, setIsNew] = useState(false);

  const { backendUrl, socket, user } = useContext(Context); // 🔥 Get user from context

  // 🔥 ONLY show for logged in users
  if (!user?._id) {
    console.log("⏸️ Banner hidden - user not logged in");
    return null;
  }

  // Fetch active promotion
  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const res = await fetch(`${backendUrl}/subscribe/active-promotion`, {
          method: "GET",
          credentials: "include"
        });
        const data = await res.json();
        if (data.success && data.promotion) {
          setPromotion(data.promotion);
          console.log("✅ Fetched promotion:", data.promotion.title);
        }
      } catch (error) {
        console.error('❌ Failed to fetch promotion:', error.message);
      }
    };

    fetchPromotion();
    const interval = setInterval(fetchPromotion, 30000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  // Socket listener
  useEffect(() => {
    if (!socket) return;

    socket.on("promotion", (data) => {
      console.log("🔥 Real-time promotion received:", data);
      setPromotion(data.data);
      setIsNew(true);
      setIsVisible(true);
      setTimeout(() => setIsNew(false), 5000);
    });

    return () => {
      socket.off("promotion");
    };
  }, [socket]);

  // Countdown timer
  useEffect(() => {
    if (!promotion?.endDate) return;

    const calculateTimeLeft = () => {
      const end = new Date(promotion.endDate);
      const now = new Date();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Ended');
        setIsVisible(false);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [promotion]);

  // Don't render if no promotion or hidden
  if (!promotion || !isVisible || timeLeft === 'Ended') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            
            {isNew && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-white text-rose-600 rounded-full text-xs font-bold animate-pulse"
              >
                <FiBell size={10} />
                NEW
              </motion.span>
            )}

            {promotion.code && (
              <div className="hidden sm:flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full shrink-0">
                <FiTag className="text-xs" />
                <span className="text-xs font-bold">{promotion.code}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold text-sm truncate">{promotion.title}</span>
              <span className="text-amber-100 font-bold text-sm shrink-0 bg-white/20 px-2 py-0.5 rounded">
                {promotion.discount}
              </span>
            </div>

            {timeLeft && (
              <div className="hidden md:flex items-center gap-1.5 text-xs text-white/90 shrink-0 ml-2">
                <FiClock />
                <span>Ends: {timeLeft}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <motion.a
              href={promotion.link || '/hot-deals'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-rose-600 rounded-full font-bold text-xs hover:shadow-lg transition-all"
            >
              <FiTrendingUp size={12} />
              Shop Now
              <FiArrowRight size={12} />
            </motion.a>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              title="Dismiss"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
        
        {timeLeft && (
          <div className="md:hidden bg-black/20 px-4 py-1 text-center text-xs">
            <FiClock className="inline mr-1" />
            Ends in: {timeLeft}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PromotionBanner;