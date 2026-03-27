import React, { useState, useEffect } from 'react';
import { FaCheck, FaFileContract, FaTimes, FaShieldAlt, FaCookie } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const TermsPopup = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user already accepted
    const hasAccepted = localStorage.getItem('termsAccepted');
    if (!hasAccepted) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('termsAccepted', 'true');
    localStorage.setItem('termsAcceptedDate', new Date().toISOString());
    setIsVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    setIsVisible(false);
    onDecline?.();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 sm:p-4 text-white relative">
            <button 
              onClick={handleDecline}
              className="absolute top-2 right-2 p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <FaTimes size={14} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <FaFileContract size={16} />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">Terms & Privacy</h3>
                <p className="text-[10px] sm:text-xs text-indigo-100">Please review before continuing</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4">
            {/* Main Text */}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3">
              We use cookies and process your data to provide the best experience. By using our site, you agree to our{' '}
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Privacy Policy
              </button>.
            </p>

            {/* Expandable Details */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-slate-50 rounded-xl p-3 mb-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <FaCookie className="text-amber-500 mt-0.5" size={12} />
                      <div>
                        <p className="font-semibold text-slate-700 text-xs">Cookies</p>
                        <p className="text-[10px] text-slate-500">Essential for login, cart, and preferences</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaShieldAlt className="text-emerald-500 mt-0.5" size={12} />
                      <div>
                        <p className="font-semibold text-slate-700 text-xs">Data Protection</p>
                        <p className="text-[10px] text-slate-500">Your data is encrypted and secure</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleDecline}
                className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-200 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="flex-[2] py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
              >
                <FaCheck size={12} />
                Accept & Continue
              </button>
            </div>

            {/* Minimal Option */}
            <button 
              onClick={handleAccept}
              className="w-full mt-2 text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
            >
              Accept only essential cookies →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TermsPopup;