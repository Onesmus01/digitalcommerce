// controllers/subscribeController.js
import Subscriber from "../models/subscriberModel.js";
import Product from "../models/productModel.js";
import transporter from "../config/nodemailer.js";
import Promotion from "../models/promotionModel.js";
import { getIO } from "../soket.js";
import dotenv from "dotenv";
dotenv.config();

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'onesmuswambua747@gmail.com';


const DEMO_PRODUCTS = [
  {
    _id: "demo-1",
    name: "Premium Wireless Headphones Pro",
    price: 199,
    originalPrice: 299,
    category: "Audio",
    description: "Active noise cancellation, 40-hour battery, studio-quality sound",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    reviews: "3.2k",
    stock: 45,
    rating: 4.8
  },
  {
    _id: "demo-2",
    name: "4K Ultra HD Smart TV 55\"",
    price: 599,
    originalPrice: 899,
    category: "TV & Home Theater",
    description: "Crystal clear OLED display with AI-powered 4K upscaling",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
    reviews: "1.8k",
    stock: 23,
    rating: 4.9
  },
  {
    _id: "demo-3",
    name: "Gaming Laptop Pro X1",
    price: 1299,
    originalPrice: 1599,
    category: "Computers",
    description: "RTX 4070, Intel i9-13900H, 32GB RAM, 1TB NVMe SSD",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
    reviews: "892",
    stock: 12,
    rating: 4.7
  },
  {
    _id: "demo-4",
    name: "Smart Watch Series 7",
    price: 299,
    originalPrice: 399,
    category: "Wearables",
    description: "Health monitoring, GPS, 7-day battery, water resistant",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop",
    reviews: "5.1k",
    stock: 67,
    rating: 4.6
  }
];

const getProductsForEmail = async (limit = 4) => {
  console.log(`[PRODUCTS] Fetching ${limit} products for email...`);
  
  let products = [];
  let source = "database";
  
  try {
    if (Product && typeof Product.find === 'function') {
      products = await Product.find({ 
        isActive: true,
        stock: { $gt: 0 }
      })
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .lean();
      
      console.log(`[PRODUCTS] DB returned ${products?.length || 0} products`);
    }
  } catch (dbError) {
    console.error(`[PRODUCTS] DB Error:`, dbError.message);
    products = [];
  }

  if (!Array.isArray(products) || products.length === 0) {
    console.log(`[PRODUCTS] Using ${limit} demo products`);
    products = DEMO_PRODUCTS.slice(0, limit);
    source = "demo";
  }

  // Ensure all products have required fields
  const safeProducts = products.map((p, idx) => ({
    _id: p._id || `fallback-${idx}`,
    name: p.name || "Premium Product",
    price: p.price || 99,
    originalPrice: p.originalPrice || Math.round((p.price || 99) * 1.3),
    category: p.category || "Electronics",
    description: p.description || "High-quality premium electronics with fast shipping",
    image: p.image || `https://via.placeholder.com/400x300/dc2626/ffffff?text=${encodeURIComponent(p.name || 'Product')}`,
    reviews: p.reviews || "1k+",
    stock: p.stock || 10,
    rating: p.rating || 4.5
  }));

  console.log(`[PRODUCTS] Returning ${safeProducts.length} products from ${source}`);
  return { products: safeProducts, source, count: safeProducts.length };
};

const buildProductCard = (product) => {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const hasDiscount = discount > 0;
  
  return `
    <!-- Product Card -->
    <div style="display: inline-block; width: 280px; margin: 10px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); vertical-align: top; border: 1px solid #e5e7eb;">
      
      ${hasDiscount ? `
        <div style="position: relative;">
          <div style="position: absolute; top: 12px; left: 12px; background: #dc2626; color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; z-index: 10; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            SAVE ${discount}%
          </div>
        </div>
      ` : ''}
      
      <div style="height: 180px; overflow: hidden; position: relative;">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;" width="280" height="180"/>
        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); padding: 15px;">
          <span style="color: #fbbf24; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">${product.category}</span>
        </div>
      </div>
      
      <div style="padding: 20px;">
        <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 17px; font-weight: 700; line-height: 1.3; height: 44px; overflow: hidden;">${product.name}</h3>
        
        <div style="margin-bottom: 10px;">
          <span style="color: #fbbf24; font-size: 14px; letter-spacing: 1px;">★★★★★</span>
          <span style="color: #6b7280; font-size: 12px; margin-left: 6px;">(${product.reviews})</span>
        </div>
        
        <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0 0 15px 0; height: 40px; overflow: hidden;">${product.description}</p>
        
        <div style="margin-bottom: 15px;">
          <span style="color: #dc2626; font-size: 24px; font-weight: 800;">$${product.price}</span>
          ${hasDiscount ? `<span style="color: #9ca3af; font-size: 14px; text-decoration: line-through; margin-left: 8px;">$${product.originalPrice}</span>` : ''}
        </div>
        
        <a href="https://digitalcommerce.com/product/${product._id}" style="display: block; background: linear-gradient(135deg, #dc2626, #ea580c); color: white; text-align: center; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3);">
          Shop Now →
        </a>
      </div>
    </div>
  `;
};

