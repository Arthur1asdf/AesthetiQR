import { useState, useEffect } from "react";
import {
  FiSearch,
  FiUser,
  FiLogIn,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import logoVideo from "../assets/logo.mp4"; // Adjust the path based on your file structure
import { SignedIn, SignedOut, useSession } from "@clerk/clerk-react";

// Define TypeScript interfaces
interface Template {
  id: number;
  title: string;
  description: string;
}

const TemplateCard = ({
  id,
  title,
  description,
  selected,
  onClick,
}: {
  id: number;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: id * 0.1 }}
    className={`relative overflow-hidden p-5 rounded-2xl cursor-pointer group ${selected ? "ring-2 ring-white" : ""}`}
    onClick={onClick}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-400 to-pink-500 opacity-70 group-hover:opacity-90 transition-opacity" />
    <div className="absolute inset-0 bg-noise opacity-10" />
    <div className="relative z-10">
      <div className="h-40 bg-white/10 backdrop-blur-sm rounded-lg mb-4 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-pink-300 to-blue-300 rounded-full" />
        </motion.div>
      </div>
      <h3 className="text-white font-bold text-lg">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: selected ? 1 : 0, x: selected ? 0 : -10 }}
        className="flex items-center mt-2 text-white/90"
      >
        <FiArrowRight className="mr-1" />
        <span className="text-xs">Selected</span>
      </motion.div>
    </div>
  </motion.div>
);

const HomePage = () => {
  const { isSignedIn } = useSession();
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleTemplate = (id: number) => {
    setSelectedTemplates((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const templates: Template[] = [
    { id: 1, title: "Neon Glow", description: "Vibrant neon QR design" },
    { id: 2, title: "Cyber Pink", description: "Cyberpunk aesthetic" },
    { id: 3, title: "Purple Haze", description: "Dreamy gradient effect" },
    { id: 4, title: "Aqua Dream", description: "Ocean-inspired colors" },
    { id: 5, title: "Crystal Blue", description: "Clean techy look" },
    { id: 6, title: "Soft Gradient", description: "Pastel color blend" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-pink-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-t-pink-400 border-r-blue-400 border-b-purple-400 border-l-white/50 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-pink-700 text-white">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 bg-noise opacity-10 pointer-events-none" />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header with Auth */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4"
        >
          <div className="flex items-center gap-3">
            <video
              className="w-16 h-16 rounded-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={logoVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <motion.h1
              className="text-6xl py-3 font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              Aestheti-QR
            </motion.h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <motion.div whileHover={{ scale: 1.02 }} className="w-full">
              <div className="relative w-full">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="w-full bg-white/10 backdrop-blur-sm px-4 py-2 pl-10 rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </motion.div>
            <SignedIn>
              <motion.button
                onClick={() => navigate("/profile")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20"
              >
                <FiUser />
                <span>Profile</span>
              </motion.button>
            </SignedIn>
            <SignedOut>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/register")} // Navigate to Register page
                  className="bg-transparent hover:bg-white/10 px-6 py-2 rounded-full border border-white/20"
                >
                  Sign Up
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")} // Navigate to Login page
                  className="bg-white hover:bg-gray-100 text-purple-900 px-6 py-2 rounded-full font-medium"
                >
                  Log In
                </motion.button>
              </div>
            </SignedOut>
          </div>
        </motion.header>

        {/* Template Section */}
        <section className="mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <motion.h2
              className="text-2xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Featured Templates
            </motion.h2>

            {isSignedIn && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                className="flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-medium"
              >
                <FiPlus />
                <span>Create New</span>
              </motion.button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  id={template.id}
                  title={template.title}
                  description={template.description}
                  selected={selectedTemplates.includes(template.id)}
                  onClick={() => toggleTemplate(template.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
