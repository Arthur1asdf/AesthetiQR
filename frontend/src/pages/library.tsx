import { useClerk, useUser } from "@clerk/clerk-react";
import React, { useState } from "react";
import { FaThLarge, FaClipboard, FaArrowCircleLeft } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import logoVideo from "../assets/logo.mp4";

const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Use Clerk's useUser hook to access user data
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return <div>Loading...</div>; // Loading state while Clerk is loading user info
  }

  // If not signed in, redirect to sign-in page
  if (!isSignedIn) {
    navigate("/sign-in");
    return null;
  }

  // Accessing user details from Clerk
  const displayName = user.fullName || user.primaryEmailAddress?.emailAddress || "User";
  const avatarUrl = user.imageUrl || "/default-avatar.png"; // Fallback to a default image if not set

  // Navigation actions
  const navigateToHome = () => navigate("/dashboard");
  const navigateToWhiteboard = () => navigate("/whiteboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-blue-500 flex px-6 py-10">
      {/* Left Sidebar */}
      <div className="flex flex-col items-start mr-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-white text-lg hover:text-gray-300 bg-gray-700 px-4 py-2 rounded"
        >
          <FaArrowCircleLeft className="mr-2" /> Back
        </button>

        {/* Sidebar */}
        <div className="w-52 bg-black bg-opacity-10 p-4 rounded-2xl shadow-lg">
          <h2 className="text-xl text-white mb-4">Navigation</h2>
          <button
            onClick={navigateToHome}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-700 mb-3"
          >
            <FaThLarge /> Home
          </button>
          <button
            onClick={navigateToWhiteboard}
            className="w-full bg-pink-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-pink-600"
          >
            <FaClipboard /> Whiteboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center w-full">
        {/* Top Bar */}
        <div className="w-full flex items-center justify-between mb-10">
          {/* Logo */}
          <div className="flex items-center">
            <video
              className="w-16 h-16 rounded-full object-cover mr-4"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={logoVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300">
              Aestheti-Qr
            </h1>
          </div>

          {/* Profile Section */}
          <div className="relative flex items-center space-x-3">
            <span className="text-xl font-semibold text-white">{displayName}</span>
            <img
              src={avatarUrl}
              alt="Profile"
              onClick={() => setMenuOpen(prev => !prev)}
              className="w-14 h-14 bg-gray-500 rounded-full cursor-pointer border-4 border-neutral-700"
            />
            {menuOpen && (
              <div className="absolute right-0 top-16 w-48 bg-pink-400 rounded-lg shadow-lg z-10 text-lg">
                <Link to="/dashboard" className="block rounded-lg px-4 py-2 hover:bg-pink-200">
                  Dashboard
                </Link>
                <Link to="/library" className="block rounded-lg px-4 py-2 hover:bg-pink-200">
                  Library
                </Link>
                <Link to="/whiteboard" className="block rounded-lg px-4 py-2 hover:bg-pink-200">
                  Whiteboard
                </Link>
                <Link to="/profile" className="block rounded-lg px-4 py-2 hover:bg-pink-200">
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left rounded-lg px-4 py-2 hover:bg-pink-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Library Section */}
        <div className="w-full bg-black bg-opacity-10 p-8 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bagel text-center text-white mb-6">Your Library</h1>
          <h2 className="text-2xl text-gray-300 mb-6 text-center">Your Saved Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-900 p-6 rounded-lg shadow-lg text-white text-center"
              >
                Template {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
