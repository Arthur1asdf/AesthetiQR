import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isLoaded, signUp, setActive } = useSignUp();

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear errors before making a request
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.create({
        emailAddress: email,
        username: name,
        password,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Registration Failed:", err);
      setError(
        err.message ||
          "Registration failed. Try a different username or email.",
      );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-blue-500">
      <h1 className="text-5xl font-bagel text-white mb-8">Aestheti-QR</h1>

      <div className="bg-black bg-opacity-10 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-white backdrop-blur-md border border-white border-opacity-20">
        <h2 className="text-3xl font-bagel text-center mb-6">REGISTER</h2>

        {/* Error message display */}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {/* Registration form */}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm">EMAIL:</label>
            <div className="flex items-center bg-gray-800 bg-opacity-20 text-white p-2 mt-2 rounded-xl">
              <FaEnvelope className="mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent w-full outline-none text-white placeholder-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm">USERNAME:</label>
            <div className="flex items-center bg-gray-800 bg-opacity-20 text-white p-2 mt-2 rounded-xl">
              <FaUser className="mr-2" />
              <input
                type="text"
                placeholder="Enter your username"
                className="bg-transparent w-full outline-none text-white placeholder-gray-300"
                value={name}
                onChange={(e) => setUsername(e.target.value)}
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
            SIGN UP
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4 text-sm">
          <span>Already have an account? </span>
          <Link to="/login" className="text-pink-300 font-bold">
            Log in!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
