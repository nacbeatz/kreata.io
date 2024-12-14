import React, { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";

interface RightSidebarProps {
  darkMode: boolean;
}

const Sidebar2: React.FC<RightSidebarProps> = ({ darkMode }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your subscription has been renewed!" },
    { id: 2, message: "New comment on your video!" },
    { id: 3, message: "Weekly analytics are ready to view!" },
  ]);

  const [isExpanded, setIsExpanded] = useState(false);

  const recentVideos = Array.from({ length: 10 }, (_, index) => ({
    id: 10 - index,
    thumbnail: "/img/thumbnail.jpg",
    title: `Video Title ${10 - index}`,
  }));

  const handleNotificationClose = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const toggleDropdown = () => {
    setIsExpanded(!isExpanded);
  };

  const containerClass = darkMode
    ? "bg-[#0A1739] text-white"
    : "bg-gray-100 text-black";

  const notificationClass = darkMode
    ? "bg-[#012244] text-white"
    : "bg-gray-300 text-black";

  return (
    <aside
      className={`${containerClass} hidden md:block rounded-md w-full md:w-[20%] h-[calc(100vh-1rem)] mt-28 mb-32 p-4 fixed right-0 overflow-y-auto`}
      style={{ scrollbarWidth: "thin" }}
    >
      {/* Channel Info Section */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="https://via.placeholder.com/100"
          alt="Channel Picture"
          className="w-20 h-20 rounded-full object-cover"
        />
        <h2 className="mt-2 text-lg font-bold">Akariho Tech</h2>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          @akarihotech
        </p>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        Sobanukirwa ibijyanye na TEKINOLOJI
        </p>
        <div className="flex justify-center flex-col items-center space-y-4 mt-5">
  
  <div className="flex justify-center items-center space-x-2">
  
  <div className="flex flex-col items-center ">
    <span className={`text-xs font-bold ${darkMode ? "text-gray-300" : "text-black"}`}>
      Subs
    </span>
    <div className={`flex items-center justify-center w-24 h-5 mt-2 rounded-full ${darkMode ? "bg-[#012244] text-white" : "bg-gradient-to-r from-[#D6ED07] to-[#25A906] text-white"}`}>
      <span className="text-xs font-bold">124K</span>
    </div>
  </div>
  <div className="flex flex-col items-center">
    <span className={`text-xs font-bold ${darkMode ? "text-gray-300" : "text-black"}`}>
      Views
    </span>
    <div className={`flex items-center justify-center w-24 h-5 mt-2 rounded-full ${darkMode ? "bg-[#012244] text-white" : "bg-gradient-to-r from-[#D6ED07] to-[#25A906] text-white"}`}>
      <span className="text-xs font-bold">420K</span>
    </div>
  </div>
</div>


<div className="flex justify-center items-center space-x-2 mt-2">
  <div className="flex flex-col items-center">
    <span className={`text-xs  ${darkMode ? "text-gray-300" : "text-black"}`}>
      Videos
    </span>
    <div className={`flex items-center justify-center w-16 h-5 mt-2 rounded-full ${darkMode ? "bg-[#012244] text-white" : "bg-gradient-to-r from-[#D6ED07] to-[#25A906] text-white"}`}>
      <span className="text-xs">10,230</span>
    </div>
  </div>
  <div className="flex flex-col items-center">
    <span className={`text-xs ${darkMode ? "text-gray-300" : "text-black"}`}>
      RPM
    </span>
    <div className={`flex items-center justify-center w-16 h-5 mt-2 rounded-full ${darkMode ? "bg-[#012244] text-white" : "bg-gradient-to-r from-[#D6ED07] to-[#25A906] text-white"}`}>
      <span className="text-xs">$2.5</span>
    </div>
  </div>
  <div className="flex flex-col items-center">
    <span className={`text-xs ${darkMode ? "text-gray-300" : "text-black"}`}>
      Category
    </span>
    <div className={`flex items-center justify-center w-24 h-5 mt-2 rounded-full ${darkMode ? "bg-[#012244] text-white" : "bg-gradient-to-r from-[#D6ED07] to-[#25A906] text-white"}`}>
      <span className="text-xs">Education</span>
    </div>
  </div>
</div>

</div>

      </div>


      {/* Notifications Section */}
      <div>
        <h2 className="text-lg font-bold mb-4">Notifications</h2>
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map(({ id, message }) => (
              <li key={id} className={`flex items-center justify-between p-3 rounded-md ${notificationClass}`}>
                <p className="text-sm">{message}</p>
                <button
                  aria-label="Close notification"
                  onClick={() => handleNotificationClose(id)}
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            No new notifications.
          </p>
        )}
      </div>

      <div className="mb-8 mt-8">
        <div
          className={`w-full h-40 rounded-lg ${darkMode ? "bg-[#1a2744]" : "bg-gray-300"} flex items-center justify-center`}
        >
          <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
            {/* Graph Placeholder */}
          </p>
        </div>
      </div>
      <div className="mt-8 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-[#25A906] text-center">
          LAST 10 VIDEOS
        </h2>
        <div className="flex flex-wrap mb-24">

          <div
            key={recentVideos[0].id}
            className="flex items-center justify-center rounded-lg overflow-hidden border-2 border-[#25A906] shadow-md w-full mb-4 cursor-pointer"
            style={{ height: "150px" }}
          >
            <img
              src={recentVideos[0].thumbnail}
              alt={`Thumbnail for Video #${recentVideos[0].id}`}
              className="w-full h-full object-cover"
            />
          </div>


          <button
            onClick={toggleDropdown}
            className="w-full flex justify-center items-center text-2xl mt-[-22px] text-[#25A906]"
          >
            <ArrowDropDownIcon
              className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                }`}
            />
          </button>
        </div>


        {isExpanded && (
          <div className="flex flex-wrap">
            {recentVideos.slice(1).map(({ id, thumbnail }) => (
              <div
                key={id}
                className="flex items-center justify-center rounded-lg overflow-hidden border-2 border-[#25A906] shadow-md w-full mb-1 cursor-pointer"
                style={{ height: "50px" }}
              >
                <img
                  src={thumbnail}
                  alt={`Thumbnail for Video #${id}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar2;
