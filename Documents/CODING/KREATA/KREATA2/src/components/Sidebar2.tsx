import React from "react";

interface RightSidebarProps {
  darkMode: boolean;
}

const Sidebar2: React.FC<RightSidebarProps> = ({ darkMode }) => {
  const containerClass = darkMode
    ? "bg-[#0A1739] text-white"
    : "bg-gray-100 text-black";

  return (
    <aside
      className={`${containerClass} hidden md:block rounded-md w-full md:w-[20%] h-[calc(100vh-1rem)] mt-28 mb-32 p-4 fixed right-0 overflow-y-auto`}
      style={{ scrollbarWidth: "thin" }}
    >
     
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl font-bold text-center">
          No channel added
        </p>
        <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Add a channel to see its details here.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar2;
