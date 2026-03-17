"use client";

import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiTag, 
  FiClock, 
  FiArrowRight, 
  FiBell, 
  FiTrendingUp,
  FiZap 
} from 'react-icons/fi';
import Context from "@/context/index.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
const REFRESH_INTERVAL = 30000; // 30 seconds
const COUNTDOWN_INTERVAL = 60000; // 1 minute
const NEW_BADGE_DURATION = 5000; // 5 seconds

// Custom hook for countdown timer
const useCountdown = (endDate) => {
  const calculateTimeLeft = useCallback(() => {
    if (!endDate) return null;
    
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) return 'ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }, [endDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
    }, COUNTDOWN_INTERVAL);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return timeLeft;
};

// Custom hook for promotion data fetching
const usePromotion = (userId) => {
  const [promotion, setPromotion] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPromotion = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/subscribe/active-promotion`, {
        method: "GET",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.promotion) {
        setPromotion(data.promotion);
        setError(null);
      } else {
        setPromotion(null);
      }
    } catch (err) {
      console.error('Failed to fetch promotion:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPromotion();
    
    const interval = setInterval(fetchPromotion, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchPromotion]);

  return { promotion, error, isLoading, refetch: fetchPromotion };
};

// Custom hook for socket events
const usePromotionSocket = (socket, userId) => {
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (!socket || !userId) return;

    const handleNewPromotion = (data) => {
      setIsNew(true);
      // Auto-hide "NEW" badge after duration
      const timeout = setTimeout(() => setIsNew(false), NEW_BADGE_DURATION);
      return () => clearTimeout(timeout);
    };

    socket.on("promotion", handleNewPromotion);

    return () => {
      socket.off("promotion", handleNewPromotion);
    };
  }, [socket, userId]);

  return isNew;
};

// Sub-components for better organization
const NewBadge = () => (
  <motion.span 
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
    className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-white text-rose-600 rounded-full text-xs font-bold shadow-lg"
  >
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
    </span>
    NEW
  </motion.span>
);

const PromoCode = ({ code }) => (
  <div className="hidden sm:flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full shrink-0 border border-white/30">
    <FiTag className="text-xs text-amber-200" />
    <span className="text-xs font-bold tracking-wider">{code}</span>
  </div>
);

const Countdown = ({ timeLeft, className = "" }) => {
  const isUrgent = timeLeft && (timeLeft.includes('m') && !timeLeft.includes('h'));
  
  return (
    <div className={`flex items-center gap-1.5 text-xs shrink-0 ${className}`}>
      <FiClock className={isUrgent ? "text-amber-200 animate-pulse" : "text-white/80"} />
      <span className={isUrgent ? "text-amber-100 font-bold" : "text-white/90"}>
        {timeLeft === 'ended' ? 'Expired' : `Ends in ${timeLeft}`}
      </span>
    </div>
  );
};

const ShopButton = ({ link, onClick }) => (
  <motion.a
    href={link || '/hot-deals'}
    onClick={onClick}
    whileHover={{ scale: 1.05, y: -1 }}
    whileTap={{ scale: 0.95 }}
    className="group flex items-center gap-2 px-4 py-2 bg-white text-rose-600 rounded-full font-bold text-xs hover:shadow-xl hover:shadow-white/20 transition-all duration-300 relative overflow-hidden"
  >
    <span className="absolute inset-0 bg-gradient-to-r from-rose-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <FiZap size={12} className="relative z-10 group-hover:text-orange-500 transition-colors" />
    <span className="relative z-10">Shop Now</span>
    <FiArrowRight size={12} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
  </motion.a>
);

const CloseButton = ({ onClick }) => (
  <motion.button 
    whileHover={{ scale: 1.1, rotate: 90 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
    title="Dismiss promotion"
    aria-label="Close promotion banner"
  >
    <FiX size={16} />
  </motion.button>
);

// Main Component
const PromotionBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [dismissedPromoId, setDismissedPromoId] = useState(null);
  
  const { socket, user } = useContext(Context);
  
  // 🔥 SAME PATTERN AS HEADER: Early return if not logged in
  if (!user?._id) {
    return null;
  }

  const userId = user._id;
  
  const { promotion, error } = usePromotion(userId);
  const timeLeft = useCountdown(promotion?.endDate);
  const isNew = usePromotionSocket(socket, userId);

  // Handle manual dismiss with localStorage persistence
  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    if (promotion?._id) {
      setDismissedPromoId(promotion._id);
      try {
        localStorage.setItem('dismissedPromotionId', promotion._id);
      } catch (e) {
        console.warn('Could not save dismissed promotion to localStorage');
      }
    }
  }, [promotion?._id]);

  // Check if this promotion was previously dismissed
  useEffect(() => {
    try {
      const lastDismissed = localStorage.getItem('dismissedPromotionId');
      if (lastDismissed && promotion?._id === lastDismissed) {
        setIsVisible(false);
      }
    } catch (e) {
      console.warn('Could not access localStorage');
    }
  }, [promotion?._id]);

  // Reset visibility when promotion changes
  useEffect(() => {
    if (promotion?._id !== dismissedPromoId) {
      setIsVisible(true);
    }
  }, [promotion?._id, dismissedPromoId]);

  // Don't render if no promotion or hidden or ended
  if (!promotion || !isVisible || timeLeft === 'ended' || timeLeft === null) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={promotion._id || 'promo-banner'}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          mass: 1
        }}
        className="fixed top-0 left-0 right-0 z-[100] text-white shadow-2xl backdrop-blur-sm"
        style={{
          background: 'linear-gradient(135deg, #e11d48 0%, #f97316 50%, #f59e0b 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 8s ease infinite',
        }}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none" />
        
        {/* Shine effect */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ 
            repeat: Infinity, 
            duration: 3, 
            ease: "linear",
            repeatDelay: 2
          }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left Section: Badges & Title */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <AnimatePresence>
                {isNew && <NewBadge />}
              </AnimatePresence>

              {promotion.code && <PromoCode code={promotion.code} />}

              <div className="flex items-center gap-2 min-w-0">
                <FiTrendingUp className="hidden sm:block text-amber-200 shrink-0" size={16} />
                <span className="font-bold text-sm sm:text-base truncate drop-shadow-md">
                  {promotion.title}
                </span>
                {promotion.discount && (
                  <motion.span 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-amber-100 font-black text-sm shrink-0 bg-white/25 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/20 shadow-inner"
                  >
                    {promotion.discount}
                  </motion.span>
                )}
              </div>

              {/* Desktop Countdown */}
              <div className="hidden md:flex ml-4">
                <Countdown timeLeft={timeLeft} />
              </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <ShopButton 
                link={promotion.link} 
                onClick={() => {
                  // Optional: track click analytics here
                  console.log('Promotion clicked:', promotion._id);
                }}
              />
              <CloseButton onClick={handleDismiss} />
            </div>
          </div>

          {/* Mobile Countdown */}
          <div className="md:hidden mt-2 pt-2 border-t border-white/20">
            <Countdown timeLeft={timeLeft} className="justify-center text-white/80" />
          </div>
        </div>

        {/* Inject keyframe animation */}
        <style jsx>{`
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromotionBanner;