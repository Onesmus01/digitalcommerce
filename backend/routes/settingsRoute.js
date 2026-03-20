import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getSettings,
  updateSettings,
  uploadAsset,
  changePassword,
  generateBackup,
  clearCache,
  testNotification
} from '../controller/settingsController.js';
import authToken from '../middleware/authToken.js';
import isAdmin from '../middleware/adminAuth.js';

const settingsRouter = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|ico|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// All routes require auth and admin
settingsRouter.use(authToken, isAdmin);

// Main settings routes
settingsRouter.get('/', getSettings);
settingsRouter.put('/', updateSettings);

// File upload
settingsRouter.post('/upload', upload.single('file'), uploadAsset);

// Security
settingsRouter.post('/change-password', changePassword);

// Backup & Maintenance
settingsRouter.get('/backup', generateBackup);
settingsRouter.post('/clear-cache', clearCache);

// Testing
settingsRouter.post('/test-notification', testNotification);

export default settingsRouter;