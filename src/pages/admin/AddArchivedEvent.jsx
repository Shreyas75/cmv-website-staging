import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaTimes, FaPlus, FaSave, FaArrowLeft } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import archivedEventsService from '../../services/archivedEventsService';
import { validateImage, compressImage, createImagePreview, revokeImagePreview } from '../../utils/imageUtils';
import { showToast } from '../../components/Toast';
import { scrollToTop } from '../../utils/scrollUtils';

const AddArchivedEvent = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    organizer: '',
    attendees: '',
    highlights: ['']
  });
  
  // Image states
  const [heroImage, setHeroImage] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData(prev => ({
      ...prev,
      highlights: newHighlights
    }));
  };

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }));
  };

  const removeHighlight = (index) => {
    if (formData.highlights.length > 1) {
      setFormData(prev => ({
        ...prev,
        highlights: prev.highlights.filter((_, i) => i !== index)
      }));
    }
  };

  const handleHeroImageChange = async (file) => {
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.isValid) {
      showToast(validation.error, 'error');
      return;
    }

    try {
      const compressedFile = await compressImage(file);
      setHeroImage(compressedFile);
      
      // Clean up previous preview
      if (heroImagePreview) {
        revokeImagePreview(heroImagePreview);
      }
      
      const preview = createImagePreview(compressedFile);
      setHeroImagePreview(preview);
    } catch (error) {
      console.error('Error processing hero image:', error);
      showToast('Error processing image', 'error');
    }
  };

  const handleGalleryImagesChange = async (files) => {
    const validFiles = [];
    const previews = [];

    for (const file of Array.from(files)) {
      const validation = validateImage(file);
      if (!validation.isValid) {
        showToast(`${file.name}: ${validation.error}`, 'error');
        continue;
      }

      try {
        const compressedFile = await compressImage(file);
        validFiles.push(compressedFile);
        previews.push(createImagePreview(compressedFile));
      } catch (error) {
        console.error('Error processing gallery image:', error);
        showToast(`Error processing ${file.name}`, 'error');
      }
    }

    setGalleryImages(prev => [...prev, ...validFiles]);
    setGalleryPreviews(prev => [...prev, ...previews]);
  };

  const removeGalleryImage = (index) => {
    // Clean up preview
    revokeImagePreview(galleryPreviews[index]);
    
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleGalleryImagesChange(files);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    }

    if (!heroImage) {
      newErrors.heroImage = 'Hero image is required';
    }

    if (galleryImages.length === 0) {
      newErrors.galleryImages = 'At least one gallery image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors below', 'error');
      return;
    }

    setLoading(true);

    try {
      // Convert hero image to base64
      const heroImageBase64 = heroImage ? await convertToBase64(heroImage) : null;
      
      // Convert gallery images to base64
      const galleryImagesBase64 = await Promise.all(
        galleryImages.map(img => convertToBase64(img))
      );

      // Prepare event data for backend
      const eventData = {
        title: formData.title,
        description: formData.description,
        coverImageBase64: heroImageBase64,
        imagesBase64: galleryImagesBase64
      };

      // Create event
      await archivedEventsService.create(eventData);
      
      showToast('Archived event created successfully!', 'success');
      navigate('/admin/archived-events');
    } catch (error) {
      console.error('Error creating archived event:', error);
      showToast('Failed to create archived event', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  // Cleanup on unmount
  useState(() => {
    return () => {
      if (heroImagePreview) revokeImagePreview(heroImagePreview);
      galleryPreviews.forEach(revokeImagePreview);
    };
  }, []);

  const handleBackToManageClick = () => {
    navigate('/admin/archived-events');
    scrollToTop();
  };

  const handleCancelClick = () => {
    navigate('/admin/archived-events');
    scrollToTop();
  };

  return (
    <>
      <Helmet>
        <title>Add Archived Event | Admin | Chinmaya Mission Vasai</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <button
                  onClick={handleBackToManageClick}
                  className="inline-flex items-center text-[#BC3612] dark:text-[#F47930] hover:text-[#ff725e] dark:hover:text-[#ff725e] mb-4 transition-colors"
                >
                  <FaArrowLeft className="w-4 h-4 mr-2" />
                  Back to Manage Events
                </button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Add Archived Event
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Create a new archived event entry with images and details
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter event title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Event Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Event location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Organizer
                    </label>
                    <input
                      type="text"
                      name="organizer"
                      value={formData.organizer}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Event organizer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Number of Attendees
                    </label>
                    <input
                      type="number"
                      name="attendees"
                      value={formData.attendees}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Number of attendees"
                      min="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Event Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Describe the event in detail..."
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>
                </div>
              </div>

              {/* Event Highlights */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Event Highlights
                </h2>
                
                <div className="space-y-3">
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => handleHighlightChange(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={`Highlight ${index + 1}`}
                      />
                      {formData.highlights.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          className="px-3 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="inline-flex items-center px-4 py-2 text-[#BC3612] dark:text-[#F47930] hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                  >
                    <FaPlus className="w-4 h-4 mr-2" />
                    Add Highlight
                  </button>
                </div>
              </div>

              {/* Hero Image */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Hero Image *
                </h2>
                
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleHeroImageChange(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#BC3612] file:text-white hover:file:bg-[#ff725e] file:cursor-pointer"
                  />
                  
                  {heroImagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={heroImagePreview}
                        alt="Hero preview"
                        className="w-64 h-40 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          revokeImagePreview(heroImagePreview);
                          setHeroImagePreview(null);
                          setHeroImage(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  
                  {errors.heroImage && <p className="text-red-500 text-sm">{errors.heroImage}</p>}
                </div>
              </div>

              {/* Gallery Images */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Gallery Images *
                </h2>
                
                <div className="space-y-6">
                  {/* Drag & Drop Zone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? 'border-[#BC3612] bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-[#BC3612] dark:hover:border-[#F47930]'
                    }`}
                  >
                    <FaUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Drag & drop images here, or{' '}
                      <label className="text-[#BC3612] dark:text-[#F47930] hover:underline cursor-pointer">
                        browse files
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleGalleryImagesChange(e.target.files)}
                          className="hidden"
                        />
                      </label>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Supports: JPEG, PNG, WebP (max 10MB each)
                    </p>
                  </div>
                  
                  {/* Gallery Previews */}
                  {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {galleryPreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Gallery preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {errors.galleryImages && <p className="text-red-500 text-sm">{errors.galleryImages}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 bg-[#BC3612] dark:bg-[#F47930] hover:bg-[#ff725e] dark:hover:bg-[#ff725e] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaSave className="w-5 h-5 mr-2" />
                      Create Event
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddArchivedEvent;
