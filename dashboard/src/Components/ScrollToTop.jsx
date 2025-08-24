import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Scroll to top with a small delay to ensure DOM is ready
    const scrollToTop = () => {
      try {
        // Try multiple scroll methods for better compatibility
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
        
        // Fallback for older browsers
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // For any scrollable containers
        const scrollableElements = document.querySelectorAll('.scrollable, [data-scrollable="true"]');
        scrollableElements.forEach(element => {
          element.scrollTop = 0;
        });
      } catch {
        // Fallback to instant scroll if smooth scroll fails
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    // Use requestAnimationFrame for better performance
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(scrollToTop);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
