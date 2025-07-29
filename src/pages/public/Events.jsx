import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { scrollToTop } from "../../utils/scrollUtils";
import EventsModal from "../../modals/EventsModal";

const Events = ({ featuredEvents }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleViewPastEventsClick = () => {
    scrollToTop();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">Events</h1>

          <div className="prose max-w-none text-gray-800 dark:text-gray-300 space-y-6">
            <p className="text-base md:text-lg leading-relaxed text-justify">
              Chinmaya Mission Vasai hosts a diverse array of spiritual and cultural events throughout the year, each designed to blend spiritual wisdom with engaging experiences. From adventurous treks in nature's lap to profound celebrations of sacred festivals, our events create meaningful connections and lasting memories.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-justify">
              Our signature events include transformative winter camps that immerse youth in spiritual learning through interactive activities, the divine celebration of Maha Shivaratri with night-long pujas and bhajans, spiritual monsoon treks that combine the serenity of nature with Vedantic discussions, and mindful New Year celebrations that begin the year with spiritual consciousness.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-justify">
              These events serve as powerful mediums to understand and experience spiritual truths while fostering a sense of community. Whether you're seeking adventure, knowledge, devotion, or celebration, our events provide unique opportunities for spiritual growth and personal transformation. We welcome everyone to be part of these enriching experiences and discover the joy of spiritual living through active participation.
            </p>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-center mt-12 mb-10" id="featured-events">
            Our Featured Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {featuredEvents.map((event) => (
              <div
                key={event._id}
                className="group flex flex-col items-center cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl rounded-lg overflow-hidden"
                onClick={() => handleEventClick(event)}
              >
                <div className="relative w-full h-64 md:h-72 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 w-full">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
                    {event.name}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 line-clamp-2 text-center">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* "View Past Events" Button */}
          <div className="bg-white dark:bg-gray-900 py-8 sm:py-12 flex justify-center">
            <Link
              to="/events/archived"
              onClick={handleViewPastEventsClick}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm sm:text-base font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              View Past Events
            </Link>
          </div>

          {/* Modal */}
          <EventsModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            event={selectedEvent}
          />
        </div>
      </div>
    </div>
  );
};

export default Events;