const buildProductsSection = (products, title = "Featured Products") => {
  if (!Array.isArray(products) || products.length === 0) {
    return `<p style="text-align: center; color: #6b7280; padding: 40px;">No products available</p>`;
  }

  const cards = products.map(p => buildProductCard(p)).join('');
  
  return `
    <div style="text-align: center; margin: 30px 0;">
      <h2 style="color: #dc2626; margin: 0 0 25px 0; font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
        ${title}
      </h2>
      <div style="text-align: center;">
        ${cards}
      </div>
    </div>
  `;
};

const sendWelcomeEmail = async (email) => {
  console.log(`[EMAIL] Building welcome email for: ${email}`);
  
  try {
    const { products, source, count } = await getProductsForEmail(4);
    console.log(`[EMAIL] Using ${count} products from ${source}`);
    
    const productsSection = buildProductsSection(products, "🔥 Trending Now");
    
    const featuredList = products.slice(0, 3).map(p => {
      const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
      return `<li style="margin-bottom: 10px; color: #374151; font-size: 15px;">
        <strong style="color: #dc2626;">${p.name}</strong> — 
        <span style="color: #059669; font-weight: 600;">$${p.price}</span>
        ${discount > 0 ? `<span style="color: #dc2626; font-size: 13px; margin-left: 8px; background: #fef2f2; padding: 2px 8px; border-radius: 4px;">Save ${discount}%</span>` : ''}
      </li>`;
    }).join('');

    // IMPROVED: Better email headers for deliverability
    const mailOptions = {
      from: `"DigitalCommerce Team" <${OWNER_EMAIL}>`, // Changed to hello@ (more friendly)
      to: email,
      subject: "Welcome to DigitalCommerce! Your Tech Deals Await 🎉",
      replyTo: "support@digitalcommerce.com", // Add reply-to
      headers: {
        'X-Mailer': 'DigitalCommerce-NodeJS',
        'X-Priority': '1', // High priority
        'Precedence': 'bulk'
      },
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Welcome to DigitalCommerce</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">
  
  <!-- Hidden preview text -->
  <div style="display: none; max-height: 0px; overflow: hidden;">
    Welcome! Check out these amazing tech deals: ${products[0]?.name} at $${products[0]?.price}, ${products[1]?.name} at $${products[1]?.price}...
  </div>
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%); padding: 50px 40px; text-align: center;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px auto;">
                <tr>
                  <td style="background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.3);">
                    <span style="color: #ffffff; font-size: 13px; font-weight: 700; letter-spacing: 1px;">✓ VERIFIED MEMBER</span>
                  </td>
                </tr>
              </table>
              
              <h1 style="color: #ffffff; margin: 0; font-size: 44px; font-weight: 900; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); line-height: 1.2;">
                Welcome Aboard! 🚀
              </h1>
              <p style="color: rgba(255,255,255,0.95); margin: 20px 0 0 0; font-size: 18px; font-weight: 500;">
                You're now part of an exclusive tech community
              </p>
            </td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 17px; color: #374151; line-height: 1.8; margin: 0 0 20px 0;">
                Hi there, <strong style="color: #dc2626; font-size: 19px;">Tech Enthusiast</strong>! 👋
              </p>
              <p style="font-size: 16px; color: #6b7280; line-height: 1.8; margin: 0 0 30px 0;">
                Thanks for joining <strong style="color: #111827;">50,000+ savvy shoppers</strong> who get first access to premium electronics at unbeatable prices!
              </p>
              
              <!-- Benefits -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                <tr>
                  <td width="25%" style="padding: 8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #fef2f2; border-radius: 16px;">
                      <tr><td style="padding: 20px; text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 8px;">⚡</div>
                        <p style="margin: 0; font-size: 12px; color: #dc2626; font-weight: 700;">FLASH<br/>SALES</p>
                      </td></tr>
                    </table>
                  </td>
                  <td width="25%" style="padding: 8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #eff6ff; border-radius: 16px;">
                      <tr><td style="padding: 20px; text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 8px;">🆕</div>
                        <p style="margin: 0; font-size: 12px; color: #2563eb; font-weight: 700;">NEW<br/>DROPS</p>
                      </td></tr>
                    </table>
                  </td>
                  <td width="25%" style="padding: 8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f0fdf4; border-radius: 16px;">
                      <tr><td style="padding: 20px; text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 8px;">💰</div>
                        <p style="margin: 0; font-size: 12px; color: #16a34a; font-weight: 700;">VIP<br/>DEALS</p>
                      </td></tr>
                    </table>
                  </td>
                  <td width="25%" style="padding: 8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #faf5ff; border-radius: 16px;">
                      <tr><td style="padding: 20px; text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 8px;">🚚</div>
                        <p style="margin: 0; font-size: 12px; color: #9333ea; font-weight: 700;">FREE<br/>SHIPPING</p>
                      </td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Products Section -->
          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fef2f2, #fff7ed); border-radius: 20px; border: 2px dashed #fca5a5;">
                <tr><td style="padding: 35px 25px;">
                  ${productsSection}
                  
                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 30px auto 0 auto;">
                    <tr>
                      <td style="background: #111827; border-radius: 12px; text-align: center;">
                        <a href="https://digitalcommerce.com/shop" style="display: inline-block; color: #ffffff; padding: 18px 40px; text-decoration: none; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; border-radius: 12px;">
                          Explore All Products →
                        </a>
                      </td>
                    </tr>
                  </table>
                </td></tr>
              </table>
            </td>
          </tr>

          <!-- Hot Picks -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f9fafb; border-radius: 16px;">
                <tr><td style="padding: 30px;">
                  <h3 style="margin: 0 0 20px 0; color: #111827; font-size: 20px; font-weight: 700; text-align: center;">🔥 This Week's Hot Picks</h3>
                  <ul style="margin: 0; padding: 0; list-style: none;">
                    ${featuredList}
                  </ul>
                  <p style="text-align: center; margin: 20px 0 0 0;">
                    <a href="https://digitalcommerce.com/deals" style="color: #dc2626; font-weight: 700; text-decoration: none; font-size: 15px;">View All Deals →</a>
                  </p>
                </td></tr>
              </table>
            </td>
          </tr>

          <!-- Categories -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <h3 style="margin: 0 0 20px 0; color: #111827; font-size: 18px; font-weight: 700; text-align: center;">Shop by Category</h3>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: center;">
                    <a href="https://digitalcommerce.com/laptops" style="display: inline-block; margin: 5px; padding: 12px 20px; background: #ffffff; border: 2px solid #e5e7eb; border-radius: 10px; color: #374151; text-decoration: none; font-weight: 600; font-size: 14px;">💻 Laptops</a>
                    <a href="https://digitalcommerce.com/smartphones" style="display: inline-block; margin: 5px; padding: 12px 20px; background: #ffffff; border: 2px solid #e5e7eb; border-radius: 10px; color: #374151; text-decoration: none; font-weight: 600; font-size: 14px;">📱 Phones</a>
                    <a href="https://digitalcommerce.com/audio" style="display: inline-block; margin: 5px; padding: 12px 20px; background: #ffffff; border: 2px solid #e5e7eb; border-radius: 10px; color: #374151; text-decoration: none; font-weight: 600; font-size: 14px;">🎧 Audio</a>
                    <a href="https://digitalcommerce.com/gaming" style="display: inline-block; margin: 5px; padding: 12px 20px; background: #ffffff; border: 2px solid #e5e7eb; border-radius: 10px; color: #374151; text-decoration: none; font-weight: 600; font-size: 14px;">🎮 Gaming</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Social Proof -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <div style="border-top: 2px solid #f3f4f6; padding-top: 30px;">
                <p style="color: #6b7280; font-size: 15px; margin: 0 0 20px 0;">
                  Join <strong style="color: #111827; font-size: 18px;">50,000+</strong> happy customers
                </p>
                <div style="color: #fbbf24; font-size: 24px; letter-spacing: 3px; margin-bottom: 10px;">★★★★★</div>
                <p style="color: #9ca3af; font-size: 13px; margin: 0;">4.9/5 from 12,847 verified reviews</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #111827; padding: 40px; text-align: center;">
              <p style="color: #9ca3af; font-size: 13px; margin: 0 0 15px 0; line-height: 1.6;">
                You're receiving this because you subscribed to DigitalCommerce.<br>
                <a href="https://digitalcommerce.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> · 
                <a href="https://digitalcommerce.com/privacy" style="color: #6b7280; text-decoration: underline;">Privacy Policy</a>
              </p>
              <p style="color: #4b5563; font-size: 12px; margin: 0;">
                © 2025 DigitalCommerce. All rights reserved.<br>
                123 Tech Street, San Francisco, CA 94102
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
  
</body>
</html>`
    };

    console.log(`[EMAIL] Sending welcome email to ${email}...`);
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`[EMAIL] ✅ SUCCESS - Welcome email sent to ${email}`);
    console.log(`[EMAIL] 📧 Message ID: ${info.messageId}`);
    console.log(`[EMAIL] 📊 Included ${count} products from ${source}`);
    console.log(`[EMAIL] 📨 Check spam folder if not received in inbox`);
    
    return { success: true, messageId: info.messageId, productsCount: count };

  } catch (error) {
    console.error(`[EMAIL] ❌ FAILED to send welcome email to ${email}`);
    console.error(`[EMAIL] Error:`, error.message);
    return { success: false, error: error.message };
  }
};
//
export const sendPromotionEmail = async (email, promotion) => {
  try {
    const { products, count } = await getProductsForEmail(3);
    const productsSection = buildProductsSection(products, "Sale Spotlight");

    const daysLeft = promotion.endDate 
      ? Math.ceil((new Date(promotion.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

    const urgencyHtml = daysLeft 
      ? `<div style="background: #dc2626; color: white; display: inline-block; padding: 10px 24px; border-radius: 30px; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);">⏰ Only ${daysLeft} Days Left</div>`
      : `<div style="background: #dc2626; color: white; display: inline-block; padding: 10px 24px; border-radius: 30px; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);">🔥 Limited Time Offer</div>`;

    await transporter.sendMail({
      from: `"DigitalCommerce Deals" <${OWNER_EMAIL}>`,
      to: email,
      subject: `🔥 ${promotion.title} — ${promotion.discount || 'UP TO 50% OFF'}!`,
      replyTo: "support@digitalcommerce.com",
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${promotion.title}</title>
</head>
<body style="margin: 0; padding: 0; background: #0a0a0f; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(180deg, #0a0a0f 0%, #1f2937 100%);">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background: #111827; border-radius: 24px; overflow: hidden; border: 1px solid #374151;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626, #991b1b); padding: 35px; text-align: center;">
              ${urgencyHtml}
            </td>
          </tr>

          <tr>
            <td style="padding: 50px 40px; text-align: center; background: radial-gradient(ellipse at top, rgba(220, 38, 38, 0.3) 0%, transparent 70%);">
              <h1 style="color: #ffffff; margin: 0; font-size: 42px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; text-shadow: 0 0 40px rgba(220, 38, 38, 0.5); line-height: 1.2;">
                ${promotion.title}
              </h1>
              <p style="color: #fca5a5; margin: 20px 0 0 0; font-size: 20px; font-weight: 600;">
                ${promotion.subtitle || "Don't miss out!"}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <div style="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #0a0a0f; display: inline-block; padding: 25px 50px; border-radius: 16px; font-size: 36px; font-weight: 900; transform: rotate(-2deg); box-shadow: 0 20px 25px -5px rgba(251, 191, 36, 0.4); text-transform: uppercase;">
                ${promotion.discount || "UP TO 50% OFF"}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <div style="background: rgba(220, 38, 38, 0.1); border: 2px solid #dc2626; border-radius: 16px; padding: 30px; display: inline-block;">
                <p style="color: #fca5a5; margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 3px; font-weight: 600;">Your Exclusive Code</p>
                <p style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; font-family: 'Courier New', monospace; background: #dc2626; padding: 15px 30px; border-radius: 8px; letter-spacing: 4px;">
                  ${promotion.code || 'FLASH25'}
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 40px 30px;">
              ${productsSection}
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 50px 40px; text-align: center;">
              <a href="${promotion.link || 'https://digitalcommerce.com/sale'}" style="display: inline-block; background: linear-gradient(135deg, #dc2626, #ea580c); color: #ffffff; padding: 22px 50px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 18px; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 15px 35px -5px rgba(220, 38, 38, 0.5);">
                Shop the Sale Now →
              </a>
              <p style="color: #6b7280; margin-top: 20px; font-size: 14px;">
                ${promotion.endDate ? `Offer ends ${new Date(promotion.endDate).toLocaleDateString()}` : 'Limited stock available'}
              </p>
            </td>
          </tr>

          <tr>
            <td style="background: #0f172a; padding: 30px; text-align: center; border-top: 1px solid #1e293b;">
              <p style="color: #475569; font-size: 12px; margin: 0;">
                *Terms and conditions apply. Valid until ${promotion.endDate || 'while stocks last'}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
  
</body>
</html>`
    });
    
    return true;
  } catch (error) {
    console.error(`[EMAIL ERROR] Promotion email failed:`, error.message);
    return false;
  }
};


