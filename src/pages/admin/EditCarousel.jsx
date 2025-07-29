import { useState, useEffect } from 'react';
import axios from 'axios';

const EditCarousel = ({ carouselItems = [], setCarouselItems }) => {
  const [newImageFile, setNewImageFile] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarouselItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/carousel-items`);
        
        if (Array.isArray(response.data)) {
          setCarouselItems(response.data);
        } else {
          console.error('Expected array but got:', response.data);
          setCarouselItems([]);
        }
      } catch (error) {
        console.error('Error fetching carousel items:', error);
        setError('Failed to load carousel items');
        setCarouselItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselItems();
  }, [setCarouselItems]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  
  const handleAddImage = async () => {
    if (newImageFile) {
      setUploading(true);
  
      try {
        // Step 1: Convert image to base64
        const base64Image = await toBase64(newImageFile);
  
        // Step 2: Upload image to backend
        const uploadResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/upload-image`,
          { imageBase64: base64Image }
        );
  
        const imageUrl = uploadResponse.data.imageUrl;
  
        // Step 3: Send new carousel item with uploaded image URL
        const newItem = {
          title: newTitle,
          description: newDescription,
          image: imageUrl,
        };
  
        const apiResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/carousel-items`,
          newItem
        );
  
        setCarouselItems([...carouselItems, apiResponse.data]);
  
        // Step 4: Reset fields
        setNewImageFile(null);
        setNewTitle('');
        setNewDescription('');
      } catch (error) {
        console.error('Error uploading image or adding carousel item:', error);
      } finally {
        setUploading(false);
      }
    } else {
      alert('Please select an image file to upload.');
    }
  };
  
  const handleRemoveImage = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/carousel-items/${id}`);
      setCarouselItems(carouselItems.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Edit Carousel Images</h2>
        
        {loading ? (
          <div className="text-center">Loading carousel items...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(carouselItems) && carouselItems.length > 0 ? (
              carouselItems.map((item, index) => (
                <div key={item._id || index} className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                  <div>
                    <p className="text-lg font-bold dark:text-white">{item.title}</p>
                    <p className="text-sm dark:text-gray-300">{item.description}</p>
                    <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg mt-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveImage(item._id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center dark:text-white">No carousel items found.</p>
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
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleAddImage}
            className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Add Image'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCarousel;