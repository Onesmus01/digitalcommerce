import React, { useState, useEffect, useContext } from "react";
import { FaStar, FaStarHalfAlt, FaShoppingCart } from "react-icons/fa";
import fetchCategoryWiseProducts from "@/helpers/fetchCategoryWiseProducts.js";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import addToCart from '@/helpers/addToCart.js'
import { Context } from '@/context/ProductContext.jsx'
import { Link } from 'react-router-dom'

const VerticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { fetchCountCart } = useContext(Context)
  const skeletons = new Array(6).fill(null);

  const handleAddToCart = async (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    await addToCart(e, id)
    fetchCountCart()
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetchCategoryWiseProducts(category);
      setData(res?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  return (
    <section className="bg-gray-50 py-4 sm:py-6">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Compact Header */}
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <h2 className="text-sm sm:text-lg font-bold text-slate-800">{heading}</h2>
          <span className="text-xs sm:text-sm text-slate-500 hover:text-red-600 cursor-pointer font-medium">
            View all →
          </span>
        </div>

        {/* Responsive Grid - Small Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
          
          {/* Skeleton Loading */}
          {loading &&
            skeletons.map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg sm:rounded-xl border border-slate-100 overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-slate-200" />
                <div className="p-2 sm:p-3 space-y-2">
                  <div className="h-3 bg-slate-300 rounded w-3/4" />
                  <div className="h-2 bg-slate-200 rounded w-1/2" />
                  <div className="h-4 bg-slate-300 rounded w-2/3" />
                </div>
              </div>
            ))}

          {/* Product Cards - Compact */}
          {!loading &&
            data.map((product) => (
              <Link 
                to={`product/${product._id}`}
                key={product._id}
                className="group bg-white border border-slate-100 rounded-lg sm:rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Image Container - Square aspect */}
                <div className="relative aspect-square bg-slate-50 flex items-center justify-center p-2 sm:p-3">
                  <img
                    src={product?.productImage?.[0]}
                    alt={product?.productName}
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Premium Badge - Compact */}
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2">
                    <div className="bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                      HOT
                    </div>
                  </div>
                </div>

                {/* Content - Tight padding */}
                <div className="p-2 sm:p-3 space-y-1 sm:space-y-1.5">
                  {/* Title - Single line */}
                  <h3 className="text-[11px] sm:text-sm font-semibold text-slate-800 line-clamp-1 leading-tight">
                    {product?.productName}
                  </h3>

                  {/* Category & Rating */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] sm:text-xs text-slate-500 capitalize">
                      {product?.category}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <FaStar className="text-amber-400 text-[8px] sm:text-[10px]" />
                      <span className="text-[9px] sm:text-xs text-slate-600">4.5</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-bold text-red-600">
                      {displayKESCurrency(product?.selling)}
                    </span>
                    <span className="text-[9px] sm:text-xs text-slate-400 line-through hidden sm:inline">
                      {displayKESCurrency(product?.price)}
                    </span>
                  </div>

                  {/* Add Button - Icon on mobile, text on desktop */}
                  <button
                    onClick={(e) => handleAddToCart(e, product?._id)}
                    className="w-full mt-1 bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-xs font-semibold py-1.5 sm:py-2 rounded-md flex items-center justify-center gap-1 transition-colors active:scale-95"
                  >
                    <FaShoppingCart size={10} className="sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
};

export default VerticalCardProduct;