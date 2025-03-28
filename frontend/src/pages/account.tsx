import React from "react";
import { FaUser, FaLock, FaBirthdayCake, FaCreditCard, FaCog, FaTrash } from "react-icons/fa";

const AccountPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-6 bg-black min-h-screen text-white">
      <h1 className="text-4xl font-bold text-purple-400 mb-6">Account Settings</h1>
      
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
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
        
        <div className="mb-4">
          <label className="block text-pink-400 flex items-center"><FaCreditCard className="mr-2" /> Payment Info</label>
          <input type="text" className="mt-2 p-2 w-full border rounded bg-gray-800" placeholder="Card details" />
        </div>
        
        <div className="flex justify-between mt-6">
          <button className="bg-red-600 px-4 py-2 rounded flex items-center">
            <FaTrash className="mr-2" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
