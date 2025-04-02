import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaDownload, FaSave } from "react-icons/fa";
import QRCodeStyling from "qr-code-styling";
import axios from "axios";

const AIPromptGenerator: React.FC = () => {
  // for image upload
  const [image, setImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");

  // for open ai
  const [prompt, setPrompt] = useState("");
  const [imageAI, setImageAI] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // for qr generation
  const [url, setUrl] = useState("");
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("http://localhost:3000/api/openai/generate-image", { prompt });
      
      if (response.data.success) {
        setImageUrl(response.data.data.imageUrl);
      } else {
        setError("Failed to generate image.");
      }
    } catch (err) {
      setError("Error generating image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = () => {
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: 200,
        height: 200,
        type: "svg",
        data: url || "https://your-default-url.com", // uses user input url or default
        image: image ? image : undefined, // uses uploaded image if available
        dotsOptions: { color: "#000", type: "rounded" },
        backgroundOptions: { color: "#fff" },
        imageOptions: { crossOrigin: "anonymous", margin: 5, imageSize: 1 },
      });
    } else {
      qrCodeRef.current.update({
        data: url || "https://your-default-url.com",
        image: image ? image : undefined,
      });
    }
    // Ensure QR code renders inside the container
    if (canvasRef.current) {
      canvasRef.current.innerHTML = ""; // Clear previous QR code
      qrCodeRef.current.append(canvasRef.current);
    }
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string); // ensure e.target is not null, type assertion to force it as a string and display image preview
      };
      reader.readAsDataURL(file); // ensures result is always a string
    }
  };

  const downloadQRCode = () => {
    qrCodeRef.current?.download({ name: "qrcode", extension: "png" });
  };

  return (
    <div id="mainBackground" className="w-full min-h-screen flex flex-col justify-center items-center text-white bg-gradient-to-br from-purple-700 via-pink-600 to-blue-500">

      {/* title bar: fixed logo at top of screen with the back button*/}
      <div id="topHeader" className="w-full flex items-center justify-between p-4 shadow-lg">

        {/* back button*/}
        <button id="backButton" className="flex items-center text-white text-lg hover:text-gray-300 bg-gray-700 px-4 py-2 rounded">
          <FaArrowLeft className="mr-2" /> Back
        </button>

        {/* logo */}
        <div id="logoContainer" className="flex items-center">
          <div id="logoImg" className="bg-purple-400 p-8 rounded-full mr-4"></div>
          <h1 id="logoText" className="text-5xl font-bold">AestheticQr</h1>
        </div>

        {/* profile section (incoming drop-down menu) */}
        <div id="profileContainer" className="flex items-center">
          <span id="username" className="mr-3 text-xl font-semibold">Name</span>
          <div id="pfp" className="w-15 h-15 bg-gray-500 rounded-full"></div>
        </div>
      </div>

      {/* main container filling the remaining space */}
      <div id="mainContainer" className="flex w-full h-full space-x-1 p-1 opacity-70">

        {/* left container */}
        <div id="leftContainer" className="flex-col rounded-2xl shadow-lg w-full max-w-3xl items-center justify-center">
          <div id="leftSubcontainer" className="rounded-2xl p-3 shadow-lg w-full max-w-3xl bg-[#1A1B1E]">

            {/* prompt with the image side by side container */}
            <div id="promptwimageContainer" className="flex p-5 space-x-3 items-start rounded-2xl bg-[#B3B3B3]">
              <div id="promptContainer" className="flex-1">
                {/* prompt input */}
                <label id="promptLabel" className="block text-lg mb-2 text-black">What can I help you with?</label>
                <textarea id="promptextArea"
                  className="w-full p-6 text-lg rounded-xl text-black placeholder-gray-500 focus:ring-pink-400 h-56 bg-white"
                  placeholder="Enter a description for the image..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                ></textarea>

                {/* generate image button */}
                <button
                  onClick={generateImage}
                  className="cursor-pointer mt-2 w-full flex items-center justify-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  disabled={loading}
                >{loading ? "Generating..." : "Generate Image"}</button>

                {/* display error */}
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>

              <div id="uploadImgPlaceholderContainer">
                {/* display generated image */}
                <div id="uploadImagePlaceholder" className="w-64 aspect-square border-10 border-gray-600 flex items-center justify-center rounded-lg bg-white p-10">
                  {imageUrl ? (
                      <img src={imageUrl} alt="Generated" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                      <span className="text-gray-400">No image yet</span>
                  )}
                </div>

                {/* save button for generated image */}
                <div className="mt-3">
                  <button id="saveGenImgBtn" className="cursor-pointer w-full flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl shadow-md">
                    <FaSave className="mr-2" /> Save
                  </button>
                </div>
              </div>   
            </div>

            <div id="imgUploadContainer" className="flex mt-3 p-5 space-x-3 items-start rounded-2xl bg-[#B3B3B3]">
              <div>
                <label id="uploadLabel" className="block text-lg mb-5 text-black">Upload An Image:</label>
                {/* Image Upload Button */}
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Upload Image
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={uploadImage} 
                    className="hidden"
                  />
                </label>

                {/* Show uploaded file name */}
                {uploadedFileName && <p className="mt-2 text-sm text-gray-800">{uploadedFileName}</p>}
              
                {/* Placeholder for uploaded image */}
                <div className="w-64 h-64 mt-5 border-2 border-gray-600 rounded-lg flex items-center justify-center bg-white">
                  {image ? (
                    <img src={image} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-gray-400">No image yet</span>
                  )}
                </div>

                {/* Generate QR Code from upload image */}
                <div className="flex-1 bg-gray-900 p-1 mt-5 rounded-lg shadow-lg flex items-center justify-center">
                  <button 
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 w-full"
                    onClick={generateQRCode}
                  >
                    Generate QR Code
                  </button>
                </div>
              </div>

              {/* Right side: URL input and display QR code */}
              <div className="flex-1 flex flex-col items-center">
                <label id="urlLabel" className="block text-lg mb-3 text-black">Input an URL:</label>
                {/* input for url */}
                <input 
                  type="text" 
                  placeholder="Enter URL for QR code"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full p-2 border-3 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
                
                <label id="qrLabel" className="block text-lg mt-5 text-black">Your Generated QR:</label>
                {/* display qr code */}
                <div ref={canvasRef} className="w-64 h-64 mt-2 border-2 border-gray-600 rounded-lg flex items-center justify-center bg-white">
                  {/* QR Code will be rendered here */}
                </div>
              </div>

            </div> {/* end of image upload container */}  
          </div> {/* end of left subcontainer */}
        </div> {/* end of main left container */}

        {/* right container */}
        <div id="rightSubcontainer" className="rounded-2xl p-4 shadow-lg w-full bg-[#1A1B1E]">
          {}
        </div>
      </div> 

    </div>
  );
};

export default AIPromptGenerator;