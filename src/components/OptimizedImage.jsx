import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  loading = 'lazy',
  placeholder = true,
  objectFit = 'contain',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
  }, []);

  // Generate placeholder background
  const placeholderStyle = {
    backgroundColor: '#f3f4f6',
    backgroundImage: `linear-gradient(45deg, #e5e7eb 25%, transparent 25%), 
                     linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), 
                     linear-gradient(45deg, transparent 75%, #e5e7eb 75%), 
                     linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)`,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Placeholder */}
      {placeholder && !isLoaded && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={placeholderStyle}
        />
      )}
      
      {/* Main Image */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          transition-opacity duration-300 
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${hasError ? 'hidden' : ''}
          w-full h-full
        `}
        style={{ objectFit }}
        {...props}
      />
      
      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.oneOf(['lazy', 'eager']),
  placeholder: PropTypes.bool,
  objectFit: PropTypes.oneOf(['contain', 'cover', 'fill', 'none', 'scale-down'])
};

export default OptimizedImage;
