import React from "react";
import { FaVolumeUp, FaBell, FaLightbulb, FaStar } from "react-icons/fa"; // icons

const FeatureGrid = () => {
  const features = [
    {
      title: "Call / Sound",
      icon: <FaVolumeUp className="text-6xl text-white" />,
      gradient: "from-purple-500 via-pink-500 to-red-500",
    },
    {
      title: "Alerts",
      icon: <FaBell className="text-4xl text-white" />,
      gradient: "from-yellow-400 via-orange-400 to-red-400",
    },
    {
      title: "Ideas",
      icon: <FaLightbulb className="text-4xl text-white" />,
      gradient: "from-green-400 via-teal-400 to-blue-400",
    },
    {
      title: "Favorites",
      icon: <FaStar className="text-4xl text-white" />,
      gradient: "from-pink-400 via-purple-400 to-indigo-400",
    },
  ];

  return (
    <div className="container mx-auto px-3 sm:px-6 lg:px-6 py-6">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-2">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`relative h-40 rounded-2xl overflow-hidden shadow-lg cursor-pointer flex items-center justify-center`}
            style={{
              backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
            }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${feature.gradient}`}
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-3">
              {feature.icon}
              <h1 className="text-white font-bold mt-2">{feature.title}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;