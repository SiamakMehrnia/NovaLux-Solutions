import React from "react";
import { motion } from "framer-motion";
import { Meteors } from "./magicui/meteors";
import { FlickeringGrid } from "./magicui/flickering-grid.jsx";

const Intro = () => {
  return (
    <section
      id="home"
      className="h-screen  flex justify-center items-center px-4 md:px-8 lg:px-16"
    >
        {/* Flickering Grid as Background */}
      <div className="absolute inset-0 z-0">
        <FlickeringGrid className="w-full h-full bg-white" />
      </div>

      <div className="bg-black w-full max-w-[600px] h-[300px] md:h-[350px] lg:h-[400px] flex justify-center items-center shadow-2xl rounded-2xl relative overflow-hidden p-10 lg:p-12">
        {/* Shining Meteors */}
        <Meteors
          number={15}
          minDelay={0.2}
          maxDelay={1.2}
          minDuration={2}
          maxDuration={6}
          angle={215}
          className="absolute inset-0"
        />

        {/* AlphaWeb Text with Pulse Animation and Shadow */}
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-with z-10 drop-shadow-lg"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          NovaLux-Solutions
        </motion.h1>
      </div>
    </section>
  );
};

export default Intro;
