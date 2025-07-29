import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { FaChevronRight } from "react-icons/fa";
import UpcomingEventsModal from "../modals/UpcomingEventsModal";
import PropTypes from "prop-types";
import { useMediaQuery, useThrottle } from "../hooks/usePerformance";
import OptimizedImage from "../components/OptimizedImage";

export const UpcomingEvents = ({ upcomingEvents }) => {
  const [selectedUpcomingEvent, setSelectedUpcomingEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Use media queries for better performance
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isLaptop = useMediaQuery('(min-width: 1024px)');
  const isLandscape = useMediaQuery('(orientation: landscape)');
  
  const carouselRef = useRef(null);
  const autoplayRef = useRef(null);

  // Throttled resize handler
  const throttledResize = useThrottle(useCallback(() => {
    if (carouselRef.current) {
      setContainerWidth(carouselRef.current.offsetWidth);
    }
  }, []), 150);

  // Memoize event handlers for better performance
  const handleEventClick = useCallback((event) => {
    setSelectedUpcomingEvent(event);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedUpcomingEvent(null);
    setIsModalOpen(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if ((isLaptop && upcomingEvents.length > 3) || !isLaptop) {
      clearInterval(autoplayRef.current);
    }
  }, [isLaptop, upcomingEvents.length]);
  
  const handleMouseLeave = useCallback(() => {
    if (isLaptop && upcomingEvents.length > 3) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1;
          return nextIndex >= upcomingEvents.length ? 0 : nextIndex;
        });
      }, 3000);
    } else if (!isLaptop) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % upcomingEvents.length);
      }, isTablet ? 4000 : 3000);
    }
  }, [isLaptop, isTablet, upcomingEvents.length]);

  // Update container width
  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setContainerWidth(carouselRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", throttledResize);
    return () => window.removeEventListener("resize", throttledResize);
  }, [throttledResize]);

  // Autoplay effect with endless loop logic
  useEffect(() => {
    if (isLaptop && upcomingEvents.length > 3) {
      // Laptop grid carousel with endless loop
      const startAutoplay = () => {
        autoplayRef.current = setInterval(() => {
          setCurrentIndex((prev) => {
            const nextIndex = prev + 1;
            // Reset to 0 when we reach the end of original events for seamless loop
            return nextIndex >= upcomingEvents.length ? 0 : nextIndex;
          });
        }, 3000);
      };
      startAutoplay();
      return () => clearInterval(autoplayRef.current);
    } else if (!isLaptop) {
      // Mobile/tablet carousel
      const startAutoplay = () => {
        autoplayRef.current = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % upcomingEvents.length);
        }, isTablet ? 4000 : 3000); // Slightly slower for tablet
      };
      startAutoplay();
      return () => clearInterval(autoplayRef.current);
    }
  }, [upcomingEvents.length, isLaptop, isTablet]);

  // Memoize constants for better performance
  const SPRING_OPTIONS = useMemo(() => ({ 
    type: "spring", 
    stiffness: 200, 
    damping: 20 
  }), []);

  return (
    <div className="bg-white dark:bg-gray-900 py-2 sm:py-8 md:py-6">
      {/* Laptop/Desktop: Grid Layout or Grid Carousel */}
      {isLaptop ? (
        <div className="max-w-7xl mx-auto px-4">
          {upcomingEvents.length <= 3 ? (
            /* Static Grid for 3 or fewer events */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="flex flex-col items-center cursor-pointer bg-white dark:bg-gray-900 shadow-xl rounded-xl p-6 hover:scale-105 transition-transform duration-200 max-w-sm"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="relative w-full rounded-lg overflow-hidden mb-6 group">
                    <OptimizedImage
                      src={event.image}
                      alt={event.name}
                      className="w-full h-80 bg-white dark:bg-gray-900"
                      objectFit="contain"
                      loading="lazy"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 group-hover:bg-orange-500 transition-opacity duration-300" />
                    {/* Learn More Button */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all">
                        Learn More
                        <FaChevronRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                    {event.name}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            /* Grid Carousel for more than 3 events - Shows exactly 3 at a time */
            <div className="relative overflow-hidden max-w-6xl mx-auto">
              <div className="flex gap-8 w-full">
                <motion.div
                  className="flex gap-8"
                  animate={{ 
                    x: `${-(currentIndex * (100/3))}%`
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ 
                    width: `${upcomingEvents.length * (100/3)}%`
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {upcomingEvents.map((event, index) => (
                    <div
                      key={`${event._id}-${index}`}
                      className="flex flex-col items-center cursor-pointer bg-white dark:bg-gray-900 shadow-xl rounded-xl p-6 hover:scale-105 transition-transform duration-200 flex-shrink-0"
                      style={{ width: `calc(100% / 3 - 21.33px)` }}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="relative w-full rounded-lg overflow-hidden mb-6 group">
                        <img
                          src={event.image}
                          alt={event.name}
                          className="w-full h-80 object-contain bg-white dark:bg-gray-900"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 group-hover:bg-orange-500 transition-opacity duration-300" />
                        {/* Learn More Button */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all">
                            Learn More
                            <FaChevronRight className="ml-2 w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                        {event.name}
                      </h3>
                    </div>
                  ))}
                </motion.div>
              </div>
              
              {/* Carousel Indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: upcomingEvents.length }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? 'bg-orange-500 dark:bg-orange-400'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : isTablet ? (
        /* Tablet: Clean 2-Image Carousel - Just like laptop but for 2 images */
        <div className="max-w-5xl mx-auto px-4">
          {upcomingEvents.length <= 2 ? (
            /* Static 2-Column Grid for 1-2 events */
            <div className="grid grid-cols-2 gap-8 justify-items-center">
              {upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="flex flex-col items-center cursor-pointer bg-white dark:bg-gray-900 shadow-xl rounded-xl p-5 hover:scale-105 transition-transform duration-200 max-w-sm"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="relative w-full rounded-lg overflow-hidden mb-5 group">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-72 object-contain bg-white dark:bg-gray-900"
                    />
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 group-hover:bg-orange-500 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all">
                        Learn More
                        <FaChevronRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                    {event.name}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            /* Tablet Carousel - Shows exactly 2 images at a time */
            <div className="relative overflow-hidden max-w-5xl mx-auto">
              <div className="flex gap-8 w-full">
                <motion.div
                  className="flex gap-8"
                  animate={{ 
                    x: `${-(currentIndex * 50)}%`
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ 
                    width: `${upcomingEvents.length * 50}%`
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {upcomingEvents.map((event, index) => (
                    <div
                      key={`${event._id}-${index}`}
                      className="flex flex-col items-center cursor-pointer bg-white dark:bg-gray-900 shadow-xl rounded-xl p-5 hover:scale-105 transition-transform duration-200 flex-shrink-0"
                      style={{ width: `calc(50% - 16px)` }}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="relative w-full rounded-lg overflow-hidden mb-5 group">
                        <img
                          src={event.image}
                          alt={event.name}
                          className="w-full h-72 object-contain bg-white dark:bg-gray-900"
                        />
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 group-hover:bg-orange-500 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all">
                            Learn More
                            <FaChevronRight className="ml-2 w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                        {event.name}
                      </h3>
                    </div>
                  ))}
                </motion.div>
              </div>
              
              {/* Carousel Indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: upcomingEvents.length }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? 'bg-orange-500 dark:bg-orange-400'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Mobile/Tablet: Carousel Layout */
        <div
          ref={carouselRef}
          className="relative w-full max-w-6xl mx-auto overflow-hidden bg-white dark:bg-gray-900"
        >
          <motion.div
            className="flex w-full bg-white dark:bg-gray-900"
            animate={{ 
              x: isMobile && isLandscape 
                ? -(currentIndex * (containerWidth / 2)) 
                : -(currentIndex * containerWidth) 
            }}
            transition={SPRING_OPTIONS}
            style={{ 
              width: isMobile && isLandscape 
                ? `${upcomingEvents.length * (containerWidth / 2)}px` 
                : `${upcomingEvents.length * containerWidth}px` 
            }}
          >
            {upcomingEvents.map((event) => (
              <motion.div
                key={event._id}
                className="relative shrink-0 flex flex-col items-center cursor-pointer py-1 px-0 sm:p-6 bg-white dark:bg-gray-900 shadow-xl rounded-xl"
                style={{ 
                  width: isMobile && isLandscape 
                    ? `${containerWidth / 2}px` 
                    : `${containerWidth}px` 
                }}
                onClick={() => handleEventClick(event)}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <div
                  className="relative w-full rounded-lg overflow-hidden mb-1 sm:mb-4 group bg-white dark:bg-gray-900"
                  onMouseEnter={!isMobile ? handleMouseEnter : undefined}
                  onMouseLeave={!isMobile ? handleMouseLeave : undefined}
                >
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-88 sm:h-72 md:h-80 object-contain bg-white dark:bg-gray-900"
                  />
                  {/* Hover Overlay (Tablet only) */}
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 group-hover:bg-orange-500 transition-opacity duration-300 hidden sm:block" />
                  {/* Learn More Button */}
                  <motion.div
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 sm:group-hover:-translate-y-2 transition-transform duration-300 sm:opacity-0 sm:group-hover:opacity-100 opacity-90"
                    initial={{ opacity: isMobile ? 0.9 : 0, translateY: 0 }}
                    whileHover={{ translateY: -8, opacity: 1 }}
                    animate={{ opacity: isMobile ? 0.9 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm sm:text-base font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all">
                      Learn More
                      <FaChevronRight className="ml-2 w-4 h-4" />
                    </button>
                  </motion.div>
                </div>
                <h3 className="text-sm sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-center">
                  {event.name}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      <UpcomingEventsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedUpcomingEvent}
      />
    </div>
  );
};

UpcomingEvents.propTypes = {
  upcomingEvents: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};