export const sendNewProductEmail = async (email, product) => {
  try {
    let relatedProducts = [];
    try {
      relatedProducts = await Product.find({
        category: product.category,
        _id: { $ne: product._id },
        isActive: true
      }).limit(2).lean();
    } catch (e) {
      relatedProducts = DEMO_PRODUCTS.filter(p => p.category === product.category).slice(0, 2);
    }

    const relatedHtml = relatedProducts.length > 0 
      ? relatedProducts.map(p => buildProductCard(p)).join('')
      : '';

    await transporter.sendMail({
      from: `"DigitalCommerce New Arrivals" <${OWNER_EMAIL}>`,
      to: email,
      subject: `🆕 Just Dropped: ${product.name} — Be First!`,
      replyTo: "support@digitalcommerce.com",
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Arrival: ${product.name}</title>
</head>
<body style="margin: 0; padding: 0; background: #0a0a0f; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #0a0a0f;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background: #111827; border-radius: 24px; overflow: hidden;">
          
          <tr>
            <td style="background: linear-gradient(90deg, #10b981, #059669); padding: 20px; text-align: center;">
              <span style="color: #ffffff; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 3px;">✨ Just Launched Today</span>
            </td>
          </tr>

          <tr>
            <td>
              <div style="position: relative; height: 400px;">
                <img src="${product.image || 'https://via.placeholder.com/600x400'}" style="width: 100%; height: 100%; object-fit: cover; display: block;" alt="${product.name}" width="600" height="400"/>
                <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, #111827, transparent); padding: 40px;">
                  <span style="background: #dc2626; color: #ffffff; padding: 10px 20px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                    ${product.category || 'New Arrival'}
                  </span>
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              <h1 style="color: #ffffff; margin: 0 0 20px 0; font-size: 36px; font-weight: 800; line-height: 1.2;">
                ${product.name}
              </h1>
              
              <div style="margin-bottom: 25px;">
                <span style="color: #fbbf24; font-size: 20px; letter-spacing: 2px;">★★★★★</span>
                <span style="color: #6b7280; margin-left: 12px; font-size: 14px;">New Release</span>
              </div>

              <p style="color: #9ca3af; font-size: 17px; line-height: 1.8; margin: 0 0 35px 0;">
                ${product.description || 'Premium quality with cutting-edge technology. Limited first batch available.'}
              </p>

              <div style="background: linear-gradient(135deg, #1f2937, #111827); border-radius: 16px; padding: 35px; text-align: center; border: 1px solid #374151;">
                <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 3px; font-weight: 600;">Launch Day Price</p>
                <p style="color: #10b981; margin: 0; font-size: 52px; font-weight: 900;">$${product.price}</p>
                
                ${product.originalPrice ? `<p style="color: #6b7280; margin: 10px 0 0 0; text-decoration: line-through; font-size: 20px;">$${product.originalPrice}</p>` : ''}
                
                <a href="https://digitalcommerce.com/product/${product._id}" style="display: block; margin-top: 25px; background: linear-gradient(135deg, #dc2626, #ea580c); color: #ffffff; padding: 18px; border-radius: 10px; text-decoration: none; font-weight: 800; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 20px -5px rgba(220, 38, 38, 0.4);">
                  Order Now — Ships Today ⚡
                </a>
                
                <p style="color: #fbbf24; margin-top: 15px; font-size: 14px; font-weight: 600;">
                  🔥 Only ${product.stock || '12'} units in first batch
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="33%" style="padding: 10px;">
                    <div style="background: #1f2937; border-radius: 12px; padding: 25px; text-align: center;">
                      <div style="font-size: 32px; margin-bottom: 10px;">🚚</div>
                      <p style="margin: 0; color: #ffffff; font-size: 12px; font-weight: 700;">FREE EXPRESS<br/>SHIPPING</p>
                    </div>
                  </td>
                  <td width="33%" style="padding: 10px;">
                    <div style="background: #1f2937; border-radius: 12px; padding: 25px; text-align: center;">
                      <div style="font-size: 32px; margin-bottom: 10px;">🛡️</div>
                      <p style="margin: 0; color: #ffffff; font-size: 12px; font-weight: 700;">2-YEAR<br/>WARRANTY</p>
                    </div>
                  </td>
                  <td width="33%" style="padding: 10px;">
                    <div style="background: #1f2937; border-radius: 12px; padding: 25px; text-align: center;">
                      <div style="font-size: 32px; margin-bottom: 10px;">↩️</div>
                      <p style="margin: 0; color: #ffffff; font-size: 12px; font-weight: 700;">30-DAY<br/>RETURNS</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${relatedProducts.length > 0 ? `
          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <h3 style="color: #ffffff; margin: 0 0 25px 0; font-size: 22px; text-align: center;">Complete Your Setup</h3>
              <div style="text-align: center;">
                ${relatedHtml}
              </div>
            </td>
          </tr>
          ` : ''}

          <tr>
            <td style="background: #0f172a; padding: 30px; text-align: center; border-top: 1px solid #1e293b;">
              <p style="color: #475569; font-size: 12px; margin: 0;">
                You're receiving new product alerts.<br>
                <a href="https://digitalcommerce.com/preferences" style="color: #6b7280;">Manage Preferences</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
  
</body>
</html>`
    });
    
    return true;
  } catch (error) {
    console.error(`[EMAIL ERROR] New product email failed:`, error.message);
    return false;
  }
};


export const subscribeUser = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: "Valid email required" });
    }

    console.log(`[SUBSCRIBE] Processing: ${email}`);

    const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(200).json({ 
        success: true, 
        message: "You're already subscribed! Check your inbox for latest deals." 
      });
    }

    const subscriber = await Subscriber.create({
      email: email.toLowerCase().trim(),
      user: req.userId || null,
      subscribedAt: new Date(),
      active: true,
      preferences: { promotions: true, newProducts: true, newsletter: true }
    });

    console.log(`[SUBSCRIBE] Created: ${subscriber._id}`);

    // Send welcome email with timeout
    const emailResult = await Promise.race([
      sendWelcomeEmail(email),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Email timeout')), 30000))
    ]).catch(err => {
      console.error(`[EMAIL TIMEOUT]`, err.message);
      return { success: false, error: 'timeout' };
    });

    // Socket notification
    try {
      const io = getIO();
      const count = await Subscriber.countDocuments();
      io.emit("subscriberUpdate", {
        type: "NEW_SUBSCRIBER",
        count,
        message: "New subscriber joined!",
        email: email.substring(0, 3) + "***"
      });
    } catch (e) {
      console.error(`[SOCKET ERROR]`, e.message);
    }

    res.status(201).json({
      success: true,
      message: emailResult.success 
        ? "Welcome! Check your email (and spam folder) for exclusive deals." 
        : "Subscribed! Email delivery delayed.",
      subscriber: {
        id: subscriber._id,
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt
      },
      emailSent: emailResult.success,
      emailDetails: emailResult.success ? {
        messageId: emailResult.messageId,
        productsShown: emailResult.productsCount,
        tip: "If not in inbox, check spam/junk folder"
      } : null
    });

  } catch (err) {
    console.error(`[SUBSCRIBE ERROR]`, err);
    res.status(500).json({ 
      success: false, 
      message: "Subscription failed. Please try again." 
    });
  }
};
export const getAllSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const subscribers = await Subscriber.find()
      .sort({ subscribedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Subscriber.countDocuments();
    
    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      subscribers
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const notifyNewProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const subscribers = await Subscriber.find({ 
      active: true, 
      'preferences.newProducts': true 
    });

    try {
      const io = getIO();
      io.emit("newProduct", {
        type: "NEW_PRODUCT",
        product: { 
          id: product._id, 
          name: product.name, 
          price: product.price,
          image: product.image 
        },
        message: `🆕 ${product.name} available!`
      });
    } catch (e) {}

    const results = { sent: 0, failed: 0 };
    const batchSize = 50;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      await Promise.all(batch.map(sub => 
        sendNewProductEmail(sub.email, product)
          .then(ok => ok ? results.sent++ : results.failed++)
      ));
      if (i + batchSize < subscribers.length) await new Promise(r => setTimeout(r, 1000));
    }

    res.status(200).json({
      success: true,
      message: `Notified ${results.sent} subscribers about ${product.name}`,
      stats: results
    });
    
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const unsubscribeUser = async (req, res) => {
  try {
    const { email } = req.body;
    const deleted = await Subscriber.findOneAndDelete({ email: email.toLowerCase().trim() });
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    try {
      const io = getIO();
      io.emit("subscriberUpdate", {
        type: "UNSUBSCRIBE",
        email: email.substring(0, 3) + "***"
      });
    } catch (e) {}

    res.status(200).json({
      success: true,
      message: "Successfully unsubscribed. We're sorry to see you go!"
    });
    
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getActivePromotion = async (req, res) => {
  try {
    // Find most recent active promotion that hasn't expired
    const promotion = await Promotion.findOne({
      isActive: true,
      $or: [
        { endDate: { $gte: new Date() } },
        { endDate: null }
      ]
    }).sort({ broadcastAt: -1 });

    if (!promotion) {
      return res.json({ success: true, promotion: null });
    }

    res.json({ 
      success: true, 
      promotion: {
        title: promotion.title,
        subtitle: promotion.subtitle,
        description: promotion.description,
        discount: promotion.discount,
        code: promotion.code,
        link: promotion.link,
        endDate: promotion.endDate,
        broadcastAt: promotion.broadcastAt,
        recipientCount: promotion.recipientCount
      }
    });
    
  } catch (err) {
    console.error('[ACTIVE PROMOTION ERROR]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
export const broadcastPromotion = async (req, res) => {
  try {
    const { title, subtitle, description, discount, code, endDate, link } = req.body;
    
    const subscribers = await Subscriber.find({ active: true });
    if (subscribers.length === 0) {
      return res.status(400).json({ success: false, message: "No active subscribers" });
    }

    // Deactivate all previous promotions
    await Promotion.updateMany({}, { isActive: false });

    // Create new promotion in database
    const promotionDoc = await Promotion.create({
      title,
      subtitle,
      description,
      discount,
      code,
      endDate: endDate ? new Date(endDate) : null,
      link,
      isActive: true,
      broadcastAt: new Date(),
      recipientCount: subscribers.length
    });

    const promotionData = {
      title,
      subtitle,
      description,
      discount,
      code,
      endDate,
      link
    };
    
    // Socket notification
    try {
      const io = getIO();
      io.emit("promotion", {
        type: "NEW_PROMOTION",
        data: promotionData,
        message: `🔥 ${title}`
      });
    } catch (e) {}

    // Send emails in background
    const results = { sent: 0, failed: 0 };
    const batchSize = 50;

    (async () => {
      for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize);
        await Promise.all(batch.map(sub => 
          sendPromotionEmail(sub.email, promotionData)
            .then(ok => ok ? results.sent++ : results.failed++)
        ));
        if (i + batchSize < subscribers.length) await new Promise(r => setTimeout(r, 1000));
      }
      console.log(`[BROADCAST] Complete: ${results.sent} sent, ${results.failed} failed`);
    })();

    res.status(202).json({
      success: true,
      message: `Broadcasting to ${subscribers.length} subscribers`,
      promotionId: promotionDoc._id,
      recipientCount: subscribers.length
    });
    
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getSubscriberStats = async (req, res) => {
  try {
    const total = await Subscriber.countDocuments();
    const thisMonth = await Subscriber.countDocuments({
      subscribedAt: { $gte: new Date(new Date().setDate(1)) }
    });
    
    res.status(200).json({
      success: true,
      stats: { total, thisMonth }
    });
    
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
//lkl