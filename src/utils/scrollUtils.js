// Utility function for smooth scroll to top
export const scrollToTop = (behavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: behavior
  });
};

// Alternative scroll to top with offset (useful for fixed headers)
export const scrollToTopWithOffset = (offset = 0, behavior = 'smooth') => {
  window.scrollTo({
    top: offset,
    left: 0,
    behavior: behavior
  });
};

// Scroll to specific element
export const scrollToElement = (elementId, offset = 0, behavior = 'smooth') => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: behavior
    });
  }
};

export default scrollToTop;
