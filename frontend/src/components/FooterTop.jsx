import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

const data = [
  {
    title: "Visit Us",
    subtitle: "New Orlean, USA",
    icon: (
      <MapPin className="h-6 w-6 text-gray-400 group-hover:text-shop_light_green transition-colors" />
    ),
  },
  {
    title: "Call Us",
    subtitle: "+12 958 648 597",
    icon: (
      <Phone className="h-6 w-6 text-gray-400 group-hover:text-shop_light_green transition-colors" />
    ),
  },
  {
    title: "Working Hours",
    subtitle: "Mon - Sat: 10:00 AM - 7:00 PM",
    icon: (
      <Clock className="h-6 w-6 text-gray-400 group-hover:text-shop_light_green transition-colors" />
    ),
  },
  {
    title: "Email Us",
    subtitle: "Shopcart@gmail.com",
    icon: (
      <Mail className="h-6 w-6 text-gray-400 group-hover:text-shop_light_green transition-colors" />
    ),
  },
];

const FooterTop = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-10 border-b border-gray-700">
      {data.map((item, index) => (
        <div
          key={index}
          className="
            flex items-start gap-4 group 
            p-5 rounded-xl 
            bg-[#111] 
            hover:bg-[#1a1a1a]
            transition-all duration-300
            hover:-translate-y-0.5 
            hover:shadow-md/10
          "
        >
          {item.icon}
          <div>
            <h3 className="font-semibold text-gray-200 group-hover:text-shop_light_green transition-colors">
              {item.title}
            </h3>
            <p className="text-gray-400 text-sm mt-1 group-hover:text-gray-300 transition-colors">
              {item.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;
