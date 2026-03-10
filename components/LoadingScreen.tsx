"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

// PERF: Memoize ProgressRing to prevent unnecessary re-renders
const ProgressRing = memo(function ProgressRing({ progress }: { progress: number }) {
  const radius = 80;
  const stroke = 2;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    // PERF: Add GPU acceleration hint
    <div className="relative" style={{ transform: 'translateZ(0)' }}>
      {/* PERF: Static blur glow - no animation on filter, only opacity and scale (GPU) */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)`,
          filter: "blur(40px)",
          // PERF: Force GPU layer, keep blur static
          transform: "translateZ(0) scale(1.5)",
          willChange: 'opacity, transform',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          // PERF: Use transform3d for GPU acceleration
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
        // PERF: GPU acceleration for SVG
        style={{ willChange: 'auto' }}
      >
        <circle
          stroke="rgba(255,255,255,0.06)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        
        {/* PERF: strokeDashoffset is GPU-accelerated in modern browsers */}
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
          // PERF: GPU acceleration
          style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
        >
          {/* PERF: Remove key prop to avoid DOM thrashing on every progress change */}
          <span className="text-3xl font-extralight tracking-tight text-white/90 tabular-nums">
            {Math.round(progress)}
          </span>
          <span className="text-sm font-extralight text-white/40 ml-0.5">%</span>
        </motion.div>
      </div>
    </div>
  );
});

// PERF: Memoize particle component to prevent re-renders
const AmbientParticle = memo(function AmbientParticle({ delay, duration, x, y, size }: { 
  delay: number; 
  duration: number;
  x: number;
  y: number;
  size: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/20"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        // PERF: Force GPU layer for transforms
        willChange: 'opacity, transform',
        transform: 'translateZ(0)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
        // PERF: Use translate3d for GPU acceleration
        y: [0, -30, -60],
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: 2,
      }}
    />
  );
});

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

  // PERF: Pre-compute particle positions once during initialization
  // Reduce particle count from 12 to 8 for better performance
  const particles = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        key: i,
        delay: i * 0.4,
        duration: 3 + (i % 3),
        x: 20 + (i * 8) % 60,
        y: 20 + ((i * 13) % 60),
        size: 1 + (i % 3),
      })),
    []
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)",
          // PERF: Promote to GPU layer
          willChange: 'opacity, transform',
        }}
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          // PERF: Remove filter: blur from exit - causes expensive CPU repaints
          // Use scale + opacity for same perceived "fade away" effect (GPU accelerated)
          scale: 1.1,
          // PERF: Use transform3d for GPU acceleration on exit
        }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* PERF: Static noise texture - no animation needed */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* PERF: Background orbs with static blur, only animate opacity and scale (GPU) */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(120,120,120,0.15) 0%, transparent 60%)",
            filter: "blur(60px)",
            // PERF: Static blur, GPU layer
            transform: 'translateZ(0)',
            willChange: 'opacity, transform',
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
            // PERF: Static blur, GPU layer
            transform: 'translateZ(0)',
            willChange: 'opacity, transform',
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

        {/* PERF: Particles rendered from pre-computed values */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p) => (
            <AmbientParticle
              key={p.key}
              delay={p.delay}
              duration={p.duration}
              x={p.x}
              y={p.y}
              size={p.size}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center" style={{ transform: 'translateZ(0)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            style={{ willChange: 'opacity, transform' }}
          >
            <ProgressRing progress={progress} />
          </motion.div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
          >
            <h1 className="text-2xl md:text-3xl font-extralight tracking-[0.2em] text-white/90 mb-3">
              HACKATHON HUB
            </h1>
            <motion.div
              className="h-[1px] w-16 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 1, ease: [0.4, 0, 0.2, 1] }}
              // PERF: GPU acceleration for scale transform
              style={{ willChange: 'transform', transformOrigin: 'center', transform: 'translateZ(0)' }}
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
              style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
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

        {/* PERF: Vertical lines use scaleY (GPU accelerated transform) */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[30vh]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
            transformOrigin: 'top',
            willChange: 'opacity, transform',
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
            transformOrigin: 'bottom',
            willChange: 'opacity, transform',
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 0.4, duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </motion.div>
    </AnimatePresence>
  );
}