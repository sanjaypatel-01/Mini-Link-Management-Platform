import React from "react";

function Dashboard() {
  return (
    <>
            <div className="h-1/8">
                <h3 className="font-semibold text-xl flex space-x-10">
                <span>Total Clicks</span>
                <span className="text-blue-700">1234</span>
                </h3>
            </div>
            <div className="h-7/8 flex space-x-4">
                <div className="w-[49%] p-4 border-2 border-gray-400 rounded">
                <h3 className="text-blue-700 font-semibold">Date-wise Clicks</h3>
                </div>
                <div className="w-[49%] p-4 border-2 border-gray-400 rounded">
                <h3 className="text-blue-700 font-semibold">Click Devices</h3>
                </div>
            </div>
    </>
  );
}

export default Dashboard;
