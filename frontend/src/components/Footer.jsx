import React, { useState, useEffect } from "react";
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

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {  // Removed TypeScript type annotation
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
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
    { name: "Products", href: "#" },
    { name: "Categories", href: "#" },
    { name: "About Us", href: "#" },
    { name: "Contact", href: "#" },
  ];

  const supportLinks = [
    { name: "FAQs", href: "#" },
    { name: "Shipping & Returns", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms & Conditions", href: "#" },
    { name: "Careers", href: "#" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  return (
    <footer className="relative bg-[#0a0a0f] text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(239, 68, 68, 0.15) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse delay-1000" />

      {/* Main Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-6 py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column - Takes 4 columns */}
          <motion.div className="lg:col-span-4 space-y-6" variants={itemVariants}>
            <div className="relative group">
              <h1 className="text-4xl font-black tracking-tighter mb-2">
                <span className="bg-gradient-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-transparent">
                  Digital
                </span>
                <span className="text-white">Commerce</span>
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-transparent rounded-full group-hover:w-32 transition-all duration-500" />
            </div>
            
            <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
              Elevating commerce through innovation. Premium electronics, 
              unmatched quality, and lightning-fast delivery worldwide.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group cursor-pointer">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-red-500/20 transition-colors">
                  <FaMapMarkerAlt className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-sm">San Francisco, CA 94102</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group cursor-pointer">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-red-500/20 transition-colors">
                  <FaPhone className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group cursor-pointer">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-red-500/20 transition-colors">
                  <FaEnvelope className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-sm">hello@digitalcommerce.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 pt-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className={`
                    relative p-3 rounded-xl bg-white/5 border border-white/10 
                    text-gray-400 hover:text-white hover:border-white/30 
                    transition-all duration-300 group overflow-hidden
                    ${social.color}
                  `}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <social.icon className="w-5 h-5 relative z-10" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links - Takes 2 columns */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">
              Navigation
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <span className={`
                      w-0 h-px bg-red-500 transition-all duration-300
                      ${hoveredLink === link.name ? "w-4" : "w-0"}
                    `} />
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-red-500 to-transparent group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support - Takes 2 columns */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">
              Support
            </h3>
            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <span className={`
                      w-0 h-px bg-red-500 transition-all duration-300
                      ${hoveredLink === link.name ? "w-4" : "w-0"}
                    `} />
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-red-500 to-transparent group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter - Takes 4 columns */}
          <motion.div className="lg:col-span-4" variants={itemVariants}>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
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
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all duration-300 pr-36"
                  disabled={isSubscribed}
                />
                <motion.button
                  type="submit"
                  className={`
                    absolute right-2 top-2 bottom-2 px-6 rounded-xl font-semibold text-sm
                    flex items-center gap-2 transition-all duration-300
                    ${isSubscribed 
                      ? "bg-green-500 text-white" 
                      : "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-500/25"
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubscribed}
                >
                  <AnimatePresence mode="wait">
                    {isSubscribed ? (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        Subscribed!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="subscribe"
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        Subscribe
                        <FaArrowRight className="w-4 h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
              
              {/* Success Message */}
              <AnimatePresence>
                {isSubscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -bottom-8 left-0 text-green-400 text-sm flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Welcome to the club! Check your inbox.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 mt-12 pt-8 border-t border-white/5">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-[#0a0a0f] flex items-center justify-center text-xs font-bold text-gray-400"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                <span className="text-white font-semibold">50k+</span> happy customers
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
          variants={itemVariants}
        >
          <p className="text-gray-500 text-sm">
            © 2025 DigitalCommerce. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <span className="w-1 h-1 bg-gray-700 rounded-full" />
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <span className="w-1 h-1 bg-gray-700 rounded-full" />
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>

          {/* Back to Top */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm"
            whileHover={{ y: -2 }}
          >
            Back to top
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-red-500/20 transition-colors">
              <svg 
                className="w-4 h-4 rotate-180" 
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






// import React, { useState, useEffect } from "react";
// import { 
//   FaFacebookF, 
//   FaTwitter, 
//   FaInstagram, 
//   FaLinkedinIn,
//   FaArrowRight,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaEnvelope
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";

// const Footer = () => {
//   const [email, setEmail] = useState("");
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [hoveredLink, setHoveredLink] = useState(null);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   const handleSubscribe = (e) => {
//     e.preventDefault();
//     if (email) {
//       setIsSubscribed(true);
//       setTimeout(() => {
//         setIsSubscribed(false);
//         setEmail("");
//       }, 3000);
//     }
//   };

//   const socialLinks = [
//     { icon: FaFacebookF, href: "#", label: "Facebook", color: "hover:bg-blue-600 hover:text-white" },
//     { icon: FaTwitter, href: "#", label: "Twitter", color: "hover:bg-sky-500 hover:text-white" },
//     { icon: FaInstagram, href: "#", label: "Instagram", color: "hover:bg-pink-600 hover:text-white" },
//     { icon: FaLinkedinIn, href: "#", label: "LinkedIn", color: "hover:bg-blue-700 hover:text-white" },
//   ];

//   const quickLinks = [
//     { name: "Home", href: "#" },
//     { name: "Products", href: "#" },
//     { name: "Categories", href: "#" },
//     { name: "About Us", href: "#" },
//     { name: "Contact", href: "#" },
//   ];

//   const supportLinks = [
//     { name: "FAQs", href: "#" },
//     { name: "Shipping & Returns", href: "#" },
//     { name: "Privacy Policy", href: "#" },
//     { name: "Terms & Conditions", href: "#" },
//     { name: "Careers", href: "#" },
//   ];

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         ease: [0.23, 1, 0.32, 1],
//       },
//     },
//   };

//   return (
//     <footer className="relative bg-slate-50 text-slate-800 overflow-hidden">
//       {/* Subtle Background Pattern */}
//       <div className="absolute inset-0 opacity-30">
//         <div 
//           className="absolute inset-0"
//           style={{
//             backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(239, 68, 68, 0.08) 0%, transparent 40%)`,
//           }}
//         />
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px)] bg-[size:64px_64px]" />
//       </div>

//       {/* Soft Gradient Orbs */}
//       <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-200/30 rounded-full blur-[128px]" />
//       <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-200/30 rounded-full blur-[128px]" />

//       {/* Main Content */}
//       <motion.div 
//         className="relative z-10 container mx-auto px-6 py-16"
//         variants={containerVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
//           {/* Brand Column */}
//           <motion.div className="lg:col-span-4 space-y-6" variants={itemVariants}>
//             <div className="relative group">
//               <h1 className="text-4xl font-black tracking-tighter mb-2">
//                 <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
//                   Digital
//                 </span>
//                 <span className="text-slate-800">Commerce</span>
//               </h1>
//               <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-orange-400 rounded-full group-hover:w-32 transition-all duration-500" />
//             </div>
            
//             <p className="text-slate-600 text-lg leading-relaxed max-w-sm">
//               Elevating commerce through innovation. Premium electronics, 
//               unmatched quality, and lightning-fast delivery worldwide.
//             </p>

//             {/* Contact Info */}
//             <div className="space-y-3 pt-4">
//               <div className="flex items-center gap-3 text-slate-600 hover:text-red-600 transition-colors group cursor-pointer">
//                 <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-200 group-hover:border-red-200 group-hover:shadow-md transition-all">
//                   <FaMapMarkerAlt className="w-4 h-4 text-red-500" />
//                 </div>
//                 <span className="text-sm font-medium">San Francisco, CA 94102</span>
//               </div>
//               <div className="flex items-center gap-3 text-slate-600 hover:text-red-600 transition-colors group cursor-pointer">
//                 <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-200 group-hover:border-red-200 group-hover:shadow-md transition-all">
//                   <FaPhone className="w-4 h-4 text-red-500" />
//                 </div>
//                 <span className="text-sm font-medium">+1 (555) 123-4567</span>
//               </div>
//               <div className="flex items-center gap-3 text-slate-600 hover:text-red-600 transition-colors group cursor-pointer">
//                 <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-200 group-hover:border-red-200 group-hover:shadow-md transition-all">
//                   <FaEnvelope className="w-4 h-4 text-red-500" />
//                 </div>
//                 <span className="text-sm font-medium">hello@digitalcommerce.com</span>
//               </div>
//             </div>

//             {/* Social Icons */}
//             <div className="flex gap-3 pt-4">
//               {socialLinks.map((social, index) => (
//                 <motion.a
//                   key={social.label}
//                   href={social.href}
//                   className={`
//                     relative p-3 rounded-xl bg-white border border-slate-200 
//                     text-slate-600 shadow-sm
//                     hover:shadow-lg hover:border-transparent
//                     transition-all duration-300 group overflow-hidden
//                     ${social.color}
//                   `}
//                   whileHover={{ scale: 1.1, y: -2 }}
//                   whileTap={{ scale: 0.95 }}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <social.icon className="w-5 h-5 relative z-10" />
//                 </motion.a>
//               ))}
//             </div>
//           </motion.div>

//           {/* Quick Links */}
//           <motion.div className="lg:col-span-2" variants={itemVariants}>
//             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
//               Navigation
//             </h3>
//             <ul className="space-y-4">
//               {quickLinks.map((link) => (
//                 <li key={link.name}>
//                   <a
//                     href={link.href}
//                     className="group flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors duration-300 font-medium"
//                     onMouseEnter={() => setHoveredLink(link.name)}
//                     onMouseLeave={() => setHoveredLink(null)}
//                   >
//                     <span className={`
//                       w-0 h-0.5 bg-red-500 transition-all duration-300 rounded-full
//                       ${hoveredLink === link.name ? "w-4" : "w-0"}
//                     `} />
//                     <span className="relative">
//                       {link.name}
//                       <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-400 group-hover:w-full transition-all duration-300 rounded-full" />
//                     </span>
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>

//           {/* Support */}
//           <motion.div className="lg:col-span-2" variants={itemVariants}>
//             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
//               Support
//             </h3>
//             <ul className="space-y-4">
//               {supportLinks.map((link) => (
//                 <li key={link.name}>
//                   <a
//                     href={link.href}
//                     className="group flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors duration-300 font-medium"
//                     onMouseEnter={() => setHoveredLink(link.name)}
//                     onMouseLeave={() => setHoveredLink(null)}
//                   >
//                     <span className={`
//                       w-0 h-0.5 bg-red-500 transition-all duration-300 rounded-full
//                       ${hoveredLink === link.name ? "w-4" : "w-0"}
//                     `} />
//                     <span className="relative">
//                       {link.name}
//                       <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-400 group-hover:w-full transition-all duration-300 rounded-full" />
//                     </span>
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>

//           {/* Newsletter */}
//           <motion.div className="lg:col-span-4" variants={itemVariants}>
//             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
//               Stay Updated
//             </h3>
//             <p className="text-slate-600 mb-6 leading-relaxed">
//               Join 50,000+ subscribers receiving exclusive deals, 
//               product launches, and insider news.
//             </p>

//             <form onSubmit={handleSubscribe} className="relative">
//               <div className="relative group">
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email"
//                   className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-300 pr-36 shadow-sm"
//                   disabled={isSubscribed}
//                 />
//                 <motion.button
//                   type="submit"
//                   className={`
//                     absolute right-2 top-2 bottom-2 px-6 rounded-xl font-semibold text-sm
//                     flex items-center gap-2 transition-all duration-300 shadow-md
//                     ${isSubscribed 
//                       ? "bg-green-500 text-white" 
//                       : "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 hover:shadow-lg hover:shadow-red-500/25"
//                     }
//                   `}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   disabled={isSubscribed}
//                 >
//                   <AnimatePresence mode="wait">
//                     {isSubscribed ? (
//                       <motion.span
//                         key="success"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                       >
//                         Subscribed!
//                       </motion.span>
//                     ) : (
//                       <motion.span
//                         key="subscribe"
//                         className="flex items-center gap-2"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                       >
//                         Subscribe
//                         <FaArrowRight className="w-4 h-4" />
//                       </motion.span>
//                     )}
//                   </AnimatePresence>
//                 </motion.button>
//               </div>
              
//               {/* Success Message */}
//               <AnimatePresence>
//                 {isSubscribed && (
//                   <motion.p
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     className="absolute -bottom-8 left-0 text-green-600 text-sm flex items-center gap-2 font-medium"
//                   >
//                     <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//                     Welcome to the club! Check your inbox.
//                   </motion.p>
//                 )}
//               </AnimatePresence>
//             </form>

//             {/* Trust Badges */}
//             <div className="flex items-center gap-4 mt-12 pt-8 border-t border-slate-200">
//               <div className="flex -space-x-2">
//                 {[...Array(4)].map((_, i) => (
//                   <div 
//                     key={i}
//                     className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600"
//                   >
//                     {String.fromCharCode(65 + i)}
//                   </div>
//                 ))}
//               </div>
//               <div className="text-sm text-slate-500">
//                 <span className="text-slate-800 font-bold">50k+</span> happy customers
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Bottom Bar */}
//         <motion.div 
//           className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4"
//           variants={itemVariants}
//         >
//           <p className="text-slate-500 text-sm">
//             © 2025 DigitalCommerce. All rights reserved.
//           </p>
          
//           <div className="flex items-center gap-6 text-sm text-slate-500">
//             <a href="#" className="hover:text-red-600 transition-colors font-medium">Privacy</a>
//             <span className="w-1 h-1 bg-slate-300 rounded-full" />
//             <a href="#" className="hover:text-red-600 transition-colors font-medium">Terms</a>
//             <span className="w-1 h-1 bg-slate-300 rounded-full" />
//             <a href="#" className="hover:text-red-600 transition-colors font-medium">Cookies</a>
//           </div>

//           {/* Back to Top */}
//           <motion.button
//             onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//             className="group flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-sm font-medium"
//             whileHover={{ y: -2 }}
//           >
//             Back to top
//             <div className="p-2 rounded-lg bg-white border border-slate-200 group-hover:border-red-200 group-hover:shadow-md transition-all">
//               <svg 
//                 className="w-4 h-4 rotate-180" 
//                 fill="none" 
//                 viewBox="0 0 24 24" 
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//               </svg>
//             </div>
//           </motion.button>
//         </motion.div>
//       </motion.div>

//       {/* Decorative Bottom Line */}
//       <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-400 to-red-500" />
//     </footer>
//   );
// };

// export default Footer;