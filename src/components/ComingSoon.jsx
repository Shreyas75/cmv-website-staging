import React, { useState, useEffect } from 'react';
import { FaHeart, FaCalendarAlt } from 'react-icons/fa';

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Launch date: August 3rd, 2025
  const launchDate = new Date('2025-08-03T00:00:00').getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo and Title */}
        <div className="mb-8 animate-fade-in">
          <div className="mb-6">
            <img
              src="/src/assets/cmOm.webp"
              alt="Chinmaya Mission Vasai"
              className="w-24 h-24 mx-auto rounded-full shadow-lg border-4 border-white dark:border-gray-700"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Chinmaya Mission
            <span className="block text-3xl sm:text-4xl lg:text-5xl text-[#BC3612] dark:text-[#F47930] mt-2">
              Vasai
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-2">
            Something Amazing is Coming
          </p>
          <div className="flex items-center justify-center gap-2 text-lg text-gray-500 dark:text-gray-400">
            <FaCalendarAlt />
            <span>Launching August 3rd, 2025</span>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mb-12 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-8">
            Get Ready for Launch
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {[
              { value: timeLeft.days, label: 'Days' },
              { value: timeLeft.hours, label: 'Hours' },
              { value: timeLeft.minutes, label: 'Minutes' },
              { value: timeLeft.seconds, label: 'Seconds' }
            ].map((item, index) => (
              <div
                key={item.label}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-orange-200 dark:border-gray-700 transform hover:scale-105 transition-transform duration-300"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'slideUp 0.6s ease-out forwards'
                }}
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#BC3612] dark:text-[#F47930] mb-2">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-12 animate-fade-in-delayed">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 max-w-3xl mx-auto border border-orange-200 dark:border-gray-700">
            <FaHeart className="text-4xl text-[#BC3612] dark:text-[#F47930] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Spiritual Journey Awaits
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              We're building something extraordinary for our spiritual community. Our new website will feature 
              upcoming events, spiritual resources, community activities, and much more to support your 
              journey with Chinmaya Mission Vasai.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-orange-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold text-gray-900 dark:text-white">Events</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Spiritual gatherings</div>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl mb-2">📚</div>
                <div className="font-semibold text-gray-900 dark:text-white">Resources</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Learning materials</div>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl mb-2">🤝</div>
                <div className="font-semibold text-gray-900 dark:text-white">Community</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Connect with others</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="mb-2">
            © 2025 Chinmaya Mission Vasai. All rights reserved.
          </p>
          <p className="text-sm">
            Spreading spiritual wisdom and fostering community growth.
          </p>
        </div>

        {/* Custom Animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out;
          }
          
          .animate-fade-in-delayed {
            animation: fadeIn 0.8s ease-out 0.3s both;
          }
          
          .animate-slide-up {
            animation: slideUp 0.8s ease-out 0.1s both;
          }
          
          .animate-slide-up-delayed {
            animation: slideUp 0.8s ease-out 0.5s both;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ComingSoon;