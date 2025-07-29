import { useState, useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaDownload, FaShareAlt } from 'react-icons/fa';

const ImageLightbox = ({ images, isOpen, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(images[currentIndex].url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `event-image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Event Image',
          text: images[currentIndex].caption || 'Check out this event image!',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        if (window.showToast) {
          window.showToast('Link copied to clipboard!', 'success');
        }
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  if (!isOpen || !images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 p-2"
        aria-label="Close lightbox"
      >
        <FaTimes className="w-6 h-6" />
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 p-2"
            aria-label="Previous image"
          >
            <FaChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 p-2"
            aria-label="Next image"
          >
            <FaChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Action Buttons */}
      <div className="absolute top-4 left-4 flex space-x-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          disabled={isLoading}
          className="text-white hover:text-gray-300 p-2 bg-black bg-opacity-50 rounded"
          aria-label="Download image"
        >
          <FaDownload className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="text-white hover:text-gray-300 p-2 bg-black bg-opacity-50 rounded"
          aria-label="Share image"
        >
          <FaShareAlt className="w-5 h-5" />
        </button>
      </div>

      {/* Image Container */}
      <div 
        className="relative max-w-full max-h-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.url}
          alt={currentImage.caption || `Event image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
          loading="lazy"
        />
        
        {/* Image Caption */}
        {currentImage.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
            <p className="text-center">{currentImage.caption}</p>
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                index === currentIndex ? 'border-white' : 'border-transparent opacity-60'
              }`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageLightbox;
