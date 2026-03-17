import React, { useContext, useEffect, useRef, useState } from 'react'
import displayKESCurrency from '@/helpers/displayCurrency.js'
import { FaAngleLeft, FaAngleRight, FaHeart, FaStar, FaShoppingCart, FaBolt, FaFire, } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import { Sparkles } from "lucide-react";
import Context from '@/context/index.js'
import fetchCategoryWiseProduct from '@/helpers/fetchCategoryWiseProducts.js'

const CategoryWiseProductDisplay = ({ category, heading }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const scrollContainerRef = useRef(null)
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

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="relative py-12 md:py-16 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Premium Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 to-violet-500" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Premium Header with Glassmorphism */}
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 blur-lg opacity-50 rounded-full" />
              <div className="relative w-2 h-10 bg-gradient-to-b from-red-500 to-orange-500 rounded-full shadow-lg" />
            </div>
            
            <div className="flex flex-col">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                {heading}
              </h2>
              <span className="text-sm text-slate-500 font-medium mt-1">
                Curated just for you
              </span>
            </div>

            <span className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 text-xs font-bold rounded-full border border-orange-200 shadow-sm">
              <FaFire className="text-orange-500 animate-bounce" />
              TRENDING NOW
            </span>
          </div>
          
          {/* Glassmorphic Navigation Arrows */}
          <div className="flex gap-3">
            <button 
              onClick={() => scroll('left')}
              className="group p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <FaAngleLeft size={22} className="text-slate-600 group-hover:text-red-600 transition-colors" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="group p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <FaAngleRight size={22} className="text-slate-600 group-hover:text-red-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Products Container with Glassmorphism */}
        <div className="relative group">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          {/* Scrollable Grid */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-5 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-6 -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              // Premium Loading Skeletons with shimmer
              loadingList.map((_, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-[280px] md:w-[320px] bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 h-56 animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-slate-200 rounded-full animate-pulse w-3/4" />
                    <div className="h-3 bg-slate-200 rounded-full animate-pulse w-1/2" />
                    <div className="flex gap-3 pt-2">
                      <div className="h-6 bg-slate-200 rounded-full animate-pulse w-24" />
                      <div className="h-6 bg-slate-200 rounded-full animate-pulse w-20" />
                    </div>
                    <div className="h-12 bg-slate-200 rounded-xl animate-pulse mt-4" />
                  </div>
                </div>
              ))
            ) : (
              // Premium Product Cards with Glassmorphism
              data.map((product, index) => (
                <Link 
                  key={product?._id}
                  to={"/product/" + product?._id} 
                  className="flex-shrink-0 w-[280px] md:w-[320px] group/card relative"
                  onClick={scrollTop}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Card with Glassmorphism */}
                  <div className={`
                    relative bg-white/80 backdrop-blur-md rounded-3xl 
                    border border-white/60 shadow-lg hover:shadow-2xl
                    overflow-hidden transition-all duration-500 ease-out
                    ${hoveredIndex === index ? 'transform -translate-y-3 scale-[1.02]' : ''}
                  `}>
                    {/* Image Container with Gradient Overlay */}
                    <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                      {/* Animated Gradient Background */}
                      <div className={`
                        absolute inset-0 bg-gradient-to-br from-red-500/20 via-orange-500/20 to-transparent
                        transition-opacity duration-500
                        ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}
                      `} />

                      {/* Premium Badges */}
                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        {product?.discount > 0 && (
                          <span className="relative px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-black rounded-lg shadow-lg shadow-red-500/30 flex items-center gap-1">
                            <FaBolt size={10} className="animate-pulse" />
                            -{Math.round(((product.price - product.selling) / product.price) * 100)}%
                          </span>
                        )}
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-slate-700 text-xs font-bold rounded-lg shadow-md border border-white/50">
                          {product?.category}
                        </span>
                      </div>

                      {/* Wishlist Button with Glassmorphism */}
                      <button 
                        className="absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-white/50 shadow-md hover:shadow-lg text-slate-400 hover:text-red-500 hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95"
                        onClick={(e) => e.preventDefault()}
                      >
                        <FaHeart size={16} />
                      </button>

                      {/* Product Image with Hover Zoom */}
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <img 
                          src={product?.productImage?.[0]} 
                          alt={product?.productName}
                          className={`
                            object-contain max-h-full max-w-full mix-blend-multiply drop-shadow-xl
                            transition-all duration-700 ease-out
                            ${hoveredIndex === index ? 'scale-110 rotate-2' : 'scale-100'}
                          `}
                        />
                      </div>

                      {/* Quick Action Overlay with Glassmorphism */}
                      <div className={`
                        absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent backdrop-blur-sm
                        transform transition-transform duration-500 ease-out
                        ${hoveredIndex === index ? 'translate-y-0' : 'translate-y-full'}
                      `}>
                        <button 
                          onClick={(e) => handleAddToCart(e, product?._id)}
                          className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-red-50 hover:text-red-600 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                        >
                          <FaShoppingCart size={16} />
                          Quick Add
                        </button>
                      </div>
                    </div>

                    {/* Content with Premium Typography */}
                    <div className="p-6 space-y-3">
                      {/* Rating with Stars */}
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              size={12} 
                              className={i < 4 ? "text-amber-400 drop-shadow-sm" : "text-slate-200"} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400 font-medium">(4.0)</span>
                        <span className="text-xs text-slate-300 mx-1">•</span>
                        <span className="text-xs text-emerald-600 font-semibold">In Stock</span>
                      </div>

                      {/* Title with Gradient Hover */}
                      <h3 className="font-bold text-slate-800 text-lg leading-tight line-clamp-1 group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r group-hover/card:from-red-600 group-hover/card:to-orange-600 transition-all duration-300">
                        {product?.productName}
                      </h3>

                      {/* Price with Premium Styling */}
                      <div className="flex items-baseline gap-3 pt-1">
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                          {displayKESCurrency(product?.selling)}
                        </span>
                        <span className="text-sm text-slate-400 line-through font-medium">
                          {displayKESCurrency(product?.price)}
                        </span>
                      </div>

                      {/* Savings Badge */}
                      {product?.price > product?.selling && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                          <Sparkles size={10} />
                          Save {displayKESCurrency(product?.price - product?.selling)}
                        </div>
                      )}

                      {/* Add to Cart Button with Gradient */}
                      <button 
                        onClick={(e) => handleAddToCart(e, product?._id)}
                        className={`
                          w-full mt-4 py-3.5 rounded-xl font-bold text-sm
                          transition-all duration-500 transform
                          ${hoveredIndex === index 
                            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02]' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }
                          active:scale-95
                        `}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Premium View All Button */}
        <div className="mt-10 text-center">
          <Link 
            to={`/category/${category}`}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-md border-2 border-slate-200 text-slate-700 font-bold rounded-full hover:border-red-500 hover:text-red-600 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1 active:translate-y-0"
          >
            <span>View All {heading}</span>
            <FaAngleRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
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