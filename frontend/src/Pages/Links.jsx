import React, { useState, useEffect } from "react";
import axios from "axios";
import EditLinkModal from "../Components/EditLinkModal";
import NewLinkModal from "../Components/NewLinkModal";
import sort from "../assets/sort.svg";
import { useOutletContext } from "react-router-dom"; //Import this to get searchTerm from Layout.js
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Links() {
  const [linksData, setLinksData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLinks, setTotalLinks] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [linkToRemove, setLinkToRemove] = useState(null);
  const [showToast, setShowToast] = useState(false);
  
  const [filteredLinks, setFilteredLinks] = useState([]); //  Declare filteredLinks
  const { searchTerm } = useOutletContext(); // Get searchTerm from Layout.js

  const rowsPerPage = 10;

  const [selectedLink, setSelectedLink] = useState(null); // Store selected link data
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Track Edit Modal state

  
  // Function to open Edit Modal with link details
  const openEditModal = (link) => {
    setSelectedLink(link); // Store link details before opening modal
    setIsEditModalOpen(true);
  };

  // Function to close Edit Modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedLink(null); // Clear selected link after closing modal
  };

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/links` , {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = response.data;
  
      if (data && Array.isArray(data.data)) {

        // Previous, 
        // const updatedLinks = data.data.map(link => {
        // const expirationDate = new Date(link.expirationDate);
        // const now = new Date();

        // if (expirationDate && expirationDate < now) {
        //   return { ...link, status: "Inactive" }; // Mark as inactive
        // }
        // return link;
        // });

        const updatedLinks = data.data.map(link => {
          const expirationDate = link.expirationDate ? new Date(link.expirationDate) : null;
          const now = new Date();
          
          return {
            ...link,
            status: expirationDate && expirationDate < now ? "Inactive" : "Active", // Ensure correct status
          };
        });
        

        // setLinksData(data.data);
        setLinksData(updatedLinks);
        setFilteredLinks(updatedLinks); // Set filtered data initially
        setTotalPages(data.totalPages);
        setTotalLinks(data.totalLinks);
      } else {
        setLinksData([]);
        setTotalPages(0);
        setTotalLinks(0);
      }
    } catch (error) {
      console.error("Error fetching links:", error);
      setError("Failed to fetch data. Please try again later.");
    }
    setLoading(false);
  };
  
  // Call `fetchLinks` when component mounts
  useEffect(() => {
    fetchLinks();
  }, []);

  // Filter links when `searchTerm` changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredLinks(linksData);
    } else {
      const results = linksData.filter((link) =>
        link.remarks.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLinks(results);
    }
  }, [searchTerm, linksData]);
  

  // Remove the shortlink data
  const removeLink = async () => {
    try {
  
      // Check if _id exists instead of shortId
      if (!linkToRemove || !linkToRemove._id) {
        console.error("Error: linkToRemove or _id is undefined");
        setError("Failed to remove link. Invalid link data.");
        return;
      }
  
      // Use _id in the API request
      await axios.delete( `${backendUrl}/api/links/${linkToRemove._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
  
      // Filter by _id instead of shortId
      setLinksData((prevLinks) =>
        prevLinks.filter((link) => link._id !== linkToRemove._id)
      );
  
      closeRemoveModal();
    } catch (error) {
      console.error("Error Removing link:", error);
      setError("Failed to Remove link. Please try again later.");
    }
  };
  
  
  

  // Format the date
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",  // "Jan"
      day: "2-digit",  // "14"
      year: "numeric", // "2025"
      hour: "2-digit", // "16"
      minute: "2-digit", // "30"
      hour12: false,  // 24-hour format
    }).replace(",", ""); // Remove extra comma
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  // const currentRows = linksData.slice(startIndex, startIndex + rowsPerPage);
  const currentRows = filteredLinks.slice(startIndex, startIndex + rowsPerPage); // ✅ Use `filteredLinks`

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const openRemoveModal = (link) => {
    console.log("Opening remove modal for:", link); // Debugging
    setLinkToRemove(link);
    setIsRemoveModalOpen(true);
  };

  const closeRemoveModal = () => {
    setIsRemoveModalOpen(false);
    setLinkToRemove(null);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) return <p className="text-center">Loading data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <div className="p-4 h-full rounded flex flex-col min-h-full">
        <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[850px] table-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-100 text-left text-gray-800">
              <th className="py-3 px-4 flex gap-2">Date
                <span className="flex items-center justify-center"><img src={sort} alt="" /></span>
              </th>
              <th className="py-3 px-4">Original Link</th>
              <th className="py-3 px-4">Short Link</th>
              <th className="py-3 px-2">Remarks</th>
              <th className="py-3 px-4">Clicks</th>
              <th className="py-3 px-4 flex gap-2">Status
                <span className="flex items-center justify-center"><img src={sort} alt="" /></span>
              </th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((row, index) => (
              <tr
                key={row._id}
                className={`text-gray-700 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="py-3 px-4">{formatDate(row.createdAt) || "N/A"}</td>
                <td className="py-3 px-4 truncate max-w-[150px] overflow-hidden whitespace-nowrap">
                  <a
                    href={row.originalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=""
                    title={row.originalLink}
                  >
                    {row.originalLink || "N/A"}
                  </a>
                </td>
                <td className="py-3 px-4 flex items-center gap-2 max-w-[200px]">
                  <a
                    href={row.shortLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate w-4/5 overflow-hidden whitespace-nowrap"
                    title={row.shortLink}
                  >
                    {`${backendUrl}/${row.shortLink}`}
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${backendUrl}/api/${row.shortLink}`);
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 2000);
                    }}
                    className="text-gray-500 hover:text-blue-500 hover:font-bold font-semibold cursor-pointer text-lg">
                    <i className="fa-regular fa-clone"></i>
                  </button>
                </td>
                <td className="py-3 px-2">{row.remarks || "N/A"}</td>
                <td className="py-3 px-4">{row.clicks.length || 0}</td>
                {/* <td className={`py-3 px-4 font-semibold ${row.status === "Active" ? "text-green-500" : "text-red-500"}`}>
                  {row.status || "Unknown"}
                </td> */}
                
                {/* Previous */}
                {/* <td
                  className={`py-3 px-4 font-semibold ${
                      new Date(row.expirationDate) < new Date() ? "text-yellow-600" : "text-green-500"
                    }`}
                  >
                    {new Date(row.expirationDate) < new Date() ? "Inactive" : row.status || "Unknown"}
                  </td> */}

                  <td className={`py-3 px-4 font-semibold ${row.status === "Inactive" ? "text-yellow-600" : "text-green-500"}`}>
                    {row.status || "Unknown"}
                  </td>


                <td className="py-3 px-4 flex gap-6">
                  {/* <button
                    onClick={openModal}
                    className="text-black cursor-pointer hover:text-blue-700"
                  >
                    <i className="fa-solid fa-pen" />
                  </button> */}
                  <button onClick={() => openEditModal(row)} className="text-black cursor-pointer hover:text-blue-700">
                    <i className="fa-solid fa-pen" />
                  </button>
                  <button className="text-black cursor-pointer hover:text-red-700"
                     onClick={() => openRemoveModal(row)}
                     >
                    <i className="fa-regular fa-trash-can" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                {/* Keep table empty if data fetch fails */}
              </td>
            </tr>
          )}
          </tbody>
        </table>
        </div>
        
        {filteredLinks.length > 0 && (
        <div className="flex justify-center gap-12 items-center mt-auto py-4">
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
      )}
      </div>

      {/* Confirmation Modal */}
      {isRemoveModalOpen && (
        <div className="fixed inset-0 flex rounded-lg items-center justify-center backdrop-brightness-50 bg-opacity-50 z-50 ">
          <div className="bg-white rounded shadow-lg scale-70 md:scale-100">
            <span className="text-lg cursor-pointer flex justify-end p-6" onClick={closeRemoveModal}>
              <i className="fa-solid fa-xmark"></i>
            </span>
            <div className="px-14 pb-10">
              <h2 className="text-lg justify-center px-4 flex w-full">Are you sure, you want to remove it ?</h2>
              <div className="flex justify-between mt-10 ">
                <button
                  onClick={closeRemoveModal}
                  className="px-16 py-2 bg-gray-200 text-black font-semibold rounded cursor-pointer"
                >
                  NO
                </button>
                <button
                  onClick={removeLink}
                  className="px-16 py-2 bg-blue-700 text-white font-semibold rounded cursor-pointer"
                >
                  YES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <EditLinkModal isOpen={isModalOpen} closeModal={closeModal} /> */}
      <EditLinkModal isOpen={isEditModalOpen} closeModal={closeEditModal} link={selectedLink} refreshData={fetchLinks}/>

      <NewLinkModal isOpen={isModalOpen} closeModal={closeModal} link={selectedLink} refreshData={fetchLinks} />

      {showToast && (
          <div className="fixed bottom-12 left-12 bg-white border border-blue-500 shadow-md rounded-lg px-10 py-2 flex items-center space-x-2">
            <i className="fa-solid fa-check-circle text-blue-500 text-lg"></i>
            <span className="text-gray-800 font-semibold">Link Copied</span>
          </div>
      )}

    </>
  );
}

export default Links;


