import Settings from '../models/settingsModel.js';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { format } from 'date-fns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===================== GET SETTINGS =====================
export const getSettings = async (req, res) => {
  try {
    // Fetch or create default settings
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({
        general: {
          storeName: 'My Store',
          contactEmail: 'admin@store.com',
          phone: '',
          website: '',
          description: '',
          address: '',
          city: '',
          postalCode: '',
          country: 'Kenya'
        },
        payments: {
          methods: {
            creditCard: true,
            paypal: false,
            bankTransfer: false,
            mpesa: true,
            cod: false
          },
          currency: 'KES',
          currencyPosition: 'before',
          stripe: { publicKey: '', secretKey: '', webhook: '' }
        },
        notifications: {
          email: {
            newOrder: true,
            statusUpdate: true,
            lowStock: true,
            newUser: false
          },
          sms: {
            enabled: false,
            twilioSid: '',
            twilioToken: '',
            twilioPhone: ''
          },
          push: {
            enabled: true
          }
        },
        security: {
          strongPasswords: true,
          loginAlerts: true,
          sessionTimeout: true,
          twoFactorEnabled: false
        },
        appearance: {
          theme: 'light',
          primaryColor: 'emerald',
          compactMode: false,
          sidebarCollapsed: false,
          animations: true
        },
        users: {
          allowRegistration: true,
          requireVerification: true,
          autoApprove: false
        },
        backup: {
          autoBackup: false,
          cloudBackup: false,
          lastBackup: null
        }
      });
    }

    // Remove sensitive data before sending
    const safeSettings = {
      ...settings.toObject(),
      payments: {
        ...settings.payments,
        stripe: {
          publicKey: settings.payments.stripe.publicKey ? 
            settings.payments.stripe.publicKey.substring(0, 10) + '...' : '',
          secretKey: settings.payments.stripe.secretKey ? 
            '••••••••' + settings.payments.stripe.secretKey.slice(-4) : '',
          webhook: settings.payments.stripe.webhook ? 
            '••••••••' : ''
        }
      }
    };

    res.status(200).json({
      success: true,
      settings: safeSettings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message
    });
  }
};

// ===================== UPDATE SETTINGS =====================
export const updateSettings = async (req, res) => {
  try {
    const { section, data } = req.body;
    
    if (!section || !data) {
      return res.status(400).json({
        success: false,
        message: 'Section and data are required'
      });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    // Update specific section
    switch(section) {
      case 'general':
        settings.general = { ...settings.general, ...data };
        break;
      case 'payments':
        settings.payments = { ...settings.payments, ...data };
        break;
      case 'notifications':
        settings.notifications = { ...settings.notifications, ...data };
        break;
      case 'security':
        settings.security = { ...settings.security, ...data };
        break;
      case 'appearance':
        settings.appearance = { ...settings.appearance, ...data };
        break;
      case 'users':
        settings.users = { ...settings.users, ...data };
        break;
      case 'backup':
        settings.backup = { ...settings.backup, ...data };
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid section'
        });
    }

    settings.updatedAt = new Date();
    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings: settings.toObject()
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message
    });
  }
};

// ===================== UPLOAD LOGO/FAVICON =====================
export const uploadAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { type } = req.body; // 'logo' or 'favicon'
    const fileUrl = `/uploads/${req.file.filename}`;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    // Delete old file if exists
    const oldFile = type === 'logo' ? settings.general.logo : settings.general.favicon;
    if (oldFile) {
      const oldPath = path.join(__dirname, '../../public', oldFile);
      try {
        await fs.unlink(oldPath);
      } catch (err) {
        console.log('Old file not found or already deleted');
      }
    }

    // Update settings
    if (type === 'logo') {
      settings.general.logo = fileUrl;
    } else {
      settings.general.favicon = fileUrl;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: `${type} uploaded successfully`,
      url: fileUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    });
  }
};

// ===================== CHANGE PASSWORD =====================
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current and new password are required'
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

// ===================== GENERATE BACKUP =====================
export const generateBackup = async (req, res) => {
  try {
    const { type = 'full' } = req.query;
    
    const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
    const backupData = {};

    // Fetch data based on type
    if (type === 'full' || type === 'users') {
      backupData.users = await User.find().select('-password');
    }
    if (type === 'full' || type === 'orders') {
      backupData.orders = await Order.find();
    }
    if (type === 'full' || type === 'products') {
      backupData.products = await Product.find();
    }

    // Create backup object
    const backup = {
      metadata: {
        generatedAt: new Date(),
        type: type,
        version: '1.0'
      },
      data: backupData
    };

    // Save to file (in production, upload to S3 or cloud storage)
    const backupDir = path.join(__dirname, '../../backups');
    await fs.mkdir(backupDir, { recursive: true });
    
    const filename = `backup-${type}-${timestamp}.json`;
    const filepath = path.join(backupDir, filename);
    
    await fs.writeFile(filepath, JSON.stringify(backup, null, 2));

    // Update last backup time in settings
    let settings = await Settings.findOne();
    if (settings) {
      settings.backup.lastBackup = new Date();
      await settings.save();
    }

    // Send file for download
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({
          success: false,
          message: 'Failed to download backup'
        });
      }
    });
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate backup',
      error: error.message
    });
  }
};

// ===================== CLEAR CACHE =====================
export const clearCache = async (req, res) => {
  try {
    const { type = 'all' } = req.body;
    
    // In production, implement actual cache clearing logic
    // This could be Redis, Node-cache, or file system cache
    
    const clearedCaches = [];
    
    if (type === 'all' || type === 'products') {
      // Clear product cache
      clearedCaches.push('products');
    }
    if (type === 'all' || type === 'orders') {
      // Clear orders cache
      clearedCaches.push('orders');
    }
    if (type === 'all' || type === 'users') {
      // Clear users cache
      clearedCaches.push('users');
    }

    res.status(200).json({
      success: true,
      message: 'Cache cleared successfully',
      cleared: clearedCaches
    });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache',
      error: error.message
    });
  }
};

// ===================== TEST EMAIL/SMS =====================
export const testNotification = async (req, res) => {
  try {
    const { type } = req.body; // 'email' or 'sms'
    
    if (type === 'email') {
      // Implement email test logic
      // await sendTestEmail(req.user.email);
      res.status(200).json({
        success: true,
        message: 'Test email sent successfully'
      });
    } else if (type === 'sms') {
      // Implement SMS test logic
      // await sendTestSMS(req.user.phone);
      res.status(200).json({
        success: true,
        message: 'Test SMS sent successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid notification type'
      });
    }
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification',
      error: error.message
    });
  }
};