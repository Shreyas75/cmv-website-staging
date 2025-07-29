import { useState, useEffect, useRef, useMemo } from 'react';

const StatisticsSection = () => {
  // Stats data
  const stats = useMemo(() => [
    { name: "Balavihar", count: 35, icon: "fas fa-child" },
    { name: "CHYK", count: 30, icon: "fas fa-users" },
    { name: "Members", count: 145, icon: "fas fa-user-friends" },
    { name: "Devi Group", count: 35, icon: "fas fa-hands-praying" }
  ], []);

  const [counters, setCounters] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Check if element is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          // Start the animation for each stat
          stats.forEach((stat, index) => {
            const duration = 2500; // Increased from 1500ms to 2500ms
            const steps = 50; // Increased from 30 to 50 steps
            const targetCount = stat.count;
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
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
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
  }, [hasAnimated, stats]);

  return (
    <div ref={sectionRef} className="bg-white dark:bg-gray-900 py-4 px-2 stats-section">
      <style>
        {`
          .stats-card {
            min-width: 80px; /* Ensure minimum width for mobile */
            width: 100%; /* Take full width of container */
            max-width: 100px; /* Limit width for uniformity */
          }
          @media (min-width: 425px) {
            .stats-section {
              padding: 1.5rem 1rem; /* py-6 px-4 */
            }
            .stats-container {
              display: grid !important;
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 1.5rem !important; /* gap-6 */
              justify-items: center !important;
            }
            .stats-card {
              padding: 1rem !important; /* p-4 */
              min-width: unset !important; /* Remove min-width for grid */
              max-width: 200px !important; /* Slightly larger for larger screens */
            }
            .stats-icon {
              font-size: 1.25rem !important; /* text-xl */
              margin-bottom: 0.5rem !important; /* mb-2 */
            }
            .stats-count {
              font-size: 1.5rem !important; /* text-2xl */
            }
            .stats-name {
              font-size: 0.875rem !important; /* text-sm */
            }
          }
          @media (min-width: 768px) {
            .stats-container {
              grid-template-columns: repeat(4, minmax(0, 1fr)) !important; /* md:grid-cols-4 */
              gap: 1.5rem !important; /* gap-6 */
              justify-items: center !important;
            }
            .stats-card {
              padding: 1rem !important; /* p-4 */
              max-width: 200px !important; /* Consistent width */
            }
            .stats-icon {
              font-size: 1.5rem !important; /* md:text-2xl */
            }
            .stats-count {
              font-size: 1.875rem !important; /* md:text-3xl */
            }
            .stats-name {
              font-size: 1rem !important; /* md:text-base */
            }
          }
        `}
      </style>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-row flex-wrap justify-around gap-2 stats-container text-center">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="flex flex-col items-center bg-[#ffe4d6] dark:bg-gray-800 rounded-lg p-2 stats-card shadow-md hover:shadow-lg transition-shadow"
            >
              <i className={`${stat.icon} text-[#BC3612] dark:text-[#F47930] text-lg stats-icon mb-1`}></i>
              <span className="text-lg stats-count font-bold text-[#BC3612] dark:text-[#F47930]">
                {counters[index]}+
              </span>
              <span className="text-xs stats-name font-medium text-gray-800 dark:text-gray-200">
                {stat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;