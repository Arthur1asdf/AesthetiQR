import React, { useState } from "react";
import { FaUser, FaLock, FaBirthdayCake, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for routing

const Profile: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const navigate = useNavigate(); // Initialize navigate function for routing

  // Handle profile picture change
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfilePic(e.target.files[0]);
    }
  };

  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate("/loggedinhomepage"); // Change this to your logged-in home page route
  };

  return (
    <div className="flex flex-col items-center p-6 bg-black min-h-screen text-pink-500">
      <h1 className="text-4xl font-bold mb-6">Edit Profile</h1>

      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="absolute top-4 left-4 text-pink-500 hover:text-pink-400 flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to Home
        </button>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <input
            type="file"
            onChange={handleProfilePicChange}
            className="hidden"
            id="profilePicInput"
          />
          <label htmlFor="profilePicInput" className="cursor-pointer">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-pink-500">
              {profilePic ? (
                <img
                  src={URL.createObjectURL(profilePic)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-pink-500">+</span>
                </div>
              )}
            </div>
          </label>
          <p className="text-sm text-pink-400">Click to choose a profile picture</p>
        </div>

        {/* Username Section */}
        <div className="mb-4">
          <label className="block text-pink-400 mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-pink-500"
            placeholder="Enter your username"
          />
        </div>

        {/* Password Section */}
        <div className="mb-4">
          <label className="block text-pink-400 mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded bg-gray-800 text-pink-500"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-pink-500"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Birthdate Section */}
        <div className="mb-6">
          <label className="block text-pink-400 mb-2" htmlFor="birthdate">
            Birthdate
          </label>
          <input
            type="date"
            id="birthdate"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-pink-500"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded w-full max-w-sm"
            onClick={() => {
              // Handle save logic here, e.g., make API call to save the profile info
              alert("Profile saved!");
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;



