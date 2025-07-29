import { useState, useEffect } from 'react';
import axios from 'axios';

const EditUpcomingEvents = ({ upcomingEvents = [], setUpcomingEvents }) => {
  const [newImageFile, setNewImageFile] = useState(null);
  const [newEventName, setNewEventName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSchedule, setNewSchedule] = useState('');
  const [newHighlights, setNewHighlights] = useState('');
  const [newContact, setNewContact] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/upcoming-events`);
        
        if (Array.isArray(response.data)) {
          setUpcomingEvents(response.data);
        } else {
          console.error('Expected array but got:', response.data);
          setUpcomingEvents([]);
        }
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
        setError('Failed to load upcoming events');
        setUpcomingEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, [setUpcomingEvents]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  
  const handleAddEvent = async () => {
    if (newImageFile) {
      setUploading(true);
  
      try {
        const base64Image = await toBase64(newImageFile);
        const uploadResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/upload-image`,
          { imageBase64: base64Image }
        );
  
        const imageUrl = uploadResponse.data.imageUrl;
  
        const newEvent = {
          eventName: newEventName,
          description: newDescription,
          schedule: newSchedule,
          highlights: newHighlights.split(','),
          contact: newContact,
          image: imageUrl,
        };
  
        const apiResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/upcoming-events`,
          newEvent
        );
  
        setUpcomingEvents([...upcomingEvents, apiResponse.data]);
  
        setNewImageFile(null);
        setNewEventName('');
        setNewDescription('');
        setNewSchedule('');
        setNewHighlights('');
        setNewContact('');
      } catch (error) {
        console.error('Error uploading image or adding event:', error);
      } finally {
        setUploading(false);
      }
    } else {
      alert('Please select an image file to upload.');
    }
  };
  
  const handleRemoveEvent = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/upcoming-events/${id}`);
      setUpcomingEvents(upcomingEvents.filter(event => event._id !== id));
    } catch (error) {
      console.error('Error removing event:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Edit Upcoming Events</h2>
        
        {loading ? (
          <div className="text-center">Loading upcoming events...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(upcomingEvents) && upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <div key={event._id || index} className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                  <div>
                    <p className="text-lg font-bold dark:text-white">{event.eventName}</p>
                    <p className="text-sm dark:text-gray-300">{event.description}</p>
                    <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg mt-2">
                      <img
                        src={event.image}
                        alt={event.eventName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveEvent(event._id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center dark:text-white">No upcoming events found.</p>
            )}
          </div>
        )}
        
        <div className="mt-6">
          <div
            role="alert"
            className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-400 text-yellow-800 dark:text-yellow-200 rounded-lg"
          >
            <p className="font-semibold">Image Upload Note:</p>
            <p>
              For best results, upload flyer-sized images (recommended: 2480x3508 pixels, A4 size, or 4:5 aspect ratio). 
              Supported formats: JPEG, PNG. Maximum file size: 10MB.
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImageFile(e.target.files[0])}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Event Name"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Schedule"
            value={newSchedule}
            onChange={(e) => setNewSchedule(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Highlights (comma separated)"
            value={newHighlights}
            onChange={(e) => setNewHighlights(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Contact"
            value={newContact}
            onChange={(e) => setNewContact(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleAddEvent}
            className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Add Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUpcomingEvents;