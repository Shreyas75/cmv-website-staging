const ActivitiesModal = ({ isOpen, onClose, activity }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-[90%] md:max-w-2xl max-h-[90vh] flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <span className="text-2xl text-gray-600 dark:text-gray-200">&times;</span>
        </button>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col items-center">
            {/* Square Image */}
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-lg overflow-hidden mb-4 shadow-lg">
              <img
                src={activity.image}
                alt={activity.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center dark:text-white">
              {activity.name}
            </h2>

            {/* Description */}
            <div className="prose max-w-none dark:prose-dark">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                {activity.description}
              </p>
            </div>

            {/* Additional Details */}
            <div className="mt-6 space-y-4 w-full">
              {activity.schedule && (
                <div>
                  <h3 className="font-semibold text-lg mb-2 dark:text-white">Schedule</h3>
                  <p className="text-gray-700 dark:text-gray-300">{activity.schedule}</p>
                </div>
              )}
              
              {activity.benefits && (
                <div>
                  <h3 className="font-semibold text-lg mb-2 dark:text-white">Benefits</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    {activity.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activity.contact && (
                <div>
                  <h3 className="font-semibold text-lg mb-2 dark:text-white">Contact</h3>
                  <p className="text-gray-700 dark:text-gray-300">{activity.contact}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesModal;
