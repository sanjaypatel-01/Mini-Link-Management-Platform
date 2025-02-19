import React, { useState, useEffect } from "react";
import axios from "axios";

function EditLinkModal({ isOpen, closeModal, link, refreshData }) {
  const [remarks, setRemarks] = useState("");
  const [expirationEnabled, setExpirationEnabled] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");

  useEffect(() => {
    if (link) {
      setRemarks(link.remarks || "");
      setExpirationEnabled(!!link.expirationDate);
      setExpirationDate(link.expirationDate ? new Date(link.expirationDate).toISOString().slice(0, 16) : "");
    }
  }, [link]);

  if (!isOpen || !link) return null;

  const handleUpdate = async () => {
    try {
      const updatedData = {
        remarks,
        expirationDate: expirationEnabled ? expirationDate : null,
      };

      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/links/${link._id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      refreshData();
      closeModal();
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-brightness-50 z-50">
      <div className="bg-white rounded-md w-6/7 scale-90 md:w-4/7 md:scale-100 lg:w-2/7 h-[70%] relative overflow-hidden shadow-lg">
        <div className="text-lg font-semibold bg-slate-700 text-white p-4 flex justify-between">
          <h2>Edit Link</h2>
          <span className="text-2xl cursor-pointer" onClick={closeModal}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </div>

        <div className="px-6 pt-4 pb-2">
          <label className="block text-sm font-medium mb-1" htmlFor="destinationUrl">
            Destination Url
          </label>
          <input
            type="url"
            id="destinationUrl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            value={link.originalLink}
            disabled
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
            <div
              className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                expirationEnabled ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => setExpirationEnabled(!expirationEnabled)}
            >
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
            />
          )}
        </div>

        <div className="flex justify-between p-4 bg-gray-100 absolute bottom-0 left-0 right-0">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-600 cursor-pointer"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditLinkModal;
