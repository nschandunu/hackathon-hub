"use client";

import React from 'react';
import { motion, easeInOut } from 'framer-motion';
import Link from 'next/link';
import LiquidEther from './LiquidEther';
import ScrollVelocity from './ScrollVelocity';
import ScrollReveal from './ScrollReveal';

// --- BENTO GRID DATA & ANIMATIONS ---

const EVENTS = [
  {
    id: 1,
    title: "Hack-In-Shell 2026",
    date: "MARCH 15, 2026",
    tag: "MAJOR EVENT",
    description: "The flagship 24-hour hackathon of NSBM Computing Society.",
    size: "md:col-span-2 md:row-span-2", // Large Hero Card
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
    y: 40, 
    filter: 'blur(10px)',
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: easeInOut
    }
  },
};

// --- COMPONENTS ---

function BentoEvents() {
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
              {/* Image with dark overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 opacity-40 group-hover:opacity-60"
                style={{ backgroundImage: `url(${event.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-[#5227ff] font-mono text-[10px] tracking-[0.3em] mb-2 font-bold bg-[#5227ff]/10 self-start px-2 py-0.5">
                  {event.tag}
                </span>
                <h3 className="text-white text-xl md:text-2xl font-black uppercase tracking-tighter group-hover:text-[#5227ff] transition-colors">
                  {event.title}
                </h3>
                <p className="text-neutral-400 text-xs mt-2 line-clamp-2 max-w-[80%] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {event.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                   <span className="text-neutral-500 font-mono text-[10px] tracking-widest">{event.date}</span>
                   <div className="w-8 h-px bg-white/20 group-hover:w-16 group-hover:bg-[#5227ff] transition-all duration-500" />
                </div>
              </div>

              {/* Premium Corner Accents */}
              <div className="absolute top-0 right-0 w-8 h-8 flex items-start justify-end p-2">
                 <div className="w-1 h-1 bg-white/20 rounded-full group-hover:bg-[#5227ff] group-hover:animate-ping" />
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

// ...existing code...

// --- ABOUT SECTION COMPONENT ---

function AboutSection() {
  return (
    <section className="w-full bg-black py-32 md:py-40 lg:py-52 px-6 flex flex-col items-center border-t border-white/5">
      <div className="max-w-6xl w-full flex flex-col items-start">
        
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#5227ff] font-mono border border-[#5227ff]/30 px-4 py-2 bg-[#5227ff]/5">
            // ABOUT_US
          </span>
        </motion.div>

        {/* ScrollReveal Text */}
        <div className="w-full text-left px-4 md:px-8">
          <ScrollReveal
            baseOpacity={0.1}
            enableBlur
            baseRotation={2}
            blurStrength={4}
            containerClassName="w-full"
            textClassName="text-white text-left !text-[clamp(1.8rem,5vw,4rem)] !leading-[1.3] md:!leading-[1.4] lg:!leading-[1.5] font-medium tracking-tight"
          >
            Hackathon Hub is the innovation engine of NSBM Computing Society. We build, break, and rebuild the future through code.
          </ScrollReveal>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 md:mt-20 px-4 md:px-8"
        >
          <Link href="/about">
            <button className="group relative px-8 md:px-12 py-4 md:py-5 bg-transparent border border-white/20 text-white font-bold uppercase text-[10px] md:text-xs tracking-[0.3em] transition-all hover:border-[#5227ff] overflow-hidden">
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                Discover Our Story
              </span>
              <div className="absolute inset-0 bg-[#5227ff] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-[#5227ff] transition-colors" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-[#5227ff] transition-colors" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-[#5227ff] transition-colors" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-[#5227ff] transition-colors" />
            </button>
          </Link>
        </motion.div>

        {/* Decorative Elements */}
        <div className="mt-20 md:mt-24 px-4 md:px-8 flex items-center gap-4">
          <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent to-white/20" />
          <div className="w-1.5 h-1.5 bg-[#5227ff] rotate-45" />
          <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent to-white/20" />
        </div>
      </div>
    </section>
  );
}

// ...existing code...

// --- MAIN PAGE ---

export default function LandingPage() {
  return (
    <div className="w-full bg-black flex flex-col">
      
      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
        
        {/* BACKGROUND: The Liquid Animation */}
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
          <LiquidEther
            colors={['#5227ff', '#2200ff', '#000000']}
            mouseForce={35}
            cursorSize={100}
            isViscous={true}
            viscous={30}
            autoDemo={true}
            autoSpeed={0.5}
          />
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 px-4 py-1 border border-white/10 rounded-full bg-white/5 backdrop-blur-md"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-medium">
              NSBM Green University • Computing Society
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase leading-[0.85]"
          >
            HACKATHON <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
              HUB
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-8 max-w-2xl text-neutral-400 text-sm md:text-lg font-light leading-relaxed tracking-wide"
          >
            We are the heartbeat of innovation at NSBM. A collective of developers, designers, and dreamers 
            pushing the boundaries of what's possible through code.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row gap-4"
          >
            <button className="group relative px-10 py-4 bg-white text-black font-bold uppercase text-xs tracking-widest transition-all hover:bg-[#5227ff] hover:text-white overflow-hidden">
              <span className="relative z-10">Join the Society</span>
              <div className="absolute inset-0 bg-[#5227ff] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            
            <button className="px-10 py-4 border border-white/20 text-white font-bold uppercase text-xs tracking-widest hover:border-[#5227ff] hover:text-[#5227ff] transition-all bg-black/40 backdrop-blur-sm">
              Explore Events
            </button>
          </motion.div>
        </div>

        {/* HUD/Decorative elements */}
        <div className="absolute bottom-10 left-10 hidden lg:block">
           <p className="text-[9px] font-mono text-neutral-600 tracking-widest">SYSTEM_STATUS: ACTIVE</p>
           <p className="text-[9px] font-mono text-[#5227ff] tracking-widest">LOCATION: 6.8211 N, 80.0409 E</p>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
        </motion.div>

        <div className="hidden lg:block absolute top-10 left-10 w-24 h-24 border-t border-l border-white/10" />
        <div className="hidden lg:block absolute bottom-10 right-10 w-24 h-24 border-b border-r border-white/10" />
      </section>

      {/* VELOCITY SCROLL SECTION */}
      <section className="w-full py-20 border-y border-white/5 bg-black overflow-hidden">
        <ScrollVelocity
          texts={[
            'HACKATHON HUB • NSBM GREEN UNIVERSITY •', 
            'CODE • COMPETE • CONQUER •'
          ]} 
          velocity={60}
          className="text-white font-black italic uppercase tracking-tighter"
        />
      </section>

      {/* NEW BENTO SECTION (6 Events Integrated) */}
      <BentoEvents />

      {/* ABOUT SECTION WITH SCROLL REVEAL */}
      <AboutSection />

      {/* FOOTER PLACEHOLDER */}
      <section className="w-full min-h-[20vh] bg-black border-t border-white/5" />

    </div>
  );
}