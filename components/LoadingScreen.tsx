"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

function ProgressRing({ progress }: { progress: number }) {
  const radius = 80;
  const stroke = 2;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)`,
          filter: "blur(40px)",
          transform: "scale(1.5)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1.4, 1.6, 1.4],
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="rgba(255,255,255,0.06)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        
        <motion.circle
          stroke="url(#progressGradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />

        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.span
            className="text-3xl font-extralight tracking-tight text-white/90 tabular-nums"
            key={Math.round(progress)}
          >
            {Math.round(progress)}
          </motion.span>
          <span className="text-sm font-extralight text-white/40 ml-0.5">%</span>
        </motion.div>
      </div>
    </div>
  );
}

function AmbientParticle({ delay, duration }: { delay: number; duration: number }) {
  const randomX = useMemo(() => 20 + Math.random() * 60, []);
  const randomY = useMemo(() => 20 + Math.random() * 60, []);
  const size = useMemo(() => 1 + Math.random() * 2, []);

  return (
    <motion.div
      className="absolute rounded-full bg-white/20"
      style={{
        width: size,
        height: size,
        left: `${randomX}%`,
        top: `${randomY}%`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
        y: [0, -30, -60],
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
      }}
    />
  );
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "complete">("loading");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setPhase("complete");
          setTimeout(() => onComplete(), 1200);
          return 100;
        }
        const remaining = 100 - prev;
        const increment = Math.max(1, Math.floor(remaining * 0.08 + Math.random() * 3));
        return Math.min(100, prev + increment);
      });
    }, 80);

    return () => clearInterval(timer);
  }, [onComplete]);

  const particles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => (
        <AmbientParticle
          key={i}
          delay={i * 0.4}
          duration={3 + Math.random() * 2}
        />
      )),
    []
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)",
        }}
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.05,
          filter: "blur(20px)",
        }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle at center, rgba(120,120,120,0.15) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 50%)",
            filter: "blur(40px)",
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        <div className="absolute inset-0 pointer-events-none">{particles}</div>

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          >
            <ProgressRing progress={progress} />
          </motion.div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <h1 className="text-2xl md:text-3xl font-extralight tracking-[0.2em] text-white/90 mb-3">
              HACKATHON HUB
            </h1>
            <motion.div
              className="h-[1px] w-16 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 1, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>

          <motion.div
            className="mt-8 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.div
              className="w-1 h-1 rounded-full bg-white/50"
              animate={{
                opacity: phase === "complete" ? 1 : [0.3, 1, 0.3],
                scale: phase === "complete" ? 1.2 : [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: phase === "complete" ? 0 : Infinity,
              }}
            />
            <motion.span
              className="text-[11px] font-light tracking-[0.25em] text-white/40 uppercase"
              key={phase}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {phase === "complete" ? "Ready" : "Preparing your experience"}
            </motion.span>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 text-[10px] font-light tracking-[0.3em] text-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          CODE · COMPETE · CONQUER
        </motion.div>

        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[30vh]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 0.2, duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        />

        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-[20vh]"
          style={{
            background:
              "linear-gradient(0deg, rgba(255,255,255,0.05) 0%, transparent 100%)",
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 0.4, duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </motion.div>
    </AnimatePresence>
  );
}