import { Link } from "react-router-dom";
import { GoPersonFill } from "react-icons/go";
import { LiaBookSolid } from "react-icons/lia";
import { BsPersonArmsUp } from "react-icons/bs";
import { MdContacts } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { useRef, useEffect, useState } from "react";

const UtilityButtons = () => {
  const buttons = [
    {
      name: "Donate",
      icon: <FaHeart className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
      path: "/donate",
      description: "Support our mission",
      isExternal: false,
    },
    {
      name: "Join Us",
      icon: <GoPersonFill className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
      path: "/volunteer#volunteer-form",
      description: "Join our community",
      isExternal: false,
    },
    {
      name: "Books Store",
      icon: <LiaBookSolid className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
      path: "https://eshop.chinmayamission.com/",
      description: "Explore our literature",
      isExternal: true,
    },
    {
      name: "Our Pledge",
      icon: <BsPersonArmsUp className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
      path: "/pledge",
      description: "Our commitment",
      isExternal: false,
    },
    {
      name: "Contact Us",
      icon: <MdContacts className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
      path: "/contact-us",
      description: "Get in touch",
      isExternal: false,
    },
  ];

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Scroll to leftmost on mount
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.scrollLeft = 0;
      updateArrows();
    }
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
    // eslint-disable-next-line
  }, []);

  // Update arrow visibility
  const updateArrows = () => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    setCanScrollLeft(scrollEl.scrollLeft > 0);
    setCanScrollRight(scrollEl.scrollLeft + scrollEl.clientWidth < scrollEl.scrollWidth - 1);
  };

  // Scroll by one button width
  const scrollByButton = (dir) => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    const button = scrollEl.querySelector('.utility-btn');
    const scrollAmount = button ? button.offsetWidth + 8 : 80; // 8px gap fallback
    scrollEl.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
    setTimeout(updateArrows, 350);
  };

  // Listen to scroll events
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    scrollEl.addEventListener('scroll', updateArrows);
    updateArrows();
    return () => scrollEl.removeEventListener('scroll', updateArrows);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 py-3 px-4 sm:py-6 md:py-4 lg:py-6 shadow-md dark:shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1)]">
      <div className="container mx-auto max-w-4xl relative flex items-center">
        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex flex-nowrap justify-center items-center gap-2 sm:gap-4 md:gap-6 lg:gap-10 overflow-x-auto scrollbar-hide w-full px-8"
          style={{ scrollBehavior: 'smooth' }}
        >
          {buttons.map((button, index) => (
            button.isExternal ? (
              <a
                href={button.path}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                className="utility-btn flex flex-col items-center justify-center group transition-transform hover:scale-105 relative w-24 sm:w-28 md:w-32 h-20 sm:h-24 md:h-28 px-0"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center 
                  bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-600 dark:to-gray-800 text-[#BC3612] dark:text-[#F47930] 
                  shadow-md transition-all duration-300 mx-auto">
                  {button.icon}
                </div>
                <span className="mt-1 text-xs sm:text-sm md:text-base lg:text-base font-medium text-gray-900 dark:text-gray-100 w-full block whitespace-normal break-words text-center min-h-[2.5em] leading-tight">
                  {button.name}
                </span>
                <span className="text-xs md:text-sm lg:text-sm text-gray-600 dark:text-gray-400 hidden md:block w-full block whitespace-normal break-words text-center min-h-[2.5em] leading-tight">
                  {button.description}
                </span>
              </a>
            ) : (
              <Link
                to={button.path}
                key={index}
                className="utility-btn flex flex-col items-center justify-center group transition-transform hover:scale-105 relative w-24 sm:w-28 md:w-32 h-20 sm:h-24 md:h-28 px-0"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center 
                  bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-600 dark:to-gray-800 text-[#BC3612] dark:text-[#F47930] 
                  shadow-md transition-all duration-300 mx-auto">
                  {button.icon}
                </div>
                <span className="mt-1 text-xs sm:text-sm md:text-base lg:text-base font-medium text-gray-900 dark:text-gray-100 w-full block whitespace-normal break-words text-center min-h-[2.5em] leading-tight">
                  {button.name}
                </span>
                <span className="text-xs md:text-sm lg:text-sm text-gray-600 dark:text-gray-400 hidden md:block w-full block whitespace-normal break-words text-center min-h-[2.5em] leading-tight">
                  {button.description}
                </span>
              </Link>
            )
          ))}
        </div>
        <style>
          {`
            @keyframes ripple {
              0% {
                transform: scale(0);
                opacity: 0.3;
              }
              100% {
                transform: scale(4);
                opacity: 0;
              }
            }
            .ripple {
              animation: ripple 600ms ease-out;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default UtilityButtons;