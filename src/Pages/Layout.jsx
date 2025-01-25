import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import IconGM from "../assets/IconGM.png";
import IconSearch from "../assets/IconSearch.png";
import { Link, Outlet, useLocation } from "react-router-dom";
import Dashboard from "./Dashboard";
import Routing from "./Routing";
import NewLinkModal from "../Components/NewLinkModal";

function Layout({ children }) {
  // To determine the active route
  const location = useLocation();

  // To show date and greeting accordingly
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Get the current time
    const now = new Date();
    const hours = now.getHours();

    // Determine the greeting based on the time
    if (hours < 12) {
      setGreeting("Good morning");
    } else if (hours < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }

    // Format the current date
    const options = { weekday: "short", month: "short", day: "numeric" };
    setCurrentDate(now.toLocaleDateString("en-US", options));
  }, []);
  // Till here, To show date and greeting accordingly


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


  return (
    <div className="w-full h-screen flex">
      <div className="w-1/5 flex items-start flex-col p-6 border-r border-gray-200">
        <div>
          <img className="w-12" src={logo} alt="" />
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
            <i class="fa-solid fa-house"></i>
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
            <i class="fa-solid fa-link"></i>
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
            <i class="fa-solid fa-chart-simple"></i>
          </span>
          <span>Analytics</span>
        </Link>

        <Link
          to="/setting"
          className={`mt-10 flex items-center space-x-2 py-2 px-3 w-full rounded cursor-pointer ${
            location.pathname === "/setting"
              ? "bg-blue-100 text-blue-700 font-semibold"
              : "bg-white text-black"
          }`}
        >
          <span>
            <i class="fa-solid fa-gear"></i>
          </span>
          <span>Setting</span>
        </Link>
      </div>

      <div className="w-4/5 flex flex-col">
        <div className="h-1/10 flex items-center justify-between p-8 border-b border-gray-200">
          <div>
            <div>
              <h3 className="font-semibold flex items-center">
                <span className="mr-2">
                  <img src={IconGM} alt="" />
                </span>
                {greeting}, Sanjay
              </h3>
              <span className="text-gray-600 text-sm ml-6">{currentDate}</span>
            </div>
          </div>
          <div className="flex">
            <button className="bg-blue-700 text-white rounded px-4 py-1 h-10 ml-16 cursor-pointer"
            onClick={openModal}
            >
              + Create new
            </button>
            <div className="flex border border-gray-400 rounded p-2 ml-10 mr-16 cursor-pointer items-center space-x-2 justify-center">
              <span>
                <img src={IconSearch} alt="" />
              </span>
              <input className="outline-none" type="text" placeholder="Search by remarks" />
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-400 font-semibold text-lg text-gray-700 flex items-center justify-center p-1 ml-8 cursor-pointer">
              SP
            </div>
          </div>
        </div>

        <div className="h-9/10 p-10 flex flex-col">
          <Outlet />
        </div>

        {/* Yahn mujhe place karna hai jab bhi mai kishi link pe click karu, toh ushka section yahn aa jaye */}
      </div>

          {/* Modal */}
<NewLinkModal isOpen={isModalOpen} closeModal={closeModal} />

    </div>


  );
}

export default Layout;
