import { useClerk, useUser } from "@clerk/clerk-react";
import React, { useState, useRef, useEffect } from "react";
import { FaArrowCircleLeft, FaDownload, FaSave } from "react-icons/fa";
import QRCodeStyling, { CornerSquareType, DotType, DrawType } from "qr-code-styling";
import axios from "axios";
import logoVideo from '../assets/logo.mp4';
import { useNavigate, Link } from "react-router-dom";

const AIPromptGenerator: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  if (!isLoaded || !isSignedIn || !user) return null;

  // for profile user
  const displayName = user.fullName || user.primaryEmailAddress?.emailAddress;
  const avatarUrl = user.imageUrl;
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut } = useClerk();

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
  // default QR code refs (always uses simple styling)
  const defaultCanvasRef = useRef<HTMLDivElement | null>(null);
  const defaultQRCodeRef = useRef<QRCodeStyling | null>(null);
  // customized QR code refs (will update based on the customize controls)
  const customCanvasRef = useRef<HTMLDivElement | null>(null);
  const customQRCodeRef = useRef<QRCodeStyling | null>(null);

  // for qr backend save
  const [qrName, setQrName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  // some set initial customizations for qr
  const [dotsShape, setDotsShape] = useState("square");
  const [dotsColor, setDotsColor] = useState("#000000");
  const [cornerStyle, setCornerStyle] = useState("square");
  const [cornerColor, setCornerColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [hideBackgroundDots, setHideBackgroundDots] = useState(false);
  const [imageSize, setImageSize] = useState(1.0);

  const navigate = useNavigate();

  // ----------------- Image Generation Functions -----------------
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
  
  // ----------------- QR Code Generation Functions -----------------

  // generates the default QR code with a simple design and renders it into BOTH canvases.
  // the customization canvas will then serve as the starting point for further updates.
  const generateDefaultQRCode = () => {
    if (!url.trim()) {
      alert("Please enter a valid URL for the QR Code.");
      return;
    }

    // define simple default options
    const defaultOptions = {
      width: 300,
      height: 300,
      type: "svg" as DrawType, // cast to DrawType so TS knows it’s not just any string, but a valid DrawType
      data: url, // uses user input url
      image: image ? image : undefined, // uses uploaded image if available
      dotsOptions: { 
        color: dotsColor, 
        type: dotsShape as DotType, 
      },
      cornersSquareOptions: {
        color: cornerColor,
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
    }

    const customOptions = {
      ...defaultOptions,
      width: 400,
      height: 400,
    }

    // create or update the defualt qr code instance
    if (!defaultQRCodeRef.current) {
      defaultQRCodeRef.current = new QRCodeStyling(defaultOptions);
    } else {
      defaultQRCodeRef.current.update({
        data: url,
        image: image ? image : undefined,
      });
    }
    // ensure QR code renders inside the container
    if (defaultCanvasRef.current) {
      defaultCanvasRef.current.innerHTML = ""; // clear previous QR code
      defaultQRCodeRef.current.append(defaultCanvasRef.current);
    } else {
      console.error("Default canvas ref is null. Make sure it's properly assigned in the JSX.");
    }

    // also initialize/update the custom QR code instance with the same default options
    if (!customQRCodeRef.current) {
      customQRCodeRef.current = new QRCodeStyling(customOptions);
    } else {
      customQRCodeRef.current.update({ data: url, image: image ? image : undefined });
    }
    // ensure QR code renders inside the container
    if (customCanvasRef.current) {
      customCanvasRef.current.innerHTML = "";
      customQRCodeRef.current.append(customCanvasRef.current);
    } else {
      console.error("Custom canvas ref is null. Make sure it's properly assigned in the JSX.");
    }
  };

  // update the customized QR code on the second canvas only
  const updateCustomizedQRCode = () => {
    if (!customQRCodeRef.current) {
      alert("Please generate the default QR Code first.");
      return;
    }
    customQRCodeRef.current.update({
      data: url,
      image: image ? image : undefined,
      dotsOptions: { 
        color: dotsColor, 
        type: dotsShape as DotType, 
      },
      cornersSquareOptions: {
        color: cornerColor,
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
  };

  // download functions for QR codes
  const downloadDefaultQRCode = () => {
    defaultQRCodeRef.current?.download({ name: "qrcode", extension: "png" });
  };

  const downloadCustomQRCode = () => {
    customQRCodeRef.current?.download({ name: "custom_qrcode", extension: "png" });
  };

  const saveCustomQRCode = async () => {
    if (!user) return alert("Not signed in");

    if (!customQRCodeRef.current) {
      return alert("Generate the custom QR first!");
    }

    if (!qrName.trim()) return alert("Name your QR code! C:");

    try {
      // grab the png blob from the QRCodeStyling instance
      const blob: Blob = await customQRCodeRef.current.getRawData("png");

      // convert to base64
      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to read blob as DataURL"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // post to backend
      await axios.post("http://localhost:3000/api/qrcode/addQrcode", {
        userId: user.id,
        qrcodeUrl: dataUrl,
        qrcodeName: qrName.trim() || "Untitled QR",
      });

      alert("Saved!");
      setShowNameInput(false);
      setQrName("");
    } catch (err) {
      console.error(err);
      alert("Save failed. Please try again.");
    }
  }

  // ----------------- Image Upload Function -----------------
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

  // ----------------- JSX -----------------
  return (
    <div id="mainBackground" className="w-full min-h-screen flex flex-col justify-center items-center text-white bg-gradient-to-br from-purple-700 via-pink-600 to-blue-500">

      {/* title bar: fixed logo at top of screen with the back button*/}
      <div id="topHeader" className="w-full flex items-center justify-between px-4 py-2 shadow-lg">

        {/* back button*/}
        <button 
          id="backButton"
          onClick={() => navigate("/library")}
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
              <div className="absolute right-0 top-8 w-42 bg-pink-400 rounded-lg shadow-lg z-10 text-lg">
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

      {/* main container filling the remaining space */}
      <div id="mainContainer" className="flex w-full h-full space-x-1 p-2">

        {/* left container */}
        <div id="leftContainer" className="flex-col rounded-2xl shadow-lg w-full max-w-3xl items-center justify-center">

          {/* left top container: open ai image generation */}
          <div id="leftSubcontainerTop" className="rounded-2xl p-3 shadow-lg w-full max-w-3xl bg-[#fccee8]">
            {/* prompt with the image side by side container */}
            <div id="promptwimageContainer" className="flex p-5 space-x-3 items-start rounded-2xl bg-[#fda5d5]">
              <div id="promptContainer" className="flex-1">
                {/* prompt input */}
                <label id="promptLabel" className="block text-xl mb-2 text-black">What can I help you with?</label>
                <textarea id="promptextArea"
                  className="w-full p-6 text-lg rounded-xl text-black placeholder-gray-500 focus:ring-pink-400 h-56 bg-white"
                  placeholder="Enter a description for the image..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                ></textarea>

                {/* generate image button */}
                <div className="mt-2 bg-gray-900 p-1 rounded-lg shadow-md">
                  <button
                    onClick={generateImage}
                    className="cursor-pointer w-full flex py-2 rounded items-center justify-center text-lg bg-blue-500 hover:bg-blue-600"
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Generate Image"}
                  </button>
                </div>

                {/* display error */}
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>

              <div id="uploadImgPlaceholderContainer">
                {/* display generated image */}
                <div id="uploadImagePlaceholder" className="w-64 aspect-square border-2 border-gray-600 flex items-center justify-center rounded-lg bg-white p-1">
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
                    className="cursor-pointer w-full flex py-3 items-center justify-center bg-pink-500 hover:bg-pink-600 text-lg tracking-widest rounded-lg transition"
                  >
                    <FaSave className="mr-2" /> SAVE
                  </button>
                </div>
              </div>   
            </div>
          </div>

          {/* left bottom container: upload image & default qr code generation */}
          <div id="leftSubcontainerBottom" className="rounded-2xl mt-1 p-3 shadow-lg w-full max-w-3xl bg-[#fccee8]">
            <div id="imgUploadContainer" className="flex p-5 space-x-3 items-start rounded-2xl bg-[#fda5d5]">

              <div id="imgUploadContainerLeft">
                <label id="uploadLabel" className="block text-xl mb-3 text-black">UPLOAD AN IMAGE:</label>
                {/* image upload button */}
                <div className="flex-1 bg-gray-900 p-1 rounded-lg shadow-lg flex items-center justify-center">
                  <label className="cursor-pointer px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 w-full text-lg text-center">Upload Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={uploadImage} 
                      className="hidden"
                    />
                  </label>
                </div>

                {/* show uploaded file name */}
                {uploadedFileName && <p className="mt-2 text-md text-gray-800">{"FILENAME: " + uploadedFileName}</p>}
              
                {/* placeholder for uploaded image */}
                <div className="w-80 h-80 mt-5 border-2 border-gray-600 rounded-lg flex items-center justify-center bg-white">
                  {image ? (
                    <img src={image} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-gray-400">No image yet</span>
                  )}
                </div>

                <label id="urlLabel" className="block text-xl mt-5 mb-2 text-black">INPUT AN URL:</label>
                {/* input for url */}
                <input 
                  type="text" 
                  placeholder="Enter URL for QR code"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full p-2 border-3 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />

                {/* generate QR Code from upload image */}
                <div className="flex-1 bg-gray-900 p-1 mt-5 rounded-lg shadow-lg flex items-center justify-center">
                  <button 
                    className="cursor-pointer px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 w-full text-lg"
                    onClick={generateDefaultQRCode}
                  >
                    Generate QR Code
                  </button>
                </div>
              </div>

              {/* right side: display QR code */}
              <div id="imgUploadContainerRight" className="flex-1 flex flex-col items-center">
                
                <label id="qrLabel" className="block text-2xl text-pink-500 mt-23">👾YOUR GENERATED QR👾</label>
                {/* display qr code */}
                <div ref={defaultCanvasRef} className="w-80 h-80 mt-5 border-2 border-gray-600 rounded-lg flex items-center justify-center bg-white">
                  {/* QR Code will be rendered here */}
                </div>

                {/* save qr code */}
                <div className="w-64 bg-gray-900 mt-4 p-1 rounded-lg shadow-lg">
                  <button 
                    id="saveQrBtn" 
                    onClick={downloadDefaultQRCode}
                    className="cursor-pointer w-full flex py-3 items-center justify-center bg-pink-500 hover:bg-pink-600 text-lg tracking-widest rounded-lg shadow-md"
                  >
                    <FaDownload className="mr-2" /> DOWNLOAD
                  </button>
                </div>
              </div>
            </div> {/* end of image upload container */}  
          </div> {/* end of left subcontainer */}
        </div> {/* end of main left container */}

        {/* right container: customize qr code */}
        <div id="rightContainer" className="rounded-2xl p-3 shadow-lg w-full bg-[#fccee8]">
          <div id="rightSubcontainer" className="flex p-5 space-x-3 justify-center items-start rounded-2xl bg-[#fda5d5]">
            <div id="customizeContainer" className="flex-1 space-y-5 text-black">

              {/* section title */}
              <h2 className="text-3xl text-pink-500 font-bold text-center mb-4">🍃CUSTOMIZE YOUR QR CODE🍃</h2>

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
                  <label className="block text-lg mb-2">Corner Shape:</label>
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
                  max="2"
                  step="0.1"
                  value={imageSize}
                  onChange={(e) => setImageSize(parseFloat(e.target.value))}
                  className="w-full"
                />
                <span>{Math.round(imageSize * 100)}%</span>
                
                {/* Generate QR Code from upload image */}
                <div className="flex-1 bg-black p-1 mt-5 rounded-lg shadow-lg items-center">
                  <button 
                    className="cursor-pointer bg-green-500 text-white text-2xl px-6 py-2 rounded-lg hover:bg-green-600 w-full"
                    onClick={updateCustomizedQRCode}
                  >
                    Generate QR Code
                  </button>
                </div>
                
                {/* qr preview */}
                <label id="qrLabel" className="block text-3xl mt-10 text-pink-500 text-center">🍃YOUR CUSTOMIZED QR CODE🍃</label>
                <div className="flex justify-center items-center p-5">
                  <div id="qrPreview" className="w-96 aspect-square border-10 border-pink-500 rounded-lg shadow-lg">
                    <div ref={customCanvasRef} className="w-full h-full flex items-center justify-center bg-white border-2 items-center"></div>
                  </div>
                </div>

                {/* save and download qr code buttons */}
                <div className="flex space-x-4 w-full mt-4">
                  {/* download only */}
                  <button 
                    id="saveQrBtn" 
                    onClick={downloadCustomQRCode}
                    className="cursor-pointer flex-1 flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white text-2xl py-3 rounded-lg shadow-md"
                  >
                    <FaDownload className="mr-2" /> DOWNLOAD
                  </button>

                  {/* save to backend */}
                  {!showNameInput ? (
                    <button
                      onClick={() => setShowNameInput(true)}
                      className="cursor-pointer flex-1 flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white text-2xl py-3 rounded-lg shadow-md"
                    >
                      <FaSave className="mr-2" /> SAVE
                    </button>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Enter QR name"
                        value={qrName}
                        onChange={e => setQrName(e.target.value)}
                        className="p-2 border rounded-lg"
                      />
                      <button 
                        id="saveQrBtn" 
                        onClick={saveCustomQRCode}
                        className="cursor-pointer flex-1 flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white text-2xl py-3 rounded-lg shadow-md"
                      >
                        <FaSave className="mr-2" /> Confirm SAVE
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div> {/* end of right container */}
      </div> 
    </div>
  );
};

export default AIPromptGenerator;