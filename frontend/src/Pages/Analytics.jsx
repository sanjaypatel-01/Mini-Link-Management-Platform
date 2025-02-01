import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Analytics() {
  // State for storing analytics data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Number of rows per page

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/analytics`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });

        console.log("API Response:", response.data); // Debugging

        if (response.data.success && Array.isArray(response.data.data)) {
          setData(response.data.data);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to fetch analytics data.");
      }
      setLoading(false);
    };

    fetchAnalyticsData();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / rowsPerPage) || 1; // Ensure at least 1 page

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
    <div className="p-4 h-full flex flex-col rounded min-h-full">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-100 text-left text-gray-800">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Original Link</th>
              <th className="py-3 px-10">Short Link</th>
              <th className="py-3 px-6">IP Address</th>
              <th className="py-3 px-4">User Device</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => (
                <tr key={index} className={`text-gray-700 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <td className="py-3 px-4 max-w-[150px]">
                    {row.timestamp ? new Date(row.timestamp).toLocaleString() : "No Timestamp"}
                  </td>
                  <td className="py-3 px-4 text-blue-500 truncate max-w-[160px] overflow-hidden whitespace-nowrap">
                    {row.originalLink}
                  </td>
                  <td className="py-3 px-10 text-blue-500 truncate max-w-[160px] overflow-hidden whitespace-nowrap">
                    <a href={row.shortLink.startsWith("http") ? row.shortLink : `${backendUrl}/${row.shortLink}`} target="_blank" rel="noopener noreferrer">
                      {row.shortLink.startsWith("http") ? row.shortLink : `${backendUrl}/${row.shortLink}`}
                    </a>
                  </td>
                  <td className="py-3 px-6">{row.ipAddress || "No IP"}</td>
                  <td className="py-3 px-4">{row.userDevice || "No Data"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Currently, there is no data to show.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Show pagination only if there is data */}
      {data.length > 0 && (
        <div className="flex justify-center gap-12 items-center mt-auto py-4">
          <button
            className={`px-4 py-2 rounded cursor-pointer ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`px-4 py-2 rounded cursor-pointer ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Analytics;
