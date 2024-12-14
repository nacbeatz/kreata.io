import React from "react";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

interface MainContentProps {
  darkMode: boolean;
  activeButton: number;
  handleButtonClick: (buttonIndex: number) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  darkMode,
  activeButton,
  handleButtonClick,
}) => {
  return (
    <div
      className={`${
        darkMode ? "bg-[#0B1838] text-white" : "bg-white text-black"
      } flex-1 p-6 max-w-[72%] rounded ml-6 lg:ml-24 mt-12 lg:mt-24`}
      style={{ fontSize: "clamp(0.9rem, 1vw, 1.2rem)" }}
    >
      {/* Header Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
        {["INSIGHTS", "CHANNEL REPORT"].map((label, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(index)}
            className={`${
              activeButton === index
                ? "border-2 border-[#012244] bg-[#012244]"
                : "bg-gradient-to-r from-[#D6ED07] to-[#25A906]"
            } text-white px-4 py-2 w-full md:w-44 rounded transition-transform duration-300 hover:scale-105`}
          >
            {label}
          </button>
        ))}
        <div className="flex justify-end">
          <button
            onClick={() => handleButtonClick(2)}
            className={`${
              activeButton === 2
                ? "border-2 border-[#012244] bg-[#012244]"
                : "bg-gradient-to-r from-[#D6ED07] to-[#25A906]"
            } text-white px-4 py-2 rounded flex items-center justify-center transition-transform duration-300 hover:scale-105`}
          >
            Export <SystemUpdateAltIcon fontSize="small" className="ml-1" />
          </button>
        </div>
      </div>

      {/* SEO Growth Insights */}
      <section className={`mb-6 ${darkMode ? "text-white" : "text-black"}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
          <h2 className="text-2xl font-bold">SEO GROWTH INSIGHTS</h2>
          <div className="flex justify-end">
            <button
              onClick={() => handleButtonClick(3)}
              className="px-4 text-sm py-2 rounded bg-[#25A906] text-white transition-colors hover:bg-[#D6ED07]"
            >
              Update
            </button>
          </div>
        </div>
        <p className="text-sm">Last Updated: 01/12/2024</p>
      </section>

   

      {/* Stats Section */}
      <section
        className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 mt-12 ${
          darkMode ? "backdrop-blur-md" : ""
        }`}
      >
        {[
          { label: "Comment", value: "200" },
          { label: "FAVORITE ADDED", value: "50" },
          { label: "FAVORITE REMOVED", value: "12" },
          { label: "SHARES", value: "120" },
          { label: "WATCH TIME", value: "128 hrs" },
          { label: "CTR", value: "10.0" },
          { label: "AVD", value: "240" },
          { label: "COMMENTS", value: "340" },
        ].map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg flex flex-col items-center transition-transform duration-300 ${
              darkMode ? "bg-[#012244] h-32" : "bg-gray-200"
            } hover:scale-105`}
          >
            <p className="text-sm">{item.label}</p>
            <h2 className="text-xl font-bold">{item.value}</h2>
          </div>
          
        ))}
        
      </section>
         {/* Chart Placeholder */}
         <div
        className={`mt-6 p-6 h-96 rounded-lg ${
          darkMode ? "bg-[#012244] backdrop-blur-lg" : "bg-gray-200"
        }`}
      >
        GRAPH
      </div>

      {/* Earnings vs Loss Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={`flex flex-col items-center p-6 rounded-lg`}
        >
          <h3 className="text-lg font-semibold mb-4">Channel Stats</h3>
          <div className="grid grid-cols-2 gap-6">
            {["VIDEOS", "SUBS", "LIKES", "COMMENTS"].map((label, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg flex flex-col items-center transition-transform duration-300 ${
                  darkMode ? "bg-[#012244]" : "bg-gray-200"
                } hover:scale-105`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#D6ED07] to-[#25A906] flex items-center justify-center text-white mb-2">
                  {label[0]}
                </div>
                <p className="text-base font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Earn vs Loss</h3>
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#D6ED07] to-[#25A906] flex items-center justify-center text-white">
            {/* Placeholder for Pie Chart */}
          </div>
          <p className="mt-4">
            Av. Revenue: <span className="font-bold">$40.234</span>
          </p>
          <p>
            Loss: <span className="font-bold text-red-500">$140.234</span>
          </p>
          <p>
            Real Revenue: <span className="font-bold">$40.234</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
