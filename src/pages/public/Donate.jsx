import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaUser, FaEnvelope, FaPhone, FaIdCard, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';
import axios from 'axios';

const Donate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    panCardNumber: '',
    state: '',
    city: '',
    pinCode: '',
    address: '',
    seek80G: 'no',
    amount: '',
    transactionId: '',
    reasonForDonation: '',
    purpose: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Lakshadweep", "Puducherry"
  ];

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    const requiredFields = ['fullName', 'email', 'phoneNumber', 'state', 'city', 'pinCode', 'address', 'amount', 'transactionId', 'reasonForDonation'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      setIsLoading(false);
      return;
    }

    if (!/^\d{6}$/.test(formData.pinCode)) {
      setError('Please enter a valid 6-digit pin code');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/donations`, formData);
      
      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          panCardNumber: '',
          state: '',
          city: '',
          pinCode: '',
          address: '',
          seek80G: 'no',
          amount: '',
          transactionId: '',
          reasonForDonation: '',
          purpose: ''
        });
      }
    } catch (err) {
      setError('Failed to submit donation. Please try again.');
      console.error('Donation submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
          <FaHeart className="text-5xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Thank You!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your donation details have been successfully submitted. We will process your contribution and send you a confirmation email shortly.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setSuccess(false)}
              className="w-full px-6 py-2 bg-[#BC3612] hover:bg-[#ff725e] text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Make Another Donation
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <FaHeart className="text-5xl text-[#BC3612] dark:text-[#F47930] mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Support Our Mission
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your generous contribution helps us continue our spiritual and community service activities. Thank you for supporting Chinmaya Mission Vasai.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Donation Details
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="10-digit number"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    PAN Card Number
                  </label>
                  <div className="relative">
                    <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="panCardNumber"
                      value={formData.panCardNumber}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pin Code *
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    placeholder="6-digit code"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    80G Exemption
                  </label>
                  <select
                    name="seek80G"
                    value={formData.seek80G}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address *
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Donation Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (₹) *
                  </label>
                  <div className="relative">
                    <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason for Donation *
                  </label>
                  <select
                    name="reasonForDonation"
                    value={formData.reasonForDonation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Reason</option>
                    {donationReasons.map((reason) => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transaction ID *
                </label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  placeholder="Enter UPI transaction ID"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purpose
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Please feel free to share any additional information regarding this contribution"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#BC3612] to-orange-500 hover:from-orange-500 hover:to-[#BC3612] text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Donation'
                )}
              </button>
            </form>
          </div>

          {/* QR Code Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Scan to Pay
            </h2>
            
            <div className="text-center mb-6">
              {/* QR Code Image */}
              <div className="flex justify-center mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <img
                    src="/QR.jpeg"
                    alt="Donation QR Code"
                    className="w-80 h-80 object-contain"
                    onError={(e) => {
                      e.target.src = '/images/default-qr.png';
                    }}
                  />
                </div>
              </div>
              
              <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  How to Donate:
                </h3>
                <ol className="text-sm text-gray-600 dark:text-gray-300 text-left space-y-1">
                  <li>1. Scan the QR code with any UPI app</li>
                  <li>2. Enter the donation amount</li>
                  <li>3. Complete the payment</li>
                  <li>4. Copy the transaction ID</li>
                  <li>5. Fill the form and submit</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
