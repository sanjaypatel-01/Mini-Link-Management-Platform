import React from "react";

function Settings() {
  return (
    <>
      <div className="bg-white h-9/10 p-12 flex justify-center rounded">
        <div className="h-full w-1/3 flex flex-col gap-4 items-start">
          <div className="flex w-full items-center justify-between mt-16">
            <span>Name</span>
            <input
              className="border border-gray-400 p-1 rounded w-3/5"
              type="text"
              placeholder="Sanjay Patel"
            />
          </div>
          <div className="flex w-full items-center justify-between">
            <span>Email Id</span>
            <input
              className="border border-gray-400 p-1 rounded w-3/5"
              type="text"
              placeholder="sanjay@gmail.com"
            />
          </div>
          <div className="flex w-full items-center justify-between">
            <span>Mobile no.</span>
            <input
              className="border border-gray-400 p-1 rounded w-3/5"
              type="text"
              placeholder="9630974774"
            />
          </div>

          <button className="bg-blue-700 w-full text-white rounded p-2 mt-16">
            Save Changes
          </button>
          <button className="bg-red-600 w-full text-white rounded p-2">
            Delete Account
          </button>
        </div>
      </div>
    </>
  );
}

export default Settings;
