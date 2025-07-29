import { useState, useEffect, useRef, useMemo } from 'react';

const FiguresSection = () => {
  const figures = useMemo(() => [
    { name: "Monks", count: 301, icon: "fas fa-user" },
    { name: "Ashrams", count: 300, icon: "fas fa-building" },
    { name: "Schools", count: 300, icon: "fas fa-school" },
  ], []);

  const [counters, setCounters] = useState(figures.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          figures.forEach((figure, index) => {
            const duration = 2500;
            const steps = 50;
            const targetCount = figure.count;
            const increment = Math.ceil(targetCount / steps);
            let current = 0;
            const timer = setInterval(() => {
              current += increment;
              if (current >= targetCount) {
                current = targetCount;
                clearInterval(timer);
              }
              
              setCounters(prevCounters => {
                const newCounters = [...prevCounters];
                newCounters[index] = current;
                return newCounters;
              });
            }, duration / steps);
          });
        }
      },
      { threshold: 0.1 }
    );

    const sectionNode = sectionRef.current;
    if (sectionNode) {
      observer.observe(sectionNode);
    }

    return () => {
      if (sectionNode) {
        observer.unobserve(sectionNode);
      }
    };
  }, [hasAnimated, figures]);

  return (
    <div ref={sectionRef} className="bg-white dark:bg-gray-700 py-1 sm:py-2 sm:px-2 figures-section">
      <style>
        {`
          @media (min-width: 640px) {
            .figures-section {
              padding: 0.5rem 1rem !important;
            }
            .figures-container {
              display: grid !important;
              grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
              gap: 0.5rem !important;
              justify-items: center !important;
            }
            .figures-card {
              padding: 0.25rem !important;
              min-width: unset !important;
              max-width: 120px !important;
            }
            .figures-icon {
              font-size: 1rem !important;
              margin-bottom: 0.25rem !important;
            }
            .figures-count {
              font-size: 0.875rem !important;
            }
            .figures-name {
              font-size: 0.625rem !important;
            }
          }
          @media (min-width: 768px) {
            .figures-section {
              padding: 0.5rem 1rem !important;
            }
            .figures-container {
              grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
              gap: 0.5rem !important;
              justify-items: center !important;
            }
            .figures-card {
              padding: 0.25rem !important;
              max-width: 100px !important;
              background: linear-gradient(to bottom right, rgba(255, 229, 204, 0.8), rgba(255, 255, 255, 0.8)) !important;
              backdrop-filter: blur(8px) !important;
              border: 1px solid rgba(255, 165, 0, 0.3) !important;
              transition: all 0.3s ease !important;
            }
            .figures-card:hover {
              transform: scale(1.05) !important;
              box-shadow: 0 0 15px rgba(255, 165, 0, 0.5) !important;
            }
            .figures-icon {
              font-size: 1rem !important;
              margin-bottom: 0.25rem !important;
            }
            .figures-count {
              font-size: 0.875rem !important;
            }
            .figures-name {
              font-size: 0.625rem !important;
            }
            .dark .figures-card {
              background: linear-gradient(to bottom right, rgba(75, 85, 99, 0.8), rgba(31, 41, 55, 55, 0.8)) !important;
              border: 1px solid rgba(244, 121, 48, 0.5) !important;
            }
            .dark .figures-card:hover {
              box-shadow: 0 0 15px rgba(244, 121, 48, 0.5) !important;
            }
          }
          @media (min-width: 1024px) {
            .figures-section {
              padding: 0.5rem !important;
            }
            .figures-container {
              grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
              gap: 1rem !important;
            }
            .figures-card {
              padding: 0.25rem !important;
              max-width: 120px !important;
            }
            .figures-icon {
              font-size: 1.25rem !important;
              margin-bottom: 0.5rem !important;
            }
            .figures-count {
              font-size: 1rem !important;
            }
            .figures-name {
              font-size: 0.75rem !important;
            }
          }
          @keyframes fadeInStagger {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-stagger:nth-child(1) {
            animation: fadeInStagger 600ms ease-in-out forwards;
          }
          .animate-fade-in-stagger:nth-child(2) {
            animation: fadeInStagger 600ms ease-in-out 200ms forwards;
          }
          .animate-fade-in-stagger:nth-child(3) {
            animation: fadeInStagger 600ms ease-in-out 400ms forwards;
          }
          .figure-number::after {
            content: '';
            display: block;
            width: 20px;
            height: 1px;
            background: #BC3612;
            margin: 2px auto;
          }
          .dark .figure-number::after {
            background: #F47930;
          }
        `}
      </style>
      <div className="max-w-6xl mx-auto">
        {/* Mobile View: Grid layout with 3 columns */}
        <div className="grid grid-cols-3 gap-2 sm:hidden text-center">
          {figures.map((figure, index) => (
            <div key={index} className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 rounded-md">
              <span className="text-[11px] font-bold text-[#BC3612] dark:text-[#F47930] figure-number">
                {counters[index]}+
              </span>
              <span className="text-[9px] font-medium uppercase text-[#BC3612] dark:text-[#F47930]">
                {figure.name}
              </span>
            </div>
          ))}
        </div>
        {/* Tablet and Larger: Premium Card Layout */}
        <div className="hidden sm:flex sm:flex-row sm:flex-wrap sm:justify-around sm:gap-2 figures-container text-center">
          {figures.map((figure, index) => (
            <div 
              key={index}
              className="flex flex-col items-center rounded-lg p-0.5 sm:p-2 figures-card shadow-md animate-fade-in-stagger"
            >
              <i className={`${figure.icon} text-[#BC3612] dark:text-[#F47930] text-lg figures-icon mb-1 sm:mb-1`}></i>
              <span className="text-base sm:text-lg figures-count font-bold text-[#BC3612] dark:text-[#F47930]">
                {figure.suffix === "Cr+" ? (counters[index] / 10000000).toFixed(1) + "Cr+" : counters[index] + "+"}
              </span>
              <span className="text-[10px] sm:text-sm figures-name font-medium text-gray-800 dark:text-gray-200">
                {figure.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiguresSection;