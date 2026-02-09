import React, { useState, useEffect } from "react";
import fetchCategoryWiseProducts from "@/helpers/fetchCategoryWiseProducts.js";

const ConveyorBeltProducts = ({ category }) => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetchCategoryWiseProducts(category);
      // Make sure data is an array
      setData(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setData([]); // fallback to empty array
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  // duplicate data safely
  const items = [...data, ...data];

  return (
    <div className="overflow-hidden container relative w-full py-5 bg-slate-200">
      <div
        className="flex gap-2 animate-conveyor"
        style={{ display: "flex", whiteSpace: "nowrap" }}
      >
        {items.map((product, idx) => (
          <div
            key={idx}
            className="inline-block w-64 h-64 flex-shrink-0 flex items-center bg-slate-300 justify-center rounded-xl"
          >
            <img
              src={product.productImage?.[0]}
              alt={product.productName}
              className="h-56 w-44 bg-slate-300 object-contain"
            />
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes conveyor {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-conveyor {
            animation: conveyor 15s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default ConveyorBeltProducts;
