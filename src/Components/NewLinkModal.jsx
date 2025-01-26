import React, { useState, useEffect } from "react";

function NewLinkModal({ isOpen, closeModal }) {
  const [destinationUrl, setDestinationUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [expirationEnabled, setExpirationEnabled] = useState(true);
  const [expirationDate, setExpirationDate] = useState("");

  // Set the default expiration date to the current date and time with AM/PM format
  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:mm
    setExpirationDate(formattedDate);
  }, []);

  if (!isOpen) return null; // Don't render the modal if it's not open

  const handleCreate = () => {
    // Handle the creation logic here
    console.log({ destinationUrl, remarks, expirationEnabled, expirationDate });
    closeModal();
  };

  const handleClear = () => {
    // Reset all form fields to their initial state
    setDestinationUrl("");
    setRemarks("");
    setExpirationEnabled(true);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:mm
    setExpirationDate(formattedDate);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-md z-50">
      <div className="bg-white rounded-md w-2/7 h-[70%] relative overflow-hidden shadow-lg">
        <div className="text-lg font-semibold bg-slate-700 text-white p-4 flex justify-between">
          <h2>New Link</h2>
          <span className="text-2xl cursor-pointer" onClick={closeModal}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </div>

        <div className="px-6 pt-4 pb-2">
          <label className="block text-sm font-medium mb-1" htmlFor="destinationUrl">
            Destination Url <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="destinationUrl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
            value={destinationUrl}
            onChange={(e) => setDestinationUrl(e.target.value)}
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
          />
        </div>

        <div className="space-y-2 flex flex-col px-6 py-4">
          <div className="flex justify-between">
            <label className="block text-sm font-medium mr-2">Link Expiration</label>
            <input
              type="checkbox"
              checked={expirationEnabled}
              onChange={(e) => setExpirationEnabled(e.target.checked)}
              className="mr-2"
            />
          </div>
          {expirationEnabled && (
            <input
              type="datetime-local"
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          )}
        </div>

        <div className="flex justify-between p-4 bg-gray-100 absolute bottom-0 left-0 right-0">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
            onClick={handleClear} // This will clear the form fields
          >
            Clear
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-600 cursor-pointer"
            onClick={handleCreate}
          >
            Create new
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewLinkModal;
