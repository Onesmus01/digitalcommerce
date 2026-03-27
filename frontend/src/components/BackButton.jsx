import React, { useEffect, useState } from "react";
import { useNavigate, useNavigationType } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  const [canGoBack, setCanGoBack] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);

    // animation trigger
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 50);

    return () => clearTimeout(timer);
  }, [navigationType]);
  useEffect(() => {
  let startX = 0;
  let startY = 0;

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;

    const diffX = endX - startX;
    const diffY = Math.abs(endY - startY);

    // ✅ Conditions for swipe-back
    const isSwipeRight = diffX > 80;      // enough horizontal movement
    const isFromEdge = startX < 40;       // must start from left edge
    const isHorizontal = diffY < 50;      // avoid vertical scroll conflict

    if (isSwipeRight && isFromEdge && isHorizontal) {
      navigate(-1);
    }
  };

  window.addEventListener("touchstart", handleTouchStart);
  window.addEventListener("touchend", handleTouchEnd);

  return () => {
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchend", handleTouchEnd);
  };
}, [navigate]);

  if (!canGoBack) return null;

  return (
    <>
      {/* 🔹 MOBILE */}
      <button
        onClick={() => navigate(-1)}
        className={`
          fixed bottom-4 left-4 
          sm:hidden
          flex items-center justify-center
          w-12 h-12
          bg-gray-900/90 backdrop-blur-lg
          text-white 
          rounded-full 
          shadow-xl
          hover:scale-110 active:scale-95
          transition-all duration-300
          z-50
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
      >
        <ArrowLeft size={20} />
      </button>

      {/* 🔹 DESKTOP */}
      <button
        onClick={() => navigate(-1)}
        className={`
          hidden sm:flex
          fixed top-20 left-6
          items-center gap-2
          bg-white/80 backdrop-blur-lg
          text-gray-800
          px-4 py-2 rounded-xl
          shadow-md hover:shadow-xl
          hover:-translate-y-1
          transition-all duration-300
          z-40
          ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}
        `}
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </button>
    </>
  );
};

export default BackButton;