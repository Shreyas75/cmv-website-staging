import { Link } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="bg-white dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-700" aria-label="Breadcrumb">
      <div className="container mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link 
              to="/" 
              className="text-gray-500 dark:text-gray-400 hover:text-[#BC3612] dark:hover:text-[#F47930] transition-colors flex items-center"
              aria-label="Go to homepage"
            >
              <FaHome className="w-4 h-4" />
            </Link>
          </li>
          
          {items.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <FaChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
              {item.href && index < items.length - 1 ? (
                <Link 
                  to={item.href}
                  className="text-gray-500 dark:text-gray-400 hover:text-[#BC3612] dark:hover:text-[#F47930] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
