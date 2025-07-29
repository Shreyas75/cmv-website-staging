const AcharyaModal = ({ isOpen, onClose, acharya }) => {
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
            {/* Image */}
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden mb-4 shadow-lg">
              <img
                src={acharya.image}
                alt={acharya.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center dark:text-white">
              {acharya.name}
            </h2>

            {/* Description */}
            <div className="prose max-w-none dark:prose-dark">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                {acharya.description}
              </p>
            </div>

            {/* Additional content if needed */}
            <div className="mt-6 space-y-4 w-full">
              {acharya.achievements && (
                <div>
                  <h3 className="font-semibold text-lg mb-2 dark:text-white">Achievements</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    {acharya.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {acharya.teachings && (
                <div>
                  <h3 className="font-semibold text-lg mb-2 dark:text-white">Key Teachings</h3>
                  <p className="text-gray-700 dark:text-gray-300">{acharya.teachings}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcharyaModal;
