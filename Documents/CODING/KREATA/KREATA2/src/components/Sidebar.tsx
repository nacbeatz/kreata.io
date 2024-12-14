import React, { useState, useEffect } from "react";
import InsightsIcon from "@mui/icons-material/Insights";
import YouTubeIcon from "@mui/icons-material/YouTube";
import SchoolIcon from "@mui/icons-material/School";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TuneIcon from "@mui/icons-material/Tune";
import MenuIcon from "@mui/icons-material/Menu";
import { Tooltip, Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  darkMode: boolean;
  toggleDarkMode: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ darkMode, toggleDarkMode }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      toggleDarkMode(savedMode === "true");
    }
  }, [toggleDarkMode]);

  const toggleSidebarExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDarkModeToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.checked;
    toggleDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
  };

  const navItems = [
    { name: "Insights", icon: <InsightsIcon />, path: "/insights" },
    { name: "Channel", icon: <YouTubeIcon />, path: "/channel" },
    { name: "Learn", icon: <SchoolIcon />, path: "/learn" },
    { name: "SEOTips", icon: <TipsAndUpdatesIcon />, path: "/seo-tips" },
    { name: "Notifications", icon: <NotificationsIcon />, path: "/notifications" },
    { name: "Settings", icon: <TuneIcon />, path: "/settings" },
  ];

  return (
    <aside
      className={`${
        darkMode ? "bg-[#0A1739] text-white" : "bg-gray-100 text-black"
      } fixed top-0 left-0 h-screen transition-all duration-300 flex flex-col justify-between mt-16 ${
        isExpanded ? "w-64" : "w-16"
      } rounded-r-lg shadow-lg transform ease-in-out transition-all backdrop-blur-lg bg-opacity-70 backdrop-filter z-50`}
    >
      <div>
        <div className="p-4 cursor-pointer" onClick={toggleSidebarExpansion}>
          <MenuIcon sx={{ color: darkMode ? "white" : "black" }} />
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Tooltip title={item.name} placement="right" disableHoverListener={isExpanded}>
                  <div
                    onClick={() => navigate(item.path)}
                    className={`group flex items-center gap-4 px-4 py-2 rounded-md transition-all duration-300 hover:scale-105 ${
                      darkMode ? "hover:bg-[#05102E]" : "hover:bg-gray-200"
                    } cursor-pointer transform ease-in-out`}
                  >
                    <div
                      className={`transition-colors duration-300 ${
                        darkMode ? "text-white group-hover:text-[#25A906]" : "text-[#012244] group-hover:text-[#25A906]"
                      }`}
                    >
                      {React.cloneElement(item.icon, { className: "w-6 h-6" })}
                    </div>
                    {isExpanded && <span>{item.name}</span>}
                  </div>
                </Tooltip>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-4">
        {isExpanded && (
          <div className="flex justify-center mb-44">
            <button
              onClick={() => navigate("/pricing")}
              className="bg-[#D6ED07] text-black py-2 px-4 w-full rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Upgrade Plan
            </button>
          </div>
        )}

        <div
          className={`flex items-center mb-20 ${isExpanded ? "justify-between" : "justify-center mb-20"}`}
        >
          <Switch
            checked={darkMode}
            onChange={handleDarkModeToggle}
            color="default"
            inputProps={{ "aria-label": "dark mode toggle" }}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

