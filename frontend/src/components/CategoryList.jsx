import React, { useEffect, useState, useContext, useRef } from 'react'
import { Context } from '@/context/ProductContext.jsx'
import { Link } from 'react-router-dom'

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([])
  const { toast, backendUrl } = useContext(Context)
  const [loading, setLoading] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
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

  if (loading) {
    return (
      <div className="w-full py-4 bg-white border-b border-gray-100">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="flex gap-4 overflow-hidden">
            {categoryLoading.map((_, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse" />
                <div className="w-12 h-3 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (categoryProduct.length === 0) return null

  return (
    <div className="w-full py-4 bg-white border-b border-gray-100">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Horizontal scrollable categories */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categoryProduct.map((cat, index) => (
            <Link
              to={'/product-category/' + cat?.category}
              key={index}
              className="flex-shrink-0 group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex flex-col items-center gap-2">
                {/* Compact circular image - matches conveyor style */}
                <div className={`
                  relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden
                  bg-gray-50 border border-gray-100
                  transition-all duration-300 ease-out
                  ${hoveredIndex === index ? 'scale-110 shadow-md border-gray-200' : 'shadow-sm'}
                `}>
                  <img
                    src={cat.productImage}
                    alt={cat.category}
                    className={`
                      w-full h-full object-contain p-2 mix-blend-multiply
                      transition-transform duration-300
                      ${hoveredIndex === index ? 'scale-110' : 'scale-100'}
                    `}
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
                
                {/* Compact text */}
                <p className={`
                  text-xs font-medium text-center capitalize whitespace-nowrap
                  transition-colors duration-200
                  ${hoveredIndex === index ? 'text-gray-900' : 'text-gray-500'}
                `}>
                  {cat.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default CategoryList