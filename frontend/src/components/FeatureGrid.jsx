import React from "react";
import { FaVolumeUp, FaBell, FaLightbulb, FaStar } from "react-icons/fa";

const FeatureGrid = () => {
  const features = [
    { title: "Call / Sound", icon: <FaVolumeUp className="text-3xl text-blue-500" /> },
    { title: "Alerts", icon: <FaBell className="text-3xl text-blue-500" /> },
    { title: "Ideas", icon: <FaLightbulb className="text-3xl text-blue-500" /> },
    { title: "Favorites", icon: <FaStar className="text-3xl text-blue-500" /> },
  ];

  return (
    <div className="container mx-auto px-3 sm:px-6 lg:px-6 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-xl transition"
          >
            {feature.icon}
            <h1 className="text-black font-semibold mt-2 text-sm sm:text-base text-center">
              {feature.title}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;