import { useState } from 'react';
import ActivitiesModal from '../../modals/ActivitiesModal';

const activities = [
  {
    id: 1,
    name: "Bala Vihar",
    image: "/images/bala-vihar.jpg",
    description: "Bala Vihar is a weekly cultural and spiritual education program for children. Through stories, shlokas, bhajans, games, and other creative activities, children learn values and principles from our rich cultural heritage.",
    schedule: "Every Sunday, 10:30 AM - 12:00 PM",
    benefits: [
      "Character development through value education",
      "Learning Indian culture and traditions",
      "Development of leadership qualities",
      "Building confidence and public speaking skills"
    ],
    contact: "For registration: +91 XXXXXXXXXX or email: balavihar@chinmayavasai.org"
  },
  {
    id: 2,
    name: "Yuva Kendra",
    image: "/images/yuva-kendra.jpeg",
    description: "Yuva Kendra is a dynamic forum for youth to explore and understand life through the wisdom of Vedanta. It provides a platform for young adults to discuss practical life challenges and find solutions through ancient wisdom.",
    schedule: "Every Sunday, 8:30 AM - 10:00 AM",
    benefits: [
      "Understanding life through Vedantic perspective",
      "Developing clarity in decision making",
      "Building a strong value system",
      "Networking with like-minded youth"
    ],
    contact: "Join our WhatsApp group: +91 XXXXXXXXXX"
  },
];

const Activities = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-3xl font-bold text-center mb-8">Activities</h1>
          
          <div className="prose max-w-none text-gray-800 dark:text-gray-300">
            <p className="text-lg leading-relaxed mb-6 text-justify">
              Chinmaya Mission Vasai conducts various spiritual and cultural activities aimed at inner transformation and character development for all age groups. Our activities are designed to promote the understanding of Vedantic knowledge and its practical application in daily life.
            </p>
            
            <p className="text-lg leading-relaxed mb-6 text-justify">
              Through regular study groups, workshops, cultural programs, and community service initiatives, we provide platforms for individuals to grow spiritually while serving society. Our activities include Vedanta classes, meditation sessions, youth programs, children's cultural education, and various community outreach programs.
            </p>

            <p className="text-lg leading-relaxed mb-6 text-justify">
              Each activity at Chinmaya Mission is carefully structured to help participants understand the deeper meaning of life while fostering values like compassion, discipline, and selfless service. We welcome everyone to join our activities and experience the transformative wisdom of Vedanta.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-center mb-12">Our Regular Activities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {activities.map((activity) => (
              <div 
                key={activity.id}
                className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => setSelectedActivity(activity)}
              >
                <div className="w-64 h-64 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-center dark:text-white">{activity.name}</h3>
              </div>
            ))}
          </div>

          <ActivitiesModal
            isOpen={!!selectedActivity}
            onClose={() => setSelectedActivity(null)}
            activity={selectedActivity}
          />
        </div>
      </div>
    </div>
  );
};

export default Activities;