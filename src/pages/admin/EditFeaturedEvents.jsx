import { useState, useEffect } from 'react';
import axios from 'axios';

const EditFeaturedEvents = ({ featuredEvents = [], setFeaturedEvents }) => {
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
    const fetchFeaturedEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/featured-events`);
        
        if (Array.isArray(response.data)) {
          setFeaturedEvents(response.data);
        } else {
          console.error('Expected array but got:', response.data);
          setFeaturedEvents([]);
        }
      } catch (error) {
        console.error('Error fetching featured events:', error);
        setError('Failed to load featured events');
        setFeaturedEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, [setFeaturedEvents]);

  const handleAddEvent = async () => {
    if (!newImageFile) {
      alert('Please select an image file to upload.');
      return;
    }
  
    setUploading(true);
  
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
  
    try {
      // Convert image to base64 and upload via backend
      const base64Image = await toBase64(newImageFile);
  
      const uploadResponse = await axios.post(
        '${import.meta.env.VITE_BACKEND_URL}/api/upload-image',
        {
          imageBase64: base64Image,
        }
      );
  
      const imageUrl = uploadResponse.data.imageUrl;
  
      // Prepare new event data
      const newEvent = {
        name: newEventName,
        description: newDescription,
        schedule: newSchedule,
        highlights: newHighlights.split(','),
        contact: newContact,
        image: imageUrl,
      };
  
      // Save the event data in MongoDB
      const apiResponse = await axios.post(
        '${import.meta.env.VITE_BACKEND_URL}/api/featured-events',
        newEvent
      );
  
      // Update local state
      setFeaturedEvents([...featuredEvents, apiResponse.data]);
  
      // Reset form
      setNewImageFile(null);
      setNewEventName('');
      setNewDescription('');
      setNewSchedule('');
      setNewHighlights('');
      setNewContact('');
    } catch (error) {
      console.error('Error uploading image or saving event:', error);
      alert('Something went wrong while uploading or saving the event.');
    } finally {
      setUploading(false);
    }
  };
  

  const handleRemoveEvent = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/featured-events/${id}`);
      setFeaturedEvents(featuredEvents.filter(event => event._id !== id));
    } catch (error) {
      console.error('Error removing event:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Edit Featured Events</h2>
        
        {loading ? (
          <div className="text-center">Loading featured events...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(featuredEvents) && featuredEvents.length > 0 ? (
              featuredEvents.map((event, index) => (
                <div key={event._id || index} className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                  <div>
                    <p className="text-lg font-bold dark:text-white">{event.name}</p>
                    <p className="text-sm dark:text-gray-300">{event.description}</p>
                    <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg mt-2">
                      <img
                        src={event.image}
                        alt={event.name}
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
              <p className="text-center dark:text-white">No featured events found.</p>
            )}
          </div>
        )}
        
        <div className="mt-6">
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

export default EditFeaturedEvents;