import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaEye } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import archivedEventsService from '../../services/archivedEventsService';
import { ArchivedEventsListSkeleton } from '../../components/LoadingSkeletons';
import { showToast } from '../../components/Toast';
import { scrollToTop } from '../../utils/scrollUtils';

const ArchivedEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArchivedEvents();
  }, []);

  useEffect(() => {
    const filterEventsInternal = () => {
      if (!searchQuery.trim()) {
        setFilteredEvents(events);
        return;
      }

      const filtered = events.filter(event =>
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.highlights?.some(highlight => 
          highlight.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredEvents(filtered);
    };

    filterEventsInternal();
  }, [events, searchQuery]);

  const fetchArchivedEvents = async () => {
    try {
      setLoading(true);
      const data = await archivedEventsService.getAll();
      setEvents(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching archived events:', err);
      setError('Failed to load archived events. Please try again later.');
      setEvents([]);
      showToast('Failed to load archived events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Date not available';
    }
  };

  const handleViewDetailsClick = () => {
    scrollToTop();
  };

  if (loading) {
    return <ArchivedEventsListSkeleton />;
  }

  return (
    <>
      <Helmet>
        <title>Archived Events | Chinmaya Mission Vasai</title>
        <meta name="description" content="Browse our collection of past spiritual events, workshops, and community gatherings at Chinmaya Mission Vasai. Relive the memorable moments and sacred celebrations." />
        <meta name="keywords" content="archived events, past events, Chinmaya Mission Vasai, spiritual gatherings, workshops, celebrations" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Archived Events
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our collection of past spiritual events, workshops, and community gatherings. 
              Relive the sacred moments and celebrations that have enriched our spiritual journey.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Results Count */}
          {searchQuery && (
            <div className="text-center mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} 
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg max-w-md mx-auto">
                <p>{error}</p>
                <button
                  onClick={fetchArchivedEvents}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Events Grid */}
          {!error && (
            <>
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 dark:text-gray-400">
                    {searchQuery ? (
                      <>
                        <p className="text-xl mb-2">No events found</p>
                        <p>Try adjusting your search terms</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xl mb-2">No archived events available</p>
                        <p>Check back later for event archives</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <div
                      key={event._id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {/* Event Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={event.coverImage || '/images/default-event.jpg'}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-semibold text-lg line-clamp-2">
                            {event.title}
                          </h3>
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="p-6">
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                          {event.description}
                        </p>

                        {/* Event Details */}
                        <div className="space-y-2 mb-4">
                          {event.date && (
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                              <FaCalendarAlt className="w-4 h-4 mr-2 text-[#BC3612] dark:text-[#F47930]" />
                              {formatDate(event.date)}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                              <FaMapMarkerAlt className="w-4 h-4 mr-2 text-[#BC3612] dark:text-[#F47930]" />
                              {event.location}
                            </div>
                          )}
                        </div>

                        {/* View Details Button */}
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {event.images?.length || 0} photo{(event.images?.length || 0) !== 1 ? 's' : ''}
                          </div>
                          <Link
                            to={`/archived-events/${event._id}`}
                            onClick={handleViewDetailsClick}
                            className="inline-flex items-center px-4 py-2 bg-[#BC3612] dark:bg-[#F47930] hover:bg-[#ff725e] dark:hover:bg-[#ff725e] text-white text-sm font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930]"
                            aria-label={`View details for ${event.title}`}
                          >
                            <FaEye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ArchivedEvents;
