import React, { useState, useEffect, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  CalendarDays,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Loader2,
  RefreshCw,
  History,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  UserPlus,
  AlertTriangle,
  Star,
  Target,
  Percent,
  ArrowUpRight,
  ArrowDownRight
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
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, startOfWeek, endOfWeek, subHours } from 'date-fns';
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
  teal: '#14b8a6',
  indigo: '#6366f1',
  gradient: {
    violet: 'from-violet-500 to-purple-600',
    pink: 'from-pink-500 to-rose-500',
    amber: 'from-amber-500 to-orange-500',
    emerald: 'from-emerald-500 to-teal-500',
    blue: 'from-blue-500 to-cyan-500',
    indigo: 'from-indigo-500 to-blue-600'
  }
};

const CHART_COLORS = [
  COLORS.primary, COLORS.secondary, COLORS.accent, 
  COLORS.success, COLORS.info, COLORS.purple, 
  COLORS.rose, COLORS.cyan, COLORS.teal, COLORS.indigo
];

// ===================== TIME RANGE CONFIGURATION =====================
const TIME_RANGES = {
  hour: { 
    label: 'Last 24 Hours', 
    shortLabel: '24h',
    icon: Clock, 
    value: 'hour',
    format: 'HH:mm'
  },
  today: { 
    label: 'Today', 
    shortLabel: 'Today',
    icon: Clock, 
    value: 'today',
    format: 'HH:mm'
  },
  week: { 
    label: 'This Week', 
    shortLabel: 'Week',
    icon: Calendar, 
    value: 'week',
    format: 'EEE dd'
  },
  month: { 
    label: 'This Month', 
    shortLabel: 'Month',
    icon: CalendarDays, 
    value: 'month',
    format: 'MMM dd'
  },
  year: { 
    label: 'This Year', 
    shortLabel: 'Year',
    icon: CalendarDays, 
    value: 'year',
    format: 'MMM yyyy'
  },
  all: { 
    label: 'All Time', 
    shortLabel: 'All',
    icon: History, 
    value: 'all',
    format: 'yyyy'
  }
};

// ===================== REPORT TYPES =====================
const REPORT_TYPES = [
  { id: 'sales', label: 'Sales Report', icon: DollarSign, color: 'violet', endpoint: 'sales' },
  { id: 'orders', label: 'Orders Report', icon: ShoppingBag, color: 'pink', endpoint: 'orders' },
  { id: 'customers', label: 'Customers Report', icon: Users, color: 'blue', endpoint: 'customers' },
  { id: 'products', label: 'Products Report', icon: Package, color: 'emerald', endpoint: 'products' },
  { id: 'inventory', label: 'Inventory Report', icon: Package, color: 'amber', endpoint: 'inventory' },
  { id: 'financial', label: 'Financial Report', icon: DollarSign, color: 'indigo', endpoint: 'financial' }
];

// ===================== COMPONENTS =====================

