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
        {/* Mary needs to modify sign up and login in button */}
        <Route path="/" element={<HomePage />} />
        {/* also needs change maybe isiah */}
        <Route path="/login" element={<Login />} />
        {/* Have Derian work on this */}
        <Route path="/register" element={<Register />} />
        {/* Arthur change account stuff*/}
        <Route path="/account" element={<AccountPage />} />
        {/*connect library stuff - Arthur */}
        <Route path="/library" element={<LibraryPage />} />
        {/* finished */}
        <Route path="/whiteboard" element={<Whiteboard />} />
        {/* ai prompt and qr code is going to be merged into one ANNA working on it */}
        <Route path="/prompt" element={<AIPromptGenerator />} />
        <Route path="/qrcode" element={<QRCodeGenerator />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
