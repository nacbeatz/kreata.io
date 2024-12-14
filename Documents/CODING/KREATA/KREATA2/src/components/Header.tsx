import React, { useState } from "react";
import { Search, Notifications, Close } from "@mui/icons-material";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    "New comment on your post!",
    "Your subscription is about to expire!",
    "Weekly analytics are ready to view!",
  ]);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  const handleLogout = () => {
    console.log("Logged out");
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full py-3 px-4 flex items-center justify-between z-50 ${
        darkMode ? "bg-[#081028] text-white" : "bg-white text-black"
      }`}
      style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
    >
      <h1
        className={`text-2xl font-bold ml-24 ${
          darkMode ? "text-white" : "text-black"
        } whitespace-nowrap`}
      >
        Kreata.io
      </h1>

      {/* Search Bar */}
      <div
        className={`relative flex-1 max-w-md mx-auto ${
          isSearchOpen ? "block" : "hidden"
        } md:block`}
      >
        <input
          type="text"
          placeholder="Search..."
          className={`${
            darkMode
              ? "bg-[#0B1838] text-white"
              : "bg-gray-100 text-black"
          } p-2 rounded-xl pl-10 w-full focus:outline-none`}
        />
        <Search
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            darkMode ? "text-[#2B6A20]" : "text-black"
          }`}
        />
      </div>

      
      <button
        onClick={toggleSearch}
        className="block md:hidden focus:outline-none"
      >
        <Search className={darkMode ? "text-white" : "text-black"} />
      </button>

      
      <div className="flex items-center space-x-4">
        
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="relative focus:outline-none"
          >
            <Notifications
              className={`${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            />
            <span
              className={`absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full px-1 font-semibold`}
            >
              {notifications.length}
            </span>
          </button>

          {showNotifications && (
            <div
              className={`absolute right-0 mt-2 w-72 p-4 rounded-lg shadow-lg ${
                darkMode ? "bg-[#0B1838] text-white" : "bg-white text-black"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <button
                  onClick={closeNotifications}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                >
                  <Close className="w-8 h-8" />
                </button>
              </div>

              {notifications.length > 0 ? (
                <ul className="space-y-2">
                  {notifications.map((notification, index) => (
                    <li
                      key={index}
                      className={`p-2 rounded-lg ${
                        darkMode
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {notification}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No new notifications.</p>
              )}
            </div>
          )}
        </div>

        
        <div className="relative">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer"
            onClick={toggleProfileMenu}
          />

          {showProfileMenu && (
            <div
              className={`absolute right-0 mt-2 w-48 p-4 rounded-lg shadow-lg ${
                darkMode ? "bg-[#0B1838] text-white" : "bg-white text-black"
              }`}
            >
              <ul className="space-y-2">
                <li
                  className={`p-2 rounded-lg cursor-pointer ${
                    darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-200"
                  }`}
                >
                  Settings
                </li>
                <li
                  className={`p-2 rounded-lg cursor-pointer ${
                    darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-200"
                  }`}
                >
                  Privacy
                </li>
                <li
                  className={`p-2 rounded-lg cursor-pointer ${
                    darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-200"
                  }`}
                >
                  Help
                </li>
                <li
                  className={`p-2 rounded-lg cursor-pointer ${
                    darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
