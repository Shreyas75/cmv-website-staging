import { useState, useEffect, useCallback, useRef } from 'react';

// Custom hook for debouncing values
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook for throttling functions
export const useThrottle = (callback, delay) => {
  const lastRan = useRef(Date.now());

  return useCallback((...args) => {
    if (Date.now() - lastRan.current >= delay) {
      callback(...args);
      lastRan.current = Date.now();
    }
  }, [callback, delay]);
};

// Custom hook for intersection observer
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting) {
        setHasIntersected(true);
      }
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { ref, isIntersecting, hasIntersected };
};

// Custom hook for local storage with SSR support
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

// Custom hook for media queries
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

// Custom hook for preloading images
export const useImagePreloader = (imageUrls) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  useEffect(() => {
    if (!imageUrls.length) return;

    const loadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
        img.src = url;
      });
    };

    const loadAllImages = async () => {
      const promises = imageUrls.map(url => 
        loadImage(url).then(
          (loadedUrl) => {
            setLoadedImages(prev => new Set([...prev, loadedUrl]));
            return loadedUrl;
          },
          (failedUrl) => {
            console.warn(`Failed to preload image: ${failedUrl}`);
            return null;
          }
        )
      );

      await Promise.allSettled(promises);
      setAllImagesLoaded(true);
    };

    loadAllImages();
  }, [imageUrls]);

  return { loadedImages, allImagesLoaded };
};

// Hook for navbar visibility based on scroll direction
export const useScrollDirection = (threshold = 10) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const updateScrollDirection = useCallback(() => {
    const scrollY = window.scrollY;
    
    // Always show navbar at the very top
    if (scrollY < threshold) {
      setIsVisible(true);
      setLastScrollY(scrollY);
      return;
    }

    // Show navbar when scrolling up, hide when scrolling down
    if (Math.abs(scrollY - lastScrollY) > threshold) {
      setIsVisible(scrollY < lastScrollY);
      setLastScrollY(scrollY);
    }
  }, [lastScrollY, threshold]);

  const throttledUpdateScrollDirection = useThrottle(updateScrollDirection, 100);

  useEffect(() => {
    window.addEventListener('scroll', throttledUpdateScrollDirection);
    
    return () => {
      window.removeEventListener('scroll', throttledUpdateScrollDirection);
    };
  }, [throttledUpdateScrollDirection]);

  return isVisible;
};
