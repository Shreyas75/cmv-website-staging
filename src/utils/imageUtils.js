// Image compression and validation utilities

/**
 * Compress an image file
 * @param {File} file - The image file to compress
 * @param {number} quality - Compression quality (0-1)
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} maxHeight - Maximum height in pixels
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = (file, quality = 0.8, maxWidth = 1920, maxHeight = 1080) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @param {number} maxSizeInMB - Maximum file size in MB
 * @returns {Object} - Validation result
 */
export const validateImage = (file, maxSizeInMB = 10) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Invalid file type. Please select a JPEG, PNG, or WebP image.' 
    };
  }

  if (file.size > maxSizeInBytes) {
    return { 
      isValid: false, 
      error: `File size too large. Maximum size is ${maxSizeInMB}MB.` 
    };
  }

  return { isValid: true, error: null };
};

/**
 * Convert file to base64
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
};

/**
 * Create image preview URL
 * @param {File} file - The image file
 * @returns {string} - Object URL for preview
 */
export const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Revoke image preview URL to free memory
 * @param {string} url - The object URL to revoke
 */
export const revokeImagePreview = (url) => {
  URL.revokeObjectURL(url);
};
