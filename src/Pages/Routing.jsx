import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import LogIn from "./LogIn";
import DashboardLinks from "./DashboardLinks";
import DashboardAnalytics from "./DashboardAnalytics";
import Settings from "./Settings";
import SignUp from "./SignUp";

function Routing() {
    return (
        <div>
            <Routes>

                <Route path="/login" element={<LogIn/>} />

                <Route path="/signup" element={<SignUp/>} />

                <Route path="/" element={<Dashboard/>} />

                <Route path="/dashboard" element={<Dashboard/>} />

                <Route path="/links" element={<DashboardLinks/>} />
                
                <Route path="/analytics" element={<DashboardAnalytics/>} />

                <Route path="/setting" element={<Settings/>} />

            </Routes>
        </div>
    )
}

export default Routing;