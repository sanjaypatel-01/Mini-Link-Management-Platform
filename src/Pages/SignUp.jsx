import React, { useState } from "react";
import bgImage from "../assets/bg_image.png";
import { useNavigate } from "react-router-dom";
import LogIn from "./LogIn";

function SignUp() {
  const navigate = useNavigate();

  // Redirect to llogin page
  const redirectToLogin = () => {
    navigate("/login");
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let validationErrors = {};

    // Name validation
    if (!formData.name) {
      validationErrors.name = "Name is required";
    }

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      validationErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      validationErrors.email = "Enter a valid email address";
    }

    // Mobile validation
    const mobilePattern = /^[0-9]{10}$/;
    if (!formData.mobile) {
      validationErrors.mobile = "Mobile number is  required";
    } else if (!mobilePattern.test(formData.mobile)) {
      validationErrors.mobile = "Enter a valid 10-digit mobile nubmer";
    }

    // Password validation
    if (!formData.password) {
      validationErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters long";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword = "Passwords does not match";
    }

    // If no errors
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form Submitted:", formData);
    }

    setErrors(validationErrors);
  };

  // signup login toggle
      const [isSignUpActive, setIsSignUpActive] = useState(true);
  
      const redirectToSignUp = () => {
        setIsSignUpActive(true);
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
          <h3 className="m-8 w-3/5 text-lg font-semibold">Join us Today!</h3>
          <input
            className="w-3/5 border border-gray-500 p-2 rounded  mb-4"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            className="w-3/5 border border-gray-500 p-2 rounded  mb-4"
            type="email"
            name="email"
            placeholder="Email id"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            className="w-3/5 border border-gray-500 p-2 rounded  mb-4"
            type="text"
            name="mobile"
            placeholder="Mobile no."
            value={formData.mobile}
            onChange={handleChange}
          />
          <input
            className="w-3/5 border border-gray-500 p-2 rounded  mb-4"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            className="w-3/5 border border-gray-500 p-2 rounded  mb-8"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {/* Display errors */}
          {errors.name && (
            <span className="text-red-600 text-sm">{errors.name}</span>
          )}
          {errors.email && (
            <span className="text-red-600 text-sm">{errors.email}</span>
          )}
          {errors.mobile && (
            <span className="text-red-600 text-sm">{errors.mobile}</span>
          )}
          {errors.password && (
            <span className="text-red-600 text-sm">{errors.password}</span>
          )}
          {errors.confirmPassword && (
            <span className="text-red-600 text-sm">
              {errors.confirmPassword}
            </span>
          )}
          ;
          <button
            className="bg-blue-700 text-white w-3/5 rounded py-1 mb-6"
            onClick={handleSubmit}
          >
            Register
          </button>
          <span>
            Already have an account?{" "}
            <button
              className="text-blue-600 hover:font-bold font-semibold cursor-pointer"
              onClick={redirectToLogin}
            >
              Login
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
