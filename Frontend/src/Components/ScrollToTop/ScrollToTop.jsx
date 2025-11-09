import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Automatically scroll to the top when the pathname changes
    window.scrollTo({
      top: 0,
      behavior: "smooth", // change to "auto" if you want instant scroll
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;