import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { FaStar, FaStarHalf, FaHeart, FaShare, FaTruck, FaShieldAlt,FaShoppingCart, FaUndo, FaCheck } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import displayKESCurrency from '@/helpers/displayCurrency';
import VerticalCardProduct from '@/components/VerticalCardProduct.jsx';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from "@/context/index.js";
import SEO from '@/components/Seo.jsx';

const ProductDetails = () => {
  const [data, setData] = useState([])
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState("")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { toast, backendUrl, fetchCountCart } = useContext(Context)
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
    fetchCountCart()
    toast.success("Added to cart!")
  }

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id)
    fetchCountCart()
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
      
      <div className='min-h-screen bg-slate-50 pb-6 md:pb-8'>
        {/* Breadcrumb Navigation */}
        <div className='bg-white border-b border-slate-200 sticky top-0 z-40'>
          <div className='container mx-auto px-2 md:px-4 py-2 md:py-2.5'>
            <div className='flex items-center gap-1 md:gap-2 text-xs md:text-sm'>
              <Link to="/" className='text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors text-xs md:text-sm'>
                <IoIosArrowBack className='md:hidden' size={14} />
                Home
              </Link>
              <span className='text-slate-300'>/</span>
              <span className='text-slate-500 capitalize hidden sm:inline text-xs md:text-sm'>{data?.category}</span>
              <span className='text-slate-300 hidden sm:inline'>/</span>
              <span className='text-slate-800 font-medium truncate max-w-[120px] sm:max-w-[180px] md:max-w-md text-xs md:text-sm'>
                {loading ? 'Loading...' : data?.productName}
              </span>
            </div>
          </div>
        </div>

        <div className='container mx-auto px-2 md:px-4 py-2 md:py-4 lg:py-6'>
          
          {/* Main Product Section */}
          <div className='bg-white rounded-lg md:rounded-xl shadow-sm border border-slate-100 overflow-hidden'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-0'>
              
              {/* Images Section - Compact */}
              <div className='p-2 md:p-3 lg:p-4 bg-slate-50/50'>
                {loading ? (
                  <div className='space-y-2 md:space-y-3'>
                    <div className='aspect-square bg-slate-200 rounded-lg md:rounded-xl animate-pulse max-h-[300px] md:max-h-[400px]' />
                    <div className='flex gap-1.5 md:gap-2 justify-center'>
                      {[1,2,3,4].map((_, i) => (
                        <div key={i} className='w-10 h-10 md:w-12 md:h-12 bg-slate-200 rounded-md animate-pulse' />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className='space-y-2 md:space-y-3'>
                    {/* Main Image - Compact */}
                    <div className='relative aspect-square bg-white rounded-lg md:rounded-xl border border-slate-200 overflow-hidden group max-h-[280px] md:max-h-[350px] lg:max-h-[400px]'>
                      <img 
                        src={activeImage} 
                        alt={data?.productName}
                        className='w-full h-full object-contain p-2 md:p-4 mix-blend-multiply cursor-crosshair'
                        onMouseMove={handleZoomImage}
                        onMouseLeave={handleLeaveImageZoom}
                      />
                      
                      {/* Zoom Indicator (Desktop) */}
                      <div className='absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-medium text-slate-600 shadow-sm border border-slate-200 hidden lg:block'>
                        Hover to zoom
                      </div>

                      {/* Discount Badge */}
                      {discount > 0 && (
                        <div className='absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-full font-bold text-[10px] md:text-xs shadow-md'>
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
                          <button className='absolute top-4 right-4 text-white text-xs bg-black/50 px-3 py-1.5 rounded-full'>
                            Close
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Gallery - Compact */}
                    <div className='flex gap-1.5 md:gap-2 overflow-x-auto pb-1 scrollbar-hide justify-center lg:justify-start'>
                      {data?.productImage?.map((imgURL, index) => (
                        <button
                          key={imgURL}
                          onClick={() => handleMouseEnterProduct(imgURL, index)}
                          className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-md border-2 overflow-hidden transition-all ${
                            selectedImageIndex === index 
                              ? 'border-red-500 ring-1 ring-red-200' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img 
                            src={imgURL} 
                            alt={`View ${index + 1}`}
                            className='w-full h-full object-contain p-0.5 mix-blend-multiply'
                          />
                        </button>
                      ))}
                    </div>

                    {/* Desktop Zoom Preview */}
                    {zoomImage && (
                      <div className='hidden lg:block fixed left-1/2 top-1/2 -translate-y-1/2 ml-2 w-[300px] h-[300px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-30'>
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

              {/* Details Section - Compact */}
              <div className='p-2.5 md:p-3 lg:p-5 flex flex-col'>
                {loading ? (
                  <div className='space-y-2 md:space-y-3 animate-pulse'>
                    <div className='h-3 md:h-4 bg-slate-200 rounded w-1/4' />
                    <div className='h-5 md:h-6 bg-slate-200 rounded w-3/4' />
                    <div className='h-3 md:h-4 bg-slate-200 rounded w-1/2' />
                    <div className='flex gap-1'>
                      {[1,2,3,4,5].map((_, i) => (
                        <div key={i} className='w-3.5 h-3.5 md:w-4 md:h-4 bg-slate-200 rounded' />
                      ))}
                    </div>
                    <div className='h-8 md:h-10 bg-slate-200 rounded w-1/3' />
                    <div className='flex gap-2'>
                      <div className='h-9 md:h-10 bg-slate-200 rounded flex-1' />
                      <div className='h-9 md:h-10 bg-slate-200 rounded flex-1' />
                    </div>
                  </div>
                ) : (
                  <div className='space-y-2 md:space-y-3 lg:space-y-4'>
                    {/* Brand & Category */}
                    <div className='flex items-center gap-1.5 md:gap-2 flex-wrap'>
                      <span className='bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold'>
                        {data?.brandName}
                      </span>
                      <span className='bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] md:text-xs capitalize'>
                        {data?.category}
                      </span>
                      <span className='flex items-center gap-0.5 text-emerald-600 text-[10px] md:text-xs font-medium'>
                        <FaCheck size={10} /> In Stock
                      </span>
                    </div>

                    {/* Title - Smaller */}
                    <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-900 leading-tight'>
                      {data?.productName}
                    </h1>

                    {/* Rating - Compact */}
                    <div className='flex items-center gap-1.5 md:gap-2'>
                      <div className='flex items-center gap-0.5'>
                        {[...Array(4)].map((_, i) => (
                          <FaStar key={i} className='text-amber-400 text-xs md:text-sm' />
                        ))}
                        <FaStarHalf className='text-amber-400 text-xs md:text-sm' />
                      </div>
                      <span className='text-slate-500 text-[10px] md:text-xs'>4.5 (128 reviews)</span>
                    </div>

                    {/* Price - Compact */}
                    <div className='flex items-baseline gap-2 md:gap-3 flex-wrap'>
                      <span className='text-lg md:text-xl lg:text-2xl font-black text-red-600'>
                        {displayKESCurrency(data?.selling)}
                      </span>
                      {discount > 0 && (
                        <>
                          <span className='text-xs md:text-sm text-slate-400 line-through'>
                            {displayKESCurrency(data?.price)}
                          </span>
                          <span className='bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] md:text-xs font-bold'>
                            Save {displayKESCurrency(data?.price - data?.selling)}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Short Description - Compact */}
                    <p className='text-slate-600 text-xs md:text-sm leading-relaxed line-clamp-2'>
                      {data?.description?.substring(0, 100)}...
                    </p>

                    {/* Action Buttons - Compact */}
                    <div className='flex flex-col sm:flex-row gap-2 pt-1 md:pt-2'>
                      <button 
                        onClick={(e) => handleBuyProduct(e, data?._id)}
                        className='flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 md:py-2.5 rounded-lg shadow-md shadow-red-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 text-xs md:text-sm'
                      >
                        Buy Now
                      </button>
                      <button 
                        onClick={(e) => handleAddToCart(e, data?._id)}
                        className='flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 md:py-2.5 rounded-lg shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 text-xs md:text-sm'
                      >
                        <FaShoppingCart size={12} />
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className={`p-2 md:p-2.5 rounded-lg border-2 transition-all active:scale-[0.98] ${
                          isWishlisted 
                            ? 'border-red-500 text-red-500 bg-red-50' 
                            : 'border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-500'
                        }`}
                      >
                        <FaHeart size={16} className={isWishlisted ? 'fill-current' : ''} />
                      </button>
                    </div>

                    {/* Trust Badges - Compact */}
                    <div className='grid grid-cols-3 gap-1.5 md:gap-2 pt-3 md:pt-4 border-t border-slate-100'>
                      <div className='flex flex-col items-center text-center gap-0.5 p-1.5 md:p-2 rounded-md bg-slate-50'>
                        <FaTruck className='text-slate-400 text-xs md:text-base' />
                        <span className='text-[9px] md:text-[10px] font-medium text-slate-600'>Free Delivery</span>
                      </div>
                      <div className='flex flex-col items-center text-center gap-0.5 p-1.5 md:p-2 rounded-md bg-slate-50'>
                        <FaShieldAlt className='text-slate-400 text-xs md:text-base' />
                        <span className='text-[9px] md:text-[10px] font-medium text-slate-600'>Secure</span>
                      </div>
                      <div className='flex flex-col items-center text-center gap-0.5 p-1.5 md:p-2 rounded-md bg-slate-50'>
                        <FaUndo className='text-slate-400 text-xs md:text-base' />
                        <span className='text-[9px] md:text-[10px] font-medium text-slate-600'>30-Day Return</span>
                      </div>
                    </div>

                    {/* Share - Compact */}
                    <div className='flex items-center gap-2 pt-2 md:pt-3'>
                      <span className='text-slate-500 text-xs md:text-sm'>Share:</span>
                      <button className='p-1.5 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-colors'>
                        <FaShare size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Full Description Section - Compact */}
          {!loading && (
            <div className='mt-3 md:mt-5 bg-white rounded-lg md:rounded-xl shadow-sm border border-slate-100 p-2.5 md:p-4 lg:p-5'>
              <h3 className='text-sm md:text-base lg:text-lg font-bold text-slate-900 mb-2 md:mb-3'>Product Description</h3>
              <div className='prose prose-slate max-w-none text-slate-600 text-xs md:text-sm leading-relaxed'>
                {data?.description}
              </div>
            </div>
          )}

          {/* Recommended Products - Compact */}
          {data?.category && (
            <div className='mt-3 md:mt-5'>
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