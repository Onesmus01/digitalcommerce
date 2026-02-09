import React, { useState, useEffect, useRef,useContext } from "react";
import { FaAngleLeft, FaAngleRight, FaStar, FaStarHalfAlt } from "react-icons/fa";
import fetchCategoryWiseProducts from "@/helpers/fetchCategoryWiseProducts.js";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import addToCart from '@/helpers/addToCart.js'
import {Context} from '@/context/ProductContext.jsx'
import {Link} from 'react-router-dom'


const VerticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const railRef = useRef(null);
  
  const {fetchCountCart} = useContext(Context)
  const skeletons = new Array(6).fill(null);

   

    const handleAddToCart = async(e,id)=>{
       await addToCart(e,id)
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
  }, []);

  const scrollLeft = () => {
    railRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    railRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="container bg-gray-100 mx-auto px-4 my-8 relative">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-darkColor">{heading}</h2>
        <span className="text-sm text-lightColor hover:text-red-500 cursor-pointer">
          View all
        </span>
      </div>

      {/* SCROLL BUTTONS */}
      <button
        onClick={scrollLeft}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10
        bg-white text-red-500 p-2 rounded-full shadow-lg hover:scale-110"
      >
        <FaAngleLeft />
      </button>

      <button
        onClick={scrollRight}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-10
        bg-white text-red-500 p-2 rounded-full shadow-lg hover:scale-110"
      >
        <FaAngleRight />
      </button>

      {/* PRODUCT RAIL */}
      <div
        ref={railRef}
        className="flex gap-6 overflow-x-scroll scrollbar-none scroll-smooth pb-4"
      >
        {/* SKELETON */}
        {loading &&
          skeletons.map((_, i) => (
            <div
              key={i}
              className="min-w-[260px] rounded-2xl bg-white border animate-pulse"
            >
              <div className="h-[200px] bg-slate-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-300 rounded w-4/5" />
                <div className="h-3 bg-slate-200 rounded w-2/5" />
                <div className="h-5 bg-slate-300 rounded w-3/5" />
              </div>
            </div>
          ))}

        {/* PRODUCTS */}
        {!loading &&
          data.map((product) => (
            <Link to={`product/${product._id}`}
              key={product._id}
              className="group min-w-[260px] max-w-[260px]
              bg-white border  overflow-hidden
              hover:shadow-xl transition-all relative"
            >
              {/* IMAGE */}
              <div className="relative h-[200px] border border-b-blue-300 flex items-center justify-center">
                <img
                  src={product?.productImage?.[0]}
                  alt={product?.productName}
                  className="h-44 w-44 object-contain group-hover:scale-110 transition"
                />

                {/* 🔥 PREMIUM RIBBON WITH DOUBLE V */}
                <div className="absolute top-0 left-0">
                  <div className="relative bg-gray-400 text-white text-[10px] font-bold w-9 py-8">
                    <span className="rotate-90 inline-block tracking-widest">
                      PREMIUM
                    </span>
                    <div className="absolute -bottom-3 left-0 w-0 h-0 border-r-[14px] border-r-transparent border-t-[12px] border-t-red-600" />
                    <div className="absolute -bottom-3 right-0 w-0 h-0 border-l-[14px] border-l-transparent border-t-[12px] border-t-red-600" />
                  </div>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-3 flex flex-col gap-1">
                <p className="text-sm font-semibold truncate">
                  {product?.productName}
                </p>

                <div className="flex justify-between items-center">
                  <p className="text-xs text-black capitalize">
                    {product?.category}
                  </p>

                  <div className="flex items-center gap-1">
                    {[...Array(4)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-500 text-xs" />
                    ))}
                    <FaStarHalfAlt className="text-yellow-500 text-xs" />
                    <span className="text-xs font-medium">4.5</span>
                  </div>
                </div>

                <p className="text-xs text-black line-clamp-1">
                  {product?.description}
                </p>

                <div className="flex gap-2 text-sm">
                  <p className="line-through text-gray-400 font-bold">
                    {displayKESCurrency(product?.price)}
                  </p>
                  <p className="font-bold text-red-600">
                    {displayKESCurrency(product?.selling)}
                  </p>
                </div>

                <button
                  className="mt-2 mb-3 mx-auto w-1/2 bg-red-600 text-white
                  text-sm py-1 rounded-full hover:bg-red-500 transition"
                  onClick={(e)=>handleAddToCart(e,product?._id)}
                >
                  Add to Cart
                </button>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
};

export default VerticalCardProduct;
