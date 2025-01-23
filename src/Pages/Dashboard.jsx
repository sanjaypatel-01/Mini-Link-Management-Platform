import React from "react";
import logo from '../assets/logo.png';
import IconDashboard from '../assets/IconDashboard.png';
import IconLinks from '../assets/IconLinks.png';
import IconAnalytics from '../assets/IconAnalytics.png';
import IconSetting from '../assets/IconSetting.png';
import IconGM from '../assets/IconGM.png';
import IconSearch from '../assets/IconSearch.png';

function Dashboard() {
    return (
        <div className="w-full h-screen bg-blue-50 flex">
            
            <div className="w-1/5 flex items-start flex-col p-8">
              <div>
                <img className="w-12" src={logo} alt="" />
              </div>

              <button className="mt-16 flex items-center space-x-2 bg-sky-100 p-1 w-full rounded cursor-pointer">
                <span className="text-black">
                    <img src={IconDashboard} alt="Dashboard Icon" className="w-5 h-5" />
                </span>
                <span className="text-blue-700">Dashboard</span>
              </button>

              <button className="mt-4 flex items-center space-x-2 p-1 cursor-pointer">
                <span className="text-black">
                    <img src={IconLinks} alt="Links Icon" className="w-5 h-5" />
                </span>
                <span className="text-black">Links</span>
              </button>

              <button className="mt-4 flex items-center space-x-2 p-1 cursor-pointer">
                <span className="text-black">
                    <img src={IconAnalytics} alt="Analytics Icon" className="w-5 h-5" />
                </span>
                <span className="text-black">Analytics</span>
              </button>

                <br />

              <button className="mt-4 flex items-center space-x-2 p-1 cursor-pointer">
                <span className="text-black">
                    <img src={IconSetting} alt="Setting Icon" className="w-5 h-5" />
                </span>
                <span className="text-black">Setting</span>
              </button>

            </div>

            <div className="w-4/5 flex flex-col">
                <div className="bg-blue-200 h-1/10 flex items-center justify-between p-8">
                    <div>
                        <div>
                            <h3 className="font-semibold flex items-center"><span className="mr-2"><img src={IconGM} alt="" /></span>Good morning, Sanjay</h3>
                            <span className="text-gray-600 text-sm ml-6">Tues, Jan 25</span>
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
                <div className="bg-blue-100 h-9/10 p-12 flex flex-col">
                    <div className="h-1/8">
                        <h3 className="font-semibold text-xl flex space-x-10">
                           <span>Total Clicks</span>
                           <span className="text-blue-700">1234</span>
                        </h3>
                    </div>
                    <div className="h-7/8 flex space-x-4">
                        <div className="w-[49%] p-4 border-2 border-gray-400 rounded">
                            <h3 className="text-blue-700 font-semibold">Date-wise Clicks</h3>
                        </div>
                        <div className="w-[49%] p-4 border-2 border-gray-400 rounded">
                            <h3 className="text-blue-700 font-semibold">Click Devices</h3>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    ) 
}

export default Dashboard;