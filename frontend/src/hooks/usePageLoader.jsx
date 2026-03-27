// src/hooks/usePageLoader.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";

const usePageLoader = () => {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();

    // Stop progress after a min duration or route change
    const timer = setTimeout(() => {
      NProgress.done();
    }, 400); // 0.4s minimum duration to make it visible

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location.pathname]);
};

export default usePageLoader;