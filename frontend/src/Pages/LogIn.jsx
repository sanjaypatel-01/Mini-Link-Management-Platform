import React, { useState } from "react";
import bgImage from "../assets/bg_image.png";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Don't forget to import axios

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function LogIn() {
  const navigate = useNavigate();

  // Redirect to signup page
  const redirectToSignUp = () => {
    navigate("/signup");
  };

  

  // Toggle between signup and login
  const [isSignUpActive, setIsSignUpActive] = useState(false);

  const redirectToLogin = () => {
    setIsSignUpActive(false);
  };

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("before env");
      console.log("check env" , backendUrl)
      const response = await axios.post(`${backendUrl}/api/login`, formData);
      localStorage.setItem("authToken", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2">
        <img className="w-full h-full object-cover" src={bgImage} alt="" />
      </div>
      <div className="w-1/2 flex flex-col">
        <div className="h-[10%] flex justify-end items-center p-12">
          <button
            className={`cursor-pointer px-2 py-1 rounded ml-6 ${
              isSignUpActive
                ? "bg-blue-700 text-white font-bold"
                : "bg-transparent text-blue-700"
            } `}
            onClick={redirectToSignUp}
          >
            SignUp
          </button>

          <button
            className={`cursor-pointer px-2 py-1 rounded ml-6 ${
              !isSignUpActive
                ? "bg-blue-700 text-white font-bold"
                : "bg-transparent text-blue-700"
            }`}
            onClick={redirectToLogin}
          >
            Login
          </button>
        </div>
        <div className="flex flex-col h-[90%] items-center">
          <h3 className="m-10 w-3/5 text-lg font-semibold">Login</h3>
          <form onSubmit={handleSubmit} className="w-3/5">
            <input
              className="w-full border border-gray-500 p-2 rounded mb-4"
              type="email"
              placeholder="Email id"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              className="w-full border border-gray-500 p-2 rounded mb-4"
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="bg-blue-700 text-white hover:font-semibold cursor-pointer w-full rounded py-1 mb-6"
            >
              Login
            </button>
          </form>
          <span>
            Don't have an account?{" "}
            <button
              className="text-blue-600 font-semibold cursor-pointer hover:font-bold"
              onClick={redirectToSignUp}
            >
              SignUp
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
