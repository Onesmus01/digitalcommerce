import React, { useEffect, useState, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import displayKESCurrency from "@/helpers/displayCurrency.js";
import addToCart from "@/helpers/addToCart.js";
import { Context } from "@/context/ProductContext.jsx";

const SearchProduct = () => {
  const { backendUrl, fetchCountCart } = useContext(Context);
  const location = useLocation();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const skeletons = new Array(8).fill(null);

  const fetchSearchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/product/search${location.search}`);
      const result = await res.json();
      setData(result?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchProducts();
  }, [location.search]);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    e.stopPropagation(); // prevent Link navigation
    await addToCart(e, id);
    fetchCountCart();
  };

  return (
    <section className="container mx-auto px-3 sm:px-4 my-8">
      {/* GRID */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* SKELETON */}
        {loading &&
          skeletons.map((_, i) => (
            <div key={i} className="rounded-2xl bg-white border animate-pulse">
              <div className="h-[180px] bg-slate-200" />
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
            <Link
              to={`/product/${product?._id}`}
              key={product?._id}
              className="group bg-white border rounded-xl overflow-hidden hover:shadow-xl transition-all relative"
            >
              {/* IMAGE */}
              <div className="relative h-[180px] sm:h-[200px] bg-slate-100 flex items-center justify-center">
                <img
                  src={product?.productImage?.[0]}
                  alt={product?.productName}
                  className="h-36 sm:h-44 w-auto object-contain group-hover:scale-110 transition"
                />

                {/* PREMIUM RIBBON */}
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
                <p className="text-sm font-semibold truncate">{product?.productName}</p>

                <div className="flex justify-between items-center">
                  <p className="text-xs text-lightColor capitalize">{product?.category}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(4)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-500 text-xs" />
                    ))}
                    <FaStarHalfAlt className="text-yellow-500 text-xs" />
                    <span className="text-xs font-medium">4.5</span>
                  </div>
                </div>

                <p className="text-xs text-lightColor line-clamp-1">{product?.description}</p>

                <div className="flex gap-2 text-sm">
                  <p className="line-through text-gray-400 font-bold">
                    {displayKESCurrency(product?.price)}
                  </p>
                  <p className="font-bold text-red-600">{displayKESCurrency(product?.selling)}</p>
                </div>

                <button
                  onClick={(e) => handleAddToCart(e, product?._id)}
                  className="mt-2 mb-3 mx-auto w-full sm:w-1/2 bg-red-600 text-white text-sm py-1 rounded-full hover:bg-red-500 transition"
                >
                  Add to Cart
                </button>
              </div>
            </Link>
          ))}
      </div>

      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <p className="text-center text-lightColor mt-12">No products found 😔</p>
      )}
    </section>
  );
};

export default SearchProduct;
