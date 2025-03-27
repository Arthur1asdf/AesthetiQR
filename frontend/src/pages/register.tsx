import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear errors before making a request

    try {
      const response = await fetch("http://localhost:3000/register", { // Ensure this URL is correct
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed. Try a different username or email.");
      }

      const data = await response.json();
      console.log("Registration Successful:", data);
      alert("Registration Successful! You can now log in.");
    } catch (err: any) {
      console.error("Registration Failed:", err);
      setError(err.message || "Registration failed. Try a different username or email.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-pink-200">
      <div className="w-full flex justify-between items-center px-6 py-4">
        <h1 className="text-3xl font-bagel text-[#3D3131]">AestheticQR</h1>
      </div>

      <div className="bg-[#3D3131] p-8 rounded-lg shadow-lg w-96 text-white">
        <h2 className="text-2xl font-bagel text-center mb-6">REGISTER</h2>

        {/* Error message display */}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {/* Registration form */}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm">EMAIL:</label>
            <div className="flex items-center bg-pink-300 text-black p-2 rounded">
              <FaEnvelope className="mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent w-full outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm">USERNAME:</label>
            <div className="flex items-center bg-pink-300 text-black p-2 rounded">
              <FaUser className="mr-2" />
              <input
                type="text"
                placeholder="Enter your username"
                className="bg-transparent w-full outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            SIGN UP
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4 text-sm">
          <span>Already have an account? </span>
          <Link to="/login" className="text-pink-400 font-bold">
            Log in!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
