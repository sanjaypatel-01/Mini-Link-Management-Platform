import React, { useState, useEffect } from "react";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {

  // State for analytics data
  const [totalClicks, setTotalClicks] = useState(0);
  const [dateWiseClicks, setDateWiseClicks] = useState({});
  const [deviceWiseClicks, setDeviceWiseClicks] = useState({});

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        
        const response = await axios.get(`${backendUrl}/api/analytics` , {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });

        const analyticsData = response.data;

        // Process data
        let total = 0;
        let dateClicks = {};
        let deviceClicks = { Mobile: 0, Desktop: 0, Tablet: 0 };

        analyticsData.forEach((entry) => {
          // Count total clicks
          total++;

          // Extract date from timestamp
          const date = entry.timestamp ? new Date(entry.timestamp).toISOString().split("T")[0] : "Unknown";

          // Update date-wise clicks count
          dateClicks[date] = (dateClicks[date] || 0) + 1;

          // Update device-wise clicks count
          const device = entry.userDevice || "Unknown";
          deviceClicks[device] = (deviceClicks[device] || 0) + 1;
        });

        setTotalClicks(total);
        setDateWiseClicks(dateClicks);
        setDeviceWiseClicks(deviceClicks);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <>
          <div className="h-1/8">
                <h3 className="font-semibold text-xl flex space-x-10">
                <span>Total Clicks</span>
                <span className="text-blue-700">{totalClicks}</span>
                </h3>
            </div>
            <div className="h-7/8 flex space-x-6 p-4">
              {/* Date-wise Clicks */}
                <div className="w-[49%] p-6 border-2 border-gray-200 rounded">
                  <h3 className="text-blue-700 font-semibold mb-10">Date-wise Clicks</h3>
                  <div className="space-y-2" >
                    {Object.entries(dateWiseClicks).map(([date, count], index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-1/5 font-semibold">{date}</span>
                        <div className="w-3/5 bg-gray-200 full h-4">
                          <div className="h-full bg-blue-700" style={{ width: `${(count / totalClicks) * 100}%` }}></div>
                        </div>
                        <span className="w-1/5 pl-12 font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

              {/* Device-wise Click */}
                <div className="w-[49%] p-6 border-2 border-gray-200 rounded">
                  < h3 className="text-blue-700 font-semibold mb-10">Click Devices</h3>
                  <div className="space-y-2" >
                    {Object.entries(deviceWiseClicks).map(([device, count], index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-1/5 font-semibold">{device}</span>
                        <div className="w-3/5 bg-gray-200 full h-4">
                          <div className="h-full bg-blue-700" style={{ width: `${(count / totalClicks) * 100}%` }}></div>
                        </div>
                        <span className="w-1/5 pl-12 font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
            </div>
    </>
  );
}

export default Dashboard;
