"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

// Floating code symbols for background ambiance
const codeSymbols = ["</>", "{}", "=>", "[]", "()", "//", "&&", "||", "===", "++"];

function FloatingSymbol({ symbol, delay }: { symbol: string; delay: number }) {
  const randomX = useMemo(() => Math.random() * 100, []);
  const randomDuration = useMemo(() => 8 + Math.random() * 6, []);
  
  return (
    <motion.div
      className="pointer-events-none absolute text-neutral-800/40 font-mono text-sm select-none"
      style={{ left: `${randomX}%` }}
      initial={{ y: "100vh", opacity: 0 }}
      animate={{ 
        y: "-10vh", 
        opacity: [0, 0.6, 0.6, 0],
      }}
      transition={{
        duration: randomDuration,
        delay,
        ease: "linear",
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
      }}
    >
      {symbol}
    </motion.div>
  );
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "ready">("loading");
  const text = "Code. Compete. Conquer.";

  // Simulate a realistic, slightly randomized loading sequence
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setPhase("ready");
          // Add a slight delay at 100% before triggering the exit
          setTimeout(() => onComplete(), 800);
          return 100;
        }
        // Randomize the loading chunks for a "gamified/terminal" feel
        const jump = Math.floor(Math.random() * 12) + 3;
        return prev + jump > 100 ? 100 : prev + jump;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Framer Motion variants for the typing effect
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.2 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200,
      }
    },
  };

  // Generate floating symbols
  const floatingElements = useMemo(() => 
    codeSymbols.map((symbol, i) => (
      <FloatingSymbol key={i} symbol={symbol} delay={i * 0.8} />
    )), []
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black font-mono text-white overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(12px)", scale: 1.02 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-black to-neutral-950 opacity-80" />
      
      {/* Animated grid background */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
        animate={{ 
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{ 
          duration: 20, 
          ease: "linear", 
          repeat: Infinity 
        }}
      />

      {/* Floating code symbols */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements}
      </div>

      {/* Radial glow effect */}
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ 
          duration: 4, 
          ease: "easeInOut", 
          repeat: Infinity 
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Main Typing Text */}
        <div className="mb-16 flex h-12 items-center text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex"
          >
            {text.split("").map((char, index) => (
              <motion.span 
                key={index} 
                variants={letterVariants}
                className={char === "." ? "text-neutral-500" : ""}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>
          
          {/* Blinking Cursor */}
          <motion.div
            animate={{ 
              opacity: [1, 1, 0, 0],
              scaleY: [1, 1, 0.8, 0.8],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1, 
              times: [0, 0.5, 0.5, 1],
              ease: "easeInOut" 
            }}
            className="ml-1 h-[1em] w-[3px] bg-white rounded-full"
          />
        </div>

        {/* Progress Bar Container */}
        <div className="relative">
          {/* Glow effect behind progress bar */}
          <motion.div 
            className="absolute -inset-2 rounded-full blur-md"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,${progress / 500}), transparent)`,
            }}
          />
          
          {/* Progress Bar Track */}
          <div className="relative h-[3px] w-72 overflow-hidden rounded-full bg-neutral-800/50 md:w-[400px] backdrop-blur-sm">
            {/* Animated background shimmer */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Progress Fill */}
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-white/80 via-white to-white/80"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 0.3, 
                ease: [0.4, 0, 0.2, 1] 
              }}
            />
            
            {/* Progress head glow */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/60 blur-sm"
              initial={{ left: "0%" }}
              animate={{ left: `${Math.max(0, progress - 2)}%` }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </div>

        {/* Status Display */}
        <div className="mt-8 flex w-72 flex-col items-center gap-4 md:w-[400px]">
          {/* Progress percentage */}
          <motion.div 
            className="text-2xl font-light tracking-widest tabular-nums"
            animate={{ 
              opacity: phase === "ready" ? [1, 0.5, 1] : 1,
            }}
            transition={{ 
              duration: 0.5, 
              repeat: phase === "ready" ? 3 : 0 
            }}
          >
            {progress}%
          </motion.div>
          
          {/* Status text with typing effect */}
          <div className="flex items-center gap-2 text-xs tracking-[0.3em] text-neutral-500">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block w-1.5 h-1.5 rounded-full bg-current"
            />
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {phase === "ready" ? "INITIALIZATION COMPLETE" : "LOADING SYSTEMS"}
            </motion.span>
          </div>

          {/* Decorative line segments */}
          <div className="flex gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="h-[2px] w-8 rounded-full bg-neutral-700"
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: progress > (i + 1) * 20 ? 1 : 0,
                  backgroundColor: progress > (i + 1) * 20 ? "#fff" : "#404040",
                }}
                transition={{ 
                  duration: 0.4, 
                  delay: i * 0.05,
                  ease: [0.4, 0, 0.2, 1]
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 text-[10px] tracking-widest text-neutral-700">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          HACKATHON_HUB v1.0
        </motion.span>
      </div>
      
      <div className="absolute bottom-6 right-6 text-[10px] tracking-widest text-neutral-700">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {phase === "ready" ? "▸ ENTER" : "◆ STANDBY"}
        </motion.span>
      </div>
    </motion.div>
  );
}