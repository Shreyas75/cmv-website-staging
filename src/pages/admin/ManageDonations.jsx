import { useState, useEffect } from 'react';
import { FaDownload, FaChartBar, FaCalendarAlt, FaFilter, FaSpinner, FaEye, FaFileExport } from 'react-icons/fa';
import axios from 'axios';

const ManageDonations = () => {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDonations, setTotalDonations] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    reasonForDonation: '',
    minAmount: '',
    maxAmount: ''
  });

  const donationReasons = [
    "Gurudakshina",
    "General Donation",
    "Event Sponsorship",
    "Building Fund",
    "Educational Support",
    "Community Service",
    "Special Occasion",
    "Other"
  ];

  const statusOptions = ["pending", "completed", "failed"];

  // Fetch donations with filters and pagination
  const fetchDonations = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/donations/recent?${params}`
      );

      if (response.data.success) {
        setDonations(response.data.data.donations);
        setCurrentPage(response.data.data.pagination.page);
        setTotalPages(response.data.data.pagination.pages);
        setTotalDonations(response.data.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      setError('Failed to fetch donations');
      if (error.response?.status === 401) {
        // Redirect to login or handle unauthorized
        window.location.href = '/admin/login';
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch donation statistics
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/stats/donations`
      );

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Export donations to CSV
  const exportDonations = async () => {
    setExporting(true);
    setError('');
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/export/donations?${params}`,
        {
          responseType: 'blob'
        }
      );

      // Create blob link to download the CSV file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current date
      const today = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `donations_export_${today}.csv`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting donations:', error);
      if (error.response?.status === 404) {
        setError('No donations found for the selected criteria');
      } else if (error.response?.status === 401) {
        setError('Unauthorized. Please login again.');
        window.location.href = '/admin/login';
      } else {
        setError('Failed to export donations');
      }
    } finally {
      setExporting(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    fetchDonations(1);
    fetchStats();
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      status: '',
      reasonForDonation: '',
      minAmount: '',
      maxAmount: ''
    });
    setCurrentPage(1);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, []);

  useEffect(() => {
    if (Object.values(filters).every(val => !val)) {
      fetchDonations(currentPage);
      fetchStats();
    }
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Donation Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            View, filter, and export donation data
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Donations</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.summary.totalDonations}</p>
                </div>
                <FaChartBar className="text-3xl text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.summary.totalAmount)}</p>
                </div>
                <FaChartBar className="text-3xl text-green-500" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Amount</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.summary.avgAmount)}</p>
                </div>
                <FaChartBar className="text-3xl text-orange-500" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.summary.pendingCount}</p>
                </div>
                <FaChartBar className="text-3xl text-yellow-500" />
              </div>
            </div>
          </div>
        )}

        {/* Filters and Export */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaFilter />
              Filters & Export
            </h2>
            <button
              onClick={exportDonations}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 bg-[#BC3612] hover:bg-[#A52D0F] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {exporting ? <FaSpinner className="animate-spin" /> : <FaDownload />}
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Donation
              </label>
              <select
                value={filters.reasonForDonation}
                onChange={(e) => handleFilterChange('reasonForDonation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Reasons</option>
                {donationReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Amount (₹)
              </label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Amount (₹)
              </label>
              <input
                type="number"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                placeholder="No limit"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Donations Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Donations ({totalDonations} total)
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <FaSpinner className="animate-spin text-3xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Loading donations...</p>
            </div>
          ) : donations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">No donations found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Donor Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount & Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {donations.map((donation) => (
                      <tr key={donation._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {donation.fullName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              {donation.email}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              {donation.phoneNumber}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatCurrency(donation.amount)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              {donation.reasonForDonation}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-900 dark:text-white font-mono">
                            {donation.transactionId}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            donation.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : donation.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {donation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {formatDate(donation.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                          fetchDonations(currentPage - 1);
                        }
                      }}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => {
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                          fetchDonations(currentPage + 1);
                        }
                      }}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDonations;
