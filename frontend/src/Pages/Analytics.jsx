import React, { useState, useEffect } from "react";
import axios from "axios"; // For making API requests

function Analytics() {
  // State for storing analytics data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Number of rows per page

  // ✅ Separate fetch function like `fetchLinks`
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/analytics", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        console.log("API Response:", response.data); // Debugging
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else if (response.data.analytics) {
          setData(response.data.analytics); // Adjust for nested response
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
      <div className="p-6 h-full rounded">
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
                <th className="py-3 px-4">Short Link</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">User Device</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(currentRows) && currentRows.length > 0 ? (
                currentRows.map((row, index) => (
                  <tr
                    key={index}
                    className={`text-gray-700 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="py-3 px-4">
                    {row.clicks?.length ? (
                      row.clicks.map((click, i) => (
                        <div key={i}>{new Date(click.timestamp).toLocaleString()}</div>
                      ))
                    ) : (
                      "No Clicks"
                    )}
                  </td>

                    <td className="py-3 px-4">{row.originalLink}</td>
                    <td className="py-3 px-4 text-blue-500">
                      <a href={`http://localhost:5000/${row.shortLink}`} target="_blank" rel="noopener noreferrer">
                        {`http://localhost:5000/${row.shortLink}`}
                      </a>
                    </td>

                    <td className="py-3 px-4">
                      {row.clicks.length > 0 ? (
                        row.clicks.map((click, i) => <div key={i}>{click.ip}</div>)
                      ) : (
                        "No Clicks"
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {row.clicks.length > 0 ? (
                        row.clicks.map((click, i) => <div key={i}>{click.device}</div>)
                      ) : (
                        "No Data"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-3 px-4">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

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
              currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"
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

export default Analytics;
