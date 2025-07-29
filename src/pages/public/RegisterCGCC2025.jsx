import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { FaUser, FaSchool, FaCalendarAlt, FaPhone, FaEnvelope, FaSpinner } from 'react-icons/fa';

const RegisterCGCC2025 = () => {
  const [formData, setFormData] = useState({
    registrationVia: '',
    otherSpecify: '',
    firstName: '',
    middleName: '',
    lastName: '',
    schoolName: '',
    standard: '',
    parentName: '',
    mobileNo: '',
    emailAddress: '',
    dateOfBirth: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const registrationOptions = [
    'Balavihar Centre',
    'School',
    'Other'
  ];

  const standards = [
    '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear otherSpecify if registrationVia is not 'Other'
    if (name === 'registrationVia' && value !== 'Other') {
      setFormData(prev => ({
        ...prev,
        otherSpecify: ''
      }));
    }
  };

  const validateForm = () => {
    const required = ['registrationVia', 'firstName', 'lastName', 'schoolName', 'standard', 'parentName', 'mobileNo', 'emailAddress', 'dateOfBirth'];
    
    for (let field of required) {
      if (!formData[field]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Validate otherSpecify if registrationVia is 'Other'
    if (formData.registrationVia === 'Other' && !formData.otherSpecify) {
      setError('Please specify the registration source');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailAddress)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate mobile number (Indian format)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobileNo)) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }

    // Validate date of birth (should not be in future)
    const today = new Date();
    const dob = new Date(formData.dateOfBirth);
    if (dob >= today) {
      setError('Date of birth cannot be in the future');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cgcc2025/register`, formData);
      
      if (response.data.success) {
        setSuccess(true);
        setFormData({
          registrationVia: '',
          otherSpecify: '',
          firstName: '',
          middleName: '',
          lastName: '',
          schoolName: '',
          standard: '',
          parentName: '',
          mobileNo: '',
          emailAddress: '',
          dateOfBirth: ''
        });
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to submit registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Helmet>
          <title>Registration Successful - CGCC 2025 | Chinmaya Mission Vasai</title>
          <meta name="description" content="Successfully registered for CGCC 2025 competition" />
        </Helmet>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Registration Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for registering for CGCC 2025. We will contact you with further details.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setError('');
            }}
            className="w-full bg-[#BC3612] hover:bg-[#A52D0F] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Register Another Participant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <Helmet>
        <title>CGCC 2025 Registration | Chinmaya Mission Vasai</title>
        <meta name="description" content="Register for Chinmaya Gita Chanting Competition 2025" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            CGCC 2025 Registration
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Chinmaya Gita Chanting Competition 2025
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Fill in all the required details to complete your registration
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Registration Via */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Registration via <span className="text-red-500">*</span>
                </label>
                <select
                  name="registrationVia"
                  value={formData.registrationVia}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select registration source</option>
                  {registrationOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Other Specify */}
              {formData.registrationVia === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specify <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="otherSpecify"
                    value={formData.otherSpecify}
                    onChange={handleInputChange}
                    placeholder="Please specify"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaUser className="inline mr-2" />
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  placeholder="Enter middle name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* School and Standard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaSchool className="inline mr-2" />
                  School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  placeholder="Enter school name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Standard <span className="text-red-500">*</span>
                </label>
                <select
                  name="standard"
                  value={formData.standard}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select standard</option>
                  {standards.map(std => (
                    <option key={std} value={std}>{std}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Parent Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaUser className="inline mr-2" />
                  Parent Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  placeholder="Enter parent's name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaPhone className="inline mr-2" />
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit mobile number"
                  pattern="[6-9][0-9]{9}"
                  maxLength="10"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Email and DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaCalendarAlt className="inline mr-2" />
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#BC3612] hover:bg-[#A52D0F] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Submitting Registration...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All fields marked with <span className="text-red-500">*</span> are mandatory
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterCGCC2025;
