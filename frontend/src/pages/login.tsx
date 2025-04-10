import { useSignIn } from "@clerk/clerk-react";
import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { signIn, isLoaded, setActive } = useSignIn();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear errors
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        navigate("/dashboard");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
      navigate("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(
        "Login Failed:",
        console.error(JSON.stringify(err, null, 2)),
      );
      setError(
        err.message || "Login failed. Please check your email and password.",
      );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-blue-500">
      <h1 className="text-6xl py-3 text-white">Aestheti-QR</h1>
      <div className="bg-black bg-opacity-10 mt-3 p-8 rounded-2xl shadow-2xl w-96 text-white backdrop-blur-md border border-white border-opacity-20">
        <h2 className="text4xl text-center mb-6">LOGIN</h2>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm">USERNAME/EMAIL:</label>
            <div className="flex items-center bg-gray-800 bg-opacity-20 text-white p-2 mt-2 rounded-xl">
              <FaUser className="mr-2" />
              <input
                type="text"
                placeholder="Enter your username"
                className="bg-transparent w-full outline-none text-white placeholder-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm">PASSWORD:</label>
            <div className="flex items-center bg-gray-800 bg-opacity-20 text-white p-2 mt-2 rounded-xl">
              <FaLock className="mr-2" />
              <input
                type="password"
                placeholder="Enter your password"
                className="bg-transparent w-full outline-none text-white placeholder-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl shadow-md"
          >
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
