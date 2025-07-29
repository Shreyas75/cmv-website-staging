import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useCallback } from 'react';
import { scrollToTop as utilScrollToTop } from '../utils/scrollUtils';

const Footer = () => {
  // Function to scroll to top with smooth behavior
  const scrollToTop = useCallback(() => {
    utilScrollToTop();
  }, []);

  return (
    <footer className="bg-[#ffe4d6] dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-8 sm:py-12 shadow-inner">
      <div className="container mx-auto px-4">
        {/* Top Section: Mission Statement */}
        <div className="text-center mb-8">
          <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
            Chinmaya Mission Vasai
          </p>
        </div>

        {/* Middle Section: Quick Links, Contact, Newsletter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about-us" },
                { name: "Events", path: "/events" },
                { name: "Contact Us", path: "/contact-us" },
                { name: "Volunteer", path: "/volunteer" },
                { name: "Our Pledge", path: "/pledge" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop} // Scroll to top on click
                    className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-[#BC3612] dark:hover:text-[#F47930] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              Sai Tower, Ambadi Rd, Vasai West,<br />
              Maharashtra 401202, India
            </p>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-2">
              Email: <a href="mailto:vasai@chinmayamission.com" className="hover:text-[#BC3612] dark:hover:text-[#F47930] transition-colors">
                vasai@chinmayamission.com
              </a>
            </p>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-2">
              Phone: +91 123-456-7890
            </p>
          </div>
        </div>

        {/* Bottom Section: Social Media and Copyright */}
        <div className="text-center">
          {/* Social Media */}
          <div className="mb-4">
            <div className="flex justify-center space-x-4">
              {[
                { href: "https://www.facebook.com/share/18uKZokgN6/", Icon: FaFacebook },
                { href: "https://www.instagram.com/cm_vasai?igsh=MWwyMjdlcHJ3dWJvNw==", Icon: FaInstagram },
                { href: "https://www.youtube.com/@chinmayamissionvasai730", Icon: FaYoutube },
                { href: "https://x.com/Chinmaya_Vasai", Icon: FaXTwitter },
              ].map(({ href, Icon }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#BC3612] dark:text-[#F47930] hover:text-orange-500 dark:hover:text-orange-500 transform hover:scale-110 transition-all"
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm">
            <p>© 2025 Chinmaya Mission Vasai. All Rights Reserved.</p>
            <p className="text-xs mt-1">Hari Om!</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;