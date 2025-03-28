import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import { ToastContainer } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Settings() {
  // State to hold the user's details
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  // Error state
  const [error, setError] = useState("");
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  // Fetch the current user data when the component mounts
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      // Assuming user data is fetched from an endpoint
      axios
        .get(`${backendUrl}/api/user`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((response) => {
          setFormData({
            name: response.data.name,
            email: response.data.email,
            mobile: response.data.mobile,
          });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  // Handle form data change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle save changes
  const saveChanges = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await axios.put(`${backendUrl}/api/user/update`,
        { name: formData.name, email: formData.email, mobile: formData.mobile }, // Send only required fields
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (response.data.success) {
        toast.success("Changes saved successfully!");

        // ✅ If email is changed, logout and redirect
      if (response.data.emailChanged) {
        setTimeout(() => {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }, 2000);
      }
      }
    } catch (error) {
      setError("Failed to update details. Please try again.");
      toast.error("Failed to update details. Please try again.");
    }
  };

    // Open the delete confirmation modal
    const openRemoveModal = () => {
      setIsRemoveModalOpen(true);
    };
  
    // Close the delete confirmation modal
    const closeRemoveModal = () => {
      setIsRemoveModalOpen(false);
    };

  // Handle account deletion
  const confirmDeleteAccount = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        const response = await axios.delete(`${backendUrl}/api/user/delete`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (response.data.success) {

          toast.success("Account deleted successfully!");

          setTimeout(() => {
            localStorage.removeItem("authToken");
            window.location.href = "/signup";
          }, 2000);
        }
      } catch (error) {
        setError("Failed to delete account. Please try again.");
      }
  };
  

  return (
    <div className="h-9/10 md:p-12 p-8 flex justify-center rounded">
      <div className="h-full w-full md:w-2/3 lg:w-1/3 flex flex-col gap-4 items-start">
        {/* Name */}
        <div className="flex w-full items-center justify-between mt-16">
          <span className="font-semibold">Name</span>
          <input
            className="border border-gray-300 p-1 px-2 text-gray-700 rounded w-4/6"
            type="text"
            name="name"
            placeholder="Sanjay Patel"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold">Email Id</span>
          <input
            className="border border-gray-300 p-1 px-2 text-gray-700 rounded w-4/6"
            type="text"
            name="email"
            placeholder="sanjay@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Mobile */}
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold">Mobile no.</span>
          <input
            className="border border-gray-300 p-1 text-gray-700 px-2 rounded w-4/6"
            type="text"
            name="mobile"
            placeholder="9630974774"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Save Changes Button */}
        <button
          className="bg-blue-700 w-full cursor-pointer text-white rounded p-2 mt-16"
          onClick={saveChanges}
        >
          Save Changes
        </button>

        {/* Delete Account Button */}
        <button
          className="bg-red-600 w-full cursor-pointer text-white rounded p-2"
          onClick={openRemoveModal}
        >
          Delete Account
        </button>
      </div>
      {/* Confirmation Modal */}
      {isRemoveModalOpen && (
            <div className="fixed inset-0 flex rounded-lg items-center justify-center backdrop-brightness-50 bg-opacity-50 z-50 ">
              <div className="bg-white rounded shadow-lg scale-70 md:scale-100">
                <span className="text-lg cursor-pointer flex justify-end p-6" onClick={closeRemoveModal}>
                  <i className="fa-solid fa-xmark"></i>
                </span>
                <div className="px-14 pb-10">
                  <h2 className="text-lg font-semibold justify-center px-4 flex w-full">Are you sure, you want to remove it ?</h2>
                  <div className="flex justify-between mt-10 ">
                    <button
                      onClick={closeRemoveModal}
                      className="px-16 py-2 bg-gray-200 text-black font-semibold rounded cursor-pointer"
                    >
                      NO
                    </button>
                    <button
                      onClick={confirmDeleteAccount}
                      className="px-16 py-2 bg-blue-700 text-white font-semibold rounded cursor-pointer"
                    >
                      YES
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <ToastContainer /> {/* ✅ Add this to enable toasts */}
    </div>

          

  );
}

export default Settings;




