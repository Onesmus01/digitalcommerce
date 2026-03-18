import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import validator from 'validator';
import PDFDocument from 'pdfkit';
import { Buffer } from 'buffer';
import authToken from '../middleware/authToken.js';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import Payment from '../models/paymentModel.js';
import MpesaLog from '../models/mpesaLog.js';
import transporter from '../config/nodemailer.js';
import { getTotalRevenue } from '../controller/paymentController.js';
import QRCode from 'qrcode';
import isAdmin from '../middleware/adminAuth.js'

dotenv.config();
const paymentRouter = express.Router();

const {
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_SHORTCODE,
  MPESA_PASSKEY,
  CALLBACK_URL,
  WEBHOOK_SECRET,
  MPESA_ENV
} = process.env;

if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET || !MPESA_SHORTCODE || !MPESA_PASSKEY || !CALLBACK_URL) {
  throw new Error('Missing required M-Pesa environment variables.');
}

const BASE_URL = MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

// ======= TOKEN CACHE =======
let cachedToken = null;
let tokenExpiry = null;
const getMpesaToken = async () => {
  const now = Date.now();
  if (cachedToken && tokenExpiry && now < tokenExpiry) return cachedToken;

  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const { data } = await axios.get(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` }
  });

  cachedToken = data.access_token;
  tokenExpiry = now + 3500 * 1000; // ~58 min
  return cachedToken;
};

// ======= INPUT SANITIZATION =======
const sanitizeInput = (input) => validator.escape(String(input).trim());

// ======= EMAIL RECEIPT =======



import { createCanvas } from 'canvas';

export const sendPaymentEmail = async (emails, name, amount, transactionId, orderId, status = 'success', items = []) => {
  try {
    // Generate artistic QR with custom styling
    const qrCanvas = createCanvas(300, 300);
    await QRCode.toCanvas(qrCanvas, `https://luxestore.co/verify/${transactionId}`, {
      width: 280,
      margin: 1,
      color: {
        dark: '#C0A062', // Gold
        light: '#0A0A0A' // Black
      }
    });
    const qrDataUrl = qrCanvas.toDataURL();

    // Calculate financials
    const subtotal = items.reduce((sum, item) => sum + (item.selling * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 250;
    const tax = Math.round(subtotal * 0.16);
    const discount = items.reduce((sum, item) => sum + ((item.price - item.selling) * item.quantity), 0);
    const total = subtotal + shipping + tax;

    // 1️⃣ PDF — DARK LUXURY EDITION
    const pdfBuffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 0 });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Color palette — Dark luxury
      const palette = {
        bg: '#0A0A0A',
        card: '#141414',
        gold: '#C0A062',
        goldLight: '#D4B896',
        silver: '#A0A0A0',
        white: '#FFFFFF',
        success: '#22C55E',
        pending: '#F59E0B',
        failed: '#EF4444'
      };

      const statusColor = palette[status] || palette.success;

      // Background
      doc.rect(0, 0, 595, 842).fill(palette.bg);

      // Subtle grid pattern
      doc.strokeColor('#1A1A1A').lineWidth(0.5);
      for (let i = 0; i < 595; i += 40) {
        doc.moveTo(i, 0).lineTo(i, 842).stroke();
      }
      for (let i = 0; i < 842; i += 40) {
        doc.moveTo(0, i).lineTo(595, i).stroke();
      }

      // === HEADER ===
      // Gold accent line
      doc.rect(0, 0, 595, 3).fill(palette.gold);

      // Logo area
      doc.fillColor(palette.gold).fontSize(36).font('Helvetica-Bold');
      doc.text('✦', 50, 40);
      
      doc.fillColor(palette.white).fontSize(24).font('Helvetica-Bold');
      doc.text('LUXE', 85, 45);
      doc.fillColor(palette.gold).text('STORE', 155, 45);

      doc.fillColor(palette.silver).fontSize(10).font('Helvetica');
      doc.text('EST. 2024 • NAIROBI • PREMIUM DIGITAL', 50, 75);

      // Status pill
      const statusText = status.toUpperCase();
      const pillWidth = doc.widthOfString(statusText) + 40;
      doc.roundedRect(595 - pillWidth - 50, 50, pillWidth, 32, 16)
         .fill(statusColor + '20')
         .stroke(statusColor);
      doc.fillColor(statusColor).fontSize(11).font('Helvetica-Bold');
      doc.text(statusText, 595 - pillWidth - 50, 60, { width: pillWidth, align: 'center' });

      // === HERO SECTION ===
      let y = 130;

      // Receipt title with gold underline
      doc.fillColor(palette.silver).fontSize(10).font('Helvetica-Bold');
      doc.text('OFFICIAL RECEIPT', 50, y);
      
      doc.moveTo(50, y + 15).lineTo(150, y + 15).stroke(palette.gold).lineWidth(2);

      // Big amount
      y += 35;
      doc.fillColor(palette.white).fontSize(48).font('Helvetica-Bold');
      doc.text(`KES ${Number(amount).toLocaleString()}`, 50, y);

      doc.fillColor(palette.gold).fontSize(14).font('Helvetica');
      doc.text('Total Amount Paid', 50, y + 55);

      // Receipt meta right side
      const metaX = 350;
      const dateStr = new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
      });

      doc.fillColor(palette.silver).fontSize(9).text('RECEIPT NUMBER', metaX, y);
      doc.fillColor(palette.white).fontSize(12).font('Helvetica-Bold').text(`#${transactionId.slice(-10).toUpperCase()}`, metaX, y + 15);

      doc.fillColor(palette.silver).fontSize(9).text('DATE ISSUED', metaX, y + 40);
      doc.fillColor(palette.white).fontSize(11).text(dateStr, metaX, y + 55);

      doc.fillColor(palette.silver).fontSize(9).text('ORDER REFERENCE', metaX, y + 80);
      doc.fillColor(palette.white).fontSize(11).font('Helvetica-Bold').text(`ORD-${orderId.toString().slice(-8).toUpperCase()}`, metaX, y + 95);

      // === CUSTOMER CARD ===
      y = 280;
      doc.roundedRect(50, y, 495, 90, 8).fill(palette.card).stroke('#262626');

      doc.fillColor(palette.gold).fontSize(9).font('Helvetica-Bold').text('BILLED TO', 70, y + 20);
      doc.fillColor(palette.white).fontSize(18).font('Helvetica-Bold').text(name.toUpperCase(), 70, y + 40);
      doc.fillColor(palette.silver).fontSize(10).text('Verified Premium Member • Nairobi, Kenya', 70, y + 65);

      // === ITEMS TABLE ===
      y = 390;

      // Table header
      doc.roundedRect(50, y, 495, 35, 4).fill(palette.card);
      const headers = ['Item Description', 'Qty', 'Unit', 'Discount', 'Total'];
      const colWidths = [200, 50, 80, 80, 85];
      let colX = 70;

      doc.fillColor(palette.gold).fontSize(9).font('Helvetica-Bold');
      headers.forEach((h, i) => {
        doc.text(h, colX, y + 12, { width: colWidths[i], align: i === 0 ? 'left' : 'right' });
        colX += colWidths[i] + 10;
      });

      // Items
      y += 45;
      if (items.length > 0) {
        items.forEach((item, idx) => {
          const isEven = idx % 2 === 0;
          if (!isEven) {
            doc.rect(50, y - 5, 495, 30).fill('#0F0F0F');
          }

          const itemDiscount = (item.price - item.selling) * item.quantity;
          const itemTotal = item.selling * item.quantity;

          colX = 70;
          doc.fillColor(palette.white).fontSize(10).font('Helvetica-Bold').text(item.name, colX, y);
          colX += colWidths[0] + 10;
          
          doc.fillColor(palette.silver).fontSize(10).text(item.quantity.toString(), colX, y, { width: colWidths[1], align: 'right' });
          colX += colWidths[1] + 10;
          
          doc.fillColor(palette.white).fontSize(10).text(`KES ${item.selling.toLocaleString()}`, colX, y, { width: colWidths[2], align: 'right' });
          colX += colWidths[2] + 10;
          
          doc.fillColor(itemDiscount > 0 ? palette.gold : palette.silver).fontSize(10).text(
            itemDiscount > 0 ? `-KES ${itemDiscount.toLocaleString()}` : '—', 
            colX, y, { width: colWidths[3], align: 'right' }
          );
          colX += colWidths[3] + 10;
          
          doc.fillColor(palette.white).fontSize(10).font('Helvetica-Bold').text(`KES ${itemTotal.toLocaleString()}`, colX, y, { width: colWidths[4], align: 'right' });

          y += 35;
        });
      } else {
        doc.fillColor(palette.silver).fontSize(11).text('Payment for Order', 70, y);
        doc.fillColor(palette.white).fontSize(11).font('Helvetica-Bold').text(`KES ${Number(amount).toLocaleString()}`, 545, y, { align: 'right' });
        y += 35;
      }

      // === FINANCIAL BREAKDOWN ===
      y += 20;

      // Left: Payment method
      doc.roundedRect(50, y, 240, 130, 8).fill(palette.card).stroke('#262626');
      doc.fillColor(palette.gold).fontSize(9).font('Helvetica-Bold').text('PAYMENT METHOD', 70, y + 20);
      doc.fillColor(palette.white).fontSize(14).font('Helvetica-Bold').text('M-Pesa', 70, y + 45);
      doc.fillColor(palette.silver).fontSize(10).text('Mobile Money', 70, y + 65);
      doc.fillColor(palette.gold).fontSize(9).text('✓ INSTANT CONFIRMATION', 70, y + 95);

      // Right: Totals
      const totalsX = 320;
      const lineHeight = 22;

      const drawTotalLine = (label, value, isBold = false, color = palette.white) => {
        doc.fillColor(palette.silver).fontSize(10).text(label, totalsX, y);
        doc.fillColor(color).fontSize(isBold ? 14 : 11)[isBold ? 'font' : 'font']('Helvetica-Bold').text(value, 545, y, { align: 'right' });
        y += lineHeight;
      };

      drawTotalLine('Subtotal', `KES ${subtotal.toLocaleString()}`);
      drawTotalLine('Shipping', shipping === 0 ? 'FREE' : `KES ${shipping.toLocaleString()}`, false, palette.gold);
      drawTotalLine('Tax (16% VAT)', `KES ${tax.toLocaleString()}`);
      if (discount > 0) {
        drawTotalLine('You Saved', `KES ${discount.toLocaleString()}`, false, palette.gold);
      }

      // Grand total box
      y += 10;
      doc.roundedRect(totalsX, y, 225, 50, 6).fill(palette.gold + '15').stroke(palette.gold);
      doc.fillColor(palette.gold).fontSize(10).font('Helvetica-Bold').text('TOTAL PAID', totalsX + 15, y + 15);
      doc.fillColor(palette.white).fontSize(22).font('Helvetica-Bold').text(`KES ${Number(amount).toLocaleString()}`, 545, y + 12, { align: 'right' });

      // === QR & VERIFY ===
      y = 720;

      // QR placeholder with gold border
      doc.roundedRect(50, y, 100, 100, 8).stroke(palette.gold).lineWidth(2);
      doc.fillColor(palette.gold).fontSize(8).text('[QR CODE]', 100, y + 45, { align: 'center' });

      // Verification text
      doc.fillColor(palette.white).fontSize(14).font('Helvetica-Bold').text('Verify Authenticity', 170, y + 20);
      doc.fillColor(palette.silver).fontSize(10).text('Scan to verify this receipt on our blockchain', 170, y + 45);
      doc.fillColor(palette.gold).fontSize(9).font('Helvetica-Bold').text(`luxestore.co/verify/${transactionId.slice(-8)}`, 170, y + 65);

      // === FOOTER ===
      y = 820;
      doc.fillColor('#333333').fontSize(8).font('Helvetica');
      doc.text('This receipt is legally binding. Keep for returns & warranty.', 50, y);
      doc.text('© 2024 LUXESTORE. All rights reserved.', 50, y + 15);

      // Gold bottom line
      doc.rect(0, 839, 595, 3).fill(palette.gold);

      doc.end();
    });

    // 2️⃣ HTML EMAIL — AURORA DARK MODE
    const palette = {
      bg: '#0A0A0A',
      card: '#141414',
      gold: '#C0A062',
      goldGlow: 'rgba(192, 160, 98, 0.3)',
      silver: '#A0A0A0',
      white: '#FFFFFF',
      success: '#22C55E',
      pending: '#F59E0B',
      failed: '#EF4444'
    };

    const statusColor = palette[status] || palette.success;

    const itemsRows = items.length > 0 ? items.map((item, idx) => {
      const itemDiscount = (item.price - item.selling) * item.quantity;
      const itemTotal = item.selling * item.quantity;
      return `
        <tr style="background: ${idx % 2 === 0 ? '#0A0A0A' : '#0F0F0F'};">
          <td style="padding: 16px; color: #fff; font-size: 14px; font-weight: 600; border-bottom: 1px solid #1A1A1A;">${item.name}</td>
          <td style="padding: 16px; color: #A0A0A0; font-size: 14px; text-align: center; border-bottom: 1px solid #1A1A1A;">${item.quantity}</td>
          <td style="padding: 16px; color: #fff; font-size: 14px; text-align: right; border-bottom: 1px solid #1A1A1A;">KES ${item.selling.toLocaleString()}</td>
          <td style="padding: 16px; color: ${itemDiscount > 0 ? '#C0A062' : '#666'}; font-size: 14px; text-align: right; border-bottom: 1px solid #1A1A1A;">${itemDiscount > 0 ? `-KES ${itemDiscount.toLocaleString()}` : '—'}</td>
          <td style="padding: 16px; color: #fff; font-size: 14px; font-weight: 700; text-align: right; border-bottom: 1px solid #1A1A1A;">KES ${itemTotal.toLocaleString()}</td>
        </tr>
      `;
    }).join('') : `
      <tr>
        <td colspan="5" style="padding: 20px; color: #A0A0A0; text-align: center; border-bottom: 1px solid #1A1A1A;">Payment for Order #${orderId.toString().slice(-8).toUpperCase()}</td>
      </tr>
    `;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LuxeStore — Payment Confirmation</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body {
            font-family: 'Space Grotesk', -apple-system, sans-serif;
            background: #050505;
            color: #ffffff;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
          }
          
          .email-wrapper {
            max-width: 680px;
            margin: 0 auto;
            background: linear-gradient(180deg, #0A0A0A 0%, #141414 100%);
            border: 1px solid #1A1A1A;
          }
          
          /* Header */
          .header {
            padding: 40px 30px;
            border-bottom: 1px solid #1A1A1A;
            position: relative;
            overflow: hidden;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent, #C0A062, transparent);
          }
          
          .brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          
          .brand-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #C0A062 0%, #8B7355 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 0 30px rgba(192, 160, 98, 0.3);
          }
          
          .brand-text {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 2px;
          }
          
          .brand-text span { color: #C0A062; }
          
          .status-pill {
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            background: ${statusColor}15;
            border: 1px solid ${statusColor};
            color: ${statusColor};
            padding: 10px 24px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          
          /* Hero */
          .hero {
            padding: 50px 30px;
            text-align: center;
            background: radial-gradient(ellipse at center, #1A1A1A 0%, transparent 70%);
          }
          
          .amount-label {
            color: #C0A062;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 4px;
            margin-bottom: 16px;
          }
          
          .amount-value {
            font-size: 56px;
            font-weight: 700;
            background: linear-gradient(135deg, #FFFFFF 0%, #C0A062 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
          }
          
          @media (max-width: 480px) {
            .amount-value { font-size: 40px; }
          }
          
          .amount-currency {
            color: #A0A0A0;
            font-size: 14px;
          }
          
          /* Customer Card */
          .customer-card {
            margin: 0 30px 30px;
            padding: 24px;
            background: #141414;
            border: 1px solid #262626;
            border-radius: 16px;
          }
          
          .card-label {
            color: #C0A062;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }
          
          .customer-name {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 4px;
          }
          
          .customer-meta {
            color: #A0A0A0;
            font-size: 13px;
          }
          
          /* Items Table */
          .items-section {
            padding: 0 30px 30px;
          }
          
          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          
          .section-title {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #A0A0A0;
          }
          
          .item-count {
            color: #C0A062;
            font-size: 13px;
            font-weight: 600;
          }
          
          .items-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 14px;
          }
          
          .items-table th {
            padding: 16px;
            text-align: left;
            color: #C0A062;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 2px solid #C0A062;
          }
          
          .items-table th:last-child { text-align: right; }
          
          /* Financial Grid */
          .financial-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            padding: 0 30px 30px;
          }
          
          @media (max-width: 600px) {
            .financial-grid { grid-template-columns: 1fr; }
          }
          
          .payment-method {
            padding: 24px;
            background: #141414;
            border: 1px solid #262626;
            border-radius: 16px;
          }
          
          .method-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-bottom: 16px;
          }
          
          .method-name {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 4px;
          }
          
          .method-type {
            color: #A0A0A0;
            font-size: 13px;
            margin-bottom: 12px;
          }
          
          .method-status {
            color: #22C55E;
            font-size: 12px;
            font-weight: 600;
          }
          
          .totals-panel {
            padding: 24px;
            background: #141414;
            border: 1px solid #262626;
            border-radius: 16px;
          }
          
          .total-line {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            color: #A0A0A0;
            font-size: 14px;
          }
          
          .total-line.discount { color: #C0A062; }
          
          .total-line.grand {
            margin-top: 16px;
            padding-top: 20px;
            border-top: 2px solid #C0A062;
            color: #fff;
            font-size: 18px;
            font-weight: 700;
          }
          
          .grand-amount {
            color: #C0A062;
            font-size: 24px;
          }
          
          /* QR Section */
          .verify-section {
            margin: 0 30px 30px;
            padding: 30px;
            background: linear-gradient(135deg, #141414 0%, #0A0A0A 100%);
            border: 1px solid #262626;
            border-radius: 20px;
            text-align: center;
          }
          
          .qr-container {
            width: 160px;
            height: 160px;
            margin: 0 auto 20px;
            padding: 10px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 0 40px rgba(192, 160, 98, 0.2);
          }
          
          .qr-container img {
            width: 100%;
            height: 100%;
            border-radius: 8px;
          }
          
          .verify-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          
          .verify-text {
            color: #A0A0A0;
            font-size: 13px;
            margin-bottom: 16px;
          }
          
          .verify-url {
            display: inline-block;
            padding: 10px 20px;
            background: #1A1A1A;
            border: 1px solid #333;
            border-radius: 25px;
            color: #C0A062;
            font-size: 12px;
            font-weight: 600;
            font-family: monospace;
          }
          
          /* CTA */
          .cta-section {
            padding: 0 30px 40px;
            display: flex;
            gap: 16px;
          }
          
          @media (max-width: 480px) {
            .cta-section { flex-direction: column; }
          }
          
          .btn {
            flex: 1;
            padding: 18px 24px;
            border-radius: 12px;
            text-align: center;
            text-decoration: none;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
          }
          
          .btn-gold {
            background: linear-gradient(135deg, #C0A062 0%, #8B7355 100%);
            color: #0A0A0A;
            box-shadow: 0 4px 20px rgba(192, 160, 98, 0.3);
          }
          
          .btn-gold:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(192, 160, 98, 0.4);
          }
          
          .btn-outline {
            background: transparent;
            color: #C0A062;
            border: 2px solid #C0A062;
          }
          
          /* Footer */
          .footer {
            padding: 40px 30px;
            background: #050505;
            border-top: 1px solid #1A1A1A;
            text-align: center;
          }
          
          .socials {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .social {
            width: 44px;
            height: 44px;
            background: #141414;
            border: 1px solid #262626;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            text-decoration: none;
            transition: all 0.3s ease;
          }
          
          .social:hover {
            background: #C0A062;
            border-color: #C0A062;
            transform: translateY(-4px);
          }
          
          .footer-brand {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          
          .footer-brand span { color: #C0A062; }
          
          .footer-text {
            color: #666;
            font-size: 13px;
            margin-bottom: 4px;
          }
          
          .copyright {
            color: #444;
            font-size: 12px;
            margin-top: 24px;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <!-- Header -->
          <div class="header">
            <div class="brand">
              <div class="brand-icon">✦</div>
              <div class="brand-text">LUXE<span>STORE</span></div>
            </div>
            <div class="status-pill">${status}</div>
          </div>
          
          <!-- Hero Amount -->
          <div class="hero">
            <div class="amount-label">Total Amount Paid</div>
            <div class="amount-value">KES ${Number(amount).toLocaleString()}</div>
            <div class="amount-currency">Kenyan Shilling • Transaction Complete</div>
          </div>
          
          <!-- Customer -->
          <div class="customer-card">
            <div class="card-label">Billed To</div>
            <div class="customer-name">${name}</div>
            <div class="customer-meta">Verified Premium Member • Receipt #${transactionId.slice(-8).toUpperCase()}</div>
          </div>
          
          <!-- Items -->
          <div class="items-section">
            <div class="section-header">
              <div class="section-title">Order Details</div>
              <div class="item-count">${items.length} Items</div>
            </div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Discount</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>
          </div>
          
          <!-- Financial -->
          <div class="financial-grid">
            <div class="payment-method">
              <div class="method-icon">📱</div>
              <div class="method-name">M-Pesa</div>
              <div class="method-type">Mobile Money Payment</div>
              <div class="method-status">✓ Instant Confirmation</div>
            </div>
            
            <div class="totals-panel">
              <div class="total-line">
                <span>Subtotal</span>
                <span>KES ${subtotal.toLocaleString()}</span>
              </div>
              <div class="total-line">
                <span>Shipping</span>
                <span style="color: #22C55E;">${shipping === 0 ? 'FREE' : `KES ${shipping.toLocaleString()}`}</span>
              </div>
              <div class="total-line">
                <span>Tax (16%)</span>
                <span>KES ${tax.toLocaleString()}</span>
              </div>
              ${discount > 0 ? `
              <div class="total-line discount">
                <span>You Saved</span>
                <span>KES ${discount.toLocaleString()}</span>
              </div>
              ` : ''}
              <div class="total-line grand">
                <span>TOTAL PAID</span>
                <span class="grand-amount">KES ${Number(amount).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <!-- Verification -->
          <div class="verify-section">
            <div class="qr-container">
              <img src="${qrDataUrl}" alt="Verify">
            </div>
            <div class="verify-title">Verify Authenticity</div>
            <div class="verify-text">Scan this code to verify on our secure blockchain ledger</div>
            <div class="verify-url">luxestore.co/verify/${transactionId.slice(-8)}</div>
          </div>
          
          <!-- CTA -->
          <div class="cta-section">
            <a href="https://luxestore.co/orders/${orderId}" class="btn btn-gold">View Order</a>
            <a href="https://luxestore.co/support" class="btn btn-outline">Need Help?</a>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <div class="socials">
              <a href="#" class="social">📘</a>
              <a href="#" class="social">🐦</a>
              <a href="#" class="social">📷</a>
              <a href="#" class="social">💬</a>
            </div>
            <div class="footer-brand">LUXE<span>STORE</span></div>
            <div class="footer-text">support@luxestore.co • +254 700 000 000</div>
            <div class="footer-text">Nairobi, Kenya</div>
            <div class="copyright">© 2024 LuxeStore. All rights reserved. This is a legally binding receipt.</div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send
    await transporter.sendMail({
      from: `"LuxeStore ✦" <${process.env.SENDER_EMAIL}>`,
      to: Array.isArray(emails) ? emails.join(',') : emails,
      subject: `✦ KES ${Number(amount).toLocaleString()} • ${status.toUpperCase()} | LuxeStore Receipt #${transactionId.slice(-6).toUpperCase()}`,
      html: htmlContent,
      attachments: [
        {
          filename: `LuxeStore-Receipt-${transactionId.slice(-6).toUpperCase()}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });

    console.log('[EMAIL SENT] Dark luxury receipt delivered:', emails);
  } catch (err) {
    console.error('[EMAIL ERROR]', err);
    throw err;
  }
};

// ======= INITIATE M-PESA PAYMENT =======
// ======= INITIATE M-PESA PAYMENT WITH RETRY SUPPORT =======
paymentRouter.post('/mpesa/pay', authToken, async (req, res) => {
  try {
    let { phone, amount, orderId } = req.body;

    /* =======================
       SANITIZE & VALIDATE
    ======================= */
    phone = sanitizeInput(phone);
    amount = Number(amount);

    if (!phone || !orderId || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone, amount, or order ID',
      });
    }

    /* =======================
       NORMALIZE PHONE
    ======================= */
    if (phone.startsWith('0')) phone = '254' + phone.slice(1);

    if (!/^(2547|2541)\d{8}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Kenyan phone number',
      });
    }

    /* =======================
       VERIFY ORDER & USER
    ======================= */
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const user = await User.findById(order.user);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    /* =======================
       CHECK EXISTING PAYMENT
    ======================= */
    const existingPayment = await Payment.findOne({ order: orderId });

    if (existingPayment) {
      if (existingPayment.status === 'pending') {
        return res.status(429).json({
          success: false,
          message: 'Pending payment exists. Complete or cancel it before retrying.',
        });
      }

      // Retry allowed for failed/cancelled payments
      if (['failed', 'cancelled'].includes(existingPayment.status)) {
        await existingPayment.deleteOne();
      }
    }

    /* =======================
       GENERATE MPESA TOKEN
    ======================= */
    const token = await getMpesaToken();

    const timestamp = new Date().toISOString().replace(/[-T:]/g, '').slice(0, 14);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

    /* =======================
       INITIATE STK PUSH
    ======================= */
    const { data } = await axios.post(
      `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: CALLBACK_URL,
        AccountReference: `Order-${orderId}`,
        TransactionDesc: 'E-Commerce Order Payment',
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const checkoutRequestId = data.CheckoutRequestID;

    /* =======================
       SAVE PAYMENT RECORD
    ======================= */
    await Payment.create({
      user: user._id,
      order: order._id,
      phone,
      amount,
      status: 'pending',
      transaction: checkoutRequestId,
    });

    return res.status(200).json({
      success: true,
      message: 'STK Push initiated. Enter M-Pesa PIN.',
      transaction_id: checkoutRequestId,
    });
  } catch (error) {
    const errData = error.response?.data || error.message;
    console.error('[MPESA STK ERROR]', errData);

    let message = 'STK Push failed. Try again.';
    if (errData?.errorCode === '400.002.02') message = 'Invalid phone number';
    if (errData?.errorCode === '500.003.02') message = 'System busy. Try again later';

    return res.status(500).json({ success: false, message });
  }
});




paymentRouter.post('/mpesa/cancel/:transactionId', authToken, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const payment = await Payment.findOne({ transaction: transactionId, status: 'pending' });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found or already processed' });

    payment.status = 'cancelled';
    await payment.save();

    const order = await Order.findById(payment.order);
    if (order) {
      order.paymentStatus = 'cancelled';
      order.orderStatus = 'pending'; // allow retry
      await order.save();
    }

    res.json({ success: true, message: 'Payment cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error cancelling payment' });
  }
});

// ======= M-PESA CALLBACK =======
paymentRouter.post("/mpesa/webhook", express.json(), async (req, res) => {
  console.log("========== MPESA WEBHOOK HIT ==========");

  try {
    const stkCallback = req.body?.Body?.stkCallback;

    if (!stkCallback) {
      console.log("[MPESA WEBHOOK] Invalid payload");
      return res.status(400).json({ message: "Invalid payload" });
    }

    const { CheckoutRequestID, ResultCode } = stkCallback;

    console.log(
      "[MPESA WEBHOOK] Transaction:",
      CheckoutRequestID,
      "| ResultCode:",
      ResultCode
    );

    /* ----------------------------------------
       STANDARDIZED STATUS MAPPING
    ----------------------------------------- */
    let status = "failed";

    if (ResultCode === 0) {
      status = "success";
    } else if (ResultCode === 1032) {
      status = "cancelled";
    }

    console.log("[MPESA WEBHOOK] Mapped status:", status);

    /* ----------------------------------------
       LOG WEBHOOK
    ----------------------------------------- */
    await MpesaLog.create({
      transaction_id: CheckoutRequestID,
      status,
      payload: req.body,
    });

    /* ----------------------------------------
       FIND PAYMENT
    ----------------------------------------- */
    const payment = await Payment.findOne({
      transaction: CheckoutRequestID,
    });

    if (!payment) {
      console.log("[MPESA WEBHOOK] Payment not found");
      return res.status(404).json({ message: "Payment not found" });
    }

    /* ----------------------------------------
       PREVENT DOUBLE PROCESSING
    ----------------------------------------- */
    if (["success", "cancelled", "failed"].includes(payment.status)) {
      console.log("[MPESA WEBHOOK] Already processed. Skipping.");
      return res.status(200).json({ message: "Already processed" });
    }

    /* ----------------------------------------
       UPDATE PAYMENT
    ----------------------------------------- */
    payment.status = status;
    await payment.save();

    console.log("[MPESA WEBHOOK] Payment updated:", status);

    /* ----------------------------------------
       UPDATE ORDER
    ----------------------------------------- */
    const order = await Order.findById(payment.order);

    if (order) {
      order.paymentStatus = status; // ✅ NOW STANDARDIZED
      order.orderStatus =
        status === "success" ? "processing" : "pending";

      await order.save();

      console.log("[MPESA WEBHOOK] Order updated:", {
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      });
    }

    /* ----------------------------------------
       SEND EMAIL IF SUCCESS
    ----------------------------------------- */
    if (status === "success") {
      const user = await User.findById(payment.user);

      if (user && order) {
        const recipients = [user.email, process.env.OWNER_EMAIL];

        await sendPaymentEmail(
          recipients,
          user.name,
          payment.amount,
          CheckoutRequestID,
          order._id
        );

        console.log(
          "[MPESA WEBHOOK] Email sent to:",
          recipients
        );
      }
    }

    console.log("========== WEBHOOK COMPLETE ==========");

    return res.status(200).json({
      message: "Webhook processed",
      status,
    });
  } catch (error) {
    console.error("[MPESA WEBHOOK ERROR]", error);
    return res.status(500).json({
      message: "Webhook processing failed",
    });
  }
});
// ======= PAYMENT STATUS =======
paymentRouter.get('/mpesa/status/:transactionId', authToken, async (req, res) => {
  try {
    const payment = await Payment.findOne({ transaction: req.params.transactionId });
    if (!payment) return res.status(404).json({ success: false, message: 'Transaction not found' });

    let message;
    switch (payment.status) {
      case 'success':
        message = '✅ Payment successful 🎉';
        break;
      case 'failed':
        message = '❌ Payment failed';
        break;
      case 'cancelled':
        message = '⚠️ Payment cancelled by user';
        break;
      default:
        message = '⏳ Payment pending...';
    }

    res.json({ success: true, status: payment.status, message });
  } catch (err) {
    console.error('[STATUS ERROR]', err);
    res.status(500).json({ success: false, message: 'Error checking status' });
  }
});


// ======= MANUAL PAYMENT =======
paymentRouter.post('/payment/manual', authToken, async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    if (!orderId || !amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const user = await User.findById(order.user);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const transactionRef = `manual-${Date.now()}`;
    await Payment.create({
      user: user._id,
      order: order._id,
      phone: user.phone,
      amount,
      status: 'success',
      transaction: transactionRef
    });

    order.paymentStatus = 'paid';
    order.orderStatus = 'processing';
    await order.save();

    await sendPaymentEmail(user.email, user.name, amount, transactionRef, order._id);

    res.json({ success: true, message: 'Manual payment recorded', transaction: transactionRef });
  } catch (err) {
    console.error('[MANUAL ERROR]', err);
    res.status(500).json({ success: false, message: 'Error processing manual payment' });
  }
});

paymentRouter.get('/total-revenue',authToken,getTotalRevenue)

export default paymentRouter;
