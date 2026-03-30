import React, { useEffect, useRef, useState, useCallback } from 'react'
import image1 from '/images/banner/img1.webp'
import image2 from '/images/banner/img2.webp'
import image3 from '/images/banner/img3.jpg'
import image4 from '/images/banner/img4.jpg'
import image5 from '/images/banner/img5.webp'

import image1Mobile from '/images/banner/img1_mobile.jpg'
import image2Mobile from '/images/banner/img2_mobile.webp'
import image3Mobile from '/images/banner/img3_mobile.jpg'
import image4Mobile from '/images/banner/img4_mobile.jpg'
import image5Mobile from '/images/banner/img5_mobile.png'

import { FaAngleRight, FaAngleLeft } from 'react-icons/fa'

const SLIDE_DURATION = 8000

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const desktopImages = [image1, image2, image3, image4, image5]
  const mobileImages = [image1Mobile, image2Mobile, image3Mobile, image4Mobile, image5Mobile]
  const images = isMobile ? mobileImages : desktopImages

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768)
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
      setProgress(0)
    }, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [isPaused, images.length])

  useEffect(() => {
    if (isPaused) return
    const step = 100 / (SLIDE_DURATION / 16)
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + step))
    }, 16)
    return () => clearInterval(timer)
  }, [isPaused, currentImage])

  const nextImage = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % images.length)
    setProgress(0)
  }, [images.length])

  const prevImage = useCallback(() => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    setProgress(0)
  }, [images.length])

  const handleTouchStart = (e) => {
    setIsPaused(true)
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    setIsPaused(false)
    const diff = touchStartX.current - touchEndX.current
    if (diff > 50) nextImage()
    if (diff < -50) prevImage()
  }

  return (
    <div className="container mx-auto px-2 sm:px-3 lg:px-4">
      <div
        className="group relative w-full overflow-hidden bg-neutral-100 rounded-lg sm:rounded-xl lg:rounded-2xl
          h-40           /* Mobile: 160px - thinner */
          sm:h-48        /* Small devices: 192px */
          md:h-56        /* Medium devices: 224px - thinner */
          lg:h-[450px]   /* Large devices: 450px */
          xl:h-[500px]   /* Extra large: 500px */
        "
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides */}
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {images.map((img, index) => (
            <div key={index} className="h-full w-full min-w-full">
              <img
                src={img}
                alt=""
                className="h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* Arrows - Smaller on mobile */}
        <button
          onClick={prevImage}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 text-white/70 transition-all duration-300 hover:text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
        >
          <FaAngleLeft className="text-xl sm:text-2xl lg:text-3xl drop-shadow-lg" />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 text-blue-500 transition-all duration-300 hover:text-white opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
        >
          <FaAngleRight className="text-xl sm:text-2xl lg:text-3xl drop-shadow-lg" />
        </button>

        {/* Progress Line - Thinner on mobile */}
        <div className="absolute bottom-0 left-0 h-0.5 sm:h-1 w-full bg-black/10">
          <div
            className="h-full bg-blue-900 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dots - Smaller on mobile */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 sm:gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentImage(index)
                setProgress(0)
              }}
              className={`h-1 sm:h-1.5 transition-all duration-300 rounded-full ${
                currentImage === index 
                  ? 'w-4 sm:w-6 bg-white' 
                  : 'w-1 sm:w-1.5 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BannerProduct