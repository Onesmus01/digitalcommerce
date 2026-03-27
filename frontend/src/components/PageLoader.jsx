// PageLoader.jsx
import React, { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: true, trickleSpeed: 200, minimum: 0.1 });

const PageLoader = ({ loading }) => {
  useEffect(() => {
    if (loading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [loading]);

  return null; // NProgress handles DOM, we don't need a spinner here
};

export default PageLoader;