const ReportCard = ({ title, value, subtext, trend, trendValue, icon: Icon, color, delay = 0 }) => {
  const colorClasses = {
    violet: 'from-violet-500 to-purple-600',
    pink: 'from-pink-500 to-rose-500',
    amber: 'from-amber-500 to-orange-500',
    emerald: 'from-emerald-500 to-teal-500',
    blue: 'from-blue-500 to-cyan-500',
    indigo: 'from-indigo-500 to-blue-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative overflow-hidden bg-white rounded-3xl shadow-lg border border-slate-100 p-6"
    >
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full blur-3xl`} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
              trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(trendValue)}%
            </span>
          )}
        </div>

        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-800">
            {typeof value === 'number' && value > 999999
              ? `$${(value / 1000000).toFixed(1)}M`
              : typeof value === 'number' && value > 999
              ? `$${(value / 1000).toFixed(1)}k`
              : value?.toLocaleString?.() || value}
          </span>
        </div>
        <p className="text-slate-400 text-xs mt-2">{subtext}</p>
      </div>
    </motion.div>
  );
};

const TimeRangeSelector = ({ currentRange, onChange, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const current = TIME_RANGES[currentRange] || TIME_RANGES.month;

  return (
    <div className="relative z-50">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:border-violet-300 hover:text-violet-600 transition-all shadow-sm min-w-[160px] justify-between"
      >
        <div className="flex items-center gap-2">
          <current.icon className="w-4 h-4" />
          <span>{current.label}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
            >
              {Object.entries(TIME_RANGES).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => {
                    onChange(key);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                    currentRange === key ? 'bg-violet-50 text-violet-600 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <config.icon className="w-4 h-4" />
                  <div className="flex-1">
                    <div>{config.label}</div>
                    <div className="text-xs text-slate-400 font-normal">
                      {key === 'hour' ? 'Last 24 hours data' : 
                       key === 'today' ? 'Today\'s data' : 
                       key === 'week' ? 'This week data' : 
                       key === 'month' ? 'This month data' : 
                       key === 'year' ? 'This year data' : 'All historical data'}
                    </div>
                  </div>
                  {currentRange === key && <Check className="w-4 h-4" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const DateNavigator = ({ currentRange, currentDate, onNavigate, loading }) => {
  if (currentRange === 'all' || currentRange === 'hour') return null;
  
  const getDisplayText = () => {
    switch(currentRange) {
      case 'today':
        return format(currentDate, 'MMM dd, yyyy');
      case 'week':
        return `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM dd')}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'year':
        return format(currentDate, 'yyyy');
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onNavigate('prev')}
        disabled={loading}
        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 disabled:opacity-50 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </motion.button>
      <span className="px-4 py-1 text-sm font-semibold text-slate-700 min-w-[140px] text-center">
        {getDisplayText()}
      </span>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onNavigate('next')}
        disabled={loading}
        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 disabled:opacity-50 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

