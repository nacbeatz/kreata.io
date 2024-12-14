import React, { useState } from "react";
import Left from "./Left";
import Header from "./Header";
import Main from "./Main";
import Sidebar2 from "./Sidebar2";

const Dashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [activeButton, setActiveButton] = useState<number>(0);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    localStorage.setItem("darkMode", JSON.stringify(!darkMode));
  };

  const handleButtonClick = (buttonIndex: number) => {
    setActiveButton(buttonIndex);
  };

  return (
    <div
      className={`${
        darkMode ? "bg-[#081028] text-white" : "bg-white text-black"
      } min-h-screen flex`}
    >
      <Left darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="flex flex-1 flex-col">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      
        <Sidebar2 darkMode={darkMode} />

        
        <Main
  darkMode={darkMode}
  activeButton={String(activeButton)}  // Convert number to string
  handleButtonClick={handleButtonClick}
/>

      </div>
    </div>
  );
};

export default Dashboard;
