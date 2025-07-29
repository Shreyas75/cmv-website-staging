import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { scrollToTop } from "../scrollUtils";

const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

export default function Carousel({ items, autoplay = true, autoplayDelay = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  // Update container width and mobile status dynamically
  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setContainerWidth(carouselRef.current.offsetWidth);
      }
      setIsMobile(window.innerWidth < 768);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Autoplay effect
  useEffect(() => {
    if (autoplay) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay, items.length]);

  const handleCarouselClick = () => {
    // Navigate to events page and scroll to top
    navigate("/events");
    // Small delay to allow navigation to complete
    setTimeout(() => {
      scrollToTop();
    }, 100);
  };

  return (
    <div ref={carouselRef} className="relative w-full overflow-hidden">
      <motion.div
        className="flex w-full"
        animate={{ x: -(currentIndex * containerWidth) }}
        transition={SPRING_OPTIONS}
        style={{ width: `${items.length * containerWidth}px` }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="relative shrink-0 text-white flex flex-col cursor-pointer group"
            onClick={handleCarouselClick}
            style={{
              width: `${containerWidth}px`,
              height: isMobile ? "50vh" : "80vh",
            }}
            whileHover={{ scale: 1.01 }}
          >
            {/* Blurred Background Layer */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${item.image})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                filter: "blur(2px)",
              }}
            >
              {/* Semi-transparent white overlay */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.5)", // White with 50% opacity for premium look
                }}
              />
            </div>

            {/* Main Image Layer */}
            <div
              className="relative z-10 flex-1"
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: isMobile ? "contain" : "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />

            {/* Description Container (Redesigned) */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/80 backdrop-blur-md transition-all duration-300"
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1 text-shadow">
                {item.title}
              </h3>
              <p className="text-base sm:text-lg text-white text-shadow">
                {item.description}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      <style>
        {`
          .text-shadow {
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          }
        `}
      </style>
    </div>
  );
}