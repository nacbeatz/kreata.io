import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface MainContentProps {
  darkMode: boolean;
  activeButton: string;
  handleButtonClick: (buttonName: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  darkMode,
  activeButton,
  handleButtonClick,
}) => {
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelExists, setChannelExists] = useState(false); // Tracks if a channel is added
  const [user, setUser] = useState({
    proChannels: 2,
    plan: "Free",
    credits: 14,
  }); // State to manage user data
  const navigate = useNavigate(); // Navigation hook

  const handleAddChannelClick = () => {
    setIsAddingChannel(true);
  };

  const handleChannelSubmit = () => {
    if (channelName.trim()) {
      toast.success("Channel added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setChannelName("");
      setIsAddingChannel(false);
      setChannelExists(true); // Mark channel as added

      // Update user data dynamically
      setUser((prevUser) => ({
        ...prevUser,
        proChannels: prevUser.proChannels + 1,
        credits: prevUser.credits - 1,
      }));
    } else {
      toast.error("Please enter a valid channel name.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleViewChannel = () => {
    if (channelExists) {
      navigate("/channel"); // Navigate to Channel.tsx route
    } else {
      toast.error("Please add a channel first.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const buttonClass = darkMode
    ? "bg-[#081028] text-white hover:bg-[#012244]"
    : "bg-gradient-to-r from-[#D6ED07] to-[#25A906] text-white hover:from-[#C0DA05] hover:to-[#1C8B05]";

  return (
    <div className="flex-1 flex flex-col items-center mt-24">
      <ToastContainer />
      {/* Headings */}
      <h2 className="text-xl font-bold text-center mb-6">DASHBOARD</h2>
      <h2 className="text-sm text-center mb-12">Welcome back!</h2>

      {/* Main Content */}
      <div
        className={`${
          darkMode ? "bg-[#0A1739] text-white" : "bg-gray-100 text-black"
        } p-6 rounded-lg shadow-lg flex flex-col items-center w-full max-w-4xl min-h-[600px] translate-x-[-20px]`}
      >
        {/* User Information */}
        <div className="mb-6 text-center mt-12">
          <p className="mb-2">
            <strong>Pro Channels:</strong> {user.proChannels}
          </p>
          <p className="mb-2">
            <strong>Plan:</strong> {user.plan}
          </p>
          {user.plan === "Free" && (
            <p className="mb-2">
              <strong>Credits Left:</strong> {user.credits}
            </p>
          )}
        </div>

        {/* Conditional Rendering for Buttons or Channel Addition */}
        {!isAddingChannel ? (
          <div className="flex flex-col space-y-4 items-center mt-32">
            <button
              className={`${buttonClass} px-4 py-2 rounded-lg`}
              onClick={handleViewChannel}
              disabled={!channelExists} // Disable button if no channel exists
            >
              View Channel
            </button>
            <button
              onClick={handleAddChannelClick}
              className={`${buttonClass} px-4 py-2 rounded-lg`}
            >
              Add Channel
            </button>
            <button
              onClick={() => console.log("Update Clicked")}
              className={`${buttonClass} px-4 py-2 rounded-lg`}
            >
              Update
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <input
              type="text"
              placeholder="Enter Channel Name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-48 p-3 border rounded-lg mb-4 text-black text-center"
            />
            <button
              onClick={handleChannelSubmit}
              className={`${buttonClass} px-4 py-2 rounded-lg`}
            >
              Add Channel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
