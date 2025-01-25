import React, { useState } from "react";

const data = [
  {
    timestamp: "Jan 14, 2025 15:10",
    originalLink: "https://www.travelwithtripnoreason.com",
    shortLink: "https://covette.io/b1aVk3C6nq",
    ipAddress: "192.168.138",
    userDevice: "Android",
  },
  {
    timestamp: "Jan 14, 2025 15:10",
    originalLink: "https://www.travelwithtripnoreason.com",
    shortLink: "https://covette.io/b1aVk3C6nq",
    ipAddress: "192.168.138",
    userDevice: "Chrome",
  },
  {
    timestamp: "Jan 14, 2025 15:10",
    originalLink: "https://www.travelwithtripnoreason.com",
    shortLink: "https://covette.io/b1aVk3C6nq",
    ipAddress: "192.168.138",
    userDevice: "iOS",
  },
];

function DashboardAnalytics() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Number of rows per page

  // Calculate total pages
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Get current page data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = data.slice(startIndex, startIndex + rowsPerPage);

  // Pagination Handlers
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <div className="p-6 bg-gray-50 h-full w-9/10 rounded">
        <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-100 text-left text-gray-800">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Original Link</th>
              <th className="py-3 px-4">Short Link</th>
              <th className="py-3 px-4">IP Address</th>
              <th className="py-3 px-4">User Device</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, index) => (
              <tr
                key={index}
                className={`text-gray-700 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-3 px-4">{row.timestamp}</td>
                <td className="py-3 px-4">{row.originalLink}</td>
                <td className="py-3 px-4 text-blue-500">
                  <a
                    href={row.shortLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {row.shortLink}
                  </a>
                </td>
                <td className="py-3 px-4">{row.ipAddress}</td>
                <td className="py-3 px-4">{row.userDevice}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <button
            className={`px-4 py-2 rounded cursor-pointer ${
              currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`px-4 py-2 rounded cursor-pointer ${
              currentPage === totalPages
                ? "bg-gray-300"
                : "bg-blue-500 text-white"
            }`}
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default DashboardAnalytics;
