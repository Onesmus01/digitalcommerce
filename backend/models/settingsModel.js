import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  general: {
    storeName: { type: String, default: 'My Store' },
    contactEmail: { type: String, default: '' },
    phone: { type: String, default: '' },
    website: { type: String, default: '' },
    description: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: 'Kenya' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' }
  },
  payments: {
    methods: {
      creditCard: { type: Boolean, default: true },
      paypal: { type: Boolean, default: false },
      bankTransfer: { type: Boolean, default: false },
      mpesa: { type: Boolean, default: true },
      cod: { type: Boolean, default: false }
    },
    currency: { type: String, default: 'KES' },
    currencyPosition: { type: String, default: 'before' },
    stripe: {
      publicKey: { type: String, default: '' },
      secretKey: { type: String, default: '' },
      webhook: { type: String, default: '' }
    }
  },
  notifications: {
    email: {
      newOrder: { type: Boolean, default: true },
      statusUpdate: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true },
      newUser: { type: Boolean, default: false }
    },
    sms: {
      enabled: { type: Boolean, default: false },
      twilioSid: { type: String, default: '' },
      twilioToken: { type: String, default: '' },
      twilioPhone: { type: String, default: '' }
    },
    push: {
      enabled: { type: Boolean, default: true }
    }
  },
  security: {
    strongPasswords: { type: Boolean, default: true },
    loginAlerts: { type: Boolean, default: true },
    sessionTimeout: { type: Boolean, default: true },
    twoFactorEnabled: { type: Boolean, default: false }
  },
  appearance: {
    theme: { type: String, default: 'light' },
    primaryColor: { type: String, default: 'emerald' },
    compactMode: { type: Boolean, default: false },
    sidebarCollapsed: { type: Boolean, default: false },
    animations: { type: Boolean, default: true }
  },
  users: {
    allowRegistration: { type: Boolean, default: true },
    requireVerification: { type: Boolean, default: true },
    autoApprove: { type: Boolean, default: false }
  },
  backup: {
    autoBackup: { type: Boolean, default: false },
    cloudBackup: { type: Boolean, default: false },
    lastBackup: { type: Date, default: null }
  },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;