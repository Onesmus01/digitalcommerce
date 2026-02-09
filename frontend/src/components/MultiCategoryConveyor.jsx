import React, { useState, useEffect } from "react";
import fetchCategoryWiseProducts from "@/helpers/fetchCategoryWiseProducts.js";

const MultiCategoryConveyor = ({ categories }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch all products
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          categories.map(async (cat) => {
            const res = await fetchCategoryWiseProducts(cat);
            return Array.isArray(res?.data) ? res.data : [];
          })
        );
        setAllProducts(results.flat()); // flatten into single array
      } catch (err) {
        console.error("Error fetching products:", err);
        setAllProducts([]);
      }
    };
    fetchAll();
  }, [categories]);

  // Detect mobile screen
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Duplicate for smooth scroll
  const items = [...allProducts, ...allProducts];

  return (
    <div className="container px-4 mx-auto py-3">
      <div className="relative overflow-hidden rounded  bg-white h-36 md:h-44">
        <div
          className="flex gap-4 animate-conveyor-reverse h-full items-center"
          style={{ whiteSpace: "nowrap" }}
        >
          {items.map((product, idx) => (
            <div
              key={idx}
              className={`inline-block flex-shrink-0 flex items-center justify-center bg-white ${
                isMobile ? "w-36 h-36" : "w-44 h-36"
              }`}
            >
              <img
                src={product.productImage?.[0]}
                alt={product.productName}
                className="object-contain h-3/4 w-full mix-blend-multiply"
              />
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes conveyor-reverse {
            0% { transform: translateX(-20%); }
            100% { transform: translateX(0); }
          }
          .animate-conveyor-reverse {
            animation: conveyor-reverse 10s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default MultiCategoryConveyor;
