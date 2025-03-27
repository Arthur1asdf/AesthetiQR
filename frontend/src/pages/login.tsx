import React, { useState } from "react";
import { FaUser, FaLock, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear errors

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials, please try again.");
      }

      const data = await response.json();
      console.log("Login Successful:", data);
      alert("Login Successful!");
      // Redirect user or store token after successful login
    } catch (err: any) {
      console.error("Login Failed:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-pink-200">
      <div className="w-full flex justify-between items-center px-6 py-4">
        <h1 className="text-3xl font-bagel text-[#3D3131]">AestheticQR</h1>
        <FaUserCircle className="text-4xl text-[#3D3131] cursor-pointer" />
      </div>

      <div className="bg-[#3D3131] p-8 rounded-lg shadow-lg w-96 text-white">
        <h2 className="text-2xl font-bagel text-center mb-6">LOGIN</h2>

        {/* Error message */}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm">USERNAME:</label>
            <div className="flex items-center bg-pink-300 text-black p-2 rounded">
              <FaUser className="mr-2" />
              <input
                type="text"
                placeholder="Enter your username"
                className="bg-transparent w-full outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm">PASSWORD:</label>
            <div className="flex items-center bg-pink-300 text-black p-2 rounded">
              <FaLock className="mr-2" />
              <input
                type="password"
                placeholder="Enter your password"
                className="bg-transparent w-full outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg"
          >
            LOGIN
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-4 text-sm">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-pink-400 font-bold">
            Sign up!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
