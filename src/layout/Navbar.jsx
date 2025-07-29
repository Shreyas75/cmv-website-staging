import { useState, useMemo, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToTop } from '../utils/scrollUtils';
import { useMediaQuery, useScrollDirection } from '../hooks/usePerformance';
import PropTypes from 'prop-types';

export const Navbar = ({ toggleDarkMode, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  // const isMobile = useMediaQuery('(max-width: 768px)');
  const isTabletOrMobile = useMediaQuery('(max-width: 1024px)');
  const scrollDirection = useScrollDirection(10);
  
  // Only enable auto-hide on tablets and phones, always show on desktop
  const isNavbarVisible = isTabletOrMobile ? scrollDirection : true;

  const toggleMenu = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  // Close menu after clicking a link (auto-collapse)
  const handleLinkClick = useCallback(() => {
    setIsOpen(false);
    scrollToTop();
  }, []);

  const handleNavLinkClick = () => {
    scrollToTop();
  };

  // Memoize navItems to prevent re-creation on every render
  const navItems = useMemo(
    () => [
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about-us" },
      { name: "Activities", path: "/activities" },
      { name: "Events", path: "/events" },
      { name: "Volunteer / Join Us", path: "/volunteer" },
      { name: "Contact Us", path: "/contact-us" },
    ],
    []
  );

  return (
    <>
      <motion.div 
        className="sticky top-0 z-50 h-auto px-4 lg:px-5 flex justify-between items-center shadow-lg bg-white dark:bg-gray-800"
        initial={{ y: 0 }}
        animate={{ 
          y: isNavbarVisible ? 0 : "-100%"
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <div className="pt-1">
            <Link to="/" onClick={handleNavLinkClick} aria-label="Chinmaya Mission Vasai Home">
              <img
                src={darkMode ? "/images/lamp1.png" : "/images/lamp.png"}
                alt="Chinmaya Mission Vasai Logo"
                className="h-8 sm:h-12 md:h-16 lg:h-20 xl:h-24 w-auto"
              />
            </Link>
          </div>
          <div>
            <Link to="/" onClick={handleNavLinkClick}>
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#BC3612] dark:text-[#F47930] font-bold">
                CHINMAYA MISSION VASAI
              </h1>
            </Link>
            <Link to="/" onClick={handleNavLinkClick}>
              <p className="text-xs sm:text-sm md:text-base font-bold dark:text-white">
                Maximum Happiness To Maximum People
              </p>
              <p className="text-xs sm:text-sm md:text-base font-bold dark:text-white">
                For Maximum Time
              </p>
            </Link>
          </div>
        </div>

        {/* Hamburger Icon and Dark Mode Toggle for Mobile */}
        <div className="custom1250:hidden flex flex-col items-center space-y-2">
          <button
            className="text-[#BC3612] dark:text-[#F47930] focus:outline-none"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[#BC3612] dark:text-[#F47930] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930]"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="hidden custom1250:flex flex-wrap items-center">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm md:text-base lg:text-lg font-bold transition-colors ${
                      isActive
                        ? "text-[#BC3612] dark:text-[#F47930] underline underline-offset-4"
                        : "text-gray-800 dark:text-white hover:text-[#BC3612] dark:hover:text-[#F47930]"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Dark Mode Toggle Button for Larger Screens */}
        <div className="hidden custom1250:flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-[#BC3612] dark:text-[#F47930] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930]"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>
        </div>
      </motion.div>

      {/* Dropdown Menu for Mobile with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="custom1250:hidden px-4 pt-[80px] pb-4 bg-white dark:bg-gray-900 shadow-md fixed z-40 w-full top-0 left-0 transition-all duration-300"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `block w-full text-left px-3 py-2 text-sm md:text-base font-bold transition-colors ${
                        isActive
                          ? "text-[#BC3612] dark:text-[#F47930] underline underline-offset-4"
                        : "text-gray-800 dark:text-white hover:text-[#BC3612] dark:hover:text-[#F47930]"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

Navbar.propTypes = {
  toggleDarkMode: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};