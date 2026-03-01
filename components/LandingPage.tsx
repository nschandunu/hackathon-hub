"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Terminal, Trophy, Code, Cpu, ChevronRight } from "lucide-react";
import gsap from "gsap";

// A ReactBits-inspired animated text component for the Hero
const SplitText = ({ text }: { text: string }) => {
  return (
    <span className="inline-block overflow-hidden">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.33, 1, 0.68, 1] }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // GSAP animation for the stats section to give it a gamified "counting up" feel
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-card", {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".stats-container",
          start: "top 80%",
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-black text-white selection:bg-white selection:text-black">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Subtle grid background for that "computing" vibe */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Note: In Next.js, public folder assets are referenced from the root */}
          <Image 
            src="/hhlogo.png" 
            alt="Hackathon Hub Logo" 
            width={120} 
            height={120} 
            className="filter grayscale hover:grayscale-0 transition-all duration-500"
          />
        </motion.div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-center mb-6 uppercase">
          <SplitText text="Hackathon Hub" />
        </h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-neutral-400 text-lg md:text-2xl text-center max-w-2xl font-light mb-10"
        >
          NSBM Green University's elite computing society. Build, compete, and level up your engineering skills.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-4"
        >
          <Link href="#join" className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-wider overflow-hidden rounded-sm">
            <span className="relative z-10 flex items-center gap-2">
              Initialize_Profile <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-neutral-300 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
          </Link>
        </motion.div>
      </section>

      {/* Gamified Tracks / Educational Standards Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16 border-b border-neutral-800 pb-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Select Your Track</h2>
            <p className="text-neutral-500">Master the core disciplines of modern computing.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <span className="px-3 py-1 border border-neutral-800 rounded-full text-xs text-neutral-400">XP Multiplier Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Frontend Engineering", icon: <Code className="w-8 h-8" />, desc: "React, Next.js, animations, and UI/UX." },
            { title: "Backend Systems", icon: <Terminal className="w-8 h-8" />, desc: "Supabase, Node, APIs, and databases." },
            { title: "Algorithms & AI", icon: <Cpu className="w-8 h-8" />, desc: "Machine learning, Python, and logic puzzles." }
          ].map((track, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10, borderColor: "rgba(255,255,255,0.5)" }}
              className="p-8 border border-neutral-800 rounded-xl bg-neutral-950 flex flex-col gap-6 cursor-pointer transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center text-white">
                {track.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{track.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{track.desc}</p>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-mono text-neutral-500">
                <span>[ Explore Module ]</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats / Gamification Section */}
      <section className="py-24 bg-neutral-950 border-y border-neutral-900 stats-container">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-neutral-800">
          {[
            { label: "Active Members", val: "500+" },
            { label: "Hackathons Won", val: "24" },
            { label: "Lines of Code", val: "1M+" },
            { label: "Coffee Consumed", val: "∞" }
          ].map((stat, i) => (
            <div key={i} className="stat-card flex flex-col items-center justify-center text-center pl-8 first:pl-0 border-none">
              <span className="text-4xl md:text-6xl font-black mb-2">{stat.val}</span>
              <span className="text-neutral-500 text-sm uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}