"use client";

import React from 'react';
import { motion, easeInOut } from 'framer-motion';

// Updated Mock Data with 6 Events
const EVENTS = [
  {
    id: 1,
    title: "Hack-In-Shell 2026",
    date: "MARCH 15, 2026",
    tag: "MAJOR EVENT",
    description: "The flagship 24-hour hackathon of NSBM Computing Society.",
    size: "md:col-span-2 md:row-span-2", // The Hero Card
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Code Combat 1.0",
    date: "APRIL 02, 2026",
    tag: "COMPETITIVE",
    description: "Speed coding tournament.",
    size: "col-span-1 row-span-1",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Terminal Velocity",
    date: "APRIL 20, 2026",
    tag: "WORKSHOP",
    description: "Mastering the Linux CLI.",
    size: "col-span-1 row-span-1",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "DevSprint x NSBM",
    date: "MAY 05, 2026",
    tag: "SPRINT",
    description: "Open source contribution day.",
    size: "col-span-1 row-span-1",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "AI Nexus Summit",
    date: "MAY 12, 2026",
    tag: "SUMMIT",
    description: "Exploring LLMs & Agents.",
    size: "col-span-1 row-span-1",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "UI/UX Forge",
    date: "JUNE 02, 2026",
    tag: "DESIGN",
    description: "Crafting interfaces that breathe.",
    size: "col-span-1 row-span-1",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=2070&auto=format&fit=crop"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30, 
    filter: 'blur(8px)',
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { 
      duration: 0.8, 
      ease: easeInOut
    }
  },
};

export function BentoEvents() {
  return (
    <section className="w-full bg-black py-32 px-6 flex flex-col items-center">
      <div className="max-w-7xl w-full">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16 border-l-2 border-[#5227ff] pl-8">
          <h2 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            Recent <br /> <span className="text-[#5227ff]">Sprints</span>
          </h2>
          <p className="text-neutral-500 mt-4 max-w-md text-sm uppercase tracking-widest font-bold">
            06 Active Entries Found in DB_LOG
          </p>
        </div>

        {/* The Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]"
        >
          {EVENTS.map((event) => (
            <motion.div
              key={event.id}
              variants={cardVariants}
              className={`${event.size} relative group overflow-hidden bg-neutral-900 border border-white/5 cursor-pointer`}
            >
              {/* Image background */}
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 opacity-30 group-hover:opacity-50"
                style={{ backgroundImage: `url(${event.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-[#5227ff] font-mono text-[10px] tracking-[0.3em] mb-2 font-bold bg-[#5227ff]/10 self-start px-2 py-0.5">
                  {event.tag}
                </span>
                <h3 className="text-white text-xl md:text-2xl font-black uppercase tracking-tighter group-hover:text-[#5227ff] transition-colors">
                  {event.title}
                </h3>
                <p className="text-neutral-400 text-xs mt-2 line-clamp-2 max-w-[85%] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {event.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                   <span className="text-neutral-500 font-mono text-[10px] tracking-widest">{event.date}</span>
                   <div className="w-8 h-px bg-white/20 group-hover:w-16 group-hover:bg-[#5227ff] transition-all duration-500" />
                </div>
              </div>

              {/* Ping Accent */}
              <div className="absolute top-0 right-0 p-4">
                 <div className="w-1.5 h-1.5 bg-white/20 rounded-full group-hover:bg-[#5227ff] group-hover:animate-ping" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <div className="mt-16 w-full flex justify-end">
           <button className="text-white font-black uppercase text-[10px] tracking-[0.4em] flex items-center gap-4 hover:text-[#5227ff] transition-colors group">
             Archive Directory <span className="p-2 border border-white/10 group-hover:border-[#5227ff] transition-colors">→</span>
           </button>
        </div>
      </div>
    </section>
  );
}