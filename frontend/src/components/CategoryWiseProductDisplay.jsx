import React, { useContext, useEffect, useState } from 'react'
import displayKESCurrency from '@/helpers/displayCurrency.js'
import { FaHeart, FaStar, FaShoppingCart, FaBolt, FaFire } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import { Sparkles } from "lucide-react";
import Context from '@/context/index.js'
import fetchCategoryWiseProduct from '@/helpers/fetchCategoryWiseProducts.js'

const CategoryWiseProductDisplay = ({ category, heading }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const { fetchCountCart } = useContext(Context)
  const loadingList = new Array(8).fill(null)

  const handleAddToCart = async (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    await addToCart(e, id)
    fetchCountCart()
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const categoryProduct = await fetchCategoryWiseProduct(category)
      setData(categoryProduct?.data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [category])

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="relative py-6 sm:py-8 md:py-12 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 to-violet-500" />

      <div className="container mx-auto px-2 sm:px-4 lg:px-8 relative z-10">
        {/* Compact Header for Mobile */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 blur-lg opacity-50 rounded-full" />
              <div className="relative w-1.5 h-8 sm:w-2 sm:h-10 bg-gradient-to-b from-red-500 to-orange-500 rounded-full shadow-lg" />
            </div>
            
            <div className="flex flex-col">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                {heading}
              </h2>
              <span className="text-[10px] sm:text-sm text-slate-500 font-medium mt-0.5 sm:mt-1">
                Curated just for you
              </span>
            </div>

            <span className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 text-xs font-bold rounded-full border border-orange-200 shadow-sm">
              <FaFire className="text-orange-500 animate-bounce" />
              TRENDING
            </span>
          </div>
          
          <Link 
            to={`/category/${category}`}
            className="text-[10px] sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1 bg-white/80 backdrop-blur px-2 py-1 sm:px-4 sm:py-2 rounded-full border border-red-200 shadow-sm hover:shadow transition-all"
          >
            View All
            <span className="hidden sm:inline">→</span>
          </Link>
        </div>

        {/* RESPONSIVE GRID LAYOUT - Columns instead of rows */}
        {loading ? (
          // Loading Skeleton Grid
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 md:gap-5">
            {loadingList.map((_, index) => (
              <div 
                key={index} 
                className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-md border border-white/50 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 aspect-square animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
                <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-3 bg-slate-200 rounded-full w-3/4" />
                  <div className="h-2 bg-slate-200 rounded-full w-1/2" />
                  <div className="flex justify-between items-center pt-1">
                    <div className="h-4 bg-slate-200 rounded-full w-1/3" />
                    <div className="h-6 w-6 bg-slate-200 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Product Grid - Responsive Columns
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 md:gap-5">
            {data.map((product, index) => (
              <Link 
                key={product?._id}
                to={"/product/" + product?._id} 
                className="group/card relative"
                onClick={scrollTop}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Compact Card */}
                <div className={`
                  relative bg-white rounded-xl sm:rounded-2xl 
                  border border-slate-100 shadow-sm hover:shadow-xl
                  overflow-hidden transition-all duration-300
                  ${hoveredIndex === index ? 'transform -translate-y-1 sm:-translate-y-2' : ''}
                `}>
                  {/* Image Container - Square aspect for mobile */}
                  <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                    {/* Hover Gradient */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10
                      transition-opacity duration-300 z-0
                      ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}
                    `} />

                    {/* Badges - Compact for mobile */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                      {product?.price > product?.selling && (
                        <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[8px] sm:text-xs font-bold rounded-md shadow-sm flex items-center gap-0.5">
                          <FaBolt size={8} />
                          -{Math.round(((product.price - product.selling) / product.price) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button - Smaller on mobile */}
                    <button 
                      className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 p-1.5 sm:p-2 rounded-lg bg-white/90 backdrop-blur text-slate-400 hover:text-red-500 hover:bg-white shadow-sm transition-all active:scale-90"
                      onClick={(e) => e.preventDefault()}
                    >
                      <FaHeart size={10} className="sm:w-4 sm:h-4" />
                    </button>

                    {/* Product Image */}
                    <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 z-0">
                      <img 
                        src={product?.productImage?.[0]} 
                        alt={product?.productName}
                        className={`
                          object-contain max-h-full max-w-full mix-blend-multiply
                          transition-all duration-500
                          ${hoveredIndex === index ? 'scale-105' : 'scale-100'}
                        `}
                      />
                    </div>

                    {/* Quick Add Overlay - Only on larger screens */}
                    <div className={`
                      hidden sm:flex absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-900/80 to-transparent
                      transform transition-transform duration-300
                      ${hoveredIndex === index ? 'translate-y-0' : 'translate-y-full'}
                    `}>
                      <button 
                        onClick={(e) => handleAddToCart(e, product?._id)}
                        className="w-full py-2 bg-white text-slate-900 font-bold rounded-lg text-xs shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <FaShoppingCart size={12} />
                        Quick Add
                      </button>
                    </div>
                  </div>

                  {/* Content - Compact padding */}
                  <div className="p-2 sm:p-4 space-y-1 sm:space-y-2">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            size={8} 
                            className={i < 4 ? "text-amber-400 sm:w-3 sm:h-3" : "text-slate-200 sm:w-3 sm:h-3"} 
                          />
                        ))}
                      </div>
                      <span className="text-[8px] sm:text-xs text-slate-400">(4.0)</span>
                    </div>

                    {/* Title - Single line */}
                    <h3 className="font-bold text-slate-800 text-[11px] sm:text-sm leading-tight line-clamp-1 group-hover/card:text-red-600 transition-colors">
                      {product?.productName}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                      <span className="text-sm sm:text-lg font-black text-red-600">
                        {displayKESCurrency(product?.selling)}
                      </span>
                      {product?.price > product?.selling && (
                        <span className="text-[9px] sm:text-xs text-slate-400 line-through">
                          {displayKESCurrency(product?.price)}
                        </span>
                      )}
                    </div>

                    {/* Savings - Hidden on smallest mobile */}
                    {product?.price > product?.selling && (
                      <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full w-fit">
                        <Sparkles size={8} />
                        Save {displayKESCurrency(product?.price - product?.selling)}
                      </div>
                    )}

                    {/* Add to Cart - Full width on mobile, icon + text on larger */}
                    <button 
                      onClick={(e) => handleAddToCart(e, product?._id)}
                      className={`
                        w-full mt-1 sm:mt-2 py-2 rounded-lg font-bold text-[10px] sm:text-xs
                        transition-all active:scale-95 flex items-center justify-center gap-1
                        ${hoveredIndex === index 
                          ? 'bg-red-600 text-white shadow-md' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }
                      `}
                    >
                      <FaShoppingCart size={10} className="sm:w-3.5 sm:h-3.5" />
                      <span className="hidden sm:inline">Add to Cart</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Button - Centered */}
        <div className="mt-6 sm:mt-10 text-center">
          <Link 
            to={`/category/${category}`}
            className="group inline-flex items-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-full hover:border-red-500 hover:text-red-600 transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
          >
            <span>View All {heading}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  )
}

export default CategoryWiseProductDisplay