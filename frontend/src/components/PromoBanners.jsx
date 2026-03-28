import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const banners = [
  {
    title: "🔥 Hot Deals",
    desc: "Grab the hottest discounts before they're gone!",
    path: "/hot-deals",
    gradient: "from-red-600 via-pink-500 to-yellow-400",
    badge: "Limited Offer",
  },
  {
    title: "🆕 New Arrivals",
    desc: "Check out the latest products just dropped!",
    path: "/new-arrivals",
    gradient: "from-blue-600 via-indigo-500 to-purple-500",
    badge: "Just In",
  },
  {
    title: "🇨🇳 China Deals",
    desc: "Affordable trending products straight from China!",
    path: "/china-deals",
    gradient: "from-green-600 via-emerald-500 to-teal-400",
    badge: "Best Prices",
  },
];

const PromoBanners = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  // Hide scrollbar styles
  const hideScrollbarStyle = {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
  };

  return (
    <div className="container mx-auto px-3 sm:px-6 lg:px-6 py-6">
      
      {/* Mobile Slider - Hidden Scrollbar */}
      <div
        ref={sliderRef}
        style={hideScrollbarStyle}
        className="flex md:hidden gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden"
      >
        {banners.map((banner) => (
          <article
            key={banner.path}
            onClick={() => navigate(banner.path)}
            className="min-w-[65%] snap-center relative h-40 rounded-xl overflow-hidden shadow-lg cursor-pointer group active:scale-95 transition-transform"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

            <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-3">
              <h2 className="text-base font-bold text-white mb-1">{banner.title}</h2>
              <p className="text-white/90 text-[11px] mb-3 line-clamp-2">{banner.desc}</p>
              
              <span className="bg-white text-gray-800 text-xs font-semibold px-4 py-1.5 rounded-full shadow">
                Shop Now
              </span>
            </div>

            <div className="absolute top-2 left-2 bg-white text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {banner.badge}
            </div>
          </article>
        ))}
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <article
            key={banner.path}
            onClick={() => navigate(banner.path)}
            className="relative h-64 lg:h-72 rounded-2xl overflow-hidden shadow-xl cursor-pointer group transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

            <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-5">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-2">{banner.title}</h2>
              <p className="text-white/90 mb-4 max-w-xs">{banner.desc}</p>
              
              <span className="bg-white text-gray-800 font-semibold px-5 py-2 rounded-full shadow-md group-hover:bg-black group-hover:text-white transition-colors">
                Shop Now
              </span>
            </div>

            <div className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
              {banner.badge}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default PromoBanners;