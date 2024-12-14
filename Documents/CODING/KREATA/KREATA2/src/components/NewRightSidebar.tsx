import React from 'react';

interface RightSidebarProps {
  channelName: string | null;
  darkMode: boolean;
}

const NewRightSidebar: React.FC<RightSidebarProps> = ({ channelName, darkMode }) => {
  return (
    <div
      className={`w-64 mt-32 rounded-xl ${
        darkMode ? 'bg-[#011B3B] text-white' : 'bg-gray-100 text-black'
      } p-4 mt-32`}
    >
      
      <div className="mt-4">
        <p className="text-sm">Current Channel</p>
        <p className="text-lg font-medium">
          {channelName ? channelName : 'No Channel'}
        </p>
      </div>
    </div>
  );
};

export default NewRightSidebar;
