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
            <div className="h-7/8 flex space-x-6 p-4">
              {/* Date-wise Clicks */}
                <div className="w-[49%] p-6 border-2 border-gray-200 rounded">
                  <h3 className="text-blue-700 font-semibold mb-10">Date-wise Clicks</h3>
                  <div className="space-y-2" >
                    <div className="flex items-center">
                        <span className="w-1/5 font-semibold">21-01-25</span>
                        <div className="w-3/5 bg-gray-200 full h-4">
                            <div className="h-full bg-blue-700 w-[80%]"></div>
                        </div>
                        <span className="w-1/5 pl-12 font-semibold">1234</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-1/5 font-semibold">20-01-25</span>
                        <div className="w-3/5 bg-gray-200 full h-4">
                            <div className="h-full bg-blue-700 w-[10%]"></div>
                        </div>
                        <span className="w-1/5 pl-12 font-semibold">134</span>
                    </div>
                  </div>
                </div>

              {/* Click Devices */}
                <div className="w-[49%] p-6 border-2 border-gray-200 rounded">
                  < h3 className="text-blue-700 font-semibold mb-10">Click Devices</h3>
                  <div className="space-y-2" >
                    <div className="flex items-center">
                        <span className="w-1/5 font-semibold">Mobille</span>
                        <div className="w-3/5 bg-gray-200 full h-4">
                            <div className="h-full bg-blue-700 w-[75%]"></div>
                        </div>
                        <span className="w-1/5 pl-12 font-semibold">134</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-1/5 font-semibold">Desktop</span>
                        <div className="w-3/5 bg-gray-200 full h-4">
                            <div className="h-full bg-blue-700 w-[20%]"></div>
                        </div>
                        <span className="w-1/5 pl-12 font-semibold">40</span>
                    </div>
                  </div>
                </div>

            </div>
    </>
  );
}

export default Dashboard;
