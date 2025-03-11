import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <h1 className="text-4xl text-center text-blue-500">Hello, Vite + React + Tailwind CSS!</h1>
  </StrictMode>
);
