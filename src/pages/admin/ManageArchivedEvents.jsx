import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCalendarAlt, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import archivedEventsService from '../../services/archivedEventsService';
import { ArchivedEventsListSkeleton } from '../../components/LoadingSkeletons';
import { showToast } from '../../components/Toast';
import { scrollToTop } from '../../utils/scrollUtils';

const ManageArchivedEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

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
        event.location?.toLowerCase().includes(searchQuery.toLowerCase())
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
    } catch (err) {
      console.error('Error fetching archived events:', err);
      showToast('Failed to load archived events', 'error');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Date not available';
    }
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    try {
      setDeleteLoading(eventToDelete._id);
      await archivedEventsService.delete(eventToDelete._id);
      setEvents(prev => prev.filter(event => event._id !== eventToDelete._id));
      showToast('Event deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting event:', err);
      showToast('Failed to delete event', 'error');
    } finally {
      setDeleteLoading(null);
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const handleAddNewEventClick = () => {
    scrollToTop();
  };

  if (loading) {
    return <ArchivedEventsListSkeleton />;
  }

  return (
    <>
      <Helmet>
        <title>Manage Archived Events | Admin | Chinmaya Mission Vasai</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Manage Archived Events
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  View, edit, and manage all archived events
                </p>
              </div>
              <Link
                to="/admin/archived-events/add"
                onClick={handleAddNewEventClick}
                className="inline-flex items-center px-6 py-3 bg-[#BC3612] dark:bg-[#F47930] hover:bg-[#ff725e] dark:hover:bg-[#ff725e] text-white rounded-lg transition-colors"
              >
                <FaPlus className="w-5 h-5 mr-2" />
                Add New Event
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Stats */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative max-w-md w-full">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Total Events: {events.length}</span>
                {searchQuery && (
                  <span>Found: {filteredEvents.length}</span>
                )}
              </div>
            </div>
          </div>

          {/* Events Grid */}
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
                    <p className="text-xl mb-4">No archived events yet</p>
                    <Link
                      to="/admin/archived-events/add"
                      className="inline-flex items-center px-6 py-3 bg-[#BC3612] dark:bg-[#F47930] hover:bg-[#ff725e] dark:hover:bg-[#ff725e] text-white rounded-lg transition-colors"
                    >
                      <FaPlus className="w-5 h-5 mr-2" />
                      Create Your First Event
                    </Link>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.heroImage || '/images/default-event.jpg'}
                      alt={event.title}
                      className="w-full h-full object-cover"
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
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
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

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {event.images?.length || 0} photo{(event.images?.length || 0) !== 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/archived-events/${event._id}`}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View Event"
                        >
                          <FaEye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/archived-events/edit/${event._id}`}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Edit Event"
                        >
                          <FaEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(event)}
                          disabled={deleteLoading === event._id}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Event"
                        >
                          {deleteLoading === event._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <FaTrash className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleDeleteCancel}></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                      <FaTrash className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        Delete Event
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Are you sure you want to delete &quot;{eventToDelete?.title}&quot;? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleDeleteConfirm}
                    disabled={deleteLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteCancel}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageArchivedEvents;
