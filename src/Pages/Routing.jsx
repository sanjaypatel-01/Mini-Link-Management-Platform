import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import LogIn from "./LogIn";
import DashboardLinks from "./DashboardLinks";
import DashboardAnalytics from "./DashboardAnalytics";
import Settings from "./Settings";
import SignUp from "./SignUp";
import Layout from "./Layout";

function Routing() {
  return (
    <Routes>
      {/* Routes without Layout */}
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Default route, redirect to /dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* Routes with Layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/links" element={<DashboardLinks />} />
        <Route path="/analytics" element={<DashboardAnalytics />} />
        <Route path="/setting" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default Routing;
