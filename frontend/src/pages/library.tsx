import { useClerk, useUser } from "@clerk/clerk-react";
import React, { useState, useEffect } from "react";
import { FaThLarge, FaClipboard, FaArrowCircleLeft, FaQrcode } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import logoVideo from "../assets/logo.mp4";
import axios from "axios";

interface QRCode {
  _id: string;
  imageUrl: string;
  qrcodeName?: string;
}

const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  // Use Clerk's useUser hook to access user data
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
   // for loading qr codes
   const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded && !isSignedIn) {
      navigate("/login");
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Fetch your QR codes
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchQRCodes = async () => {
      setLoading(true);
      setError(null);
      try {
        // POST to getQrcodeAll
        const res = await axios.post("http://localhost:3000/api/qrcode/getQrcodeAll", {
          userId: user.id,
          random: false,
        });

        // GET via searchQrcode
        // const res = await axios.get("/api/qr/searchQrcode", {
        //   params: { userId: user.id },
        // });

        if (res.data.success) {
          setQrCodes(res.data.data);
        } else {
          throw new Error(res.data.error || "Unknown error");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCodes();
  }, [isLoaded, user]);

  if (loading) return <p className="text-center text-white">Loading your library…</p>;
  if (error) return <p className="text-center text-red-400">Error: {error}</p>;

  // Accessing user details from Clerk
  const displayName = user
    ? user.fullName || user.primaryEmailAddress?.emailAddress || "User"
    : "User";
  const avatarUrl = user?.imageUrl || "/default-avatar.png";

  // Navigation actions
  const navigateToHome = () => navigate("/dashboard");
  const navigateToWhiteboard = () => navigate("/whiteboard");

  return (
    <div className="w-full min-h-screen flex flex-col items-center text-white bg-gradient-to-br from-purple-700 via-pink-600 to-blue-500">
      {/* title bar: fixed logo at top of screen with the back button*/}
      <div id="topHeader" className="w-full flex items-center justify-between px-4 py-2 shadow-lg">

        {/* back button*/}
        <button 
          id="backButton"
          onClick={navigateToHome}
          className="flex items-center text-white text-lg hover:text-gray-300 bg-pink-500 px-4 py-2 rounded-lg"
        >
          <FaArrowCircleLeft className="mr-2" /> Back
        </button>

        {/* logo */}
        <div id="logoContainer" className="flex items-center">
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
          <h1 id="logoText" className="py-3 text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300">Aestheti-Qr</h1>
        </div>

        {/* profile section (incoming drop-down menu) */}
        <div id="profileContainer" className="flex items-center space-x-3">
          <span id="username" className="mr-3 text-2xl">{displayName}</span>
          <img 
              id="pfp"
              src={avatarUrl}
              alt="Me"
              onClick={() => setMenuOpen(open => !open)} 
              className="w-18 h-18 bg-gray-500 rounded-full cursor-pointer border-5 border-neutral-700"
            />
          {/* dropdown wrapper */}
          <div className="relative">
            {menuOpen && (
              <div className="absolute right-0 top-8 w-42 bg-pink-500 rounded-lg shadow-lg z-10 text-lg">
                <Link to="/dashboard" className="block rounded-lg px-4 py-2 hover:bg-pink-200">
                  Dashboard
                </Link>
                <Link to="/whiteboard" className="block rounded-lg px-4 py-2 hover:bg-pink-200">
                  Whiteboard
                </Link>
                <Link to="/prompt" className="block rounded-lg px-4 py-2 hover:bg-pink-200">
                  QR Generation
                </Link>
                <Link to="/profile" className="block rounded-lg px-4 py-2 hover:bg-pink-200">
                  Profile
                </Link>
                <button
                  onClick={async () => await signOut({ redirectUrl: "/" })}
                  className="w-full text-left rounded-lg px-4 py-2 hover:bg-pink-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full space-x-1 p-3">
        {/* Sidebar */}
        <div className="flex flex-col items-start mr-2 space-y-6">
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
              className="w-full bg-pink-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-pink-600 mb-3"
            >
              <FaClipboard /> Whiteboard
            </button>
            <button
              onClick={() => navigate("/prompt")}
              className="w-full bg-pink-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-pink-600"
            >
              <FaQrcode /> QR Generation
            </button>
          </div>
        </div>

        {/* Library Section */}
        <div className="w-full bg-black bg-opacity-10 p-8 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bagel text-center text-white mb-6">Your Library</h1>
          <h2 className="text-2xl text-gray-300 mb-6 text-center">Your Saved Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:grid-cols-3 justify-center gap-8">
            {qrCodes.length === 0 ? (
              <p className="col-span-full text-center text-gray-400">
                You haven't saved any QR codes yet.
              </p>           
            ) : (
              qrCodes.map((code) => (
                <div
                  key={code._id}
                  className="w-64 bg-pink-400 p-2 rounded-lg shadow-lg text-white text-center flex flex-col items-center"
                >
                  <img
                    src={code.imageUrl}
                    alt={code.qrcodeName || "QR Code"}
                    className="w-full h-auto mb-4 object-contain"
                  />
                  {code.qrcodeName && <p className="mt-2">{code.qrcodeName}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
