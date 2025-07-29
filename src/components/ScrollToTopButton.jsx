import { useState, useEffect, useCallback } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { scrollToTop } from '../utils/scrollUtils';
import { useThrottle } from '../hooks/usePerformance';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down 300px
  const toggleVisibility = useCallback(() => {
    setIsVisible(window.pageYOffset > 300);
  }, []);

  const throttledToggleVisibility = useThrottle(toggleVisibility, 100);

  useEffect(() => {
    window.addEventListener('scroll', throttledToggleVisibility);
    return () => {
      window.removeEventListener('scroll', throttledToggleVisibility);
    };
  }, [throttledToggleVisibility]);

  const handleScrollToTop = useCallback(() => {
    scrollToTop();
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isVisible && (
        <button
          onClick={handleScrollToTop}
          className="bg-[#BC3612] dark:bg-[#F47930] hover:bg-[#ff725e] dark:hover:bg-[#ff725e] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930]"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
