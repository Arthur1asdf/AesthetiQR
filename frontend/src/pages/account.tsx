import React from "react";
import { FaUser, FaLock, FaBirthdayCake, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

const AccountPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-900 via-blue-800 to-pink-800 min-h-screen text-white">
      <div className="relative w-full max-w-2xl mx-auto p-6 bg-black/60 rounded-2xl shadow-lg">
        {/* Back Button */}
        <button
          onClick={() => navigate("/library")} // Navigate to Library page
          className="absolute top-6 left-6 p-2 bg-black/40 hover:bg-black/60 rounded-full"
        >
          <FaArrowLeft className="text-white text-lg" />
        </button>

        <h1 className="text-4xl font-bold text-purple-400 mb-6 text-center">Account Settings</h1>

        {/* Account Settings Form */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full">
          <div className="mb-4">
            <label className="block text-pink-400">Profile Picture</label>
            <input type="file" className="mt-2 p-2 w-full border rounded bg-gray-800" />
          </div>

          <div className="mb-4">
            <label className="block text-purple-400 flex items-center"><FaUser className="mr-2" /> Name</label>
            <input type="text" className="mt-2 p-2 w-full border rounded bg-gray-800" placeholder="Enter your name" />
          </div>

          <div className="mb-4">
            <label className="block text-pink-400 flex items-center"><FaLock className="mr-2" /> Password</label>
            <input type="password" className="mt-2 p-2 w-full border rounded bg-gray-800" placeholder="Enter new password" />
          </div>

          <div className="mb-4">
            <label className="block text-purple-400 flex items-center"><FaBirthdayCake className="mr-2" /> Birthdate</label>
            <input type="date" className="mt-2 p-2 w-full border rounded bg-gray-800" />
          </div>

          <div className="flex justify-between mt-6">
            <button className="bg-red-600 px-4 py-2 rounded flex items-center">
              <FaTrash className="mr-2" /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
