import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // 🔥 detect back/forward

  useEffect(() => {
    if (navigationType === "POP") {
      // 🔙 Back/forward → let browser handle OR go top
      window.scrollTo(0, 0); // 🔥 Amazon style (always top)
    } else {
      // 🔗 New navigation (Link click)
      window.scrollTo(0, 0); // ⚡ instant
    }
  }, [location.pathname, navigationType]);

  return null;
};

export default ScrollToTop;