import React, { useState, useEffect } from "react";

function NewLinkModal({ isOpen, closeModal, refreshData }) {
  const [destinationUrl, setDestinationUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [expirationEnabled, setExpirationEnabled] = useState(true);
  const [expirationDate, setExpirationDate] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Set the default expiration date to the current date and time + 1 day
  useEffect(() => {
    const defaultExpirationDate = new Date();
    defaultExpirationDate.setDate(defaultExpirationDate.getDate() + 1);
    const formattedDate = defaultExpirationDate.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:mm
    setExpirationDate(formattedDate);
  }, []);

  if (!isOpen) return null; // Don't render the modal if it's not open


  const handleCreate = async () => {
    if (!destinationUrl.trim() || !remarks.trim()) {
      alert("Destination URL and remarks are required!");
      return;
    }
  
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
  
      if (!token) {
        alert("You must be logged in to create a link.");
        return;
      }
  
      const response = await fetch("http://localhost:5000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          destinationUrl,
          remarks,
          expirationDate: expirationEnabled ? expirationDate : null,
        }),
      });
  
      if (!response.ok) throw new Error("Failed to create short URL");
  
      const data = await response.json();
  
      console.log("New Link Created:", data);
      
      // ✅ Refresh the links list FIRST before closing the modal
      await refreshData(); 
  
      // ✅ Close the modal after refreshing data
      closeModal();
  
    } catch (error) {
      console.error("Error creating short URL:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  // const handleCreate = async () => {
  //   if (!destinationUrl.trim() || !remarks.trim()) {
  //     alert("Destination URL and remarks are required!");
  //     return;
  //   }
  
  //   setIsLoading(true);
  //   try {
  //     // Get the token from localStorage (or wherever it's stored)
  //     const token = localStorage.getItem("authToken"); // Assuming you store the token in localStorage
  
  //     if (!token) {
  //       alert("You must be logged in to create a link.");
  //       return;
  //     }
  
  //     const response = await fetch("http://localhost:5000/create", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`, // Include the token in the Authorization header
  //       },
  //       body: JSON.stringify({
  //         destinationUrl,
  //         remarks,
  //         expirationDate: expirationEnabled ? expirationDate : null,
  //       }),
  //     });

  //     if (response.status === 200) {
  //       window.location.reload(); // ✅ Correct way to reload the page
  //     }
  
  //     // Check for a successful response
  //     if (!response.ok) throw new Error("Failed to create short URL");
  
  //     // Parse the response
  //     const data = await response.json(); // Parse JSON
  
  //     console.log(data); // Log the data to verify the response
  //     if (data.shortLink) {
  //       setShortLink(data.shortLink); // Set the generated short link
  //     }
  //     closeModal(); // Close the modal after creating the link
  //   } catch (error) {
  //     console.error("Error creating short URL:", error);
  //     alert("Something went wrong. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleClear = () => {
    setDestinationUrl("");
    setRemarks("");
    setExpirationEnabled(true);
    const defaultExpirationDate = new Date();
    defaultExpirationDate.setDate(defaultExpirationDate.getDate() + 1);
    const formattedDate = defaultExpirationDate.toISOString().slice(0, 16);
    setExpirationDate(formattedDate);
    setShortLink("");
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-brightness-50 z-50"
      aria-label="New Link Modal"
    >
      <div className="bg-white rounded-md w-2/7 h-[70%] relative overflow-hidden shadow-lg">
        <div className="text-lg font-semibold bg-slate-700 text-white p-4 flex justify-between">
          <h2>New Link</h2>
          <span
            className="text-2xl cursor-pointer"
            onClick={closeModal}
            aria-label="Close Modal"
          >
            <i className="fa-solid fa-xmark"></i>
          </span>
        </div>

        <div className="px-6 pt-4 pb-2">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="destinationUrl"
          >
            Destination Url <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="destinationUrl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
            value={destinationUrl}
            onChange={(e) => setDestinationUrl(e.target.value)}
            aria-label="Enter the destination URL"
          />
        </div>

        <div className="px-6 py-2">
          <label className="block text-sm font-medium mb-1" htmlFor="remarks">
            Remarks <span className="text-red-500">*</span>
          </label>
          <textarea
            id="remarks"
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            aria-label="Enter remarks"
          />
        </div>

        <div className="space-y-2 flex flex-col px-6 py-4">
          <div className="flex justify-between">
              <label className="block text-sm font-medium mr-2">Link Expiration</label>
              {/* <input
                type="checkbox"
                checked={expirationEnabled}
                onChange={(e) => setExpirationEnabled(e.target.checked)}
                className="mr-2"
                aria-label="Enable or disable link expiration"
              /> */}
              {/* Toggle Switch */}
              <div
                  className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    expirationEnabled ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  onClick={() => setExpirationEnabled(!expirationEnabled)}
                >
                  {/* Toggle Handle */}
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      expirationEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </div>
          </div>
          {expirationEnabled && (
            <input
              type="datetime-local"
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              aria-label="Select expiration date and time"
            />
          )}
        </div>

        <div className="flex justify-between p-4 bg-gray-100 absolute bottom-0 left-0 right-0">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
            onClick={handleClear} // This will clear the form fields
            aria-label="Clear fields"
          >
            Clear
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            onClick={handleCreate}
            disabled={isLoading}
            aria-label="Create new link"
          >
            {isLoading ? "Creating..." : "Create new"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default NewLinkModal;

