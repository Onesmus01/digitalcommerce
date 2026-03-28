import React from "react";
import { FaVolumeUp, FaBell, FaLightbulb, FaStar } from "react-icons/fa";

const features = [
  { 
    id: "calls", 
    title: "Call / Sound", 
    icon: FaVolumeUp, 
    color: "text-blue-500", 
    bg: "bg-blue-50",
    phone: "0759755575"  // Phone number added here
  },
  { 
    id: "alerts", 
    title: "Alerts", 
    icon: FaBell, 
    color: "text-amber-500", 
    bg: "bg-amber-50" 
  },
  { 
    id: "ideas", 
    title: "Ideas", 
    icon: FaLightbulb, 
    color: "text-yellow-500", 
    bg: "bg-yellow-50" 
  },
  { 
    id: "favorites", 
    title: "Favorites", 
    icon: FaStar, 
    color: "text-rose-500", 
    bg: "bg-rose-50" 
  },
];

const FeatureGrid = ({ onFeatureClick }) => {
  const handleClick = (feature) => {
    if (feature.phone) {
      // Initiates phone call
      window.location.href = `tel:${feature.phone}`;
    } else if (onFeatureClick) {
      onFeatureClick(feature.id);
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4">
      <div className="grid grid-cols-4 gap-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.id}
              onClick={() => handleClick(feature)}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex flex-col items-center justify-center p-2 sm:p-3 border border-gray-100"
            >
              <div className={`${feature.bg} p-2 rounded-full mb-1 group-hover:scale-105 transition-transform`}>
                <Icon className={`text-lg sm:text-xl ${feature.color}`} />
              </div>
              <h3 className="text-gray-800 font-medium text-[11px] sm:text-xs text-center leading-tight">
                {feature.title}
              </h3>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureGrid;