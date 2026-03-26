import React, { useState, useEffect, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Save,
  Store,
  CreditCard,
  Bell,
  Shield,
  Palette,
  Database,
  Users,
  Mail,
  Smartphone,
  Globe,
  Upload,
  Trash2,
  Plus,
  Check,
  X,
  ChevronRight,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  AlertTriangle,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Context } from "@/context/ProductContext.jsx";

// ===================== SETTING SECTIONS =====================
const SETTING_TABS = [
  { id: 'general', label: 'General', icon: Store, color: 'emerald' },
  { id: 'payments', label: 'Payments', icon: CreditCard, color: 'violet' },
  { id: 'notifications', label: 'Notifications', icon: Bell, color: 'amber' },
  { id: 'security', label: 'Security', icon: Shield, color: 'rose' },
  { id: 'appearance', label: 'Appearance', icon: Palette, color: 'blue' },
  { id: 'users', label: 'User Roles', icon: Users, color: 'cyan' },
  { id: 'backup', label: 'Backup & Data', icon: Database, color: 'slate' }
];

const COLORS = {
  emerald: 'from-emerald-500 to-teal-600',
  violet: 'from-violet-500 to-purple-600',
  amber: 'from-amber-500 to-orange-500',
  rose: 'from-rose-500 to-pink-600',
  blue: 'from-blue-500 to-cyan-600',
  cyan: 'from-cyan-500 to-blue-600',
  slate: 'from-slate-500 to-slate-700'
};

// ===================== COMPONENTS =====================

