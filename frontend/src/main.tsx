import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Whiteboard from "./pages/whiteboard";
import AIPromptGenerator from "./pages/prompt";
import QRCodeGenerator from "./pages/qrCodeGenerator";
import AccountPage from "./pages/account";
import LibraryPage from "./pages/library";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path= "/whiteboard" element={<Whiteboard />} />
        <Route path="/prompt" element={<AIPromptGenerator/>}/>
        <Route path="/qrcode" element={<QRCodeGenerator />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
