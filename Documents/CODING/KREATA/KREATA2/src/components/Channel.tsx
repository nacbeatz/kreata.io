import React from "react";
import { motion } from "framer-motion";

const Channel: React.FC = () => {
  const channels = [
    { name: "CHRISS EAZY", username: "@chrisseazy_", image: "/img/thumbnail.jpg" },
    { name: "KWIZERA TV RWA", username: "@kwizera-f4c", image: "/img/thumbnail.jpg" },
    { name: "AKARIHO TECH", username: "@akariho", image: "/img/thumbnail.jpg" },
    { name: "KWIGA TV", username: "@kwigabirakora", image: "/img/thumbnail.jpg" },
    { name: "SMART RWANDA", username: "@smartrwanda", image: "/img/thumbnail.jpg" },
    { name: "FEX PRO KURAMYA", username: "@fexprokuramya3143", image: "/img/thumbnail.jpg" },
    { name: "ONE WAY SAFARIS", username: "@onewaysafaris", image: "/img/thumbnail.jpg" },
    { name: "GATARI FRED", username: "@gatarifred", image: "/img/thumbnail.jpg" },
    { name: "BIGOY SHALOM", username: "@bigoyshalom", image: "/img/thumbnail.jpg" },
  ];

  return (
    <div
      className="min-h-screen bg-[#0B1838] text-white bg-cover bg-center p-8"
      style={{
        backgroundImage: "url('/path/to/your/background-image.jpg')", 
      }}
    >
      <h1 className="text-2xl font-bold mb-4">Channels</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4">
        {channels.map((channel, index) => (
          <motion.div
            key={index}
            className="bg-[#012244] rounded-lg flex flex-col items-center text-center hover:bg-[#012244] transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.1, rotate: 2 }} 
          >
            <img
              src={channel.image}
              alt={channel.name}
              className="w-12 h-12 rounded-full mb-3"
            />
            <h3 className="font-medium">{channel.name}</h3>
            <p className="text-sm text-[#022340]">{channel.username}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Channel;
