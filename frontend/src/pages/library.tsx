import React from "react";
import { FaUserCog, FaPlus, FaThLarge, FaClipboard } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const LibraryPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Handler functions for navigation
  const navigateToHome = () => navigate("/loggedinhomepage");
  const navigateToWhiteboard = () => navigate("/whiteboard");
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-blue-500 flex justify-center items-start px-6 py-10">
      <div className="flex w-full max-w-6xl gap-12">
        {/* Sidebar */}
        <div className="w-64 bg-black bg-opacity-10 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl text-white mb-6">Navigation</h2>
          <button 
            onClick={navigateToHome} // Navigate to Home page
            className="w-full bg-purple-600 text-white px-4 py-3 rounded flex items-center gap-2 hover:bg-purple-700 mb-4">
            <FaThLarge /> Home
          </button>
          <button 
            onClick={navigateToWhiteboard} // Navigate to Whiteboard page
            className="w-full bg-pink-500 text-white px-4 py-3 rounded flex items-center gap-2 hover:bg-pink-600 mb-4">
            <FaClipboard /> Whiteboard
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-black bg-opacity-10 p-8 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bagel text-center text-white mb-6">Your Library</h1>
          <h2 className="text-2xl text-gray-300 mb-6">Your Saved Templates</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Example Templates */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">Template 1</div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">Template 2</div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">Template 3</div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">Template 4</div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">Template 5</div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">Template 6</div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">Template 7</div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">Template 8</div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">Template 9</div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">Template 10</div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">Template 11</div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">Template 12</div>
            {/* More templates would be dynamically loaded here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
