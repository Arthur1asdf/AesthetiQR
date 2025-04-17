import { useClerk, useReverification, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState, useRef } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaArrowCircleLeft,
  FaCalendarAlt,
} from "react-icons/fa";
import DatePicker from 'react-datepicker';
import { format } from "date-fns";
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for routing

const Profile: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [password, setPassword] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>(
    (user?.unsafeMetadata?.birthdate as string) ?? "",
  );
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const datepickerRef = useRef<any>(null); // ref for the datepicker

  const { signOut } = useClerk();

  const navigate = useNavigate(); // Initialize navigate function for routing
  const updateUser = useReverification(async () => {
    await user?.setProfileImage({ file: profilePic });
    await user?.update({ username, unsafeMetadata: { birthdate } });
    if (password) {
      user?.updatePassword({
        newPassword: password,
      });
    }
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.imageUrl) return;
    const fetchProfilePic = async () => {
      const response = await fetch(user.imageUrl);
      const buffer = await response.arrayBuffer();
      setProfilePic(new File([buffer], "profile.jpg", { type: "image/jpeg" }));
    };
    fetchProfilePic();
  }, []);

  if (!isSignedIn || !user) {
    navigate("/login");
    return null;
  }

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
    navigate("/dashboard"); // Change this to your logged-in home page route
  };

  // handle date change
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formatted = format(date, "yyyy-MM-dd");
      setBirthdate(formatted);
    } else {
      setBirthdate("");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-700 via-pink-600 to-blue-500 min-h-screen text-pink-500 text-lg">
      <h1 className="text-5xl bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 font-bold py-4">Edit Profile</h1>

      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="absolute top-4 left-4 text-pink-100 hover:text-pink-300 flex items-center"
        >
          <FaArrowCircleLeft className="mr-2" />
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
            <div className="w-36 h-36 rounded-full overflow-hidden mb-4 border-4 border-pink-500">
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
          <p className="text-sm text-pink-400">
            Click to choose a profile picture
          </p>
        </div>

        {/* Username Section */}
        <div className="mb-4">
          <label className="block text-xl text-pink-400 mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Enter your username"
          />
        </div>

        {/* Password Section */}
        <div className="mb-4">
          <label className="block text-xl text-pink-400 mb-2" htmlFor="password">
            New Password
          </label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter your new password"
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
        <div className="mb-4">
          <label className="block text-xl text-pink-400 mb-2" htmlFor="birthdate">
            Birthdate
          </label>
          <div className="relative">
            <DatePicker
              ref={datepickerRef}
              selected={birthdate ? new Date(birthdate) : null}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Enter your birthday"
              className="w-full px-4 py-2 pr-60 border rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-pink-500 hover:text-pink-600"
              onClick={() => datepickerRef.current?.setFocus()}
            >
              <FaCalendarAlt className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-2">
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg w-full flex-1"
            onClick={updateUser}
          >
            Save Changes
          </button>
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg w-full flex-1"
            onClick={async () => await signOut({ redirectUrl: "/" })}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
