const EventsModal = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-[90%] md:max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <span className="text-2xl text-gray-600 dark:text-gray-200 font-bold">×</span>
        </button>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto">
          {/* Image Container */}
          <div className="w-full bg-gray-100 dark:bg-gray-700 p-4 md:p-6">
            <div className="relative w-full">
              <img
                src={event.image}
                alt={event.name}
                className="w-full max-h-[50vh] object-contain rounded-2xl"
                style={{ backgroundColor: "rgb(241 245 249)" }}
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="p-4 md:p-6">
            {/* Name */}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {event.name}
            </h2>

            {/* Description */}
            <div className="mb-6">
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              {event.schedule && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <h3 className="font-semibold text-base md:text-lg mb-2 text-gray-900 dark:text-white">
                    Schedule
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    {event.schedule}
                  </p>
                </div>
              )}

              {event.highlights && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <h3 className="font-semibold text-base md:text-lg mb-2 text-gray-900 dark:text-white">
                    Highlights
                  </h3>
                  <ul className="list-disc list-inside text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-1">
                    {event.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(event.contact && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <h3 className="font-semibold text-base md:text-lg mb-2 text-gray-900 dark:text-white">
                    Contact
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    {event.contact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsModal;