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
    <div className="flex items-center justify-center h-screen bg-pink-300">
      <div className="bg-[#3D3131] p-8 rounded-lg shadow-lg w-[800px] text-white relative">
        <button className="absolute top-4 left-4 flex items-center text-white">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="flex justify-center items-center mb-4">
          <div className="bg-purple-400 p-2 rounded-full mr-2"></div>
          <h1 className="text-3xl font-bold">AesthetiQR</h1>
        </div>
        <label className="block text-lg mb-2">What Can I Help With?</label>
        <textarea
          className="w-full p-2 rounded bg-white text-black"
          placeholder="Ask anything"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>
        <div className="mt-4">
          <label className="block mb-2">Upload Image</label>
          <input type="file" accept="image/*" onChange={uploadImage} className="block w-full text-black" />
        </div>
        <div className="mt-4">
          <label className="block mb-2">Save</label>
          <button className="w-full flex items-center justify-center bg-white text-black py-2 rounded">
            <FaSave className="mr-2" /> Save
          </button>
        </div>
        <div className="mt-6 p-4 bg-white text-black rounded-lg border-4 border-pink-500 flex justify-center items-center">
          <span className="text-2xl font-bold">QR CODE</span>
        </div>
      </div>
    </div>
  );
};

export default AIPromptGenerator;