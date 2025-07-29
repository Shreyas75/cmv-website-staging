import { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose && onClose(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 max-w-sm";
    
    if (!isVisible) {
      return `${baseStyles} translate-x-full opacity-0`;
    }

    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500 text-white`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white`;
      case 'warning':
        return `${baseStyles} bg-orange-500 text-white`;
      default:
        return `${baseStyles} bg-blue-500 text-white`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="w-5 h-5" />;
      case 'error':
        return <FaExclamationCircle className="w-5 h-5" />;
      case 'warning':
        return <FaExclamationCircle className="w-5 h-5" />;
      default:
        return <FaInfoCircle className="w-5 h-5" />;
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose && onClose(), 300);
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={handleClose}
        className="text-white hover:text-gray-200 transition-colors"
        aria-label="Close notification"
      >
        <FaTimes className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast Manager Component
export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose addToast globally
  useEffect(() => {
    window.showToast = addToast;
    return () => {
      delete window.showToast;
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Utility function to show toasts
export const showToast = (message, type = 'info', duration = 4000) => {
  if (window.showToast) {
    window.showToast(message, type, duration);
  }
};

export default Toast;
