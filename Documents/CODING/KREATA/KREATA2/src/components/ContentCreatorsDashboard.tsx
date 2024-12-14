import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MainContent from './MainContent';
import RightSidebar from './RightSidebar';

const Dashboard: React.FC = () => {
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        const savedMode = localStorage.getItem("darkMode");
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [activeButton, setActiveButton] = useState<string>('Button1'); // Using string for button names

    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleDarkMode = (value: boolean) => {
        setDarkMode(value);
    };

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
    };

    return (
        <div className={`${darkMode ? 'bg-[#081028] text-white' : 'bg-white text-black'} min-h-screen flex`}>
            <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <div className="flex flex-1 flex-col">
                <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                <MainContent
                    darkMode={darkMode}
                    activeButton={activeButton}
                    handleButtonClick={handleButtonClick}
                />
            </div>
            <RightSidebar darkMode={darkMode} />
        </div>
    );
};

export default Dashboard;