const ReportTypeSelector = ({ selected, onSelect }) => (
  <div className="flex flex-wrap gap-3">
    {REPORT_TYPES.map((type) => (
      <motion.button
        key={type.id}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect(type.id)}
        className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
          selected === type.id
            ? `bg-gradient-to-r ${COLORS.gradient[type.color]} text-white shadow-lg`
            : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600'
        }`}
      >
        <type.icon className="w-4 h-4" />
        {type.label}
      </motion.button>
    ))}
  </div>
);

const ExportMenu = ({ onExport, loading }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg shadow-violet-500/30 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        Export
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
            >
              <div className="p-2 space-y-1">
                {['pdf', 'excel', 'csv', 'json'].map((format) => (
                  <button
                    key={format}
                    onClick={() => { onExport(format); setIsOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors text-left capitalize"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      format === 'pdf' ? 'bg-rose-500' : 
                      format === 'excel' ? 'bg-emerald-500' : 
                      format === 'csv' ? 'bg-blue-500' : 'bg-amber-500'
                    }`} />
                    <span className="font-medium">Export as {format.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const DataTable = ({ columns, data, title, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-1/3 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        <div className="p-8 text-center text-slate-500">No data available for this period</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-slate-50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : (
                      <span className="text-sm text-slate-700">{row[col.key]}</span>
                    )}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-3xl shadow-lg border border-slate-100 p-6 ${className}`}>
    <h3 className="text-lg font-bold text-slate-800 mb-6">{title}</h3>
    {children}
  </div>
);

// ===================== REPORT SECTIONS =====================

const SalesReport = ({ data, loading }) => {
  const summary = data?.summary || {};
  const dailyData = data?.dailyBreakdown || [];
  const products = data?.topProducts || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard
          title="Total Revenue"
          value={summary.totalRevenue || 0}
          subtext="For selected period"
          trend={summary.growth?.revenue >= 0 ? 'up' : 'down'}
          trendValue={summary.growth?.revenue || 0}
          icon={DollarSign}
          color="violet"
          delay={0}
        />
        <ReportCard
          title="Total Sales"
          value={summary.totalSales || 0}
          subtext="Completed transactions"
          trend={summary.growth?.sales >= 0 ? 'up' : 'down'}
          trendValue={summary.growth?.sales || 0}
          icon={ShoppingBag}
          color="pink"
          delay={0.1}
        />
        <ReportCard
          title="Average Order Value"
          value={summary.aov || 0}
          subtext="Per transaction"
          trend={summary.growth?.aov >= 0 ? 'up' : 'down'}
          trendValue={summary.growth?.aov || 0}
          icon={TrendingUp}
          color="amber"
          delay={0.2}
        />
        <ReportCard
          title="Conversion Rate"
          value={`${summary.conversionRate || 0}%`}
          subtext="Visitors to customers"
          trend={summary.growth?.conversion >= 0 ? 'up' : 'down'}
          trendValue={summary.growth?.conversion || 0}
          icon={Percent}
          color="emerald"
          delay={0.3}
        />
      </div>

      <ChartCard title="Revenue Trend" className="lg:col-span-2">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dailyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                formatter={(value, name) => [name === 'revenue' ? `$${value?.toLocaleString?.()}` : value, name]}
              />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} name="Revenue" />
              <Bar yAxisId="right" dataKey="orders" fill={COLORS.secondary} radius={[8, 8, 0, 0]} name="Orders" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <DataTable
        title="Top Selling Products"
        loading={loading}
        columns={[
          { key: 'product', label: 'Product' },
          { key: 'sku', label: 'SKU' },
          { key: 'quantity', label: 'Quantity Sold' },
          { key: 'revenue', label: 'Revenue', render: (val) => `$${val?.toLocaleString?.()}` },
          { key: 'growth', label: 'Growth %', render: (val) => (
            <span className={`${val >= 0 ? 'text-emerald-600' : 'text-rose-600'} font-semibold`}>
              {val >= 0 ? '+' : ''}{val}%
            </span>
          )}
        ]}
        data={products}
      />
    </div>
  );
};

const OrdersReport = ({ data, loading }) => {
  const summary = data?.summary || {};
  const statusData = data?.statusBreakdown || [];
  const hourlyData = data?.hourlyDistribution || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard
          title="Total Orders"
          value={summary.totalOrders || 0}
          subtext="All orders"
          trend={summary.growth?.total >= 0 ? 'up' : 'down'}
          trendValue={summary.growth?.total || 0}
          icon={ShoppingBag}
          color="violet"
        />
        <ReportCard
          title="Delivered"
          value={summary.delivered || 0}
          subtext="Successfully delivered"
          trend={summary.growth?.delivered >= 0 ? 'up' : 'down'}
          trendValue={summary.growth?.delivered || 0}
          icon={CheckCircle}
          color="emerald"
        />
        <ReportCard
          title="Pending"
          value={summary.pending || 0}
          subtext="Awaiting processing"
          trend="down"
          trendValue={5}
          icon={ClockIcon}
          color="amber"
        />
        <ReportCard
          title="Cancelled"
          value={summary.cancelled || 0}
          subtext="Cancelled orders"
          trend="down"
          trendValue={2}
          icon={XCircle}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Order Status Distribution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Orders by Hour">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="orders" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <DataTable
        title="Recent Orders"
        loading={loading}
        columns={[
          { key: 'orderId', label: 'Order ID' },
          { key: 'customer', label: 'Customer' },
          { key: 'date', label: 'Date', render: (val) => format(new Date(val), 'MMM dd, yyyy') },
          { key: 'total', label: 'Total', render: (val) => `$${val?.toLocaleString?.()}` },
          { key: 'status', label: 'Status', render: (val) => (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              val === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
              val === 'shipped' ? 'bg-blue-100 text-blue-700' :
              val === 'processing' ? 'bg-violet-100 text-violet-700' :
              val === 'pending' ? 'bg-amber-100 text-amber-700' :
              'bg-rose-100 text-rose-700'
            }`}>
              {val?.toUpperCase()}
            </span>
          )}
        ]}
        data={recentOrders}
      />
    </div>
  );
};

