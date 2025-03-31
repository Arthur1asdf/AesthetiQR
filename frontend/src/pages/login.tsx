import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
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
    } catch (err: any) {
      console.error("Login Failed:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-blue-500">
      <h1 className="text-5xl font-bagel text-white mb-8">AestheticQR</h1>
      <div className="bg-black bg-opacity-10 p-8 rounded-2xl shadow-2xl w-96 text-white backdrop-blur-md border border-white border-opacity-20">
        <h2 className="text-3xl font-bagel text-center mb-6">LOGIN</h2>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm">USERNAME:</label>
            <div className="flex items-center bg-black bg-opacity-20 text-white p-2 rounded-xl">
              <FaUser className="mr-2" />
              <input type="text" placeholder="Enter your username" className="bg-transparent w-full outline-none text-white placeholder-gray-300" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm">PASSWORD:</label>
            <div className="flex items-center bg-black bg-opacity-20 text-white p-2 rounded-xl">
              <FaLock className="mr-2" />
              <input type="password" placeholder="Enter your password" className="bg-transparent w-full outline-none text-white placeholder-gray-300" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl shadow-md">
            LOGIN
          </button>
        </form>
        <div className="text-center mt-4 text-sm">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-pink-300 font-bold">
            Sign up!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
