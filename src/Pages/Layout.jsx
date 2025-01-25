import React, { useEffect, useState } from "react";
import logo from '../assets/logo.png';
import IconDashboard from '../assets/IconDashboard.png';
import IconLinks from '../assets/IconLinks.png';
import IconAnalytics from '../assets/IconAnalytics.png';
import IconSetting from '../assets/IconSetting.png';
import IconGM from '../assets/IconGM.png';
import IconSearch from '../assets/IconSearch.png';
import { Link, Outlet } from "react-router-dom";
import Dashboard from "./Dashboard";
import Routing from "./Routing";

function Layout( {children} ) {

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


    return (
        <div className="w-full h-screen flex">
            
            <div className="w-1/5 flex items-start flex-col p-8 border-r border-gray-200">
              <div>
                <img className="w-12" src={logo} alt="" />
              </div>


                <Link to="/dashboard" className="mt-16 flex items-center space-x-2 bg-sky-100 p-1 w-full rounded cursor-pointer">
                    <span className="text-black">
                        <img src={IconDashboard} alt="Dashboard Icon" className="w-5 h-5" />
                    </span>
                    <span className="text-blue-700">Dashboard</span>
                </Link>

                <Link to="/links" className="mt-4 flex items-center space-x-2 p-1 cursor-pointer">
                    <span className="text-black">
                        <img src={IconLinks} alt="Links Icon" className="w-5 h-5" />
                    </span>
                    <span className="text-black">Links</span>
                </Link>

                <Link to="/analytics" className="mt-4 flex items-center space-x-2 p-1 cursor-pointer">
                    <span className="text-black">
                        <img src={IconAnalytics} alt="Analytics Icon" className="w-5 h-5" />
                    </span>
                    <span className="text-black">Analytics</span>
                </Link>

                <Link to="/setting" className="mt-4 flex items-center space-x-2 p-1 cursor-pointer">
                    <span className="text-black">
                        <img src={IconSetting} alt="Setting Icon" className="w-5 h-5" />
                    </span>
                    <span className="text-black">Setting</span>
                </Link>

                

            </div>

            <div className="w-4/5 flex flex-col">
                <div className="h-1/10 flex items-center justify-between p-8 border-b border-gray-200">
                    <div>
                        <div>
                            <h3 className="font-semibold flex items-center"><span className="mr-2"><img src={IconGM} alt="" /></span>{greeting}, Sanjay</h3>
                            <span className="text-gray-600 text-sm ml-6">{currentDate}</span>
                        </div>
                    </div>
                    <div className="flex">
                        <button className="bg-blue-700 text-white rounded px-4 py-1 h-10 ml-16 cursor-pointer">+ Create new</button>
                        <div className="flex border border-gray-400 rounded p-2 ml-10 mr-16 cursor-pointer items-center space-x-2 justify-center">
                            <span><img src={IconSearch} alt="" /></span>
                            <input className="" type="text" placeholder="Search by remarks" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-yellow-400 font-semibold text-lg text-gray-700 flex items-center justify-center p-1 ml-8 cursor-pointer">
                            SP
                        </div>
                    </div>
                </div>
                
                <div className="h-9/10 p-12 flex flex-col">
                    <Outlet />
                </div>
                
                {/* Yahn mujhe place karna hai jab bhi mai kishi link pe click karu, toh ushka section yahn aa jaye */}

            </div>

        </div>
    ) 
}

export default Layout;

