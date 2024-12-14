import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInPage from "./components/SignInPage";
import Dashboard from "./components/Dashboard";
import ContentCreatorsDashboard from "./components/ContentCreatorsDashboard";
import Insights from "./components/Insights";
import Pricing from "./components/Pricing";
import Learn from "./components/Learn";
import Channel from "./components/Channel";
import Notifications from "./components/Notifications";
import SeoTips from "./components/SeoTips";
import Settings from "./components/Settings";

const App: React.FC = () => {
  const [isPlanVisible, setIsPlanVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Add state for dark mode

  const handleLoginSuccess = (user: { email: string; password: string }) => {
    console.log("Login successful:", user);
  };

  const handleUpgradePlan = () => {
    setIsPlanVisible(true);
  };

  const closePlan = () => {
    setIsPlanVisible(false);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev); // Function to toggle dark mode
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<SignInPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/dashboard" element={<Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/content-creators-dashboard" element={<ContentCreatorsDashboard />} />
          <Route path="/pricing" element={<Pricing darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/channel" element={<Channel />} />
          <Route path="/seo-tips" element={<SeoTips />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;