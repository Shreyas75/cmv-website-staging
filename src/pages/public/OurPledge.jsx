const OurPledge = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center py-12 px-4">
      {/* Content Section */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center w-full">
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-2xl dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] p-6 rounded-lg w-full max-w-4xl flex flex-col gap-6 transition-all duration-300">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">OUR PLEDGE</h1>
          
          <div className="space-y-4 text-sm sm:text-base md:text-lg leading-relaxed">
            <p>
              The Chinmaya Mission pledge was given to us by Swami Chinmayananda in 1964 in Chennai. It talks nothing about Chinmaya Mission in particular, and yet everything about it. It is a universal vision and an organizational passion put together.
            </p>
            
            <p>
              It is not just words and sentences that make the Chinmaya Mission Pledge, it is the graceful determination, holistic evolution and meaningfulness of the Mission.
            </p>
            
            <p className="font-semibold">
              Let us live the Chinmaya Mission Pledge.
            </p>
          </div>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mt-4">Chinmaya Mission Pledge</h2>
          
          
          
          {/* Pledge Text Container */}
          <div className="bg-[#ffe4d6] dark:bg-gray-800 p-6 rounded-lg text-center italic">
            <p className="text-base sm:text-lg md:text-xl font-medium">
              &ldquo;We stand as one family, bound to each other with love and respect.
            </p>
            <p className="text-base sm:text-lg md:text-xl font-medium mt-2">
              We serve as an army, courageous and disciplined, ever ready to fight against all low tendencies and false values, within and without us.
            </p>
            <p className="text-base sm:text-lg md:text-xl font-medium mt-2">
              We live honestly the noble life of sacrifice and service, producing more than what we consume and giving more than what we take.
            </p>
            <p className="text-base sm:text-lg md:text-xl font-medium mt-2">
              We seek the Lord's grace to keep us on the path of virtue, courage and wisdom.
            </p>
            <p className="text-base sm:text-lg md:text-xl font-medium mt-2">
              May Thy grace and blessings flow through us to the world around us.
            </p>
            <p className="text-base sm:text-lg md:text-xl font-medium mt-2">
              We believe that the service of our country is the service of the Lord of Lords, and devotion to the people is devotion to the Supreme Self.
            </p>
            <p className="text-base sm:text-lg md:text-xl font-medium mt-2">
              We know our responsibilities; give us the ability and courage to fulfill them.
            </p>
            <p className="text-base sm:text-lg md:text-xl font-bold mt-4">
              Om Tat Sat
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurPledge;