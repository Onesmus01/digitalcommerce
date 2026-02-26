import React, { useEffect, useState, useContext, useRef } from 'react'
import { Context } from '@/context/ProductContext.jsx'
import { Link } from 'react-router-dom'

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([])
  const { toast, backendUrl } = useContext(Context)
  const [loading, setLoading] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollContainerRef = useRef(null)

  const categoryLoading = new Array(10).fill(null)

  const fetchCategoryProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${backendUrl}/product/get-product-category`, {
        method: 'GET',
        credentials: 'include',
      })
      const responseData = await response.json()

      if (responseData.success) {
        setCategoryProduct(responseData.data || [])
      }
    } catch (error) {
      toast.error('Error fetching categories')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryProduct()
  }, [])

  // Auto-scroll hint animation
  useEffect(() => {
    if (scrollContainerRef.current && categoryProduct.length > 0) {
      const container = scrollContainerRef.current
      const scrollAmount = 100
      const duration = 800
      
      const animate = () => {
        container.scrollTo({ left: scrollAmount, behavior: 'smooth' })
        setTimeout(() => {
          container.scrollTo({ left: 0, behavior: 'smooth' })
        }, duration)
      }
      
      const timer = setTimeout(animate, 2000)
      return () => clearTimeout(timer)
    }
  }, [categoryProduct])

  if (loading) {
    return (
      <div className="w-full py-6 bg-gradient-to-b from-white to-gray-50/50">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="flex gap-4 overflow-hidden pb-2">
            {categoryLoading.map((_, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse shadow-inner" />
                <div className="w-16 h-3 bg-gray-200 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (categoryProduct.length === 0) return null

  return (
    <div className="w-full py-6 bg-gradient-to-b from-white via-white to-gray-50/30 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-pink-100/30 rounded-full blur-3xl pointer-events-none" />
      
      <div className="px-4 mx-auto max-w-7xl relative">
        {/* Section title */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Browse Categories
          </h3>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          </div>
        </div>

        {/* Horizontal scrollable categories */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-4 pt-2 px-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categoryProduct.map((cat, index) => (
            <Link
              to={'/product-category/' + cat?.category}
              key={index}
              className="flex-shrink-0 group snap-start"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setActiveIndex(index)}
            >
              <div className="flex flex-col items-center gap-3">
                {/* Cute rounded badge container */}
                <div className={`
                  relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden
                  transition-all duration-500 ease-out
                  ${hoveredIndex === index 
                    ? 'scale-110 -translate-y-1 shadow-xl shadow-gray-400/20 rotate-1' 
                    : 'scale-100 shadow-md shadow-gray-200/50 hover:shadow-lg'
                  }
                  ${activeIndex === index ? 'ring-2 ring-offset-2 ring-gray-900 ring-offset-white' : ''}
                `}>
                  {/* Gradient background */}
                  <div className={`
                    absolute inset-0 transition-all duration-500
                    ${hoveredIndex === index 
                      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
                      : 'bg-gradient-to-br from-gray-50 to-gray-100'
                    }
                  `} />
                  
                  {/* Pattern overlay */}
                  <div className={`
                    absolute inset-0 opacity-0 transition-opacity duration-300
                    ${hoveredIndex === index ? 'opacity-10' : ''}
                    bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2)_1px,transparent_1px)]
                    bg-[size:8px_8px]
                  `} />
                  
                  {/* Image */}
                  <div className="relative w-full h-full p-3 md:p-4">
                    <img
                      src={cat.productImage}
                      alt={cat.category}
                      className={`
                        w-full h-full object-contain transition-all duration-500
                        ${hoveredIndex === index 
                          ? 'scale-110 drop-shadow-lg brightness-110' 
                          : 'scale-100 drop-shadow-md grayscale-[20%]'
                        }
                      `}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>

                  {/* Shine effect */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent
                    translate-x-[-100%] transition-transform duration-700
                    ${hoveredIndex === index ? 'translate-x-[100%]' : ''}
                  `} />
                </div>
                
                {/* Category name with cute styling */}
                <div className="relative">
                  <p className={`
                    text-xs md:text-sm font-medium text-center capitalize whitespace-nowrap
                    transition-all duration-300 px-3 py-1 rounded-full
                    ${hoveredIndex === index 
                      ? 'text-gray-900 bg-gray-100 scale-105 font-semibold' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}>
                    {cat.category}
                  </p>
                  
                  {/* Active indicator dot */}
                  <span className={`
                    absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full
                    transition-all duration-300
                    ${hoveredIndex === index ? 'bg-gray-900 scale-100' : 'bg-transparent scale-0'}
                  `} />
                </div>
              </div>
            </Link>
          ))}
          
          {/* "See all" cute ending badge */}
          <Link 
            to="/categories" 
            className="flex-shrink-0 group snap-start"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-2 border-dashed border-gray-300">
                <span className="text-2xl text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
              </div>
              <p className="text-xs md:text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors px-3 py-1">
                View All
              </p>
            </div>
          </Link>
        </div>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default CategoryList