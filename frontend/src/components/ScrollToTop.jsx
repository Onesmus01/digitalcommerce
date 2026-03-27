import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // 🔥 Disable browser auto scroll restore (IMPORTANT)
  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    // 🔥 Force scroll to top AFTER navigation completes
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default ScrollToTop;