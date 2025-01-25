import React, { useState } from "react";

const data = [
  {
    date: "Jan 14, 2025 16:30",
    originalLink: "https://www.traw...",
    shortLink: "https://cuv...",
    remarks: "campaign1",
    clicks: 5,
    status: "Active",
  },
  {
    date: "Jan 14, 2025 05:45",
    originalLink: "https://www.traw...",
    shortLink: "https://cuv...",
    remarks: "campaign2",
    clicks: 5,
    status: "Inactive",
  },
  {
    date: "Jan 14, 2025 07:43",
    originalLink: "https://www.traw...",
    shortLink: "https://cuv...",
    remarks: "campaign3",
    clicks: 5,
    status: "Inactive",
  },
];

function Links() {
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
    <>
      <div className="p-6 h-full rounded">
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
                className={`text-gray-700 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
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

export default Links;
