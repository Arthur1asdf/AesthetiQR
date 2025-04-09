import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaDownload, FaSave } from "react-icons/fa";
import QRCodeStyling, { CornerSquareType, DotType } from "qr-code-styling";
import axios from "axios";
import logoVideo from '../assets/logo.mp4';

const AIPromptGenerator: React.FC = () => {
  // for image upload
  const [image, setImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");

  // for open ai
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // for qr generation
  const [url, setUrl] = useState("");
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [dotsShape, setDotsShape] = useState("dots");
  const [dotsColor, setDotsColor] = useState("#000000");
  const [cornerStyle, setCornerStyle] = useState("square");
  const [cornerColor, setCornerColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [hideBackgroundDots, setHideBackgroundDots] = useState(false);
  const [imageSize, setImageSize] = useState(1.0);

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

  // fetch the image as a blob and trigger the download manually
  const downloadImage = async () => {
    if (!imageUrl || loading) return;
  
    try {
      const encodedUrl = encodeURIComponent(imageUrl);
      const encodedPrompt = encodeURIComponent(prompt);
  
      const downloadLink = document.createElement("a");
      downloadLink.href = `http://localhost:3000/api/openai/download-image?imageUrl=${encodedUrl}&prompt=${encodedPrompt}`;
      downloadLink.setAttribute("download", `${prompt.replace(/\s+/g, "_").toLowerCase()}.png`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Error downloading image. Try again.");
    }
  };
  

  const generateQRCode = () => {
    if (!url.trim()) {
      alert("Please enter a valid URL for the QR Code.");
      return;
    }

    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "svg",
        data: url, // uses user input url
        image: image ? image : undefined, // uses uploaded image if available
        dotsOptions: { 
          color: cornerColor, 
          type: dotsShape as DotType, 
        },
        cornersSquareOptions: {
          color:cornerColor,
          type: cornerStyle as CornerSquareType,
        },
        backgroundOptions: { 
          color: bgColor,
        },
        imageOptions: { 
          crossOrigin: "anonymous", 
          margin: 5,
          hideBackgroundDots, 
          imageSize, 
        },
      });
    } else {
      qrCodeRef.current.update({
        data: url,
        image: image ? image : undefined,
      });
    }
    // Ensure QR code renders inside the container
    if (canvasRef.current) {
      canvasRef.current.innerHTML = ""; // Clear previous QR code
      qrCodeRef.current.append(canvasRef.current);
    } else {
      console.error("Canvas ref is null. Make sure it's properly assigned in the JSX.");
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
          <h1 id="logoText" className="text-5xl font-bold">Aestheti-Qr</h1>
        </div>

        {/* profile section (incoming drop-down menu) */}
        <div id="profileContainer" className="flex items-center">
          <span id="username" className="mr-3 text-xl font-semibold">Name</span>
          <div id="pfp" className="w-15 h-15 bg-gray-500 rounded-full"></div>
        </div>
      </div>

      {/* main container filling the remaining space */}
      <div id="mainContainer" className="flex w-full h-full space-x-1 p-1 opacity-80">

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
                <div className="mt-2 bg-gray-900 p-1 rounded-lg  shadow-md">
                  <button
                    onClick={generateImage}
                    className="cursor-pointer w-full flex items-center justify-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    disabled={loading}
                  >{loading ? "Generating..." : "Generate Image"}</button>
                </div>

                {/* display error */}
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>

              <div id="uploadImgPlaceholderContainer">
                {/* display generated image */}
                <div id="uploadImagePlaceholder" className="w-64 aspect-square border-10 border-gray-600 flex items-center justify-center rounded-lg bg-white p-1">
                  {imageUrl ? (
                      <img src={imageUrl} alt="Generated" className="w-full h-full object-cover" />
                  ) : (
                      <span className="text-gray-400">No image yet</span>
                  )}
                </div>

                {/* save button for generated image */}
                <div className="mt-3 bg-gray-900 p-1 rounded-lg shadow-md">
                  <button 
                    id="saveGenImgBtn"
                    onClick={downloadImage}
                    disabled={!imageUrl}
                    className="cursor-pointer w-full flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg transition"
                  >
                    <FaSave className="mr-2" /> Save
                  </button>
                </div>
              </div>   
            </div>

            <div id="imgUploadContainer" className="flex mt-3 p-5 space-x-3 items-start rounded-2xl bg-[#B3B3B3]">
              <div>
                <label id="uploadLabel" className="block text-lg mb-3 text-black">Upload An Image:</label>
                {/* Image Upload Button */}
                <div className="flex-1 bg-gray-900 p-1 rounded-lg shadow-lg flex items-center justify-center">
                  <label className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 w-full text-center">Upload Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={uploadImage} 
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Show uploaded file name */}
                {uploadedFileName && <p className="mt-2 text-sm text-gray-800">{uploadedFileName}</p>}
              
                {/* Placeholder for uploaded image */}
                <div className="w-96 h-96 mt-5 border-2 border-gray-600 rounded-lg flex items-center justify-center bg-white">
                  {image ? (
                    <img src={image} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-gray-400">No image yet</span>
                  )}
                </div>

                {/* Generate QR Code from upload image */}
                <div className="flex-1 bg-gray-900 p-1 mt-5 rounded-lg shadow-lg flex items-center justify-center">
                  <button 
                    className="cursor-pointer bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 w-full"
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
                
                <label id="qrLabel" className="block text-2xl mt-5 text-black">Your Generated QR:</label>
                {/* display qr code */}
                <div ref={canvasRef} className="w-64 h-64 mt-5 border-2 border-gray-600 rounded-lg flex items-center justify-center bg-white">
                  {/* QR Code will be rendered here */}
                </div>

                {/* save qr code */}
                <div className="w-64 bg-gray-900 mt-4 p-1 rounded-lg shadow-lg">
                  <button id="saveQrBtn" className="cursor-pointer w-full flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg shadow-md">
                    <FaSave className="mr-2" /> Save
                  </button>
                </div>
              </div>

            </div> {/* end of image upload container */}  
          </div> {/* end of left subcontainer */}
        </div> {/* end of main left container */}

        {/* right container */}
        <div id="rightSubcontainer" className="rounded-2xl p-3 shadow-lg w-full bg-[#1A1B1E]">
          <div id="rightSubcontainer" className="flex p-5 space-x-3 justify-center items-start rounded-2xl bg-[#B3B3B3]">
            <div id="customizeContainer" className="flex-1 space-y-5 text-black">

              {/* section title */}
              <h2 className="text-3xl font-bold text-center mb-4">Customize Your QR Code</h2>

              {/* dots shape + corner squares options */} 
              <div className="flex space-x-4">
                {/* dots shape options */}
                <div id="dotsShape" className="flex-1">
                  <label className="block text-lg mb-2">Dot Shape:</label>
                  <select
                    className="w-full p-2 border-3 bg-pink-500 rounded-lg text-white"
                    value={dotsShape}
                    onChange={(e) => setDotsShape(e.target.value)}
                  >
                    <option value="square">Square</option>
                    <option value="dots">Dots</option>
                    <option value="rounded">Rounded</option>
                    <option value="extra-rounded">Extra Rounded</option>
                    <option value="classy">Classy</option>
                  </select>
                </div>

                {/* corners square options */}
                <div id="cornerSquare" className="flex-1">
                  <label className="block text-lg mb-2">Corner Style:</label>
                  <select
                    className="w-full p-2 border-3 bg-pink-500 rounded-lg text-white"
                    value={cornerStyle}
                    onChange={(e) => setCornerStyle(e.target.value)}
                  >
                    <option value="square">Square</option>
                    <option value="dot">Dot</option>
                    <option value="rounded">Rounded</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                </div>
              </div>  
              
              {/* dot color + corner color */}
              <div className="flex space-x-4">
                {/* dot color */}
                <div id="dotColor" className="flex-1">
                  <label className="block text-lg mb-2">Dot Color:</label>
                  <input
                    type="color"
                    className="h-12 w-full rounded bg-white"
                    value={dotsColor}
                    onChange={(e) => setDotsColor(e.target.value)}
                  />
                </div>

                {/* corner color */}
                <div id="cornerColor" className="flex-1">
                  <label className="block text-lg mb-2">Corner Color:</label>
                  <input
                    type="color"
                    className="h-12 w-full rounded bg-white"
                    value={cornerColor}
                    onChange={(e) => setCornerColor(e.target.value)}
                  />
                </div>
              </div>

              {/* background color */}
              <div id="bgColor" className="flex flex-col">
                <label className="text-lg mb-1">Background Color:</label>
                <input
                  type="color"
                  className="h-10 w-full p-1 rounded-lg"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </div>

              {/* show/hide dots behind image */}
              <div id="dotsVisibility" className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="hideDots"
                  checked={hideBackgroundDots}
                  onChange={(e) => setHideBackgroundDots(e.target.checked)}
                />
                <label htmlFor="hideDots" className="text-lg">Hide Dots Behind Image</label>
              </div>

              {/* image size slider */}
              <div id="imageSize" className="flex flex-col">
                <label className="text-lg mb-1">Image Size (% of QR):</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={imageSize}
                  onChange={(e) => setImageSize(parseFloat(e.target.value))}
                  className="w-full"
                />
                <span>{Math.round(imageSize * 100)}%</span>
                
                {/* Generate QR Code from upload image */}
                <div className="flex-1 bg-black p-1 mt-5 rounded-lg shadow-lg flex items-center justify-center">
                  <button 
                    className="cursor-pointer bg-green-500 text-white text-2xl px-6 py-2 rounded-lg hover:bg-green-600 w-full"
                    onClick={generateQRCode}
                  >
                    Generate QR Code
                  </button>
                </div>
                
                {/* qr preview */}
                <label id="qrLabel" className="block text-2xl mt-5 text-black text-center">Your Generated QR:</label>
                <div className="flex justify-center items-center mt-5">
                  <div id="qrPreview" className="w-128 aspect-square mt-5 border-10 border-pink-500 rounded-lg shadow-lg flex items-center justify-center">
                    <div ref={canvasRef} className="w-full h-full bg-white border-2 items-center"></div>
                  </div>
                </div>

                {/* save qr code */}
                <div className="w-full bg-gray-900 mt-4 p-1 rounded-lg shadow-lg">
                  <button id="saveQrBtn" className="cursor-pointer w-full flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white text-2xl py-3 rounded-lg shadow-md">
                    <FaSave className="mr-2" /> SAVE
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div> 

    </div>
  );
};

export default AIPromptGenerator;