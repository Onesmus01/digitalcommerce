import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { FaStar, FaStarHalf, FaHeart, FaShare, FaTruck, FaShieldAlt,FaShoppingCart, FaUndo, FaCheck } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import displayKESCurrency from '@/helpers/displayCurrency';
import VerticalCardProduct from '@/components/VerticalCardProduct.jsx';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import { Context } from '@/context/ProductContext.jsx';
import SEO from '@/components/Seo.jsx';

const ProductDetails = () => {
  const [data, setData] = useState([])
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState("")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { toast, backendUrl, getAuthHeaders } = useContext(Context)
  const { fetchUserAddToCart } = useContext(Context)
  const navigate = useNavigate()

  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 })
  const [zoomImage, setZoomImage] = useState(false)

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${backendUrl}/product/get-product-details/${id}`
      );
      const resData = await response.json();
      
      if (response.ok) {
        setData(resData?.data);
        setActiveImage(resData?.data?.productImage?.[0]);
      } else {
        toast.error(resData?.message || "Failed to fetch product");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProductDetails();
  }, [id]);

  const handleMouseEnterProduct = (imageURL, index) => {
    setActiveImage(imageURL)
    setSelectedImageIndex(index)
  }

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true)
    const { left, top, width, height } = e.target.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height
    setZoomImageCoordinate({ x, y })
  }, [])

  const handleLeaveImageZoom = () => {
    setZoomImage(false)
  }

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart()
    toast.success("Added to cart!")
  }

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart()
    navigate("/cart")
  }

  const discount = data?.price && data?.selling ? 
    Math.round(((data.price - data.selling) / data.price) * 100) : 0;

  return (
    <>
      <SEO 
        title={data?.productName ? `${data.productName} | Buy Online` : 'Loading Product...'}
        description={data?.description || 'Explore this amazing product online.'}
        url={`/product/${id}`}
        image={data?.productImage?.[0] || '/default-product-image.jpg'}
      />
      
      <div className='min-h-screen bg-slate-50 pb-8 md:pb-12'>
        {/* Breadcrumb Navigation */}
        <div className='bg-white border-b border-slate-200 sticky top-0 z-40'>
          <div className='container mx-auto px-2 md:px-4 py-2 md:py-3'>
            <div className='flex items-center gap-1 md:gap-2 text-xs md:text-sm'>
              <Link to="/" className='text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors'>
                <IoIosArrowBack className='md:hidden' />
                Home
              </Link>
              <span className='text-slate-300'>/</span>
              <span className='text-slate-500 capitalize hidden sm:inline'>{data?.category}</span>
              <span className='text-slate-300 hidden sm:inline'>/</span>
              <span className='text-slate-800 font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-md'>
                {loading ? 'Loading...' : data?.productName}
              </span>
            </div>
          </div>
        </div>

        <div className='container mx-auto px-2 md:px-4 py-3 md:py-4 lg:py-8'>
          
          {/* Main Product Section */}
          <div className='bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 overflow-hidden'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-0'>
              
              {/* Images Section */}
              <div className='p-2 md:p-4 lg:p-8 bg-slate-50/50'>
                {loading ? (
                  <div className='space-y-3 md:space-y-4'>
                    <div className='aspect-square bg-slate-200 rounded-xl md:rounded-2xl animate-pulse' />
                    <div className='flex gap-1.5 md:gap-2 justify-center'>
                      {[1,2,3,4].map((_, i) => (
                        <div key={i} className='w-12 h-12 md:w-16 md:h-16 bg-slate-200 rounded-lg animate-pulse' />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className='space-y-3 md:space-y-4'>
                    {/* Main Image */}
                    <div className='relative aspect-square bg-white rounded-xl md:rounded-2xl border border-slate-200 overflow-hidden group'>
                      <img 
                        src={activeImage} 
                        alt={data?.productName}
                        className='w-full h-full object-contain p-2 md:p-4 lg:p-8 mix-blend-multiply cursor-crosshair'
                        onMouseMove={handleZoomImage}
                        onMouseLeave={handleLeaveImageZoom}
                      />
                      
                      {/* Zoom Indicator (Desktop) */}
                      <div className='absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-white/90 backdrop-blur px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-medium text-slate-600 shadow-sm border border-slate-200 hidden lg:block'>
                        Hover to zoom
                      </div>

                      {/* Discount Badge */}
                      {discount > 0 && (
                        <div className='absolute top-2 left-2 md:top-4 md:left-4 bg-red-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full font-bold text-xs md:text-sm shadow-lg'>
                          -{discount}% OFF
                        </div>
                      )}

                      {/* Mobile Zoom Modal */}
                      {zoomImage && (
                        <div className='lg:hidden fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4' onClick={() => setZoomImage(false)}>
                          <img 
                            src={activeImage} 
                            className='max-w-full max-h-full object-contain'
                            alt="Zoomed"
                          />
                          <button className='absolute top-4 right-4 text-white text-sm md:text-lg bg-black/50 px-3 py-1.5 md:px-4 md:py-2 rounded-full'>
                            Close
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Gallery */}
                    <div className='flex gap-1.5 md:gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center lg:justify-start'>
                      {data?.productImage?.map((imgURL, index) => (
                        <button
                          key={imgURL}
                          onClick={() => handleMouseEnterProduct(imgURL, index)}
                          className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg border-2 overflow-hidden transition-all ${
                            selectedImageIndex === index 
                              ? 'border-red-500 ring-2 ring-red-200' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img 
                            src={imgURL} 
                            alt={`View ${index + 1}`}
                            className='w-full h-full object-contain p-0.5 md:p-1 mix-blend-multiply'
                          />
                        </button>
                      ))}
                    </div>

                    {/* Desktop Zoom Preview */}
                    {zoomImage && (
                      <div className='hidden lg:block fixed left-1/2 top-1/2 -translate-y-1/2 ml-4 w-[400px] h-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-30'>
                        <div
                          className='w-full h-full'
                          style={{
                            backgroundImage: `url(${activeImage})`,
                            backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`,
                            backgroundSize: '200%',
                            backgroundRepeat: 'no-repeat'
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className='p-3 md:p-4 lg:p-8 flex flex-col'>
                {loading ? (
                  <div className='space-y-3 md:space-y-4 animate-pulse'>
                    <div className='h-3 md:h-4 bg-slate-200 rounded w-1/4' />
                    <div className='h-6 md:h-8 bg-slate-200 rounded w-3/4' />
                    <div className='h-3 md:h-4 bg-slate-200 rounded w-1/2' />
                    <div className='flex gap-1.5 md:gap-2'>
                      {[1,2,3,4,5].map((_, i) => (
                        <div key={i} className='w-4 h-4 md:w-5 md:h-5 bg-slate-200 rounded' />
                      ))}
                    </div>
                    <div className='h-10 md:h-12 bg-slate-200 rounded w-1/3' />
                    <div className='flex gap-2 md:gap-4'>
                      <div className='h-10 md:h-12 bg-slate-200 rounded flex-1' />
                      <div className='h-10 md:h-12 bg-slate-200 rounded flex-1' />
                    </div>
                  </div>
                ) : (
                  <div className='space-y-3 md:space-y-4 lg:space-y-6'>
                    {/* Brand & Category */}
                    <div className='flex items-center gap-1.5 md:gap-2 flex-wrap'>
                      <span className='bg-red-100 text-red-700 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs lg:text-sm font-semibold'>
                        {data?.brandName}
                      </span>
                      <span className='bg-slate-100 text-slate-600 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs lg:text-sm capitalize'>
                        {data?.category}
                      </span>
                      <span className='flex items-center gap-0.5 md:gap-1 text-emerald-600 text-[10px] md:text-xs lg:text-sm font-medium'>
                        <FaCheck className='text-[8px] md:text-[10px]' /> In Stock
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight'>
                      {data?.productName}
                    </h1>

                    {/* Rating */}
                    <div className='flex items-center gap-1.5 md:gap-2'>
                      <div className='flex items-center gap-0.5'>
                        {[...Array(4)].map((_, i) => (
                          <FaStar key={i} className='text-amber-400 text-xs md:text-sm lg:text-base' />
                        ))}
                        <FaStarHalf className='text-amber-400 text-xs md:text-sm lg:text-base' />
                      </div>
                      <span className='text-slate-500 text-xs md:text-sm'>4.5 (128 reviews)</span>
                    </div>

                    {/* Price */}
                    <div className='flex items-baseline gap-2 md:gap-3 flex-wrap'>
                      <span className='text-xl md:text-2xl lg:text-4xl font-black text-red-600'>
                        {displayKESCurrency(data?.selling)}
                      </span>
                      {discount > 0 && (
                        <>
                          <span className='text-sm md:text-base lg:text-lg text-slate-400 line-through'>
                            {displayKESCurrency(data?.price)}
                          </span>
                          <span className='bg-emerald-100 text-emerald-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg text-[10px] md:text-xs lg:text-sm font-bold'>
                            Save {displayKESCurrency(data?.price - data?.selling)}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Short Description */}
                    <p className='text-slate-600 text-xs md:text-sm lg:text-base leading-relaxed'>
                      {data?.description?.substring(0, 150)}...
                    </p>

                    {/* Action Buttons */}
                    <div className='flex flex-col sm:flex-row gap-2 md:gap-3 pt-2 md:pt-4'>
                      <button 
                        onClick={(e) => handleBuyProduct(e, data?._id)}
                        className='flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 md:py-3.5 lg:py-4 rounded-lg md:rounded-xl shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm lg:text-base'
                      >
                        Buy Now
                      </button>
                      <button 
                        onClick={(e) => handleAddToCart(e, data?._id)}
                        className='flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 md:py-3.5 lg:py-4 rounded-lg md:rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm lg:text-base'
                      >
                        <FaShoppingCart className='text-xs md:text-sm' />
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className={`p-2.5 md:p-3.5 lg:p-4 rounded-lg md:rounded-xl border-2 transition-all active:scale-[0.98] ${
                          isWishlisted 
                            ? 'border-red-500 text-red-500 bg-red-50' 
                            : 'border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-500'
                        }`}
                      >
                        <FaHeart className={`${isWishlisted ? 'fill-current' : ''} text-sm md:text-base`} />
                      </button>
                    </div>

                    {/* Trust Badges */}
                    <div className='grid grid-cols-3 gap-1.5 md:gap-2 lg:gap-4 pt-4 md:pt-6 border-t border-slate-100'>
                      <div className='flex flex-col items-center text-center gap-0.5 md:gap-1 lg:gap-2 p-1.5 md:p-2 lg:p-3 rounded-lg bg-slate-50'>
                        <FaTruck className='text-slate-400 text-sm md:text-lg lg:text-xl' />
                        <span className='text-[9px] md:text-[10px] lg:text-xs font-medium text-slate-600'>Free Delivery</span>
                      </div>
                      <div className='flex flex-col items-center text-center gap-0.5 md:gap-1 lg:gap-2 p-1.5 md:p-2 lg:p-3 rounded-lg bg-slate-50'>
                        <FaShieldAlt className='text-slate-400 text-sm md:text-lg lg:text-xl' />
                        <span className='text-[9px] md:text-[10px] lg:text-xs font-medium text-slate-600'>Secure</span>
                      </div>
                      <div className='flex flex-col items-center text-center gap-0.5 md:gap-1 lg:gap-2 p-1.5 md:p-2 lg:p-3 rounded-lg bg-slate-50'>
                        <FaUndo className='text-slate-400 text-sm md:text-lg lg:text-xl' />
                        <span className='text-[9px] md:text-[10px] lg:text-xs font-medium text-slate-600'>30-Day Return</span>
                      </div>
                    </div>

                    {/* Share */}
                    <div className='flex items-center gap-2 md:gap-3 pt-2 md:pt-4'>
                      <span className='text-slate-500 text-xs md:text-sm'>Share:</span>
                      <button className='p-1.5 md:p-2 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-colors'>
                        <FaShare size={12} className='md:w-[14px] md:h-[14px]' />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Full Description Section */}
          {!loading && (
            <div className='mt-4 md:mt-8 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-3 md:p-4 lg:p-8'>
              <h3 className='text-base md:text-lg lg:text-xl font-bold text-slate-900 mb-3 md:mb-4'>Product Description</h3>
              <div className='prose prose-slate max-w-none text-slate-600 text-xs md:text-sm lg:text-base leading-relaxed'>
                {data?.description}
              </div>
            </div>
          )}

          {/* Recommended Products */}
          {data?.category && (
            <div className='mt-4 md:mt-8'>
              <CategroyWiseProductDisplay category={data?.category} heading="Recommended Products"/>
            </div>
          )}

          <VerticalCardProduct />
        </div>
      </div>
    </>
  )
}

export default ProductDetails