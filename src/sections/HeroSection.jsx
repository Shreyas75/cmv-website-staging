import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative w-full bg-transparent">
      <img
        src="/images/newYear2.jpeg"
        alt="Chinmaya Mission Vasai spiritual gathering"
        className="w-full h-full max-h-[50vh] object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center px-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-3">
          Chinmaya Mission Vasai
        </h1>
        <p className="text-base sm:text-lg text-white text-center max-w-xl mb-6">
          Spiritual Events, Bala Vihar, and Community in Vasai
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 max-w-md w-full">
          <Link
            to="/events"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-[#BC3612] dark:bg-[#F47930] hover:bg-[#ff725e] dark:hover:bg-[#ff725e] text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] text-center"
            aria-label="Explore our events"
          >
            Explore Events
          </Link>
          <Link
            to="/volunteer"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-[#BC3612] dark:bg-[#F47930] hover:bg-[#ff725e] dark:hover:bg-[#ff725e] text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] text-center"
            aria-label="Volunteer with us"
          >
            Volunteer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;