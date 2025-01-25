import React from "react";

// Modal component
function NewLinkModal({ isOpen, closeModal }) {
    if (!isOpen) return null; // Don't render the modal if it's not open
  
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-md w-1/3">
          <h2 className="text-xl font-semibold">Create New Item</h2>
          {/* Your modal content here */}
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  export default NewLinkModal;
  