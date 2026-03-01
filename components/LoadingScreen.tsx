"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const text = "Code. Compete. Conquer.";

  // Simulate a realistic, slightly randomized loading sequence
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Add a slight delay at 100% before triggering the exit
          setTimeout(() => onComplete(), 600);
          return 100;
        }
        // Randomize the loading chunks for a "gamified/terminal" feel
        const jump = Math.floor(Math.random() * 15) + 5;
        return prev + jump > 100 ? 100 : prev + jump;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Framer Motion variants for the typing effect
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black font-mono text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Main Typing Text */}
      <div className="mb-12 flex h-12 items-center text-3xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex"
        >
          {text.split("").map((char, index) => (
            <motion.span key={index} variants={letterVariants}>
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.div>
        
        {/* Blinking Cursor */}
        <motion.div
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className="ml-2 h-[1em] w-[0.4em] bg-white"
        />
      </div>

      {/* Monochrome Progress Bar */}
      <div className="relative h-[2px] w-64 overflow-hidden bg-neutral-900 md:w-96">
        <motion.div
          className="absolute left-0 top-0 h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </div>

      {/* Data Output Simulation */}
      <div className="mt-6 flex w-64 justify-between text-xs tracking-widest text-neutral-500 md:w-96">
        <span>SYS_INIT</span>
        <span>
          {progress === 100 ? "READY" : `LOADING_${progress.toString().padStart(3, "0")}%`}
        </span>
      </div>
    </motion.div>
  );
}