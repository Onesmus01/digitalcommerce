import React, { useState, useEffect,useMemo, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Truck,
  Target,
  Calendar,
  RefreshCw,
  Edit3,
  Check,
  X,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  Activity,
  CreditCard,
  Users,
  Package,
  Zap,
  Brain,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Eye,
  EyeOff,
  Settings,
  Bell,
  Search,
  Plus,
  Trash2,
  Save,
  Loader2
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Context } from "@/context/ProductContext.jsx";

// ===================== COLOR PALETTE =====================
const COLORS = {
  primary: '#8b5cf6',
  secondary: '#ec4899',
  accent: '#f59e0b',
  success: '#10b981',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#a855f7',
  rose: '#f43f5e',
  cyan: '#06b6d4',
  slate: '#64748b',
  gradient: {
    violet: 'from-violet-500 to-purple-600',
    pink: 'from-pink-500 to-rose-500',
    amber: 'from-amber-500 to-orange-500',
    emerald: 'from-emerald-500 to-teal-500',
    blue: 'from-blue-500 to-cyan-500'
  }
};

const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.success, COLORS.info, COLORS.purple];

// ===================== COMPONENTS =====================

const StatCard = ({ title, value, subtext, trend, trendValue, icon: Icon, color, editable, onEdit, loading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onEdit?.(editValue);
    setIsEditing(false);
    toast.success(`${title} target updated!`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 animate-pulse">
        <div className="h-20 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative overflow-hidden bg-white rounded-3xl shadow-lg border border-slate-100 p-6"
    >
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${COLORS.gradient[color]} opacity-10 rounded-full blur-3xl`} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${COLORS.gradient[color]} shadow-lg shadow-${color}-500/30`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2">
            {editable && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Edit3 className="w-4 h-4 text-slate-400" />
              </motion.button>
            )}
            {trend && (
              <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {trendValue}%
              </span>
            )}
          </div>
        </div>

        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        
        {isEditing ? (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-2xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
              autoFocus
            />
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleSave} className="p-2 bg-emerald-500 text-white rounded-xl">
              <Check className="w-5 h-5" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsEditing(false)} className="p-2 bg-rose-500 text-white rounded-xl">
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800">
              {typeof value === 'number' && value > 999 
                ? `$${(value / 1000).toFixed(1)}k` 
                : value?.toLocaleString?.() || value}
            </span>
          </div>
        )}
        
        <p className="text-slate-400 text-xs mt-2">{subtext}</p>

        {editable && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Progress</span>
              <span className="font-bold text-slate-700">
                {value && editValue ? Math.min(100, Math.round((value / editValue) * 100)) : 0}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value && editValue ? Math.min(100, (value / editValue) * 100) : 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${COLORS.gradient[color]} rounded-full`}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TargetEditor = ({ targets, onUpdate, loading }) => {
  const [editingTarget, setEditingTarget] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const handleEdit = (key, value) => {
    setEditingTarget(key);
    setTempValue(value);
  };

  const handleSave = (key) => {
    onUpdate(key, Number(tempValue));
    setEditingTarget(null);
    toast.success('Target updated successfully!');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 animate-pulse">
        <div className="h-40 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-500" />
            Monthly Targets
          </h3>
          <p className="text-slate-500 text-sm mt-1">Set and track your monthly goals</p>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(targets || {}).map(([key, target]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
          >
            <div className={`p-3 rounded-xl bg-gradient-to-br ${target.gradient} text-white`}>
              <target.icon className="w-5 h-5" />
            </div>
            
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{target.label}</p>
              <p className="text-xs text-slate-500">{target.description}</p>
            </div>

            <div className="flex items-center gap-3">
              {editingTarget === key ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-32 px-3 py-2 border border-slate-200 rounded-xl text-right font-bold focus:outline-none focus:ring-2 focus:ring-violet-500"
                    autoFocus
                  />
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleSave(key)} className="p-2 bg-emerald-500 text-white rounded-lg">
                    <Check className="w-4 h-4" />
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setEditingTarget(null)} className="p-2 bg-slate-300 text-white rounded-lg">
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              ) : (
                <>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">
                      {target.current?.toLocaleString?.() || 0} / {target.goal?.toLocaleString?.() || 0}
                    </p>
                    <p className="text-xs text-slate-500">
                      {target.goal > 0 ? Math.round((target.current / target.goal) * 100) : 0}% achieved
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(key, target.goal)}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-slate-400" />
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AIPredictions = ({ data, loading }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 rounded-3xl shadow-xl p-6 animate-pulse">
        <div className="h-40 bg-white/20 rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 rounded-3xl shadow-xl p-6 text-white overflow-hidden relative"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                AI Revenue Prediction
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              </h3>
              <p className="text-white/70 text-sm">Powered by Machine Learning</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-xl"
          >
            {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </motion.button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <p className="text-white/70 text-xs mb-1">Predicted Revenue</p>
            <p className="text-2xl font-black">${data?.predictedRevenue?.toLocaleString?.() || '0'}</p>
            <span className="text-emerald-300 text-xs flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +{data?.growthPercent || 0}%
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <p className="text-white/70 text-xs mb-1">Confidence</p>
            <p className="text-2xl font-black capitalize">{data?.confidence || 'Medium'}</p>
            <div className="flex gap-1 mt-2">
              {[1,2,3,4,5].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full ${i <= 4 ? 'bg-emerald-400' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <p className="text-white/70 text-xs mb-1">Trend</p>
            <p className="text-2xl font-black capitalize">{data?.trend || 'Stable'}</p>
            <span className="text-white/70 text-xs mt-1">Next Month</span>
          </div>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  Key Factors
                </h4>
                <div className="space-y-2">
                  {data?.factors?.map((factor, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-white/80">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      {factor}
                    </div>
                  )) || (
                    <div className="text-sm text-white/60">No factors available</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 text-xs text-white/60">
          <Activity className="w-3 h-3" />
          Last updated: {format(new Date(), 'MMM dd, HH:mm')}
        </div>
      </div>
    </motion.div>
  );
};

const RevenueChart = ({ data, loading }) => {
  const [chartType, setChartType] = useState('area');
  const [showTarget, setShowTarget] = useState(true);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 animate-pulse">
        <div className="h-80 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-500" />
            Revenue Analytics
          </h3>
          <p className="text-slate-500 text-sm mt-1">Daily revenue vs targets</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-xl p-1">
            {['area', 'bar', 'line'].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                  chartType === type ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowTarget(!showTarget)}
            className={`p-2 rounded-xl transition-colors ${showTarget ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-500'}`}
          >
            <Target className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data || []}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`$${value?.toLocaleString?.() || 0}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              {showTarget && <ReferenceLine y={4000} stroke={COLORS.accent} strokeDasharray="5 5" label="Target" />}
            </AreaChart>
          ) : chartType === 'bar' ? (
            <BarChart data={data || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`$${value?.toLocaleString?.() || 0}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
              {showTarget && <ReferenceLine y={4000} stroke={COLORS.accent} strokeDasharray="5 5" />}
            </BarChart>
          ) : (
            <LineChart data={data || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`$${value?.toLocaleString?.() || 0}`, 'Revenue']}
              />
              <Line type="monotone" dataKey="revenue" stroke={COLORS.primary} strokeWidth={3} dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }} />
              {showTarget && <ReferenceLine y={4000} stroke={COLORS.accent} strokeDasharray="5 5" label="Target" />}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CategoryBreakdown = ({ data, loading }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 animate-pulse">
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  const chartData = data || [];

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <PieChart className="w-5 h-5 text-violet-500" />
        Revenue by Category
      </h3>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="w-full lg:w-1/2 h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `$${value?.toLocaleString?.() || 0}`}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
              />
            </RePieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-black text-slate-800">
                ${chartData.reduce((acc, item) => acc + (item.value || 0), 0).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-3">
          {chartData.map((item, index) => (
            <motion.div
              key={item.name || index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                activeIndex === index ? 'bg-violet-50 border border-violet-200' : 'hover:bg-slate-50'
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                />
                <span className="font-medium text-slate-700">{item.name || 'Unknown'}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">${item.value?.toLocaleString?.() || 0}</p>
                <p className={`text-xs ${(item.growth || 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {(item.growth || 0) >= 0 ? '+' : ''}{item.growth || 0}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecentTransactions = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 animate-pulse">
        <div className="h-40 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  const transactions = data || [];

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-violet-500" />
          Recent Transactions
        </h3>
        <button className="text-sm text-violet-600 font-semibold hover:text-violet-700">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((tx, idx) => (
          <motion.div
            key={tx.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                tx.status === 'success' || tx.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                tx.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                'bg-rose-100 text-rose-600'
              }`}>
                {tx.status === 'success' || tx.status === 'completed' ? <Check className="w-5 h-5" /> :
                 tx.status === 'pending' ? <RefreshCw className="w-5 h-5" /> :
                 <X className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{tx.product || 'Order'}</p>
                <p className="text-xs text-slate-500">{tx.customer} • {tx.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800">${tx.amount?.toLocaleString?.() || 0}</p>
              <p className="text-xs text-slate-400">
                {tx.date ? format(new Date(tx.date), 'MMM dd, HH:mm') : 'Just now'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ===================== MAIN PAGE COMPONENT =====================

const RevenueDashboard = () => {
  const { backendUrl } = useContext(Context);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [aiPrediction, setAiPrediction] = useState(null);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add auth token if available
      const token = document.cookie.split('token=')[1]?.split(';')[0];
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const [
        statsRes,
        dailyRes,
        categoryRes,
        paymentRes,
        transactionsRes,
        aiRes
      ] = await Promise.all([
        fetch(`${backendUrl}/revenue/dashboard-stats`, { 
          credentials: 'include',
          headers 
        }),
        fetch(`${backendUrl}/revenue/daily-breakdown`, { 
          credentials: 'include',
          headers 
        }),
        fetch(`${backendUrl}/revenue/by-category`, { 
          credentials: 'include',
          headers 
        }),
        fetch(`${backendUrl}/revenue/by-payment-method`, { 
          credentials: 'include',
          headers 
        }),
        fetch(`${backendUrl}/revenue/recent-transactions?limit=5`, { 
          credentials: 'include',
          headers 
        }),
        fetch(`${backendUrl}/revenue/ai-prediction`, { 
          credentials: 'include',
          headers 
        })
      ]);

      // Check for auth errors
      if (statsRes.status === 401 || statsRes.status === 403) {
        toast.error('Please login as admin to view revenue data');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const [
        statsData,
        dailyData,
        categoryData,
        paymentData,
        transactionsData,
        aiData
      ] = await Promise.all([
        statsRes.json(),
        dailyRes.json(),
        categoryRes.json(),
        paymentRes.json(),
        transactionsRes.json(),
        aiRes.json()
      ]);

      if (statsData.success) {
        setStats(statsData.stats);
      }
      if (dailyData.success) {
        setDailyData(dailyData.data);
      }
      if (categoryData.success) {
        setCategoryData(categoryData.data);
      }
      if (paymentData.success) {
        setPaymentData(paymentData.data);
      }
      if (transactionsData.success) {
        setTransactions(transactionsData.data);
      }
      if (aiData.success) {
        setAiPrediction(aiData.prediction);
      }
      console.log("Fetched dashboard data:", {
        stats: statsData,
        daily: dailyData,
        category: categoryData,
        payment: paymentData,
        transactions: transactionsData,
        aiPrediction: aiData
      });

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [backendUrl]);

  // Update targets
  const handleTargetUpdate = async (key, newGoal) => {
    try {
      const token = document.cookie.split('token=')[1]?.split(';')[0];
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${backendUrl}/revenue/update-targets`, {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          targets: {
            [key]: { goal: newGoal }
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setStats(prev => ({
          ...prev,
          [key]: {
            ...prev[key],
            target: newGoal
          }
        }));
        toast.success('Target updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update target');
      }
    } catch (error) {
      console.error('Update target error:', error);
      toast.error('Failed to update target');
    }
  };

  // Export report
  const exportReport = async () => {
    try {
      const token = document.cookie.split('token=')[1]?.split(';')[0];
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${backendUrl}/revenue/full-report`, {
        credentials: 'include',
        headers
      });

      const data = await response.json();
      
      if (data.success) {
        // Create and download JSON file
        const blob = new Blob([JSON.stringify(data.report, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `revenue-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('Report downloaded successfully!');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Transform stats for target editor
  const targets = useMemo(() => {
    if (!stats) return {};
    
    return {
      revenue: {
        current: stats.revenue?.current || 0,
        goal: stats.revenue?.target || 50000,
        label: stats.revenue?.label || 'Monthly Revenue',
        description: stats.revenue?.description || 'Total sales revenue this month',
        icon: DollarSign,
        gradient: 'from-violet-500 to-purple-600'
      },
      orders: {
        current: stats.orders?.current || 0,
        goal: stats.orders?.target || 500,
        label: stats.orders?.label || 'Total Orders',
        description: stats.orders?.description || 'Number of completed orders',
        icon: ShoppingBag,
        gradient: 'from-pink-500 to-rose-500'
      },
      deliveries: {
        current: stats.deliveries?.current || 0,
        goal: stats.deliveries?.target || 400,
        label: stats.deliveries?.label || 'Delivered Orders',
        description: stats.deliveries?.description || 'Successfully delivered orders',
        icon: Truck,
        gradient: 'from-emerald-500 to-teal-500'
      },
      customers: {
        current: stats.customers?.current || 0,
        goal: stats.customers?.target || 200,
        label: stats.customers?.label || 'New Customers',
        description: stats.customers?.description || 'First-time buyers this month',
        icon: Users,
        gradient: 'from-blue-500 to-cyan-500'
      }
    };
  }, [stats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg shadow-violet-500/30">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              Revenue Dashboard
            </h1>
            <p className="text-slate-500 mt-2 ml-16">Track, analyze, and optimize your business performance</p>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportReport}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:border-violet-300 hover:text-violet-600 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export Report
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/30 disabled:opacity-50"
            >
              {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Monthly Revenue"
          value={stats?.revenue?.current}
          subtext={`Target: $${(stats?.revenue?.target || 0).toLocaleString()}`}
          trend={stats?.revenue?.growth >= 0 ? 'up' : 'down'}
          trendValue={Math.abs(stats?.revenue?.growth || 0)}
          icon={DollarSign}
          color="violet"
          editable
          onEdit={(val) => handleTargetUpdate('revenue', val)}
          loading={loading}
        />
        <StatCard
          title="Total Orders"
          value={stats?.orders?.current}
          subtext={`Target: ${(stats?.orders?.target || 0).toLocaleString()}`}
          trend={stats?.orders?.growth >= 0 ? 'up' : 'down'}
          trendValue={Math.abs(stats?.orders?.growth || 0)}
          icon={ShoppingBag}
          color="pink"
          editable
          onEdit={(val) => handleTargetUpdate('orders', val)}
          loading={loading}
        />
        <StatCard
          title="Delivered"
          value={stats?.deliveries?.current}
          subtext={`Target: ${(stats?.deliveries?.target || 0).toLocaleString()}`}
          trend={stats?.deliveries?.growth >= 0 ? 'up' : 'down'}
          trendValue={Math.abs(stats?.deliveries?.growth || 0)}
          icon={Truck}
          color="emerald"
          editable
          onEdit={(val) => handleTargetUpdate('deliveries', val)}
          loading={loading}
        />
        <StatCard
          title="New Customers"
          value={stats?.customers?.current}
          subtext={`Target: ${(stats?.customers?.target || 0).toLocaleString()}`}
          trend={stats?.customers?.growth >= 0 ? 'up' : 'down'}
          trendValue={Math.abs(stats?.customers?.growth || 0)}
          icon={Users}
          color="blue"
          editable
          onEdit={(val) => handleTargetUpdate('customers', val)}
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart data={dailyData} loading={loading} />
        </div>
        <div className="lg:col-span-1">
          <AIPredictions data={aiPrediction} loading={loading} />
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          <TargetEditor targets={targets} onUpdate={handleTargetUpdate} loading={loading} />
        </div>
        <div className="lg:col-span-1">
          <CategoryBreakdown data={categoryData} loading={loading} />
        </div>
        <div className="lg:col-span-1">
          <RecentTransactions data={transactions} loading={loading} />
        </div>
      </div>

      {/* Payment Methods & Quick Actions */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-violet-500" />
            Payment Methods
          </h3>
          <div className="space-y-4">
            {paymentData.map((method, idx) => (
              <div key={method.name || idx} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-700">{method.name}</span>
                    <span className="font-bold text-slate-800">{method.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${method.value}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-600 w-20 text-right">
                  ${method.amount?.toLocaleString?.() || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Plus, label: 'Add Transaction', color: 'bg-violet-500' },
              { icon: Filter, label: 'Filter Data', color: 'bg-pink-500' },
              { icon: Bell, label: 'Set Alerts', color: 'bg-amber-500' },
              { icon: Settings, label: 'Configure', color: 'bg-emerald-500' },
            ].map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-colors text-left"
              >
                <div className={`p-2 ${action.color} rounded-xl`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-sm">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;