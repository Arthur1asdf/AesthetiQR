import React from "react";
import { FaUserCog, FaPlus, FaThLarge, FaClipboard } from "react-icons/fa";

const LibraryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold text-purple-400 mb-6">Your Library</h1>
      
      <div className="flex gap-4 mb-6">
        <button className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-700">
          <FaThLarge /> Templates
        </button>
        <button className="bg-pink-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-pink-600">
          <FaClipboard /> Whiteboard
        </button>
        <button className="bg-gray-800 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-900">
          <FaUserCog /> Account Settings
        </button>
      </div>

      <h2 className="text-2xl text-gray-300 mb-4">Your Saved Templates</h2>
      <div className="grid grid-cols-3 gap-4">
        {/* Example Templates */}
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg">Template 1</div>
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg">Template 2</div>
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg">Template 3</div>
        {/* More templates would be dynamically loaded here */}
      </div>
    </div>
  );
};

export default LibraryPage;
