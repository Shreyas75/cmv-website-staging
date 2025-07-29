import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaArrowLeft, FaShareAlt, FaDownload } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import archivedEventsService from '../../services/archivedEventsService';
import { ArchivedEventDetailsSkeleton } from '../../components/LoadingSkeletons';
import ImageLightbox from '../../components/ImageLightbox';
import Breadcrumb from '../../components/Breadcrumb';
import { showToast } from '../../components/Toast';
import { scrollToTop } from '../../utils/scrollUtils';

const ArchivedEventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchEventDetailsInternal = async () => {
      try {
        setLoading(true);
        const data = await archivedEventsService.getById(id);
        setEvent(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details. Please try again later.');
        showToast('Failed to load event details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetailsInternal();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Date not available';
    }
  };

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!', 'success');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        showToast('Failed to copy link', 'error');
      }
    }
  };

  const handleBackToEventsClick = () => {
    scrollToTop();
  };

  if (loading) {
    return <ArchivedEventDetailsSkeleton />;
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-6 py-4 rounded-lg max-w-md mx-auto">
            <p className="mb-4">{error || 'Event not found'}</p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/archived-events"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
              >
                Back to Events
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prepare images for lightbox
  const lightboxImages = event.images?.map((img, index) => ({
    url: typeof img === 'string' ? img : img.url,
    caption: typeof img === 'string' ? `${event.title} - Photo ${index + 1}` : (img.caption || `${event.title} - Photo ${index + 1}`)
  })) || [];

  const breadcrumbItems = [
    { label: 'Archived Events', href: '/archived-events' },
    { label: event.title }
  ];

  return (
    <>
      <Helmet>
        <title>{event.title} | Archived Events | Chinmaya Mission Vasai</title>
        <meta name="description" content={event.description} />
        <meta name="keywords" content={`${event.title}, archived event, Chinmaya Mission Vasai, ${event.highlights?.join(', ')}`} />
        <meta property="og:title" content={event.title} />
        <meta property="og:description" content={event.description} />
        <meta property="og:image" content={event.coverImage} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
              to="/archived-events"
              onClick={handleBackToEventsClick}
              className="inline-flex items-center text-[#BC3612] dark:text-[#F47930] hover:text-[#ff725e] dark:hover:text-[#ff725e] mb-6 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Archived Events
            </Link>

            {/* Event Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
              {/* Hero Image */}
              {event.coverImage && (
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {event.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-white/90">
                      {event.date && (
                        <div className="flex items-center">
                          <FaCalendarAlt className="w-4 h-4 mr-2" />
                          {formatDate(event.date)}
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                      )}
                      {event.attendees && (
                        <div className="flex items-center">
                          <FaUsers className="w-4 h-4 mr-2" />
                          {event.attendees} attendees
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="absolute top-6 right-6 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    aria-label="Share event"
                  >
                    <FaShareAlt className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Event Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    About This Event
                  </h2>
                  <div className="prose max-w-none text-gray-600 dark:text-gray-300">
                    <p className="text-lg leading-relaxed whitespace-pre-line">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Event Gallery */}
                {event.images && event.images.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Event Gallery ({event.images.length} photos)
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
                          onClick={() => handleImageClick(index)}
                        >
                          <img
                            src={typeof image === 'string' ? image : (image.url || image)}
                            alt={typeof image === 'string' ? `Event photo ${index + 1}` : (image.caption || `Event photo ${index + 1}`)}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                <FaDownload className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Event Details */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Event Details
                  </h3>
                  <div className="space-y-3">
                    {event.date && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</dt>
                        <dd className="text-gray-900 dark:text-white">{formatDate(event.date)}</dd>
                      </div>
                    )}
                    {event.time && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</dt>
                        <dd className="text-gray-900 dark:text-white">{event.time}</dd>
                      </div>
                    )}
                    {event.location && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
                        <dd className="text-gray-900 dark:text-white">{event.location}</dd>
                      </div>
                    )}
                    {event.organizer && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Organizer</dt>
                        <dd className="text-gray-900 dark:text-white">{event.organizer}</dd>
                      </div>
                    )}
                    {event.attendees && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendees</dt>
                        <dd className="text-gray-900 dark:text-white">{event.attendees}</dd>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Highlights */}
                {event.highlights && event.highlights.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Highlights
                    </h3>
                    <ul className="space-y-2">
                      {event.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-[#BC3612] dark:text-[#F47930] mr-2">•</span>
                          <span className="text-gray-600 dark:text-gray-300">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Image Lightbox */}
        <ImageLightbox
          images={lightboxImages}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          initialIndex={lightboxIndex}
        />
      </div>
    </>
  );
};

export default ArchivedEventDetails;
