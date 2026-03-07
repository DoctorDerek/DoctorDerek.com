"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Import the specific 5 core background SVGs (with their variations).
// Handled by @svgr/webpack to render inline DOM nodes.
import Background0 from "@/public/images/Background.svg";
import Background1 from "@/public/images/Background-1.svg";
import Background2 from "@/public/images/Background-2.svg";
import Background3 from "@/public/images/Background-3.svg";
import Background4 from "@/public/images/Background-4.svg";
import Background5 from "@/public/images/Background-5.svg";
import Background6 from "@/public/images/Background-6.svg";

const BACKGROUNDS = [
  { standard: Background0, inverse: Background1 },
  { standard: Background2 },
  { standard: Background3 },
  { standard: Background4 },
  { standard: Background5, inverse: Background6 },
];

export default function GlobalBackground() {
  const [bg, setBg] = useState({
    index: 0,
    key: "bg-0-standard",
    Component: BACKGROUNDS[0].standard,
  });

  useEffect(() => {
    const cycleBackground = () => {
      setBg((prev) => {
        const nextIndex = (prev.index + 1) % BACKGROUNDS.length;
        const bgConfig = BACKGROUNDS[nextIndex];
        
        // Handle inverse variations for Yellow (index 0) and Pink (index 4)
        const useInverse = bgConfig.inverse && Math.random() > 0.5;
        
        return {
          index: nextIndex,
          key: `bg-${nextIndex}-${useInverse ? "inverse" : "standard"}`,
          Component: useInverse && bgConfig.inverse ? bgConfig.inverse : bgConfig.standard,
        };
      });
    };

    // 20-second interval per the Architect's mandate (Issue #70, #103)
    const interval = setInterval(cycleBackground, 20000);

    return () => clearInterval(interval);
  }, []);

  const { Component } = bg;

  return (
    <div className="fixed inset-0 -z-10 h-full w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={bg.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full"
        >
          <Component className="object-cover h-full w-full" preserveAspectRatio="xMidYMid slice" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
