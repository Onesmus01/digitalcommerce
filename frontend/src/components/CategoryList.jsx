import React, { useEffect, useState, useContext } from 'react'
import { Context } from '@/context/ProductContext.jsx'
import { Link } from 'react-router-dom'

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([])
  const { toast, backendUrl } = useContext(Context)
  const [loading, setLoading] = useState(false)

  const categoryLoading = new Array(13).fill(null) // fixed loading array

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

  return (
    <div className="container mx-auto p-4">
      <div className="flex cursor-pointer items-center justify-center gap-4 overflow-scroll scrollbar-none">
        {!loading ? (
          categoryProduct.length > 0 ? (
            categoryProduct.map((cat, index) => (
              <Link
                to={'/product-category/' + cat?.category} // fixed link
                key={index}
                className="flex-shrink-0 text-center"
              >
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-slate-200 overflow-hidden p-4 flex items-center justify-center border">
                  <img
                    src={cat.productImage}
                    alt={cat.category}
                    className="w-full hover:scale-105 h-full object-scale-down mix-blend-multiply"
                  />
                </div>
                <p className="text-sm md:text-base mt-1 capitalize">
                  {cat.category}
                </p>
              </Link>
            ))
          ) : (
            <p>No Categories Found</p>
          )
        ) : (
          categoryLoading.map((_, index) => (
            <div
              key={index}
              className="h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center"
            >
              Loading ...
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CategoryList
