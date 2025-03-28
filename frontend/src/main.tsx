import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Whiteboard from "./pages/whiteboard";
import AIPromptGenerator from "./pages/prompt";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  {/* will later be the home page :) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path = "/whiteboard" element ={<Whiteboard />} />
        <Route path ="/prompt" element ={<AIPromptGenerator/>}/>
      
      </Routes>
    </Router>
  </React.StrictMode>
);
