import React, { useRef, useEffect, useState } from "react";
import { FaArrowCircleLeft, FaQrcode, FaPencilAlt, FaPen, FaEraser, FaFont, FaUndo, FaShapes, FaSave } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import logoVideo from '../assets/logo.mp4';

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(4);
  const [text, setText] = useState("");
  const [history, setHistory] = useState<ImageData[]>([]);
  //for tracking the position of the start of the shape to end
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  //for tracking the image data of the canvas
  const [previewImage, setPreviewImage] = useState<ImageData | null>(null);
  const [shapeType, setShapeType] = useState<"rectangle" | "circle" | "triangle" | "heart" | "star">("rectangle");

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 500;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setHistory([...history, ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const lastState = history.pop();
    setHistory([...history]);
    if (lastState) ctx.putImageData(lastState, 0, 0);
  };

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (tool === "shapes") {
      setStartPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
      setPreviewImage(ctx.getImageData(0, 0, canvas.width, canvas.height));
    } else {
      saveState();
      setDrawing(true);
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  const draw = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (tool === "shapes") {
      if (!startPos || !previewImage) return;

      ctx.putImageData(previewImage, 0, 0);

      const currentX = e.nativeEvent.offsetX;
      const currentY = e.nativeEvent.offsetY;

      const width = currentX - startPos.x;
      const height = currentY - startPos.y;

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.globalCompositeOperation = "source-over";

      if (shapeType === "rectangle") {
        ctx.strokeRect(startPos.x, startPos.y, width, height);
      } else if (shapeType === "circle") {
        const centerX = startPos.x + width / 2;
        const centerY = startPos.y + height / 2;
        const radiusX = Math.abs(width / 2);
        const radiusY = Math.abs(height / 2);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (shapeType === "triangle") {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y + height); // start at bottom-left
        ctx.lineTo(startPos.x + width / 2, startPos.y); // draw line to top
        ctx.lineTo(startPos.x + width, startPos.y + height); // then to bottom-right
        ctx.closePath();
        ctx.stroke();
      } else if (shapeType === "heart") {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y + height / 4);
        
        ctx.bezierCurveTo(startPos.x, startPos.y, startPos.x - width / 2, startPos.y, startPos.x - width / 2, startPos.y + height / 4);
        ctx.bezierCurveTo(startPos.x - width / 2, startPos.y + height / 2, startPos.x, startPos.y + height, startPos.x, startPos.y + height * 1.2);
        
        ctx.bezierCurveTo(startPos.x, startPos.y + height, startPos.x + width / 2, startPos.y + height / 2, startPos.x + width / 2, startPos.y + height / 4);
        ctx.bezierCurveTo(startPos.x + width / 2, startPos.y, startPos.x, startPos.y, startPos.x, startPos.y + height / 4);
        
        ctx.closePath();
        ctx.stroke();
      } else if (shapeType === "star") {
        const points = 5; // number of points in the star
        const centerX = startPos.x + width / 2;
        const centerY = startPos.y + height / 2;
        let outerRadius = Math.max(width, height) / 2; // star size scales with drag distance
        let innerRadius = outerRadius / 2.5; // adjust for better proportions

        ctx.beginPath();
        const angle = Math.PI / points; 
        for (let i = 0; i < 2 * points; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = centerX + radius * Math.cos(i * angle);
            const y = centerY + radius * Math.sin(i * angle);
            ctx.lineTo(x,y);
        }
        
        ctx.closePath();
        ctx.stroke();
      }
    } else if (drawing) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      if (tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 10; // Optional: you can make eraser thicker
      } else {
        ctx.globalCompositeOperation = "source-over";
      }

      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };
  const saveAsImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "whiteboard.png"; // name of the downloaded file
    link.click();
  };

  const stopDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (tool === "shapes" && startPos) {
      saveState();

      const endX = e.nativeEvent.offsetX;
      const endY = e.nativeEvent.offsetY;
      const width = endX - startPos.x;
      const height = endY - startPos.y;

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.globalCompositeOperation = "source-over";

      setStartPos(null);
      setPreviewImage(null);
    }

    // Stop freehand/eraser drawing too
    setDrawing(false);
  };

  const addText = (e: React.MouseEvent) => {
    if (tool !== "text") return;
    saveState();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.font = "20px Arial";
    ctx.fillText(text, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setImage(file);
  //     const canvas = canvasRef.current;
  //     if (!canvas) return;
  //     const ctx = canvas.getContext("2d");
  //     if (!ctx) return;
  //     const img = new Image();
  //     img.src = URL.createObjectURL(file);
  //     img.onload = () => {
  //       ctx.drawImage(img, 50, 50, 200, 200);
  //     };
  //   }

  // };

  const clearCanvas = () => {
    saveState();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Back button click handler to navigate to Library page
  const handleBackClick = () => {
    navigate("/library"); // Navigate to the Library page
  };

  const handleGenerateQRCodeClick = () => {
    navigate('/prompt'); // navigate to /prompt page
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-purple-700 via-pink-600 to-blue-500 h-screen w-full relative">
      {/* title bar: fixed logo at top of screen with the back button*/}
      <div id="topHeader" className="w-full flex items-center justify-between p-4 shadow-lg">

        {/* back button*/}
        <button id="backButton" onClick={handleBackClick} className="flex items-center text-white text-lg hover:text-gray-300 bg-gray-700 px-4 py-2 rounded">
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
          <h1 id="logoText" className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300">Aestheti-Qr</h1>
        </div>

        {/* profile section (incoming drop-down menu) */}
        <div id="profileContainer" className="flex items-center">
          <span id="username" className="mr-3 text-xl font-semibold">Name</span>
          <div id="pfp" className="w-15 h-15 bg-gray-500 rounded-full"></div>
        </div>
      </div>

      {/* whiteboard container */}
      <div id="whiteboardContainer" className="flex mt-4 p-5 w-full justify-center">
        <div className="flex flex-col bg-black bg-opacity-40 p-2 rounded-2xl shadow-2xl">
          <button onClick={() => setTool("pencil")} className="p-2 hover:bg-gray-300 rounded-xl text-white">
            <FaPencilAlt />
          </button>
          <button onClick={() => setTool("pen")} className="p-2 hover:bg-gray-300 rounded-xl text-white">
            <FaPen />
          </button>
          <button onClick={() => setTool("eraser")} className="p-2 hover:bg-gray-300 rounded-xl text-white">
            <FaEraser />
          </button>
          <button onClick={() => setTool("text")} className="p-2 hover:bg-gray-300 rounded-xl text-white">
            <FaFont />
          </button>
          <button onClick={() => setTool("shapes")} className="p-2 hover:bg-gray-300 rounded-xl text-white">
            <FaShapes />
          </button>
          <button onClick={undo} className="p-2 hover:bg-gray-300 rounded-xl text-white">
            <FaUndo />
          </button>
          <button onClick={saveAsImage} className="p-2 hover:bg-gray-300 rounded-xl text-white">
            <FaSave />
          </button>
        </div>
        <canvas
          ref={canvasRef}
          onMouseDown={tool === "text" ? addText : startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="bg-white rounded-2xl border border-gray-300 ml-4 shadow-xl"
        ></canvas>
      </div>
      {tool === "text" && <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text" className="mt-2 p-2 border rounded-xl bg-white text-black" />}

      {/* color pallete, pen size, clear button and shape choices */}
      <div className="flex gap-2 mt-2">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="range" min="1" max="10" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} />
        <button onClick={clearCanvas} className="bg-red-500 text-white px-4 py-1 rounded-xl">
          Clear
        </button>
        {tool === "shapes" && (
          <div className="ml-4 flex gap-2 items-center text-white">
            <label className="text-sm">Shape:</label>
            <select value={shapeType} onChange={(e) => setShapeType(e.target.value as "rectangle" | "circle" | "triangle" | "heart" | "star")} className="bg-black text-white p-1 rounded-xl">
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
              <option value="triangle">Triangle</option>
              <option value="heart">Heart</option>
              <option value="star">Star</option>
            </select>
          </div>
        )}
      </div>

      {/* generate qr code button */}
      <button id="genQRbutton" 
        onClick={handleGenerateQRCodeClick} 
        className="absolute bottom-5 right-5 text-white text-xl bg-pink-500 hover:bg-pink-600 border-5 px-6 py-2 rounded-lg shadow-xl flex items-center"
      >
        Generate QR Code <FaQrcode className="ml-2" />
      </button>

    </div>
  );
};

export default Whiteboard;