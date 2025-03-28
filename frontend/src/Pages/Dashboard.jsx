import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {
  // State for analytics data
  const [totalClicks, setTotalClicks] = useState(0);
  const [dateWiseClicks, setDateWiseClicks] = useState({});
  const [deviceWiseClicks, setDeviceWiseClicks] = useState({
    Mobile: 0,
    Desktop: 0,
    Tablet: 0,
  });

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/analytics`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });

        console.log("API Response:", response.data); // Debugging

        if (response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const analyticsData = response.data.data;

          let total = analyticsData.length;
          let dateClicks = {};
          let deviceClicks = { Mobile: 0, Desktop: 0, Tablet: 0 };

          analyticsData.forEach((entry) => {
            // Extract date from timestamp
            const date = entry.timestamp ? new Date(entry.timestamp).toISOString().split("T")[0] : "Unknown";
            dateClicks[date] = (dateClicks[date] || 0) + 1;

            // Update device-wise clicks count
            const device = entry.userDevice || "Unknown";
            deviceClicks[device] = (deviceClicks[device] || 0) + 1;
          });

          setTotalClicks(total);
          setDateWiseClicks(dateClicks);
          setDeviceWiseClicks(deviceClicks);
        } else {
          setTotalClicks(0);
          setDateWiseClicks({});
          setDeviceWiseClicks({ Mobile: 0, Desktop: 0, Tablet: 0 });
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setTotalClicks(0);
        setDateWiseClicks({});
        setDeviceWiseClicks({ Mobile: 0, Desktop: 0, Tablet: 0 });
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className=" lg:p-6 p-2">
      {/* Total Clicks */}
      <div className="h-1/8 p-4">
        <h3 className="font-semibold text-xl flex space-x-10">
          <span>Total Clicks</span>
          <span className="text-blue-700">{totalClicks}</span>
        </h3>
      </div>

      <div className="h-7/8 flex flex-col lg:flex-row space-y-6 lg:space-x-6 p-4">
        {/* Date-wise Clicks */}
        <div className="w-full lg:w-[49%] min-h-[30vh] lg:min-h-[60vh] p-6 border-2 border-gray-200 rounded">
          <h3 className="text-blue-700 font-semibold mb-10">Date-wise Clicks</h3>
          {Object.keys(dateWiseClicks).length > 0 ? (
            Object.entries(dateWiseClicks).map(([date, count], index) => (
              <div key={index} className="flex items-center">
                <span className="w-2/6 lg:w-1/5 font-semibold">{date}</span>
                <div className="w-3/6 lg:w-3/5 bg-gray-200 h-4">
                  <div className="h-full bg-blue-700" style={{ width: `${(count / totalClicks) * 100}%` }}></div>
                </div>
                <span className="w-1/6 lg:w-1/5 pl-12 font-semibold">{count}</span>
              </div>
            ))
          ) : (
            // If no clicks, show a default row with "0"
            <div className="flex items-center">
              <span className="w-1/5 font-semibold">No Data</span>
              <div className="w-3/5 bg-gray-200 h-4">
                <div className="h-full bg-blue-700" style={{ width: "0%" }}></div>
              </div>
              <span className="w-1/5 pl-12 font-semibold">0</span>
            </div>
          )}
        </div>

        {/* Device-wise Clicks */}
        <div className="w-full lg:w-[49%] p-6 min-h-[30vh] lg:min-h-[60vh] border-2 border-gray-200 rounded">
          <h3 className="text-blue-700 font-semibold mb-10">Click Devices</h3>
          {Object.entries(deviceWiseClicks).map(([device, count], index) => (
            <div key={index} className="flex items-center">
              <span className="w-2/6 lg:w-1/5 font-semibold">{device}</span>
              <div className="w-3/6 lg:w-3/5 bg-gray-200 h-4">
                <div className="h-full bg-blue-700" style={{ width: `${totalClicks > 0 ? (count / totalClicks) * 100 : 0}%` }}></div>
              </div>
              <span className="w-1/6 lg:w-1/5 pl-12 font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
