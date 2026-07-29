import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // ✅ প্রতিটি route পরিবর্তনে স্ক্রল টপে নিয়ে যান
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;