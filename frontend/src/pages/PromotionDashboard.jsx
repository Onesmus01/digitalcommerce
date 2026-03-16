"use client";

import React, { useState, useEffect, useContext } from 'react';
import { 
  FiSend, 
  FiUsers, 
  FiPercent, 
  FiCalendar, 
  FiLink, 
  FiTag,
  FiToggleRight,
  FiToggleLeft,
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
  FiMail,
  FiTrendingUp,
  FiClock,
  FiCopy,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Context } from '@/context/ProductContext.jsx';

// Stats Card Component
const PromoStatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative group"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
    <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="text-xl text-white" />
        </div>
      </div>
    </div>
  </motion.div>
);

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onToggle, label, description }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
    <div className="flex-1">
      <h4 className="font-semibold text-slate-800 flex items-center gap-2">
        {enabled ? <FiToggleRight className="text-emerald-500" /> : <FiToggleLeft className="text-slate-400" />}
        {label}
      </h4>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
    >
      <motion.div
        animate={{ x: enabled ? 24 : 4 }}
        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
      />
    </motion.button>
  </div>
);

// Recent Broadcast Item
const BroadcastItem = ({ broadcast, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all"
  >
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
      broadcast.status === 'sent' ? 'bg-emerald-100 text-emerald-600' : 
      broadcast.status === 'sending' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
    }`}>
      {broadcast.status === 'sent' ? <FiCheckCircle size={20} /> : 
       broadcast.status === 'sending' ? <FiLoader className="animate-spin" size={20} /> : <FiClock size={20} />}
    </div>
    <div className="flex-1">
      <h4 className="font-semibold text-slate-800">{broadcast.title}</h4>
      <p className="text-sm text-slate-500">{broadcast.discount} • {broadcast.recipients} recipients</p>
    </div>
    <span className="text-xs text-slate-400">{broadcast.time}</span>
  </motion.div>
);

const PromotionDashboard = () => {
  const { toast, backendUrl } = useContext(Context);
  
  // Promotion Settings State
  const [promoEnabled, setPromoEnabled] = useState(true);
  const [autoBroadcast, setAutoBroadcast] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    discount: '',
    code: '',
    endDate: '',
    link: 'https://digitalcommerce.com/sale'
  });
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activePromotions: 0,
    lastBroadcast: null
  });
  const [recentBroadcasts, setRecentBroadcasts] = useState([
    { title: 'Flash Sale Weekend', discount: '50% OFF', recipients: 1240, status: 'sent', time: '2 days ago' },
    { title: 'New Year Special', discount: '30% OFF', recipients: 1150, status: 'sent', time: '1 week ago' }
  ]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${backendUrl}/subscribe/stats`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setStats(prev => ({
          ...prev,
          totalSubscribers: data.stats.total
        }));
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateCode = () => {
    const code = 'FLASH' + Math.random().toString(36).substring(2, 6).toUpperCase();
    setFormData(prev => ({ ...prev, code }));
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    
    if (!promoEnabled) {
      toast.error('Enable promotions first to broadcast');
      return;
    }

    if (!formData.title || !formData.discount) {
      toast.error('Title and discount are required');
      return;
    }

    setIsLoading(true);
    
    // Add to recent broadcasts immediately (optimistic UI)
    const newBroadcast = {
      title: formData.title,
      discount: formData.discount,
      recipients: stats.totalSubscribers,
      status: 'sending',
      time: 'Just now'
    };
    setRecentBroadcasts(prev => [newBroadcast, ...prev]);

    try {
      const res = await fetch(`${backendUrl}/subscribe/broadcast`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Broadcasting to ${data.recipientCount} subscribers!`);
        
        // Update broadcast status
        setRecentBroadcasts(prev => prev.map((b, i) => 
          i === 0 ? { ...b, status: 'sent' } : b
        ));
        
        // Reset form
        setFormData({
          title: '',
          subtitle: '',
          description: '',
          discount: '',
          code: '',
          endDate: '',
          link: 'https://digitalcommerce.com/sale'
        });
      } else {
        toast.error(data.message || 'Broadcast failed');
        setRecentBroadcasts(prev => prev.map((b, i) => 
          i === 0 ? { ...b, status: 'failed' } : b
        ));
      }
    } catch (error) {
      toast.error('Failed to broadcast promotion');
      setRecentBroadcasts(prev => prev.map((b, i) => 
        i === 0 ? { ...b, status: 'failed' } : b
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Promotion Center
            </h1>
            <p className="text-slate-500 mt-1">Manage and broadcast promotional campaigns</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
              promoEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {promoEnabled ? <FiCheckCircle /> : <FiAlertCircle />}
              {promoEnabled ? 'Promotions Active' : 'Promotions Paused'}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN - Stats & Settings */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4">
            <PromoStatCard 
              title="Total Subscribers" 
              value={stats.totalSubscribers.toLocaleString()} 
              icon={FiUsers}
              color="from-indigo-500 to-purple-600"
              delay={0}
            />
            <PromoStatCard 
              title="Active Promotions" 
              value={promoEnabled ? '1 Active' : 'Paused'} 
              icon={FiTrendingUp}
              color={promoEnabled ? "from-emerald-500 to-teal-600" : "from-slate-400 to-slate-600"}
              delay={0.1}
            />
            <PromoStatCard 
              title="Avg. Open Rate" 
              value="24.5%" 
              icon={FiMail}
              color="from-amber-500 to-orange-600"
              delay={0.2}
            />
          </div>

          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FiToggleRight className="text-indigo-600" />
              Promotion Settings
            </h3>
            
            <div className="space-y-4">
              <ToggleSwitch 
                enabled={promoEnabled}
                onToggle={() => setPromoEnabled(!promoEnabled)}
                label="Enable Promotions"
                description="Allow sending promotional emails to subscribers"
              />
              
              <ToggleSwitch 
                enabled={autoBroadcast}
                onToggle={() => setAutoBroadcast(!autoBroadcast)}
                label="Auto-Broadcast"
                description="Automatically send promotions when new sales start"
              />
            </div>

            <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                <FiAlertCircle size={16} />
                Quick Tip
              </h4>
              <p className="text-sm text-indigo-700">
                Promotions are sent in batches of 50 emails to avoid spam filters. 
                Each batch has a 1-second delay.
              </p>
            </div>
          </motion.div>

          {/* Recent Broadcasts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Broadcasts</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentBroadcasts.map((broadcast, index) => (
                <BroadcastItem key={index} broadcast={broadcast} index={index} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN - Broadcast Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6 lg:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg">
                  <FiSend className="text-white text-xl" />
                </div>
                New Broadcast
              </h2>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                {showPreview ? <FiEyeOff /> : <FiEye />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </motion.button>
            </div>

            {!promoEnabled && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800">
                <FiAlertCircle className="shrink-0" />
                <p className="text-sm">Promotions are currently disabled. Toggle the switch in settings to enable broadcasting.</p>
              </div>
            )}

            <form onSubmit={handleBroadcast} className="space-y-6">
              
              {/* Title & Subtitle Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Promotion Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Flash Sale Weekend"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Limited time offer!"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe your promotion..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                />
              </div>

              {/* Discount & Code Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <FiPercent className="text-slate-400" />
                    Discount <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="e.g., UP TO 50% OFF"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <FiTag className="text-slate-400" />
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="e.g., FLASH25"
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all uppercase"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={generateCode}
                      className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-medium transition-colors"
                    >
                      Generate
                    </motion.button>
                    {formData.code && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyToClipboard(formData.code)}
                        className="px-4 py-3 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition-colors"
                      >
                        <FiCopy />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* End Date & Link Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <FiCalendar className="text-slate-400" />
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <FiLink className="text-slate-400" />
                    Link URL
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    placeholder="https://digitalcommerce.com/sale"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Live Preview */}
              <AnimatePresence>
                {showPreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-rose-500 rounded-full text-xs font-bold">LIVE PREVIEW</span>
                      </div>
                      
                      <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-4 rounded-xl mb-4">
                        <p className="text-sm font-bold uppercase tracking-wider text-white/90">
                          {formData.endDate ? `⏰ Ends ${new Date(formData.endDate).toLocaleDateString()}` : '🔥 Limited Time Offer'}
                        </p>
                      </div>

                      <h3 className="text-3xl font-black mb-2 uppercase">{formData.title || 'PROMOTION TITLE'}</h3>
                      <p className="text-rose-300 mb-4">{formData.subtitle || 'Don\'t miss out!'}</p>
                      
                      <div className="inline-block bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 px-6 py-3 rounded-xl font-black text-2xl transform -rotate-2 mb-4">
                        {formData.discount || 'UP TO 50% OFF'}
                      </div>

                      {formData.code && (
                        <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-center mb-4">
                          <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Your Exclusive Code</p>
                          <p className="text-2xl font-mono font-bold tracking-widest">{formData.code}</p>
                        </div>
                      )}

                      <button className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl font-bold uppercase tracking-wider shadow-lg">
                        Shop the Sale Now →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-200">
                <motion.button
                  type="submit"
                  disabled={isLoading || !promoEnabled}
                  whileHover={promoEnabled ? { scale: 1.02 } : {}}
                  whileTap={promoEnabled ? { scale: 0.98 } : {}}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                    promoEnabled 
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/25 hover:shadow-xl' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Broadcasting to {stats.totalSubscribers} subscribers...
                    </>
                  ) : (
                    <>
                      <FiSend />
                      Broadcast Promotion
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                        {stats.totalSubscribers} recipients
                      </span>
                    </>
                  )}
                </motion.button>
                
                <p className="text-center text-sm text-slate-500 mt-4">
                  Emails are sent in batches of 50 with 1-second delays to ensure deliverability
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDashboard;