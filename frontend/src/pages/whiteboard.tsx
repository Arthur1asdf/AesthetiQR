import React, { useRef, useState, useEffect } from "react";
import { FaArrowLeft, FaQrcode, FaPencilAlt, FaPen, FaEraser, FaFont, FaUndo, FaShapes, FaSave } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState<"pencil" | "pen" | "eraser" | "text" | "shapes">("pencil");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(4);
  const [text, setText] = useState("");
  const [history, setHistory] = useState<ImageData[]>([]);
  const [shapeType, setShapeType] = useState<"rectangle" | "circle" | "triangle" | "star" | "heart">("rectangle");
  const [showShapeOptions, setShowShapeOptions] = useState(false);  // Show or hide shape options

  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;
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

  const handleShapeSelection = (shape: "rectangle" | "circle" | "triangle" | "star" | "heart") => {
    setShapeType(shape);
    setShowShapeOptions(false); // Hide shape options after selecting a shape
  };

  const addShape = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.globalCompositeOperation = "source-over";

    switch (shapeType) {
      case "rectangle":
        ctx.strokeRect(x - 50, y - 25, 100, 50); // Draw rectangle at clicked position
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, 2 * Math.PI); // Draw circle at clicked position
        ctx.stroke();
        break;
      case "triangle":
        const height = 50;
        const width = 50;
        ctx.beginPath();
        ctx.moveTo(x, y - height / 2);
        ctx.lineTo(x - width / 2, y + height / 2);
        ctx.lineTo(x + width / 2, y + height / 2);
        ctx.closePath();
        ctx.stroke();
        break;
      case "star":
        const spikes = 5;
        const step = Math.PI / spikes;
        const outerRadius = 50;
        const innerRadius = outerRadius / 2;
        ctx.beginPath();
        ctx.moveTo(x + outerRadius * Math.cos(0), y - outerRadius * Math.sin(0));

        for (let i = 1; i < 2 * spikes; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = i * step;
          ctx.lineTo(x + radius * Math.cos(angle), y - radius * Math.sin(angle));
        }

        ctx.closePath();
        ctx.stroke();
        break;

      case "heart":

      const widthHeart = 70; // Width of the heart
      const heightHeart = 60; // Height of the heart
      ctx.beginPath();
  
      // Start point (bottom center of the heart)
      ctx.moveTo(x, y + heightHeart / 4);
  
      // Left lobe (deeper and rounder)
      ctx.bezierCurveTo(
          x - widthHeart, y - heightHeart * 0.9,  // Control point 1 (wider and lower)
          x - widthHeart * 0.6, y - heightHeart * 1.3, // Control point 2 (deeper top)
          x, y - heightHeart / 2 // End at the top center
      );
  
      // Right lobe (mirrored for symmetry)
      ctx.bezierCurveTo(
          x + widthHeart * 0.6, y - heightHeart * 1.3,  // Control point 2 (deeper top)
          x + widthHeart, y - heightHeart * 0.9,  // Control point 1 (wider and lower)
          x, y + heightHeart / 4 // End at the bottom center
      );
  

      ctx.closePath();
      ctx.stroke();
      break;
      default:
        break;
    }
  };

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

  const saveAsImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not found");
      return;
    }

    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "whiteboard-image.png";
    link.click();
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-700 via-pink-600 to-blue-500 h-screen w-full">
      <div className="flex justify-between w-full px-4">
        <h2 className="text-3xl font-bagel text-white">AestheticQr</h2>
      </div>
      <div className="flex mt-4 w-full justify-center">
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
          <button
            onClick={() => setShowShapeOptions(!showShapeOptions)}
            className="p-2 hover:bg-gray-300 rounded-xl text-white"
          >
            <FaShapes />
          </button>
          {showShapeOptions && (
            <div className="flex flex-col bg-gray-200 p-2 rounded-xl mt-2">
              <button onClick={() => handleShapeSelection("rectangle")} className="p-2 hover:bg-gray-300 rounded-xl">Rectangle</button>
              <button onClick={() => handleShapeSelection("circle")} className="p-2 hover:bg-gray-300 rounded-xl">Circle</button>
              <button onClick={() => handleShapeSelection("triangle")} className="p-2 hover:bg-gray-300 rounded-xl">Triangle</button>
              <button onClick={() => handleShapeSelection("star")} className="p-2 hover:bg-gray-300 rounded-xl">Star</button>
              <button onClick={() => handleShapeSelection("heart")} className="p-2 hover:bg-gray-300 rounded-xl">Heart</button>
            </div>
          )}
          <button onClick={undo} className="p-2 hover:bg-gray-300 rounded-xl text-white">
            <FaUndo />
          </button>
          <button onClick={saveAsImage} className="p-2 hover:bg-gray-300 rounded-xl text-white">
            <FaSave />
          </button>
        </div>
        <canvas
          ref={canvasRef}
          onClick={addShape}
          className="bg-white rounded-2xl border border-gray-300 ml-4 shadow-xl"
        ></canvas>
      </div>
      <div className="flex gap-2 mt-4">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input
          type="range"
          min="1"
          max="10"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
        />
        <button onClick={clearCanvas} className="bg-red-500 text-white px-4 py-1 rounded-xl">
          Clear
        </button>
      </div>
    </div>
  );
};

export default Whiteboard;

