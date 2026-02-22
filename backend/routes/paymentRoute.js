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
export const sendPaymentEmail = async (emails, name, amount, transactionId, orderId) => {
  try {
    // 1️⃣ Generate PDF as a Buffer using a Promise
    const pdfBuffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // PDF content
      doc.fontSize(20).text('E-Commerce Payment Receipt', { align: 'center' });
      doc.moveDown().fontSize(14).text(`Hello ${name},`);
      doc.text(`Order ID: ${orderId}`);
      doc.text(`Amount: KES ${amount}`);
      doc.text(`Transaction ID: ${transactionId}`);
      doc.text(`Date: ${new Date().toLocaleString()}`);
      doc.text('Thank you for shopping with us!');
      doc.end();
    });

    // 2️⃣ Send email to user and owner
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: Array.isArray(emails) ? emails.join(',') : emails, // handle array or string
      subject: 'Order Payment Confirmation',
      text: `Hello ${name},\nYour payment of KES ${amount} for order ${orderId} has been received. Transaction ID: ${transactionId}`,
      attachments: [
        {
          filename: `Receipt-${transactionId}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    console.log('[EMAIL SENT] Payment email sent to:', emails);
  } catch (err) {
    console.error('[EMAIL ERROR]', err);
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
paymentRouter.post('/mpesa/webhook', express.json(), async (req, res) => {
  console.log('================ MPESA WEBHOOK HIT ================');
  console.log('[MPESA WEBHOOK] Received request');
  console.log('Headers:', req.headers);
  console.log('Body:', JSON.stringify(req.body, null, 2));

  // Extract stkCallback from payload
  const stkCallback = req.body?.Body?.stkCallback;
  if (!stkCallback) {
    console.log('[MPESA WEBHOOK] Invalid payload, missing stkCallback');
    return res.status(400).json({ message: 'Invalid payload' });
  }

  const { CheckoutRequestID, ResultCode } = stkCallback;
  console.log('[MPESA WEBHOOK] CheckoutRequestID:', CheckoutRequestID, 'ResultCode:', ResultCode);

  // Determine payment status
  let status;
  switch (ResultCode) {
    case 0:
      status = 'success';
      break;
    case 1032:
      status = 'cancelled';
      break;
    default:
      status = 'failed';
  }
  console.log('[MPESA WEBHOOK] Determined status:', status);

  try {
    // Log the webhook for auditing
    const log = await MpesaLog.create({ transaction_id: CheckoutRequestID, status, payload: req.body });
    console.log('[MPESA WEBHOOK] Logged webhook:', log._id);

    // Find payment record
    const payment = await Payment.findOne({ transaction: CheckoutRequestID });
    if (!payment) {
      console.log('[MPESA WEBHOOK] Payment not found for transaction:', CheckoutRequestID);
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Skip if already processed
    if (payment.status === 'success' || payment.status === 'cancelled') {
      console.log('[MPESA WEBHOOK] Payment already processed, skipping update');
      return res.status(200).end();
    }

    // Update payment status
    payment.status = status;
    await payment.save();
    console.log('[MPESA WEBHOOK] Payment status updated to:', status);

    // Update associated order
    const order = await Order.findById(payment.order);
    if (order) {
      console.log('[MPESA WEBHOOK] Found associated order:', order._id);

      if (status === 'success') {
        order.paymentStatus = 'paid';
        order.orderStatus = 'processing';
      } else if (status === 'cancelled') {
        order.paymentStatus = 'cancelled';
        order.orderStatus = 'pending';
      } else {
        order.paymentStatus = 'failed';
        order.orderStatus = 'pending';
      }

      await order.save();
      console.log('[MPESA WEBHOOK] Order updated:', {
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      });
    }

    // Send email notifications on success
    if (status === 'success') {
      const user = await User.findById(payment.user);
      if (user && order) {
        const recipients = [user.email, process.env.OWNER_EMAIL]; // notify both user & owner
        await sendPaymentEmail(
          recipients,
          user.name,
          payment.amount,
          CheckoutRequestID,
          order._id
        );
        console.log('[MPESA WEBHOOK] Payment email sent to user & owner:', recipients);
      }
    }

    console.log('[MPESA WEBHOOK] Finished processing');
    return res.status(200).json({ message: 'Webhook processed', status });
  } catch (err) {
    console.error('[MPESA WEBHOOK ERROR]', err);
    return res.status(500).json({ message: 'Webhook processing failed' });
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

export default paymentRouter;
