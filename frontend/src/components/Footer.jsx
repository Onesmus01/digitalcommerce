import React, { useState, useEffect, useContext } from "react";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaArrowRight,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Context } from "../context/ProductContext";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hoveredLink, setHoveredLink] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { backendUrl } = useContext(Context);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      const response = await fetch(`${backendUrl}/subscribe/subscribe-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubscribed(true);
        setMessage(data.message);
        setTimeout(() => {
          setIsSubscribed(false);
          setEmail("");
          setMessage("");
        }, 3000);
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (err) {
      setMessage("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks = [
    { icon: FaFacebookF, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
    { icon: FaTwitter, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
    { icon: FaInstagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
    { icon: FaLinkedinIn, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
  ];

  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/product-category/all" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const supportLinks = [
    { name: "FAQs", href: "/faqs" },
    { name: "Shipping", href: "/shipping-and-returns" },
    { name: "Privacy", href: "/privacy-policy" },
    { name: "Terms", href: "/terms-and-conditions" },
    { name: "Careers", href: "/careers" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  return (
    <footer className="relative bg-[#0a0a0f] text-white overflow-hidden">
      {/* Animated Background Grid - Hidden on small devices */}
      <div className="absolute inset-0 opacity-20 hidden sm:block">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(239, 68, 68, 0.15) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:64px_64px]" />
      </div>

      {/* Glowing Orbs - Smaller on mobile */}
      <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-red-600/20 rounded-full blur-[64px] sm:blur-[128px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-purple-600/20 rounded-full blur-[64px] sm:blur-[128px] animate-pulse delay-1000" />

      {/* Main Content - Reduced padding on mobile */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 12 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-6 lg:gap-8">
          
          {/* Brand Column - Full width on mobile, 4 cols on desktop */}
          <motion.div className="sm:col-span-2 lg:col-span-4 space-y-4 sm:space-y-6" variants={itemVariants}>
            <div className="relative group">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter mb-1 sm:mb-2">
                <span className="bg-gradient-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-transparent">
                  Digital
                </span>
                <span className="text-white">Commerce</span>
              </h1>
              <div className="h-0.5 sm:h-1 w-16 sm:w-20 bg-gradient-to-r from-red-500 to-transparent rounded-full group-hover:w-24 sm:group-hover:w-32 transition-all duration-500" />
            </div>
            
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xs sm:max-w-sm">
              Elevating commerce through innovation. Premium electronics, 
              unmatched quality, and lightning-fast delivery worldwide.
            </p>

            {/* Contact Info - Compact on mobile */}
            <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-white transition-colors group cursor-pointer">
                <div className="p-1.5 sm:p-2 rounded-lg bg-white/5 group-hover:bg-red-500/20 transition-colors">
                  <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                </div>
                <span className="text-xs sm:text-sm">Nairobi, Kenya 00100</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-white transition-colors group cursor-pointer">
                <div className="p-1.5 sm:p-2 rounded-lg bg-white/5 group-hover:bg-red-500/20 transition-colors">
                  <FaPhone className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                </div>
                <span className="text-xs sm:text-sm">+254 759755575</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-white transition-colors group cursor-pointer">
                <div className="p-1.5 sm:p-2 rounded-lg bg-white/5 group-hover:bg-red-500/20 transition-colors">
                  <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                </div>
                <span className="text-xs sm:text-sm break-all">hello@digitalcommerce.com</span>
              </div>
            </div>

            {/* Social Icons - Smaller on mobile */}
            <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className={`
                    relative p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 
                    text-gray-400 hover:text-white hover:border-white/30 
                    transition-all duration-300 group overflow-hidden
                    ${social.color}
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links - Side by side on mobile */}
          <motion.div className="sm:col-span-1 lg:col-span-2" variants={itemVariants}>
            <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 sm:mb-6">
              Navigation
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 text-xs sm:text-sm"
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <span className={`
                      h-px bg-red-500 transition-all duration-300
                      ${hoveredLink === link.name ? "w-3 sm:w-4" : "w-0"}
                    `} />
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-red-500 to-transparent group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support - Side by side on mobile */}
          <motion.div className="sm:col-span-1 lg:col-span-2" variants={itemVariants}>
            <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 sm:mb-6">
              Support
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 text-xs sm:text-sm"
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <span className={`
                      h-px bg-red-500 transition-all duration-300
                      ${hoveredLink === link.name ? "w-3 sm:w-4" : "w-0"}
                    `} />
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-red-500 to-transparent group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter - Full width on mobile, 4 cols on desktop */}
          <motion.div className="sm:col-span-2 lg:col-span-4" variants={itemVariants}>
            <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 sm:mb-6">
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-3 sm:mb-6 leading-relaxed text-xs sm:text-sm">
              Join 50,000+ subscribers receiving exclusive deals, 
              product launches, and insider news.
            </p>

            <form onSubmit={handleSubscribe} className="relative">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all duration-300 text-sm pr-28 sm:pr-36"
                  disabled={isSubscribed || isLoading}
                />
                <motion.button
                  type="submit"
                  className={`
                    absolute right-1.5 sm:right-2 top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 px-3 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm
                    flex items-center gap-1 sm:gap-2 transition-all duration-300
                    ${isSubscribed 
                      ? "bg-green-500 text-white" 
                      : "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-500/25"
                    }
                    ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
                  `}
                  whileHover={!isLoading && !isSubscribed ? { scale: 1.02 } : {}}
                  whileTap={!isLoading && !isSubscribed ? { scale: 0.98 } : {}}
                  disabled={isSubscribed || isLoading}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1 sm:gap-2"
                      >
                        <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </motion.span>
                    ) : isSubscribed ? (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs sm:text-sm"
                      >
                        Done!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="subscribe"
                        className="flex items-center gap-1 sm:gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <span className="hidden sm:inline">Subscribe</span>
                        <span className="sm:hidden">Join</span>
                        <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
              
              {/* Success/Error Message */}
              <AnimatePresence>
                {(isSubscribed || message) && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute -bottom-6 sm:-bottom-8 left-0 text-xs sm:text-sm flex items-center gap-2 ${isSubscribed ? "text-green-400" : "text-red-400"}`}
                  >
                    <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse ${isSubscribed ? "bg-green-400" : "bg-red-400"}`} />
                    <span className="truncate max-w-[200px] sm:max-w-none">
                      {isSubscribed ? "Welcome! Check your inbox." : message}
                    </span>
                  </motion.p>
                )}
              </AnimatePresence>
            </form>

            {/* Trust Badges - Smaller on mobile */}
            <div className="flex items-center gap-3 sm:gap-4 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/5">
              <div className="flex -space-x-1.5 sm:-space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-[#0a0a0f] flex items-center justify-center text-[10px] sm:text-xs font-bold text-gray-400"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                <span className="text-white font-semibold">50k+</span> happy customers
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar - Stacked on mobile, row on tablet+ */}
        <motion.div 
          className="mt-10 sm:mt-16 lg:mt-20 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4"
          variants={itemVariants}
        >
          <p className="text-gray-500 text-xs sm:text-sm order-3 sm:order-1">
            © 2025 DigitalCommerce. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 order-1 sm:order-2">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <span className="w-1 h-1 bg-gray-700 rounded-full" />
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <span className="w-1 h-1 bg-gray-700 rounded-full hidden sm:inline" />
            <a href="#" className="hover:text-white transition-colors hidden sm:inline">Cookies</a>
          </div>

          {/* Back to Top */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs sm:text-sm order-2 sm:order-3"
            whileHover={{ y: -2 }}
          >
            <span className="sm:hidden">Top</span>
            <span className="hidden sm:inline">Back to top</span>
            <div className="p-1.5 sm:p-2 rounded-lg bg-white/5 group-hover:bg-red-500/20 transition-colors">
              <svg 
                className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
    </footer>
  );
};

export default Footer;