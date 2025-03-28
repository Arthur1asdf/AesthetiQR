import React, { useRef, useEffect, useState } from "react";
import { FaArrowLeft, FaQrcode, FaPencilAlt, FaPen, FaEraser, FaFont, FaUndo, FaShapes, FaImage } from "react-icons/fa";

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(4);
  const [text, setText] = useState("");
  const [history, setHistory] = useState<ImageData[]>([]);
  const [image, setImage] = useState<File | null>(null);

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
    saveState();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: React.MouseEvent) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
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
  };

  const stopDrawing = () => {
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

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        ctx.drawImage(img, 50, 50, 200, 200);
      };
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

  return (
    <div className="flex flex-col items-center p-4 bg-[#add8e6] h-screen w-full">
      <div className="flex justify-between w-full px-4">
        <button className="text-white bg-gray-700 px-4 py-2 rounded flex items-center">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h2 className="text-3xl font-bold text-gray-900">AestheticQr</h2>
        <button className="text-white bg-blue-600 px-4 py-2 rounded flex items-center">
          Generate QR Code <FaQrcode className="ml-2" />
        </button>
      </div>
      <div className="flex mt-4 w-full justify-center">
        <div className="flex flex-col bg-gray-200 p-2 rounded shadow-lg">
          <button onClick={() => setTool("pencil")} className="p-2 hover:bg-gray-300 rounded"><FaPencilAlt /></button>
          <button onClick={() => setTool("pen")} className="p-2 hover:bg-gray-300 rounded"><FaPen /></button>
          <button onClick={() => setTool("eraser")} className="p-2 hover:bg-gray-300 rounded"><FaEraser /></button>
          <button onClick={() => setTool("text")} className="p-2 hover:bg-gray-300 rounded"><FaFont /></button>
          <button onClick={undo} className="p-2 hover:bg-gray-300 rounded"><FaUndo /></button>
          <input type="file" accept="image/*" onChange={uploadImage} className="p-2 hover:bg-gray-300 rounded" />
        </div>
        <canvas
          ref={canvasRef}
          onMouseDown={tool === "text" ? addText : startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="bg-white rounded-lg border border-gray-300 ml-4"
        ></canvas>
      </div>
      {tool === "text" && (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
          className="mt-2 p-2 border rounded"
        />
      )}
      <div className="flex gap-2 mt-2">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="range" min="1" max="10" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} />
        <button onClick={clearCanvas} className="bg-red-500 text-white px-4 py-1 rounded">Clear</button>
      </div>
    </div>
  );
};

export default Whiteboard;
