"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

// Import the specific 5 core background SVGs (with their variations).
// All moved to /public/images/ by the Architect.
// 0: Yellow (Inverse: Background-1.svg)
// 1: Orange
// 2: Purple
// 3: Blue
// 4: Pink (Inverse: Background-6.svg)
const BACKGROUNDS = [
  { standard: "/images/Background.svg", inverse: "/images/Background-1.svg" },
  { standard: "/images/Background-2.svg" },
  { standard: "/images/Background-3.svg" },
  { standard: "/images/Background-4.svg" },
  { standard: "/images/Background-5.svg", inverse: "/images/Background-6.svg" },
];

export default function GlobalBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(BACKGROUNDS[0].standard);

  useEffect(() => {
    const cycleBackground = () => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % BACKGROUNDS.length;
        const bgConfig = BACKGROUNDS[nextIndex];
        
        // Handle inverse variations for Yellow (index 0) and Pink (index 4)
        if (bgConfig.inverse && Math.random() > 0.5) {
          setCurrentSrc(bgConfig.inverse);
        } else {
          setCurrentSrc(bgConfig.standard);
        }
        
        return nextIndex;
      });
    };

    // 20-second interval per the Architect's mandate (Issue #70, #103)
    const interval = setInterval(cycleBackground, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 h-full w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentSrc}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full"
        >
          <Image
            src={currentSrc}
            alt="Dynamic Looping Background"
            fill
            className="object-cover"
            priority={currentIndex === 0} // Only prioritize the initial load to preserve massive LCP
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
