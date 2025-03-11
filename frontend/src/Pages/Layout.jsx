import React, { useEffect, useState, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import IconGM from "../assets/IconGM.png";
import IconSearch from "../assets/IconSearch.png";
import NewLinkModal from "../Components/NewLinkModal";
import cuvettelogo from "../assets/cuvettelogo.png";
import menu from "../assets/menu.svg";
import Dashboard from "./Dashboard";
import Routing from "./Routing";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Layout({ children }) {
  
  // To determine the active route
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  
  
  const [greeting, setGreeting] = useState(""); // To show date and greeting accordingly
  const [currentDate, setCurrentDate] = useState(""); 
  const [firstName, setFirstName] = useState(""); // Store first name
  const [initials, setInitials] = useState(""); // To store the user's initials
  const [error, setError] = useState(null); // To handle errors if any
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // For logout
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For the profile dropdown
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Get the current time
    const now = new Date();
    const hours = now.getHours();

    // Determine the greeting based on the time
    if (hours < 12) {
      setGreeting("Good morning");
    } else if (hours < 18) {
      setGreeting("Good afternoonn");
    } else {
      setGreeting("Good evening");
    }

    // Format the current date
    const options = { weekday: "short", month: "short", day: "numeric" };
    setCurrentDate(now.toLocaleDateString("en-US", options));

    // Till here, To show date and greeting accordingly

    // Fetch user details (you may fetch this from the backend API or use a JWT token)
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${backendUrl}/api/user` , {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userFullName = response.data.name; // Assuming 'name' is the full name
        const nameParts = userFullName.split(" ");

        // Extract first name
        setFirstName(nameParts[0]); // Store first word (first name)

        // Extract initials
        const userInitials = nameParts.length === 1
            ? nameParts[0].slice(0, 2).toUpperCase() // If single name, use first two letters
            : (nameParts[0][0] + nameParts[1][0]).toUpperCase(); // If full name, use first letters of both names

        setInitials(userInitials);
      } catch (err) {
        setError("Failed to fetch user data");
        console.error(err);
      }
    };

    fetchUserDetails();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/links` , {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const data = response.data;
    } catch (error) {
      console.error("Error fetching links:", error);
      setError("Failed to fetch data. Please try again later.");
    }
  };
  
  // Fetch links on component mount
  useEffect(() => {
    fetchLinks();
  }, []);


  

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);
      

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };
  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };


  // Redirect to `/links` when searching on another page
  useEffect(() => {
    if (searchTerm.trim() !== "" && location.pathname !== "/links") {
      navigate("/links");
    }
  }, [searchTerm, location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear auth token
    navigate("/login"); // Redirect to login page
  };
  

  return (
    <div className="w-full h-screen flex">

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-1/5 bg-white border-r border-gray-200 transform ${
          isOpen ? "translate-x-0 p-1 w-3/6 md:w-2/6" : "-translate-x-full overflow-hidden p-6"
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        {/* <div className="w-1/5 flex items-start flex-col p-6 border-r border-gray-200"></div> */}
        <div>
          <img className="w-[145px] ml-4 mt-2 hidden lg:flex" src={cuvettelogo} alt="" />
          {/* Hamburger Button */}
          <button
                className="lg:hidden p-2 w-[50px]"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <img src={menu} className="text-blue-700" alt="" /> : <img src={menu} alt="" />}
            </button>
        </div>

        <Link
          to="/dashboard"
          className={`mt-16 flex items-center space-x-2 py-2 px-3 w-full rounded cursor-pointer ${
            location.pathname === "/dashboard"
              ? "bg-blue-100 text-blue-700 font-semibold"
              : "bg-white text-black"
          }`}
        >
          <span>
            <i className="fa-solid fa-house"></i>
          </span>
          <span>Dashboard</span>
        </Link>

        <Link
          to="/links"
          className={`mt-4 flex items-center space-x-2 py-2 px-3 w-full rounded cursor-pointer ${
            location.pathname === "/links"
              ? "bg-blue-100 text-blue-700 font-semibold"
              : "bg-white text-black"
          }`}
        >
          <span>
            <i className="fa-solid fa-link"></i>
          </span>
          <span>Links</span>
        </Link>

        <Link
          to="/analytics"
          className={`mt-4 flex items-center space-x-2 py-2 px-3 w-full rounded cursor-pointer ${
            location.pathname === "/analytics"
              ? "bg-blue-100 text-blue-700 font-semibold"
              : "bg-white text-black"
          }`}
        >
          <span>
            <i className="fa-solid fa-chart-simple"></i>
          </span>
          <span>Analytics</span>
        </Link>

        <Link
          to="/setting"
          className={`mt-10 flex items-center space-x-2 py-2 px-3 w-full rounded relative cursor-pointer ${
            location.pathname === "/setting"
              ? "bg-blue-100 text-blue-700 font-semibold"
              : "bg-white text-black"
          }`}
        >
          <span>
            <i className="fa-solid fa-gear"></i>
          </span>
          <span>Settings</span>
          <span className="absolute top-[-14px] left-1/2 -translate-x-1/2 w-full h-px bg-gray-200"></span>
          <span className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 w-full h-px bg-gray-200"></span>
        </Link>
      </div>

      <div className="w-full lg:w-4/5 flex flex-col">
        {/* Navbar */}
        <div className="h-auto flex flex-wrap items-center justify-between lg:p-8 p-4 border-b border-gray-200">
          <div className="flex">
            {/* Hamburger Button */}
            <button
                className="lg:hidden p-2 w-[50px]"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <img src={menu} className="text-blue-700" alt="" /> : <img src={menu} alt="" />}
            </button>
            <div>
              <h3 className="font-semibold flex items-center">
                <span className="mr-2">
                  <img src={IconGM} alt="" />
                </span>
                {greeting}, {firstName ? firstName : "User"}
              </h3>
              <span className="text-gray-600 text-sm ml-6">{currentDate}</span>
            </div>
          </div>

          {/* Profile Icon with Dropdown */}
            <div className="relative ml-auto lg:hidden" ref={dropdownRef}>
              {/* Profile Icon */}
              <div className="w-10 h-10 rounded-full bg-yellow-300 font-semibold text-lg text-amber-700 flex items-center justify-center p-1 ml-8 cursor-pointer hover:scale-107 transform transition-transform duration-200 "
               onClick={() => setIsDropdownOpen((prev) => !prev)} >
                {initials ? initials : "NA"}
              </div>
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-sm">
                  <button onClick={handleLogout} className="w-full overflow-hidden text-center px-4 py-2 text-gray-500 hover:bg-gray-50 cursor-pointer">
                    Logout
                  </button>
                </div>
              )}
            </div>  

          {/* Right section */}
          <div className="flex flex-wrap lg:flex-nowrap w-full lg:w-auto items-center lg:justify-end mt-4 lg:mt-0 space-y-3 lg:space-y-0">
            <button
              className="bg-blue-700 text-white flex items-center justify-center gap-1 rounded px-4 py-1 h-10 cursor-pointer w-full lg:w-auto"
              onClick={openModal}
            >
              <span className="text-xl">+</span> Create new
            </button>
            <div className="flex border border-gray-300 rounded p-2 lg:ml-10 lg:mr-16 items-center space-x-2 justify-center w-full lg:w-auto">
              <span>
                <img src={IconSearch} alt="" />
              </span>
              <input
                className="outline-none"
                type="text"
                placeholder="Search by remarks"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}

              />
            </div>
            {/* Profile Icon with Dropdown */}
            <div className="relative ml-auto hidden lg:flex" ref={dropdownRef}>
              {/* Profile Icon */}
              <div className="w-10 h-10 rounded-full bg-yellow-300 font-semibold text-lg text-amber-700 flex items-center justify-center p-1 ml-8 cursor-pointer hover:scale-107 transform transition-transform duration-200 "
               onClick={() => setIsDropdownOpen((prev) => !prev)} >
                {initials ? initials : "NA"}
              </div>
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-12 w-32 bg-white border border-gray-200 rounded shadow-sm">
                  <button onClick={handleLogout} className="w-full overflow-hidden text-center px-4 py-2 text-gray-500 hover:bg-gray-50 cursor-pointer">
                    Logout
                  </button>
                </div>
              )}
            </div>  
          </div>
        </div>

        <div className="h-9/10 lg:p-10 p-1 flex flex-col bg-gra-50">
          <Outlet context={{ searchTerm }} />
        </div>

        {/* Yahn mujhe place karna hai jab bhi mai kishi link pe click karu, toh ushka section yahn aa jaye */}
      </div>

      {/* Modal */}
      {/* <NewLinkModal isOpen={isModalOpen} closeModal={closeModal} /> */}
      <NewLinkModal isOpen={isModalOpen} closeModal={closeModal} refreshData={fetchLinks} />
      <ToastContainer />  {/* ✅ Required for toast notifications */}

    </div>
  );
}

export default Layout;
