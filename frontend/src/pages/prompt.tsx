import React, { useState } from "react";
import { FaArrowLeft, FaDownload, FaSave } from "react-icons/fa";

const AIPromptGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-blue-500">
      <div className="p-12 rounded-2xl shadow-2xl w-[1000px] text-white backdrop-blur-md border border-white border-opacity-20 relative">
        <button className="absolute top-4 left-2 flex items-center text-white hover:text-pink-300">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-4xl font-bagel text-white">AestheticQR</h1>
        </div>
        <div className="bg-black bg-opacity-50 p-10 rounded-lg w-full">
          <label className="block text-lg mb-2 text-white">What Can I Help With?</label>
          <textarea
            className="w-full p-6 text-lg rounded-xl bg-transparent text-black placeholder-gray-500 focus:ring-2 focus:ring-pink-400 h-56 bg-white"
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <div className="mt-6">
            <label className="block mb-2 text-white">Upload Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={uploadImage} 
              className="block w-full text-white bg-transparent p-3 rounded-xl cursor-pointer"
            />
          </div>
          <div className="mt-6">
            <button className="w-full flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl shadow-md">
              <FaSave className="mr-2" /> Save
            </button>
          </div>
          <div className="mt-8 p-6 text-white rounded-xl flex justify-center items-center shadow-lg">
            <span className="text-2xl font-bold">QR CODE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPromptGenerator;

