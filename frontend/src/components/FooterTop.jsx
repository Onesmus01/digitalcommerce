import { Clock, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import React, { useState } from "react";

const data = [
  {
    title: "Visit Us",
    subtitle: "New Orleans, USA",
    description: "123 Commerce Street, Suite 400",
    href: "https://maps.google.com",
    icon: MapPin,
    color: "from-emerald-400 to-teal-500",
    bgGlow: "emerald-500/20",
  },
  {
    title: "Call Us",
    subtitle: "+12 958 648 597",
    description: "Mon-Fri response in 2 mins",
    href: "tel:+12958648597",
    icon: Phone,
    color: "from-violet-400 to-purple-500",
    bgGlow: "violet-500/20",
  },
  {
    title: "Working Hours",
    subtitle: "Mon - Sat: 10:00 AM - 7:00 PM",
    description: "Sunday: Closed",
    icon: Clock,
    color: "from-amber-400 to-orange-500",
    bgGlow: "amber-500/20",
  },
  {
    title: "Email Us",
    subtitle: "Shopcart@gmail.com",
    description: "24/7 support available",
    href: "mailto:Shopcart@gmail.com",
    icon: Mail,
    color: "from-sky-400 to-blue-500",
    bgGlow: "sky-500/20",
  },
];

const FooterTop = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative w-full">
      {/* Background ambient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-16 px-4 sm:px-6 lg:px-8">
        {data.map((item, index) => {
          const Icon = item.icon;
          const isHovered = hoveredIndex === index;
          const Wrapper = item.href ? "a" : "div";

          return (
            <Wrapper
              key={index}
              href={item.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                group relative flex flex-col gap-4 p-6 rounded-3xl
                backdrop-blur-xl bg-white/[0.02] 
                border border-white/10
                hover:border-white/20
                transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${isHovered ? "scale-[1.02] -translate-y-2" : "scale-100 translate-y-0"}
                ${item.href ? "cursor-pointer" : "cursor-default"}
                overflow-hidden
              `}
            >
              {/* Animated gradient background */}
              <div
                className={`
                  absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 
                  group-hover:opacity-5 transition-opacity duration-700
                `}
              />
              
              {/* Dynamic glow effect */}
              <div
                className={`
                  absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 
                  transition-opacity duration-700 blur-sm
                  bg-gradient-to-r ${item.color}
                `}
                style={{ opacity: isHovered ? 0.3 : 0 }}
              />

              {/* Floating particles effect */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`
                      absolute w-1 h-1 rounded-full bg-gradient-to-r ${item.color}
                      opacity-0 group-hover:opacity-60
                      transition-all duration-1000 delay-${i * 100}
                    `}
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${60 + i * 10}%`,
                      transform: isHovered 
                        ? `translateY(-${20 + i * 10}px) scale(${1 + i * 0.5})` 
                        : "translateY(0) scale(0)",
                      transition: `transform 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${i * 0.1}s, opacity 0.5s`,
                    }}
                  />
                ))}
              </div>

              {/* Icon Section */}
              <div className="relative flex items-center justify-between">
                <div
                  className={`
                    relative p-4 rounded-2xl
                    bg-gradient-to-br from-white/5 to-white/[0.02]
                    border border-white/10
                    group-hover:border-white/20
                    transition-all duration-500
                    ${isHovered ? "shadow-2xl" : "shadow-none"}
                  `}
                  style={{
                    boxShadow: isHovered 
                      ? `0 20px 40px -15px rgba(var(--tw-gradient-stops), 0.3)` 
                      : "none",
                  }}
                >
                  {/* Icon glow */}
                  <div
                    className={`
                      absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color}
                      opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500
                    `}
                  />
                  
                  <Icon
                    className={`
                      relative h-6 w-6 text-gray-400 
                      group-hover:text-white transition-all duration-500
                      ${isHovered ? "scale-110 rotate-3" : "scale-100 rotate-0"}
                    `}
                    strokeWidth={1.5}
                  />

                  {/* Pulse ring for interactive items */}
                  {item.href && (
                    <div
                      className={`
                        absolute inset-0 rounded-2xl border-2 border-white/30
                        transition-all duration-700
                        ${isHovered ? "scale-150 opacity-0" : "scale-100 opacity-0"}
                      `}
                    />
                  )}
                </div>

                {/* External link indicator */}
                {item.href && (
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full
                      bg-white/5 border border-white/10
                      transition-all duration-500
                      ${isHovered ? "bg-white/10 border-white/30 scale-110" : "scale-100"}
                    `}
                  >
                    <ArrowUpRight
                      className={`
                        w-4 h-4 text-gray-400 transition-all duration-500
                        ${isHovered ? "text-white translate-x-0.5 -translate-y-0.5" : ""}
                      `}
                    />
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="relative space-y-2">
                <h3
                  className={`
                    font-semibold text-gray-200 tracking-tight
                    group-hover:text-white transition-colors duration-300
                    text-lg
                  `}
                >
                  {item.title}
                </h3>
                
                <p
                  className={`
                    text-gray-400 font-medium
                    group-hover:text-gray-200 transition-colors duration-300
                    leading-relaxed
                  `}
                >
                  {item.subtitle}
                </p>
                
                <p
                  className={`
                    text-sm text-gray-500
                    group-hover:text-gray-400 transition-all duration-500
                    transform ${isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}
                  `}
                >
                  {item.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div
                className={`
                  absolute bottom-0 left-0 h-1 bg-gradient-to-r ${item.color}
                  transition-all duration-700 ease-out rounded-full
                  ${isHovered ? "w-full opacity-100" : "w-0 opacity-0"}
                `}
              />
              
              {/* Corner decoration */}
              <div
                className={`
                  absolute top-0 right-0 w-20 h-20 
                  bg-gradient-to-bl ${item.color} opacity-0 group-hover:opacity-10
                  transition-opacity duration-700 blur-2xl rounded-full
                  transform translate-x-10 -translate-y-10
                `}
              />
            </Wrapper>
          );
        })}
      </div>

      {/* Bottom divider with gradient */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent 
            animate-shimmer"
          style={{
            backgroundSize: "200% 100%",
            animation: "shimmer 3s infinite",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default FooterTop;

//onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}