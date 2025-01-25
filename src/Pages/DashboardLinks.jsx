import React, { useState } from "react";
import logo from '../assets/logo.png';
import IconDashboard from '../assets/IconDashboard.png';
import IconLinks from '../assets/IconLinks.png';
import IconAnalytics from '../assets/IconAnalytics.png';
import IconSetting from '../assets/IconSetting.png';
import IconGM from '../assets/IconGM.png';
import IconSearch from '../assets/IconSearch.png';


    const data = [
        { date: "Jan 14, 2025 16:30", originalLink: "https://www.traw...", shortLink: "https://cuv...", remarks: "campaign1", clicks: 5, status: "Active" },
        { date: "Jan 14, 2025 05:45", originalLink: "https://www.traw...", shortLink: "https://cuv...", remarks: "campaign2", clicks: 5, status: "Inactive" },
        { date: "Jan 14, 2025 07:43", originalLink: "https://www.traw...", shortLink: "https://cuv...", remarks: "campaign3", clicks: 5, status: "Inactive" },
    ];

    
function DashboardLinks() {

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; // Number of rows per page

    // Calculate total pages
    const totalPages = Math.ceil(data.length / rowsPerPage);

    // Get current page data
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = data.slice(startIndex, startIndex + rowsPerPage);

    // Pagination Handlerss
    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };


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
                
                <div className="bg-sky-100 h-9/10 pt-10 pb-6 flex justify-center">

                    <div className="p-6 bg-gray-50 h-full w-9/10 rounded">
                        <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                            <thead>
                            <tr className="bg-blue-100 text-left text-gray-800">
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4">Original Link</th>
                                <th className="py-3 px-4">Short Link</th>
                                <th className="py-3 px-4">Remarks</th>
                                <th className="py-3 px-4">Clicks</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((row, index) => (
                                <tr
                                key={index}
                                className={`text-gray-700 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                                >
                                <td className="py-3 px-4">{row.date}</td>
                                <td className="py-3 px-4">
                                    <a
                                    href={row.originalLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500"
                                    >
                                    {row.originalLink}
                                    </a>
                                </td>
                                <td className="py-3 px-4">
                                    <a
                                    href={row.shortLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500"
                                    >
                                    {row.shortLink}
                                    </a>
                                </td>
                                <td className="py-3 px-4">{row.remarks}</td>
                                <td className="py-3 px-4">{row.clicks}</td>
                                <td
                                    className={`py-3 px-4 font-semibold ${
                                    row.status === "Active" ? "text-green-500" : "text-red-500"
                                    }`}
                                >
                                    {row.status}
                                </td>
                                <td className="py-3 px-4 flex gap-6">
                                    <button className="text-black hover:text-blue-700">
                                    <i class="fa-solid fa-pen" />
                                    </button>
                                    <button className="text-black hover:text-red-700">
                                    <i class="fa-regular fa-trash-can" />
                                    </button>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="flex justify-between items-center mt-4">
                        <button
                            className={`px-4 py-2 rounded cursor-pointer ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className={`px-4 py-2 rounded cursor-pointer ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    ) 
}

export default DashboardLinks;