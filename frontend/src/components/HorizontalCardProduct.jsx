import React, { useState, useEffect, useRef, useContext } from "react";
import { FaAngleLeft, FaAngleRight, FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import fetchCategoryWiseProducts from "@/helpers/fetchCategoryWiseProducts.js";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import addToCart from "@/helpers/addToCart.js";
import Context from "@/context/index.js";
import { Title } from "./Title.jsx";

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState({});
  const [cartItem, setCartItem] = useState(null);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [activeCard, setActiveCard] = useState(null); // for card pop animation

  const railRef = useRef(null);
  const { fetchCountCart } = useContext(Context);
  const skeletons = Array.from({ length: 6 });

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

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(e, product._id);
    fetchCountCart();
    toast.success("Added to cart!");
    setCartItem(product);
    setActiveCard(product._id); // trigger pop
    setShowMiniCart(true);
    setTimeout(() => {
      setShowMiniCart(false);
      setActiveCard(null);
    }, 2500); // auto-hide mini cart
  };
  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success(wishlist[id] ? "Removed from wishlist" : "Added to wishlist");
  };

  const scrollLeft = () => railRef.current.scrollBy({ left: -320, behavior: "smooth" });
  const scrollRight = () => railRef.current.scrollBy({ left: 320, behavior: "smooth" });

  return (
    <section className="container mx-auto px-3 sm:px-4 my-6 relative">
      {/* HEADER */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-black">{heading}</h2>
          <span className="text-xs sm:text-sm text-lightColor hover:underline cursor-pointer">
            View all
          </span>
        </div>
        <Title subheading="Explore our products" />
      </div>

      {/* SCROLL BUTTONS */}
      <button
        onClick={scrollLeft}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-slate-100 z-10"
      >
        <FaAngleLeft />
      </button>

      <button
        onClick={scrollRight}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-slate-100 z-10"
      >
        <FaAngleRight />
      </button>

      {/* PRODUCT RAIL */}
      <div
        ref={railRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-3"
      >
        {/* SKELETONS */}
        {loading &&
          skeletons.map((_, i) => (
            <div
              key={i}
              className="min-w-[160px] sm:min-w-[200px] md:min-w-[220px] h-[210px] sm:h-[220px] bg-white border rounded-lg animate-pulse"
            >
              <div className="h-28 sm:h-32 bg-slate-300 rounded-t-lg" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-7 bg-slate-300 rounded-full" />
              </div>
            </div>
          ))}

        {/* PRODUCTS */}
        {!loading &&
          data.map((product) => {
            const discountPercent = product?.price
              ? Math.round(((product.price - product.selling) / product.price) * 100)
              : 0;

            return (
              <Link
                key={product?._id}
                to={`product/${product?._id}`}
                className={`min-w-[160px] sm:min-w-[200px] md:min-w-[220px] h-[210px] sm:h-[220px]
                           bg-white border border-slate-200 rounded-lg hover:shadow-md transition relative flex flex-col
                           ${activeCard === product._id ? "animate-pop" : ""}`}
              >
                {/* DISCOUNT BADGE */}
                {discountPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">
                    -{discountPercent}%
                  </div>
                )}

                {/* WISHLIST */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product._id);
                  }}
                  className="absolute top-2 right-2 text-red-500 text-lg z-10"
                >
                  {wishlist[product._id] ? <FaHeart /> : <FaRegHeart />}
                </button>

                {/* IMAGE */}
                <div className="flex-1 flex items-center justify-center p-2 sm:p-3">
                  <img
                    src={product?.productImage?.[0]}
                    alt={product?.productName}
                    className="h-24 sm:h-28 md:h-32 w-auto object-contain hover:scale-105 transition"
                  />
                </div>

                {/* INFO */}
                <div className="px-2 sm:px-3 pb-3 flex flex-col flex-1 justify-end">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                    {product?.productName}
                  </p>

                  <div className="flex items-center gap-1 mt-0.5">
                    {discountPercent > 0 && (
                      <p className="text-[10px] sm:text-xs line-through text-gray-400">
                        {displayKESCurrency(product?.price)}
                      </p>
                    )}
                    <p className="text-sm sm:text-base font-bold text-gray-900">
                      {displayKESCurrency(product?.selling)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="mt-2 w-full text-[11px] sm:text-xs font-semibold py-1.5 rounded-full border border-gray-300 hover:bg-red-500 hover:text-white transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            );
          })}

        {/* EMPTY */}
        {!loading && data.length === 0 && (
          <p className="text-sm text-lightColor">No products found.</p>
        )}
      </div>

      {/* MINI SLIDE-IN CART */}
      {showMiniCart && cartItem && (
        <div className="fixed bottom-5 right-5 w-64 sm:w-72 bg-white border shadow-lg rounded-lg p-4 flex items-center animate-slide-in">
          <img
            src={cartItem?.productImage?.[0]}
            alt={cartItem?.productName}
            className="h-16 w-16 object-contain mr-3"
          />
          <div className="flex-1">
            <p className="text-sm font-medium truncate">{cartItem?.productName}</p>
            <p className="text-sm font-bold">{displayKESCurrency(cartItem?.selling)}</p>
          </div>
          <FaShoppingCart className="text-gray-700 ml-2" />
        </div>
      )}

      <div className="pt-5">
        <hr className="bg-gray-300 h-[2px] w-full" />
      </div>

      {/* Tailwind animation */}
      <style>
        {`
          @keyframes pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-pop {
            animation: pop 0.3s ease-in-out;
          }
          @keyframes slide-in {
            0% { transform: translateX(100%) translateY(20px); opacity: 0; }
            100% { transform: translateX(0) translateY(0); opacity: 1; }
          }
          .animate-slide-in {
            animation: slide-in 0.5s ease-out;
          }
        `}
      </style>
    </section>
  );
};

export default HorizontalCardProduct;