const TabButton = ({ tab, isActive, onClick }) => {
  const Icon = tab.icon;
  return (
    <motion.button
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(tab.id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
        isActive 
          ? `bg-gradient-to-r ${COLORS[tab.color]} text-white shadow-lg` 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{tab.label}</span>
      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
    </motion.button>
  );
};

const SettingCard = ({ title, description, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 mb-6"
  >
    <div className="mb-4">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
    </div>
    {children}
  </motion.div>
);

const InputField = ({ label, value, onChange, type = "text", placeholder, icon: Icon, helpText }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
          Icon ? 'pl-12' : ''
        }`}
      />
    </div>
    {helpText && <p className="text-xs text-slate-400 mt-1">{helpText}</p>}
  </div>
);

const ToggleField = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <h4 className="font-semibold text-slate-800">{label}</h4>
      {description && <p className="text-sm text-slate-500">{description}</p>}
    </div>
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-8 rounded-full transition-colors ${
        checked ? 'bg-emerald-500' : 'bg-slate-300'
      }`}
    >
      <motion.div
        animate={{ x: checked ? 24 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 left-0 w-6 h-6 bg-white rounded-full shadow-md"
      />
    </motion.button>
  </div>
);

// ===================== SECTION COMPONENTS =====================

const GeneralSettings = ({ settings, updateSettings, handleFileUpload, uploading }) => (
  <div>
    <SettingCard title="Store Information" description="Basic details about your store" delay={0}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Store Name"
          value={settings.general?.storeName}
          onChange={(val) => updateSettings('general', { ...settings.general, storeName: val })}
          icon={Store}
        />
        <InputField
          label="Contact Email"
          value={settings.general?.contactEmail}
          onChange={(val) => updateSettings('general', { ...settings.general, contactEmail: val })}
          type="email"
          icon={Mail}
        />
        <InputField
          label="Phone Number"
          value={settings.general?.phone}
          onChange={(val) => updateSettings('general', { ...settings.general, phone: val })}
          icon={Smartphone}
        />
        <InputField
          label="Website URL"
          value={settings.general?.website}
          onChange={(val) => updateSettings('general', { ...settings.general, website: val })}
          icon={Globe}
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Store Description</label>
        <textarea
          value={settings.general?.description || ''}
          onChange={(e) => updateSettings('general', { ...settings.general, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          placeholder="Brief description of your store..."
        />
      </div>
    </SettingCard>

    <SettingCard title="Branding" description="Upload your logo and favicon" delay={0.1}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 'logo')}
            className="hidden"
            id="logo-upload"
            disabled={uploading}
          />
          <label
            htmlFor="logo-upload"
            className={`block border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {settings.general?.logo ? (
              <img src={settings.general.logo} alt="Logo" className="h-16 mx-auto mb-4 object-contain" />
            ) : (
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-slate-400" />
              </div>
            )}
            <p className="font-semibold text-slate-700">{uploading ? 'Uploading...' : 'Upload Logo'}</p>
            <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 2MB</p>
          </label>
        </div>

        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 'favicon')}
            className="hidden"
            id="favicon-upload"
            disabled={uploading}
          />
          <label
            htmlFor="favicon-upload"
            className={`block border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {settings.general?.favicon ? (
              <img src={settings.general.favicon} alt="Favicon" className="h-16 mx-auto mb-4 object-contain" />
            ) : (
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-slate-400" />
              </div>
            )}
            <p className="font-semibold text-slate-700">{uploading ? 'Uploading...' : 'Upload Favicon'}</p>
            <p className="text-xs text-slate-500 mt-1">ICO, PNG 32x32px</p>
          </label>
        </div>
      </div>
    </SettingCard>

    <SettingCard title="Address" description="Physical location of your business" delay={0.2}>
      <div className="space-y-4">
        <InputField
          label="Street Address"
          value={settings.general?.address}
          onChange={(val) => updateSettings('general', { ...settings.general, address: val })}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="City"
            value={settings.general?.city}
            onChange={(val) => updateSettings('general', { ...settings.general, city: val })}
          />
          <InputField
            label="Postal Code"
            value={settings.general?.postalCode}
            onChange={(val) => updateSettings('general', { ...settings.general, postalCode: val })}
          />
        </div>
        <InputField
          label="Country"
          value={settings.general?.country}
          onChange={(val) => updateSettings('general', { ...settings.general, country: val })}
        />
      </div>
    </SettingCard>
  </div>
);

const PaymentSettings = ({ settings, updateSettings }) => {
  const paymentMethods = [
    { key: 'creditCard', label: 'Credit Card' },
    { key: 'paypal', label: 'PayPal' },
    { key: 'bankTransfer', label: 'Bank Transfer' },
    { key: 'mpesa', label: 'M-Pesa' },
    { key: 'cod', label: 'Cash on Delivery' }
  ];

  return (
    <div>
      <SettingCard title="Payment Methods" description="Configure accepted payment options" delay={0}>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-slate-400" />
                <span className="font-medium text-slate-700">{method.label}</span>
              </div>
              <ToggleField
                label=""
                checked={settings.payments?.methods?.[method.key] || false}
                onChange={(val) => updateSettings('payments', {
                  ...settings.payments,
                  methods: { ...settings.payments?.methods, [method.key]: val }
                })}
              />
            </div>
          ))}
        </div>
      </SettingCard>

      <SettingCard title="Stripe Configuration" description="API keys for Stripe payments" delay={0.1}>
        <div className="space-y-4">
          <InputField
            label="Publishable Key"
            value={settings.payments?.stripe?.publicKey}
            onChange={(val) => updateSettings('payments', {
              ...settings.payments,
              stripe: { ...settings.payments?.stripe, publicKey: val }
            })}
            type="password"
            helpText="Starts with pk_"
          />
          <InputField
            label="Secret Key"
            value={settings.payments?.stripe?.secretKey}
            onChange={(val) => updateSettings('payments', {
              ...settings.payments,
              stripe: { ...settings.payments?.stripe, secretKey: val }
            })}
            type="password"
            helpText="Starts with sk_ - Keep this secret!"
          />
          <InputField
            label="Webhook Secret"
            value={settings.payments?.stripe?.webhook}
            onChange={(val) => updateSettings('payments', {
              ...settings.payments,
              stripe: { ...settings.payments?.stripe, webhook: val }
            })}
            type="password"
          />
        </div>
      </SettingCard>

      <SettingCard title="Currency Settings" description="Default currency and formatting" delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Currency</label>
            <select
              value={settings.payments?.currency || 'KES'}
              onChange={(e) => updateSettings('payments', { ...settings.payments, currency: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="NGN">NGN - Nigerian Naira</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Currency Symbol Position</label>
            <select
              value={settings.payments?.currencyPosition || 'before'}
              onChange={(e) => updateSettings('payments', { ...settings.payments, currencyPosition: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="before">Before amount ($100)</option>
              <option value="after">After amount (100$)</option>
            </select>
          </div>
        </div>
      </SettingCard>
    </div>
  );
};

const NotificationSettings = ({ settings, updateSettings, handleTestNotification, testing }) => (
  <div>
    <SettingCard title="Email Notifications" description="Configure when emails are sent" delay={0}>
      <div className="space-y-2">
        <ToggleField
          label="New Order Received"
          description="Send email when a new order is placed"
          checked={settings.notifications?.email?.newOrder || false}
          onChange={(val) => updateSettings('notifications', {
            ...settings.notifications,
            email: { ...settings.notifications?.email, newOrder: val }
          })}
        />
        <div className="h-px bg-slate-100 my-2" />
        <ToggleField
          label="Order Status Updated"
          description="Notify customers when order status changes"
          checked={settings.notifications?.email?.statusUpdate || false}
          onChange={(val) => updateSettings('notifications', {
            ...settings.notifications,
            email: { ...settings.notifications?.email, statusUpdate: val }
          })}
        />
        <div className="h-px bg-slate-100 my-2" />
        <ToggleField
          label="Low Stock Alert"
          description="Warn when inventory is running low"
          checked={settings.notifications?.email?.lowStock || false}
          onChange={(val) => updateSettings('notifications', {
            ...settings.notifications,
            email: { ...settings.notifications?.email, lowStock: val }
          })}
        />
        <div className="h-px bg-slate-100 my-2" />
        <ToggleField
          label="New User Registration"
          description="Alert when new users sign up"
          checked={settings.notifications?.email?.newUser || false}
          onChange={(val) => updateSettings('notifications', {
            ...settings.notifications,
            email: { ...settings.notifications?.email, newUser: val }
          })}
        />
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <button
          onClick={() => handleTestNotification('email')}
          disabled={testing}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors disabled:opacity-50"
        >
          {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          Send Test Email
        </button>
      </div>
    </SettingCard>

    <SettingCard title="SMS Notifications" description="Configure SMS alerts (requires Twilio)" delay={0.1}>
      <div className="space-y-4">
        <ToggleField
          label="Enable SMS Notifications"
          description="Send SMS for critical alerts"
          checked={settings.notifications?.sms?.enabled || false}
          onChange={(val) => updateSettings('notifications', {
            ...settings.notifications,
            sms: { ...settings.notifications?.sms, enabled: val }
          })}
        />
        {settings.notifications?.sms?.enabled && (
          <>
            <InputField
              label="Twilio Account SID"
              value={settings.notifications?.sms?.twilioSid}
              onChange={(val) => updateSettings('notifications', {
                ...settings.notifications,
                sms: { ...settings.notifications?.sms, twilioSid: val }
              })}
            />
            <InputField
              label="Twilio Auth Token"
              value={settings.notifications?.sms?.twilioToken}
              onChange={(val) => updateSettings('notifications', {
                ...settings.notifications,
                sms: { ...settings.notifications?.sms, twilioToken: val }
              })}
              type="password"
            />
            <InputField
              label="Twilio Phone Number"
              value={settings.notifications?.sms?.twilioPhone}
              onChange={(val) => updateSettings('notifications', {
                ...settings.notifications,
                sms: { ...settings.notifications?.sms, twilioPhone: val }
              })}
              placeholder="+1234567890"
            />
            <button
              onClick={() => handleTestNotification('sms')}
              disabled={testing}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors disabled:opacity-50"
            >
              {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
              Send Test SMS
            </button>
          </>
        )}
      </div>
    </SettingCard>

    <SettingCard title="Push Notifications" description="Browser push notification settings" delay={0.2}>
      <ToggleField
        label="Enable Push Notifications"
        description="Show browser notifications for new orders"
        checked={settings.notifications?.push?.enabled || false}
        onChange={(val) => updateSettings('notifications', {
          ...settings.notifications,
          push: { ...settings.notifications?.push, enabled: val }
        })}
      />
    </SettingCard>
  </div>
);

const SecuritySettings = ({ settings, updateSettings, handleChangePassword, changingPassword }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmitPassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    await handleChangePassword(passwordData.currentPassword, passwordData.newPassword);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div>
      <SettingCard title="Password Settings" description="Change your admin password" delay={0}>
        <div className="space-y-4">
          <InputField
            label="Current Password"
            type={showPassword ? "text" : "password"}
            value={passwordData.currentPassword}
            onChange={(val) => setPasswordData({ ...passwordData, currentPassword: val })}
            icon={Lock}
          />
          <InputField
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={passwordData.newPassword}
            onChange={(val) => setPasswordData({ ...passwordData, newPassword: val })}
            icon={Lock}
          />
          <InputField
            label="Confirm New Password"
            type={showPassword ? "text" : "password"}
            value={passwordData.confirmPassword}
            onChange={(val) => setPasswordData({ ...passwordData, confirmPassword: val })}
            icon={Lock}
          />
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="showPassword" className="text-sm text-slate-600">Show passwords</label>
          </div>
          <button
            onClick={handleSubmitPassword}
            disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {changingPassword ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : 'Change Password'}
          </button>
        </div>
      </SettingCard>

      <SettingCard title="Two-Factor Authentication" description="Add extra security to your account" delay={0.1}>
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-emerald-600" />
            <div>
              <p className="font-semibold text-emerald-900">
                {settings.security?.twoFactorEnabled ? '2FA is Enabled' : '2FA is Disabled'}
              </p>
              <p className="text-sm text-emerald-700">
                {settings.security?.twoFactorEnabled 
                  ? 'Your account is protected with Google Authenticator' 
                  : 'Enable 2FA for additional security'}
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
            {settings.security?.twoFactorEnabled ? 'Configure' : 'Enable'}
          </button>
        </div>
      </SettingCard>

      <SettingCard title="Login Security" description="Additional security measures" delay={0.2}>
        <div className="space-y-2">
          <ToggleField
            label="Require Strong Passwords"
            description="Enforce 8+ chars with symbols for all users"
            checked={settings.security?.strongPasswords || false}
            onChange={(val) => updateSettings('security', { ...settings.security, strongPasswords: val })}
          />
          <div className="h-px bg-slate-100 my-2" />
          <ToggleField
            label="Login Notifications"
            description="Email alert on new device login"
            checked={settings.security?.loginAlerts || false}
            onChange={(val) => updateSettings('security', { ...settings.security, loginAlerts: val })}
          />
          <div className="h-px bg-slate-100 my-2" />
          <ToggleField
            label="Session Timeout"
            description="Auto-logout after 30 minutes of inactivity"
            checked={settings.security?.sessionTimeout || false}
            onChange={(val) => updateSettings('security', { ...settings.security, sessionTimeout: val })}
          />
        </div>
      </SettingCard>
    </div>
  );
};

const AppearanceSettings = ({ settings, updateSettings }) => (
  <div>
    <SettingCard title="Theme Settings" description="Customize the look and feel" delay={0}>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {['light', 'dark', 'auto'].map((theme) => (
          <motion.button
            key={theme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updateSettings('appearance', { ...settings.appearance, theme })}
            className={`p-4 rounded-2xl border-2 transition-all ${
              settings.appearance?.theme === theme 
                ? 'border-emerald-500 bg-emerald-50' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${
              theme === 'light' ? 'bg-white border border-slate-200' :
              theme === 'dark' ? 'bg-slate-800' : 'bg-gradient-to-br from-white to-slate-800'
            }`} />
            <p className="font-semibold capitalize">{theme}</p>
          </motion.button>
        ))}
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Color</label>
          <div className="flex gap-3">
            {['emerald', 'violet', 'blue', 'rose', 'amber'].map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateSettings('appearance', { ...settings.appearance, primaryColor: color })}
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${COLORS[color]} ${
                  settings.appearance?.primaryColor === color ? 'ring-4 ring-offset-2 ring-slate-200' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </SettingCard>

    <SettingCard title="Layout Options" description="Dashboard layout preferences" delay={0.1}>
      <div className="space-y-2">
        <ToggleField
          label="Compact Mode"
          description="Reduce spacing for denser UI"
          checked={settings.appearance?.compactMode || false}
          onChange={(val) => updateSettings('appearance', { ...settings.appearance, compactMode: val })}
        />
        <div className="h-px bg-slate-100 my-2" />
        <ToggleField
          label="Sidebar Collapsed by Default"
          description="Start with collapsed navigation"
          checked={settings.appearance?.sidebarCollapsed || false}
          onChange={(val) => updateSettings('appearance', { ...settings.appearance, sidebarCollapsed: val })}
        />
        <div className="h-px bg-slate-100 my-2" />
        <ToggleField
          label="Show Animations"
          description="Enable page transitions and effects"
          checked={settings.appearance?.animations !== false}
          onChange={(val) => updateSettings('appearance', { ...settings.appearance, animations: val })}
        />
      </div>
    </SettingCard>
  </div>
);

const UserRoleSettings = ({ settings, updateSettings }) => (
  <div>
    <SettingCard title="Role Management" description="Configure user permissions" delay={0}>
      <div className="space-y-4">
        {['Admin', 'Manager', 'Editor', 'Viewer'].map((role) => (
          <div key={role} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {role[0]}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{role}</p>
                <p className="text-xs text-slate-500">
                  {role === 'Admin' ? 'Full access to all features' :
                   role === 'Manager' ? 'Can manage orders and products' :
                   role === 'Editor' ? 'Can edit content only' :
                   'View-only access'}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm font-semibold text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
            >
              Edit Permissions
            </motion.button>
          </div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 p-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Custom Role
      </motion.button>
    </SettingCard>

    <SettingCard title="Registration Settings" description="Control user sign-ups" delay={0.1}>
      <div className="space-y-2">
        <ToggleField
          label="Allow Public Registration"
          description="Anyone can create an account"
          checked={settings.users?.allowRegistration !== false}
          onChange={(val) => updateSettings('users', { ...settings.users, allowRegistration: val })}
        />
        <div className="h-px bg-slate-100 my-2" />
        <ToggleField
          label="Require Email Verification"
          description="Users must verify email before login"
          checked={settings.users?.requireVerification || false}
          onChange={(val) => updateSettings('users', { ...settings.users, requireVerification: val })}
        />
        <div className="h-px bg-slate-100 my-2" />
        <ToggleField
          label="Auto-approve New Users"
          description="Skip manual approval for new accounts"
          checked={settings.users?.autoApprove || false}
          onChange={(val) => updateSettings('users', { ...settings.users, autoApprove: val })}
        />
      </div>
    </SettingCard>
  </div>
);

const BackupSettings = ({ settings, updateSettings, handleBackup, handleClearCache, backingUp, clearing }) => (
  <div>
    <SettingCard title="Data Backup" description="Export and backup your data" delay={0}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleBackup('full')}
          disabled={backingUp}
          className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-colors text-left disabled:opacity-50"
        >
          <Download className={`w-8 h-8 text-emerald-500 mb-3 ${backingUp ? 'animate-bounce' : ''}`} />
          <h4 className="font-bold text-slate-800">Manual Backup</h4>
          <p className="text-sm text-slate-500 mt-1">Download all data as JSON</p>
        </motion.button>
        
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-violet-500 mb-3" />
          <h4 className="font-bold text-slate-800">Last Backup</h4>
          <p className="text-sm text-slate-500 mt-1">
            {settings.backup?.lastBackup 
              ? new Date(settings.backup.lastBackup).toLocaleString() 
              : 'Never'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <ToggleField
          label="Daily Automatic Backup"
          description="Backup data every day at midnight"
          checked={settings.backup?.autoBackup || false}
          onChange={(val) => updateSettings('backup', { ...settings.backup, autoBackup: val })}
        />
        <div className="h-px bg-slate-100 my-2" />
        <ToggleField
          label="Cloud Storage"
          description="Store backups in cloud (AWS S3)"
          checked={settings.backup?.cloudBackup || false}
          onChange={(val) => updateSettings('backup', { ...settings.backup, cloudBackup: val })}
        />
      </div>
    </SettingCard>

    <SettingCard title="Maintenance" description="System maintenance tools" delay={0.1}>
      <div className="p-4 border border-amber-200 bg-amber-50 rounded-xl mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-amber-900">Clear All Cache</h4>
            <p className="text-sm text-amber-700">Reset application cache</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClearCache('all')}
            disabled={clearing}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {clearing ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Clear Cache'}
          </motion.button>
        </div>
      </div>

      <div className="p-4 border border-rose-200 bg-rose-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-rose-900">Reset to Defaults</h4>
            <p className="text-sm text-rose-700">Restore all settings to factory defaults</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
          >
            Reset
          </motion.button>
        </div>
      </div>
    </SettingCard>
  </div>
);

// ===================== MAIN PAGE =====================

const AdminSettingsPage = () => {
  const { backendUrl, getAuthHeaders } = useContext(Context);
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [backingUp, setBackingUp] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [settings, setSettings] = useState({
    general: {},
    payments: { methods: {}, stripe: {} },
    notifications: { email: {}, sms: {}, push: {} },
    security: {},
    appearance: {},
    users: {},
    backup: {}
  });

  // Fetch settings on mount
  const fetchSettings = useCallback(async () => {
    try {
      const token = document.cookie.split('token=')[1]?.split(';')[0];
      const response = await fetch(`${backendUrl}/settings`, {
        credentials: 'include',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSettings(data.settings);
        }
      } else {
        toast.error('Failed to fetch settings');
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
      toast.error('Error loading settings');
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Update settings handler (section-based to match backend)
  const updateSettings = (section, data) => {
    setSettings(prev => ({ ...prev, [section]: data }));
  };

  // Save settings (section by section)
  const handleSave = async () => {
    setSaving(true);
    try {
      const token = document.cookie.split('token=')[1]?.split(';')[0];
      
      // Save current active section only
      const sectionData = {
        section: activeTab,
        data: settings[activeTab]
      };

      const response = await fetch(`${backendUrl}/settings`, {
        method: 'PUT',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(sectionData)
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          toast.success(`${SETTING_TABS.find(t => t.id === activeTab)?.label} settings saved!`);
        } else {
          toast.error(result.message || 'Failed to save');
        }
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const token = document.cookie.split('token=')[1]?.split(';')[0];
      const response = await fetch(`${backendUrl}/settings/upload`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} uploaded!`);
          updateSettings('general', { ...settings.general, [type]: data.url });
        }
      } else {
        toast.error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload error');
    } finally {
      setUploading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (currentPassword, newPassword) => {
    setChangingPassword(true);
    try {
      const token = document.cookie.split('token=')[1]?.split(';')[0];
      const response = await fetch(`${backendUrl}/settings/change-password`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Password changed successfully!');
        } else {
          toast.error(data.message || 'Failed to change password');
        }
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Error changing password');
    } finally {
      setChangingPassword(false);
    }
  };

  // Handle backup
  const handleBackup = async (type) => {
    setBackingUp(true);
    try {
      const token = document.cookie.split('token=')[1]?.split(';')[0];
      const response = await fetch(`${backendUrl}/settings/backup?type=${type}`, {
        credentials: 'include',
          headers: getAuthHeaders()
      });

      if (response.ok) {
        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${type}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('Backup downloaded!');
        // Update last backup time locally
        updateSettings('backup', { ...settings.backup, lastBackup: new Date().toISOString() });
      } else {
        toast.error('Backup failed');
      }
    } catch (error) {
      console.error('Backup error:', error);
      toast.error('Error creating backup');
    } finally {
      setBackingUp(false);
    }
  };

  // Handle clear cache
  const handleClearCache = async (type) => {
    setClearing(true);
    try {
      const token = document.cookie.split('token=')[1]?.split(';')[0];
      const response = await fetch(`${backendUrl}/settings/clear-cache`, {
        method: 'POST',
        credentials: 'include',
          headers:getAuthHeaders(),
        body: JSON.stringify({ type })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success(`Cache cleared: ${data.cleared.join(', ')}`);
        }
      } else {
        toast.error('Failed to clear cache');
      }
    } catch (error) {
      console.error('Clear cache error:', error);
      toast.error('Error clearing cache');
    } finally {
      setClearing(false);
    }
  };

  // Handle test notification
  const handleTestNotification = async (type) => {
    setTesting(true);
    try {
      const token = document.cookie.split('token=')[1]?.split(';')[0];
      const response = await fetch(`${backendUrl}/settings/test-notification`, {
        method: 'POST',
        credentials: 'include',
          headers: getAuthHeaders(),
        body: JSON.stringify({ type })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success(`Test ${type} sent!`);
        } else {
          toast.error(data.message || 'Failed to send');
        }
      } else {
        toast.error('Failed to send test notification');
      }
    } catch (error) {
      console.error('Test notification error:', error);
      toast.error('Error sending test');
    } finally {
      setTesting(false);
    }
  };

  const renderTabContent = () => {
    const props = {
      settings,
      updateSettings,
      handleFileUpload,
      uploading,
      handleChangePassword,
      changingPassword,
      handleBackup,
      handleClearCache,
      backingUp,
      clearing,
      handleTestNotification,
      testing
    };

    switch(activeTab) {
      case 'general': return <GeneralSettings {...props} />;
      case 'payments': return <PaymentSettings {...props} />;
      case 'notifications': return <NotificationSettings {...props} />;
      case 'security': return <SecuritySettings {...props} />;
      case 'appearance': return <AppearanceSettings {...props} />;
      case 'users': return <UserRoleSettings {...props} />;
      case 'backup': return <BackupSettings {...props} />;
      default: return <GeneralSettings {...props} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full"
        />
      </div>
    );
  }

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
              <div className="p-3 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              Admin Settings
            </h1>
            <p className="text-slate-500 mt-2 ml-16">Manage your store configuration</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-4 sticky top-6">
            <nav className="space-y-2">
              {SETTING_TABS.map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                  onClick={setActiveTab}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;