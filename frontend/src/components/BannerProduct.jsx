import React, { useEffect, useRef, useState } from 'react'
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

const SLIDE_DURATION = 15000

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const desktopImages = [image1, image2, image3, image4, image5]
  const mobileImages = [
    image1Mobile,
    image2Mobile,
    image3Mobile,
    image4Mobile,
    image5Mobile,
  ]

  const images = isMobile ? mobileImages : desktopImages

  /* SCREEN SIZE */
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768)
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  /* AUTO SLIDE — ALL SCREENS */
  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
      setProgress(0)
    }, SLIDE_DURATION)

    return () => clearInterval(timer)
  }, [isPaused, images.length])

  /* PROGRESS BAR */
  useEffect(() => {
    if (isPaused) return

    const step = 100 / (SLIDE_DURATION / 100)
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + step))
    }, 100)

    return () => clearInterval(timer)
  }, [isPaused, currentImage])

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
    setProgress(0)
  }

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    )
    setProgress(0)
  }

  /* TOUCH EVENTS */
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
    <div className="container px-4 mx-auto rounded">
      <div
        className="relative h-72 w-full overflow-hidden bg-slate-200"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* SLIDER */}
        <div
          className="flex h-full transition-transform duration-[2000ms] ease-in-out"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {images.map((img, index) => (
            <div key={index} className="h-72 w-full min-w-full">
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* ARROWS */}
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-3 -translate-y-1/2 bg-white shadow-md rounded-full p-2 text-2xl"
        >
          <FaAngleLeft />
        </button>

        <button
          onClick={nextImage}
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-white shadow-md rounded-full p-2 text-2xl"
        >
          <FaAngleRight />
        </button>

        {/* PROGRESS BAR */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/10">
          <div
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default BannerProduct