const CustomersReport = ({ data, loading }) => {
  const summary = data?.summary || {};
  const growthData = data?.customerGrowth || [];
  const segments = data?.segments || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard
          title="Total Customers"
          value={summary.totalCustomers || 0}
          subtext="Registered users"
          trend={summary.growth?.total >= 0 ? 'up' : 'down'}
          trendValue={summary.growth?.total || 0}
          icon={Users}
          color="blue"
        />
        <ReportCard
          title="New Customers"
          value={summary.newCustomers || 0}
          subtext="This period"
          trend={summary.growth?.new >= 0 ? 'up' : 'down'}
          trendValue={summary.growth?.new || 0}
          icon={UserPlus}
          color="emerald"
        />
        <ReportCard
          title="Returning Rate"
          value={`${summary.returningRate || 0}%`}
          subtext="Customer retention"
          trend="up"
          trendValue={4}
          icon={Target}
          color="amber"
        />
        <ReportCard
          title="Avg Lifetime Value"
          value={summary.ltv || 0}
          subtext="Per customer"
          trend="up"
          trendValue={8}
          icon={DollarSign}
          color="violet"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Customer Growth">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.info} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.info} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="customers" stroke={COLORS.info} fillOpacity={1} fill="url(#colorCustomers)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Customer Segments">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={segments}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="Customers" dataKey="A" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

const ProductsReport = ({ data, loading }) => {
  const summary = data?.summary || {};
  const products = data?.products || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard
          title="Total Products"
          value={summary.totalProducts || 0}
          subtext="Active listings"
          trend="up"
          trendValue={5}
          icon={Package}
          color="emerald"
        />
        <ReportCard
          title="Low Stock"
          value={summary.lowStock || 0}
          subtext="Needs attention"
          trend="down"
          trendValue={12}
          icon={AlertTriangle}
          color="amber"
        />
        <ReportCard
          title="Out of Stock"
          value={summary.outOfStock || 0}
          subtext="Unavailable"
          trend="down"
          trendValue={8}
          icon={XCircle}
          color="rose"
        />
        <ReportCard
          title="Categories"
          value={summary.categories || 0}
          subtext="Active categories"
          trend="up"
          trendValue={2}
          icon={Star}
          color="purple"
        />
      </div>

      <DataTable
        title="Product Performance"
        loading={loading}
        columns={[
          { key: 'name', label: 'Product Name' },
          { key: 'category', label: 'Category' },
          { key: 'stock', label: 'Stock', render: (val) => (
            <span className={`font-semibold ${val < 10 ? 'text-rose-600' : val < 50 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {val} units
            </span>
          )},
          { key: 'sold', label: 'Sold' },
          { key: 'revenue', label: 'Revenue', render: (val) => `$${val?.toLocaleString?.()}` },
          { key: 'rating', label: 'Rating', render: (val) => (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span className="font-semibold">{val}</span>
            </div>
          )}
        ]}
        data={products}
      />
    </div>
  );
};

const FinancialReport = ({ data, loading }) => {
  const summary = data?.summary || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard
          title="Gross Revenue"
          value={summary.grossRevenue || 0}
          subtext="Total sales"
          trend={summary.growth?.revenue >= 0 ? 'up' : 'down'}
          trendValue={summary.growth?.revenue || 0}
          icon={DollarSign}
          color="violet"
        />
        <ReportCard
          title="Net Revenue"
          value={summary.netRevenue || 0}
          subtext="After refunds"
          trend={summary.growth?.net >= 0 ? 'up' : 'down'}
          trendValue={summary.growth?.net || 0}
          icon={TrendingUp}
          color="emerald"
        />
        <ReportCard
          title="Refunds"
          value={summary.refunds || 0}
          subtext="Total refunded"
          trend="down"
          trendValue={3}
          icon={TrendingDown}
          color="rose"
        />
        <ReportCard
          title="Profit Margin"
          value={`${summary.profitMargin || 0}%`}
          subtext="Net / Gross"
          trend="up"
          trendValue={2}
          icon={Percent}
          color="amber"
        />
      </div>
    </div>
  );
};

// ===================== MAIN PAGE =====================

const AdminReportPage = () => {
  const { backendUrl } = useContext(Context);
  
  const [activeReport, setActiveReport] = useState('sales');
  const [timeRange, setTimeRange] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const currentReport = REPORT_TYPES.find(r => r.id === activeReport);

  // Calculate date range based on time selection
  const getDateRange = useCallback(() => {
    let start = new Date(currentDate);
    let end = new Date(currentDate);

    switch(timeRange) {
      case 'hour':
        start = subHours(end, 24);
        break;
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        start = startOfWeek(currentDate, { weekStartsOn: 1 });
        end = endOfWeek(currentDate, { weekStartsOn: 1 });
        break;
      case 'month':
        start = startOfMonth(currentDate);
        end = endOfMonth(currentDate);
        break;
      case 'year':
        start = startOfYear(currentDate);
        end = endOfYear(currentDate);
        break;
      case 'all':
        start = new Date(2020, 0, 1);
        end = new Date();
        break;
      default:
        start = subDays(end, 30);
    }
    return { start, end };
  }, [timeRange, currentDate]);

  // Fetch report data
  const fetchReportData = useCallback(async () => {
    if (!currentReport) return;
    
    setLoading(true);
    setReportData(null);
    
    try {
      const { start, end } = getDateRange();
      const token = document.cookie.split('token=')[1]?.split(';')[0];
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const params = new URLSearchParams({
        range: timeRange,
        startDate: start.toISOString(),
        endDate: end.toISOString()
      });

      const url = `${backendUrl}/reports/${currentReport.endpoint}?${params}`;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers
      });

      if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        return;
      }

      if (response.status === 403) {
        toast.error('Access denied. Admin only.');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setReportData(data.report);
      } else {
        toast.error(data.message || `Failed to fetch ${currentReport.label}`);
      }
    } catch (error) {
      console.error('Report fetch error:', error);
      toast.error(`Failed to load ${currentReport?.label || 'report'}`);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, currentReport, getDateRange, timeRange]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // Handle time range change
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    setCurrentDate(new Date());
    toast.success(`Switched to ${TIME_RANGES[newRange].label} view`);
  };

  // Handle date navigation (prev/next)
  const handleNavigate = (direction) => {
    const newDate = new Date(currentDate);
    const multiplier = direction === 'next' ? 1 : -1;
    
    switch(timeRange) {
      case 'today':
        newDate.setDate(newDate.getDate() + multiplier);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (7 * multiplier));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + multiplier);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + multiplier);
        break;
      default:
        return;
    }
    setCurrentDate(newDate);
  };

  // Handle export
  const handleExport = async (format) => {
    if (!reportData) {
      toast.error('No data to export');
      return;
    }

    setExportLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeReport}-report-${timeRange}-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Report exported as ${format.toUpperCase()}!`);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setExportLoading(false);
    }
  };

  const renderReport = () => {
    if (loading && !reportData) {
      return (
        <div className="flex items-center justify-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full"
          />
        </div>
      );
    }

    switch (activeReport) {
      case 'sales': return <SalesReport data={reportData} loading={loading} />;
      case 'orders': return <OrdersReport data={reportData} loading={loading} />;
      case 'customers': return <CustomersReport data={reportData} loading={loading} />;
      case 'products': return <ProductsReport data={reportData} loading={loading} />;
      case 'inventory': return <ProductsReport data={reportData} loading={loading} />;
      case 'financial': return <FinancialReport data={reportData} loading={loading} />;
      default: return <SalesReport data={reportData} loading={loading} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg shadow-violet-500/30">
                <FileText className="w-8 h-8 text-white" />
              </div>
              Admin Reports
            </h1>
            <p className="text-slate-500 mt-2 ml-16">Real-time analytics and insights for your business</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <DateNavigator 
              currentRange={timeRange} 
              currentDate={currentDate}
              onNavigate={handleNavigate}
              loading={loading}
            />
            
            <TimeRangeSelector 
              currentRange={timeRange}
              onChange={handleTimeRangeChange}
              loading={loading}
            />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchReportData()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:border-violet-300 hover:text-violet-600 transition-all shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </motion.button>

            <ExportMenu onExport={handleExport} loading={exportLoading} />
          </div>
        </motion.div>
      </div>

      {/* Report Type Selector */}
      <div className="max-w-7xl mx-auto mb-8">
        <ReportTypeSelector selected={activeReport} onSelect={setActiveReport} />
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-7xl mx-auto mb-4 p-4 bg-slate-100 rounded-xl text-xs text-slate-600 font-mono">
          <div>Range: {timeRange} | API: {backendUrl}/reports/{currentReport?.endpoint}</div>
        </div>
      )}

      {/* Report Content */}
      <motion.div
        key={activeReport + timeRange}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto"
      >
        {renderReport()}
      </motion.div>
    </div>
  );
};

export default AdminReportPage;