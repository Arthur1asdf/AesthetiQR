import React, { useRef, useEffect, useState } from "react";
import { FaArrowLeft, FaQrcode, FaPencilAlt, FaPen, FaEraser, FaFont, FaUndo, FaShapes, FaSave } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(4);
  const [text, setText] = useState("");
  const [history, setHistory] = useState<ImageData[]>([]);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [previewImage, setPreviewImage] = useState<ImageData | null>(null);
  const [shapeType, setShapeType] = useState<"rectangle" | "circle">("rectangle");

  const navigate = useNavigate(); // Initialize useNavigate

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
      }
    } else if (drawing) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      if (tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 10;
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
      }

      setStartPos(null);
      setPreviewImage(null);
    }

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

  return (
    <div className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-700 via-pink-600 to-blue-500 h-screen w-full">
      <div className="flex justify-between w-full px-4">
        <button 
          onClick={handleBackClick} // Handle Back button click
          className="text-white bg-gray-700 px-4 py-2 rounded flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h2 className="text-3xl font-bagel text-white">AestheticQr</h2>
        <button className="text-white bg-blue-600 px-4 py-2 rounded flex items-center">
          Generate QR Code <FaQrcode className="ml-2" />
        </button>
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
      <div className="flex gap-2 mt-4">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="range" min="1" max="10" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} />
        <button onClick={clearCanvas} className="bg-red-500 text-white px-4 py-1 rounded-xl">
          Clear
        </button>
        {tool === "shapes" && (
          <div className="ml-4 flex gap-2 items-center text-white">
            <label className="text-sm">Shape:</label>
            <select value={shapeType} onChange={(e) => setShapeType(e.target.value as "rectangle" | "circle")} className="bg-black text-white p-1 rounded-xl">
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default Whiteboard;
