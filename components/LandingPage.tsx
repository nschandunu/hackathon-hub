"use client";

import React from 'react';
import { motion } from 'framer-motion';
import LiquidEther from './LiquidEther';
import ScrollVelocity from './ScrollVelocity';

export default function LandingPage() {
  return (
    <div className="w-full bg-black flex flex-col">
      
      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
        
        {/* BACKGROUND: The Liquid Animation mf */}
        {/* We keep pointer-events-none on the DIV so buttons work, 
            but ensure LiquidEther component is set to auto internally */}
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
          <LiquidEther
            // Brightened the palette so it's actually visible against pure black
            colors={['#5227ff', '#2200ff', '#000000']}
            mouseForce={35}
            cursorSize={100}
            isViscous={true}
            viscous={30}
            autoDemo={true}
            autoSpeed={0.5}
            interactive={true}
          />
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 w-full max-max-7xl px-6 flex flex-col items-center text-center">
          
          {/* Top Badge */}
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

          {/* Main Headline - Massive & Professional */}
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

          {/* Tagline */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-8 max-w-2xl text-neutral-400 text-sm md:text-lg font-light leading-relaxed tracking-wide"
          >
            We are the heartbeat of innovation at NSBM. A collective of developers, designers, and dreamers 
            pushing the boundaries of what's possible through code.
          </motion.p>

          {/* CTA Buttons */}
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

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
        </motion.div>

        {/* Decorative Corners */}
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

      {/* PLACEHOLDER FOR NEXT SECTION */}
      <section className="w-full min-h-[50vh] bg-black" />

    </div>
  );
}