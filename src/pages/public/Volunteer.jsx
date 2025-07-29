import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Volunteer = () => {
  const location = useLocation();

  // Effect to handle scrolling to form section when URL has the right hash
  useEffect(() => {
    if (location.hash === "#volunteer-form") {
      setTimeout(() => {
        const element = document.getElementById("volunteer-form");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // Small delay to ensure the component is fully rendered
    }
  }, [location]);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Form-related states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setphoneNo] = useState("");
  const [dob, setDob] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Function to send OTP
  const handleSendOtp = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/send-otp-email`, { email });
      setOtpSent(true);
      alert("OTP sent to your email. Please check your inbox.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/verify-otp`, {
        identifier: email,
        otp,
      });
  
      // Check if the response contains the success key
      if (response.data && response.data.success) {
        setOtpVerified(true);
        alert("OTP verified successfully!");
        setOtpError("");
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("Failed to verify OTP. Please try again.");
    }
  };

  // Function to handle form submission
  const onSubmit = async (event) => {
    event.preventDefault();
  
    // Check if the form is already submitted
    if (formSubmitted) {
      alert("Form already submitted");
      return;
    }
    setFormSubmitted(true); // Set formSubmitted to true
  
    try {
      // Send all form data to the backend
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/volunteer`, {
        firstName,
        lastName,
        email,
        phoneNo, // Ensure phone is included
        dob,
        additionalComments, // Ensure comments are included
      });
  
      alert("Form submitted successfully");
  
      // Reset form fields after successful submission
      setFirstName("");
      setLastName("");
      setEmail("");
      setphoneNo("");
      setDob("");
      setAdditionalComments("");
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
      setFormSubmitted(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
      setFormSubmitted(false); // Reset formSubmitted on error
    }
  };

  return (
    <>
      {/* Background Image Section */}
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center py-8 px-4">
        <div
          className="relative w-full h-[calc(100vh-4rem)] bg-black bg-contain bg-center flex items-end sm:items-center justify-start bg-no-repeat"
          style={{ backgroundImage: "url('/Hanuman.jpeg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 sm:bg-opacity-40" />
          <div className="relative z-10 text-white pl-6 sm:pl-10 md:pl-16 max-w-lg pb-6 sm:pb-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4">
              Volunteering Opportunities
            </h1>
            <p className="text-sm sm:text-base md:text-lg italic">
              “I serve others not because they are others, but because they are my own self”
            </p>
            <p className="text-xs sm:text-sm md:text-base mt-2">
              - Pujya Gurudev Swami Chinmayananda
            </p>
          </div>
        </div>
      </div>

       {/* Why Serve Section */}
       <div className="bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center py-8 px-4">
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-2xl dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] p-6 rounded-lg w-full max-w-4xl flex flex-col gap-6 transition-all duration-300">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Why Serve?</h1>
          <div className="space-y-4 text-sm sm:text-base md:text-lg leading-relaxed">
            <p>
              Chinmaya Mission Sevaks (volunteers) strive to serve in a spirit of selfless action. Serving all as worship of the Lord.
            </p>
            <p>
              Whatever the task, be it great or small, service conducted without the expectation of personal gain shortens the ego and brings us peace and contentment within.
            </p>
            <p>Register your interest using the form below.</p>
          </div>
        </div>
      </div>

      {/* YouTube Video Section */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center py-8 px-4">
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-2xl dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] p-6 rounded-lg w-full max-w-4xl flex flex-col gap-6 transition-all duration-300">
          <div className="w-full h-[200px] sm:h-[315px] overflow-hidden rounded-md">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/B66u9DNMkvQ?si=0IVEqs2pHQ1ej_fx"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div id="volunteer-form" className="bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center py-8 px-4">
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-2xl dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] p-6 rounded-lg w-full max-w-4xl flex flex-col gap-6 transition-all duration-300">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
          Join Us
          </h1>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email and OTP Section */}
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              name="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              disabled={otpVerified}
            />

            <div className="space-y-4">
              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="bg-blue-500 text-white px-6 py-3 rounded-md w-full sm:w-auto hover:bg-blue-600 transition-all duration-300 font-semibold"
                >
                  Send OTP
                </button>
              )}

              {otpSent && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="border border-gray-300 dark:border-gray-600 p-3 rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={otpVerified}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="bg-green-500 text-white px-6 py-3 rounded-md w-full sm:w-auto hover:bg-green-600 transition-all duration-300 font-semibold"
                    disabled={otpVerified}
                  >
                    Verify OTP
                  </button>
                  {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
                </>
              )}
            </div>

            {/* Other Form Fields */}
            <input
              type="text"
              placeholder="First Name"
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              name="First Name"
              required
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              disabled={!otpVerified}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              name="Last Name"
              required
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              disabled={!otpVerified}
            />
            <input
              type="number"
              placeholder="Phone No"
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              name="Phone No"
              required
              onChange={(e) => setphoneNo(e.target.value)}
              value={phoneNo}
              disabled={!otpVerified}
            />
            <input
              type="date"
              placeholder="DOB"
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              name="DOB"
              required
              onChange={(e) => setDob(e.target.value)}
              value={dob}
              disabled={!otpVerified}
            />
            <input
              type="text"
              placeholder="Additional Comments"
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              name="Additional Comments"
              onChange={(e) => setAdditionalComments(e.target.value)}
              value={additionalComments}
              disabled={!otpVerified}
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-md w-full sm:w-auto hover:bg-blue-600 transition-all duration-300 font-semibold"
              disabled={!otpVerified}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Volunteer;