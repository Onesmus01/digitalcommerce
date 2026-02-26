import React, { useContext, useEffect, useRef, useState } from 'react'
import displayKESCurrency from '@/helpers/displayCurrency.js'
import { FaAngleLeft, FaAngleRight, FaHeart, FaStar, FaShoppingCart } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
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
      console.log(categoryProduct)
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
    <section className="relative py-8 md:py-12 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />
      
      <div className="container mx-auto px-4 relative">
        {/* Premium Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              {heading}
            </h2>
            <span className="hidden md:flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
              <FaStar className="text-yellow-500" />
              HOT
            </span>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg border border-gray-100 hover:border-red-200 text-gray-600 hover:text-red-600 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <FaAngleLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg border border-gray-100 hover:border-red-200 text-gray-600 hover:text-red-600 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <FaAngleRight size={20} />
            </button>
          </div>
        </div>

        {/* Products Container */}
        <div className="relative group">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

          {/* Scrollable Grid */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              // Loading Skeletons
              loadingList.map((_, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-[280px] md:w-[320px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="bg-gray-200 h-52 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded-full animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-200 rounded-full animate-pulse w-1/2" />
                    <div className="flex gap-3 pt-2">
                      <div className="h-5 bg-gray-200 rounded-full animate-pulse w-24" />
                      <div className="h-5 bg-gray-200 rounded-full animate-pulse w-20" />
                    </div>
                    <div className="h-10 bg-gray-200 rounded-full animate-pulse mt-4" />
                  </div>
                </div>
              ))
            ) : (
              // Product Cards
              data.map((product, index) => (
                <Link 
                  key={product?._id}
                  to={"/product/" + product?._id} 
                  className="flex-shrink-0 w-[280px] md:w-[320px] group/card relative"
                  onClick={scrollTop}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Card */}
                  <div className={`
                    relative bg-white rounded-2xl shadow-sm hover:shadow-xl 
                    border border-gray-100 hover:border-red-100
                    overflow-hidden transition-all duration-500 ease-out
                    ${hoveredIndex === index ? 'transform -translate-y-2' : ''}
                  `}>
                    {/* Image Container */}
                    <div className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {/* Badges */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                        {product?.discount && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg shadow-lg">
                            -{Math.round(((product.price - product.sellingPrice) / product.price) * 100)}%
                          </span>
                        )}
                        <span className="px-2 py-1 bg-white/90 backdrop-blur text-gray-700 text-xs font-medium rounded-lg shadow-sm">
                          {product?.category}
                        </span>
                      </div>

                      {/* Wishlist Button */}
                      <button 
                        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white text-gray-400 hover:text-red-500 shadow-sm transition-all duration-300 hover:scale-110"
                        onClick={(e) => e.preventDefault()}
                      >
                        <FaHeart size={16} />
                      </button>

                      {/* Product Image */}
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <img 
                          src={product?.productImage?.[0]} 
                          alt={product?.productName}
                          className={`
                            object-contain max-h-full max-w-full mix-blend-multiply
                            transition-all duration-700 ease-out
                            ${hoveredIndex === index ? 'scale-110 rotate-2' : 'scale-100'}
                          `}
                        />
                      </div>

                      {/* Quick Action Overlay */}
                      <div className={`
                        absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent
                        transform transition-transform duration-300
                        ${hoveredIndex === index ? 'translate-y-0' : 'translate-y-full'}
                      `}>
                        <button 
                          onClick={(e) => handleAddToCart(e, product?._id)}
                          className="w-full py-2.5 bg-white text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <FaShoppingCart size={16} />
                          Quick Add
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            size={12} 
                            className={i < 4 ? "text-yellow-400" : "text-gray-200"} 
                          />
                        ))}
                        <span className="text-xs text-gray-400 ml-1">(4.0)</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-1 group-hover/card:text-red-600 transition-colors">
                        {product?.productName}
                      </h3>

                      {/* Price */}
                      <div className="flex items-baseline gap-3 pt-1">
                        <span className="text-2xl font-bold text-red-600">
                          {displayKESCurrency(product?.sellingPrice)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {displayKESCurrency(product?.price)}
                        </span>
                      </div>

                      {/* Savings */}
                      {product?.price > product?.sellingPrice && (
                        <p className="text-xs text-green-600 font-medium">
                          Save {displayKESCurrency(product?.price - product?.sellingPrice)}
                        </p>
                      )}

                      {/* Add to Cart Button */}
                      <button 
                        onClick={(e) => handleAddToCart(e, product?._id)}
                        className={`
                          w-full mt-3 py-3 rounded-xl font-semibold text-sm
                          transition-all duration-300 transform
                          ${hoveredIndex === index 
                            ? 'bg-red-600 text-white shadow-lg shadow-red-200 hover:bg-red-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
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

        {/* View All Link */}
        <div className="mt-8 text-center">
          <Link 
            to={`/category/${category}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:border-red-500 hover:text-red-600 transition-all duration-300 hover:shadow-lg"
          >
            View All {heading}
            <FaAngleRight />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default CategoryWiseProductDisplay