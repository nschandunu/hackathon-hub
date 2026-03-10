"use client";

import React, { useRef, useEffect, useState, memo, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LiquidEther from './LiquidEther';
import ScrollVelocity from './ScrollVelocity';
import ScrollReveal from './ScrollReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const appleEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const appleBounce: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

// PERF: Memoize MagneticButton to prevent unnecessary re-renders
const MagneticButton = memo(function MagneticButton({ 
  children, 
  className = "",
  strength = 0.3,
  glowColor = "rgba(107, 142, 35, 0.4)"
}: { 
  children: React.ReactNode; 
  className?: string;
  strength?: number;
  glowColor?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  // PERF: Throttle mouse move with RAF
  const rafRef = useRef<number | null>(null);
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (!ref.current) {
        rafRef.current = null;
        return;
      }
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = (e.clientX - centerX) * strength;
      const distY = (e.clientY - centerY) * strength;
      x.set(distX);
      y.set(distY);
      rafRef.current = null;
    });
  }, [strength, x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, [x, y]);

  const springConfig = { stiffness: 150, damping: 15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ 
        x: springX, 
        y: springY,
        // PERF: GPU acceleration hints
        willChange: 'transform',
        transform: 'translateZ(0)'
      }}
      whileTap={{ scale: 0.96 }}
      className={`${className} relative overflow-hidden`}
    >
      {/* PERF: Simplify glow animation to opacity only (no rotate keyframes) */}
      <motion.div 
        className="absolute -inset-[1px] rounded-full opacity-0"
        style={{ 
          background: `linear-gradient(90deg, ${glowColor}, transparent, ${glowColor})`,
          filter: 'blur(4px)',
          transform: 'translateZ(0)'
        }}
        animate={{ opacity: isHovered ? 0.8 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* PERF: Static radial gradient, animate opacity only */}
      <motion.div 
        className="absolute inset-0 rounded-full"
        style={{ 
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          transform: 'translateZ(0) scale(1.5)'
        }}
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.4, ease: appleEase }}
      />
      
      {children}
    </motion.button>
  );
});

// PERF: Memoize TextReveal and use GPU-accelerated transforms
const TextReveal = memo(function TextReveal({ 
  children, 
  className = "",
  delay = 0,
  staggerDelay = 0.03
}: { 
  children: string; 
  className?: string;
  delay?: number;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const words = useMemo(() => children.split(' '), [children]);

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: delay + i * staggerDelay,
              ease: appleEase
            }}
            // PERF: GPU acceleration
            style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
});

// PERF: Optimize CharacterReveal - remove filter: blur animation (CPU intensive)
// Use opacity-only fade instead for similar visual effect
const CharacterReveal = memo(function CharacterReveal({ 
  children, 
  className = "",
  delay = 0 
}: { 
  children: string; 
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const characters = useMemo(() => children.split(''), [children]);

  return (
    <div ref={ref} className={`${className} inline-flex flex-wrap`}>
      {characters.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          // PERF: Remove filter: blur animation - use opacity + y only (GPU accelerated)
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.02,
            ease: appleEase
          }}
          style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
});

// PERF: Memoize ParallaxSection
const ParallaxSection = memo(function ParallaxSection({ 
  children, 
  className = "",
  speed = 0.5 
}: { 
  children: React.ReactNode; 
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div 
      ref={ref} 
      style={{ 
        y: smoothY,
        // PERF: GPU acceleration
        willChange: 'transform',
        transform: 'translateZ(0)'
      }} 
      className={className}
    >
      {children}
    </motion.div>
  );
});

// PERF: Memoize StaggerContainer
const StaggerContainer = memo(function StaggerContainer({ 
  children, 
  className = "",
  staggerDelay = 0.1 
}: { 
  children: React.ReactNode; 
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div 
      ref={ref} 
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: staggerDelay }
        }
      }}
    >
      {children}
    </motion.div>
  );
});

const fadeUpVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1, ease: appleEase }
  }
};

const EVENTS = [
  {
    id: 1,
    title: "Hack-In-Shell 2026",
    date: "MARCH 15, 2026",
    tag: "FLAGSHIP",
    description: "The flagship 24-hour hackathon of NSBM Computing Society. Build something extraordinary.",
    size: "md:col-span-2 md:row-span-2",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    gradient: "from-blue-500/20 to-purple-500/20"
  },
  {
    id: 2,
    title: "Code Combat 1.0",
    date: "APRIL 02, 2026",
    tag: "COMPETITIVE",
    description: "Speed coding tournament.",
    size: "col-span-1 row-span-1",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop",
    gradient: "from-orange-500/20 to-red-500/20"
  },
  {
    id: 3,
    title: "Terminal Velocity",
    date: "APRIL 20, 2026",
    tag: "WORKSHOP",
    description: "Mastering the Linux CLI.",
    size: "col-span-1 row-span-1",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1974&auto=format&fit=crop",
    gradient: "from-green-500/20 to-teal-500/20"
  },
  {
    id: 4,
    title: "DevSprint x NSBM",
    date: "MAY 05, 2026",
    tag: "SPRINT",
    description: "Open source contribution day.",
    size: "col-span-1 row-span-1",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    gradient: "from-cyan-500/20 to-blue-500/20"
  },
  {
    id: 5,
    title: "AI Nexus Summit",
    date: "MAY 12, 2026",
    tag: "SUMMIT",
    description: "Exploring LLMs & Agents.",
    size: "col-span-1 row-span-1",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    id: 6,
    title: "UI/UX Forge",
    date: "JUNE 02, 2026",
    tag: "DESIGN",
    description: "Crafting interfaces that breathe.",
    size: "col-span-1 row-span-1",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=2070&auto=format&fit=crop",
    gradient: "from-pink-500/20 to-rose-500/20"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

// PERF: Removed filter: blur animation - uses opacity + transform only (GPU accelerated)
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 80,
    scale: 0.92
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 1,
      ease: appleEase
    }
  },
};

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.06] ${className}`}>
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.06] via-transparent to-transparent opacity-60" />
      <div className="absolute inset-0 rounded-3xl opacity-[0.012] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function SectionTitle({ 
  label, 
  title, 
  highlight, 
  description 
}: { 
  label: string; 
  title: string; 
  highlight: string; 
  description: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="flex flex-col items-center text-center mb-20 md:mb-28">
      <motion.span 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: appleEase }}
        className="text-[11px] md:text-xs uppercase tracking-[0.4em] text-[#6B8E23] font-medium mb-6"
      >
        {label}
      </motion.span>
      
      <h2 className="text-white text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95]">
        <TextReveal delay={0.2}>{title}</TextReveal>
        <motion.span 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.5, ease: appleEase }}
          className="block text-transparent bg-clip-text bg-gradient-to-r from-[#6B8E23] via-[#8FBC8F] to-[#556B2F]"
        >
          {highlight}
        </motion.span>
      </h2>
      
      <motion.p 
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.7, ease: appleEase }}
        className="text-[#86868B] mt-6 max-w-lg text-base md:text-lg font-light leading-relaxed"
      >
        {description}
      </motion.p>
    </div>
  );
}

// PERF: Memoized BentoEvents with optimized GSAP and mouse handlers
const BentoEvents = memo(function BentoEvents() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  // PERF: RAF throttling for mouse handlers
  const rafRefs = useRef<Map<number, number | null>>(new Map());

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      // PERF: Add force3D for GPU acceleration
      gsap.fromTo(sectionRef.current, 
        { scale: 0.9, opacity: 0.5 },
        {
          scale: 1,
          opacity: 1,
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
            fastScrollEnd: true,
          },
          ease: "power2.out"
        }
      );

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        // PERF: Add force3D for GPU acceleration
        gsap.fromTo(card, 
          { 
            y: 100, 
            opacity: 0, 
            rotateX: 15,
            scale: 0.9 
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            scale: 1,
            duration: 1.2,
            delay: index * 0.1,
            ease: "power3.out",
            force3D: true,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
              fastScrollEnd: true,
            }
          }
        );

        // PERF: Throttle mouse move with RAF
        const handleMouseMove = (e: MouseEvent) => {
          if (rafRefs.current.get(index)) return;
          rafRefs.current.set(index, requestAnimationFrame(() => {
            if (!card) {
              rafRefs.current.set(index, null);
              return;
            }
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            gsap.to(card, {
              rotateX: rotateX,
              rotateY: rotateY,
              scale: 1.02,
              duration: 0.5,
              ease: "power2.out",
              transformPerspective: 1000,
              force3D: true
            });
            rafRefs.current.set(index, null);
          }));
        };

        const handleMouseLeave = () => {
          const rafId = rafRefs.current.get(index);
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafRefs.current.set(index, null);
          }
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.7,
            ease: "elastic.out(1, 0.5)",
            force3D: true
          });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-black py-40 md:py-52 px-6 flex flex-col items-center overflow-hidden"
      style={{ perspective: '2000px' }}
    >
      <div className="max-w-7xl w-full">
        
        <SectionTitle 
          label="Featured Events"
          title="Innovation"
          highlight="in motion."
          description="Explore our curated collection of hackathons, workshops, and tech gatherings designed to push boundaries."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 auto-rows-[280px]">
          {EVENTS.map((event, index) => (
            <div
              key={event.id}
              ref={el => { cardsRef.current[index] = el; }}
              className={`${event.size} bento-card relative group cursor-pointer`}
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <GlassCard className="h-full overflow-hidden">
                <motion.div 
                  className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${event.gradient} opacity-0 blur-xl`}
                  whileHover={{ opacity: 0.5 }}
                  transition={{ duration: 0.6 }}
                />
                
                <motion.div 
                  className="absolute inset-0 rounded-3xl bg-cover bg-center opacity-20"
                  style={{ 
                    backgroundImage: `url(${event.image})`,
                    transformStyle: 'preserve-3d',
                    transform: 'translateZ(-50px)'
                  }}
                  whileHover={{ 
                    scale: 1.2, 
                    opacity: 0.4,
                    filter: 'blur(0px)'
                  }}
                  transition={{ duration: 0.8, ease: appleEase }}
                />
                
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black via-black/60 to-black/20" />

                <div 
                  className="absolute inset-0 p-7 md:p-8 flex flex-col justify-end"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <motion.span 
                    className="text-[#6B8E23] text-[10px] md:text-[11px] tracking-[0.2em] mb-3 font-medium self-start px-3 py-1.5 rounded-full bg-[#6B8E23]/10 backdrop-blur-sm border border-[#6B8E23]/20"
                    whileHover={{ 
                      scale: 1.08, 
                      backgroundColor: 'rgba(107, 142, 35, 0.25)',
                      boxShadow: '0 0 20px rgba(107, 142, 35, 0.3)'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {event.tag}
                  </motion.span>
                  
                  <motion.h3 
                    className="text-white text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight leading-tight"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {event.title}
                  </motion.h3>
                  
                  {/* PERF: Removed filter: blur animation - use opacity + y only */}
                  <motion.p 
                    className="text-[#86868B] text-sm mt-3 line-clamp-2 max-w-[90%]"
                    initial={{ opacity: 0, y: 15 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: appleEase }}
                    style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
                  >
                    {event.description}
                  </motion.p>
                  
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[#86868B] text-[11px] tracking-wider font-medium">{event.date}</span>
                    <motion.div 
                      className="flex items-center gap-2 text-[#6B8E23] text-xs font-medium"
                      initial={{ opacity: 0, x: -15 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      Learn more
                      <motion.svg 
                        className="w-4 h-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </motion.svg>
                    </motion.div>
                  </div>
                </div>

                <motion.div 
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 rounded-3xl border border-white/20" />
                  <motion.div 
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                      backgroundSize: '200% 100%'
                    }}
                    animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>

                <motion.div 
                  className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.div 
                    className="absolute -inset-full top-0 bg-gradient-to-r from-transparent via-white/15 to-transparent rotate-12"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </motion.div>
              </GlassCard>
            </div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: appleEase }}
          className="mt-20 w-full flex justify-center"
        >
          <MagneticButton 
            className="group relative px-8 py-4 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/10 text-white font-medium text-sm tracking-wide hover:bg-white/10 hover:border-white/20 transition-all duration-500"
            strength={0.4}
          >
            <span className="flex items-center gap-3">
              View all events
              <motion.svg 
                className="w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </span>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
});

// PERF: Memoized AnimatedCounter with GPU-accelerated animations (no blur)
const AnimatedCounter = memo(function AnimatedCounter({ 
  value, 
  suffix = "",
  delay = 0
}: { 
  value: number; 
  suffix?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isInView || hasAnimated) return;
    
    setHasAnimated(true);
    
    const counter = { value: 0 };
    
    gsap.to(counter, {
      value: value,
      duration: 2.5,
      delay: delay,
      ease: "power3.out",
      onUpdate: () => {
        setDisplayValue(Math.floor(counter.value));
      }
    });
  }, [isInView, value, hasAnimated, delay]);

  return (
    <div ref={ref} className="relative">
      {/* PERF: Removed filter: blur - use scale + opacity only */}
      <motion.span 
        className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: delay, ease: appleEase }}
        style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
      >
        {displayValue}{suffix}
      </motion.span>
      <motion.div 
        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6B8E23]/20 to-[#8FBC8F]/20 -z-10"
        style={{ filter: 'blur(48px)', transform: 'translateZ(0)' }}
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 0.6, scale: 1.5 } : {}}
        transition={{ duration: 1.5, delay: delay + 0.5, ease: appleEase }}
      />
    </div>
  );
});

function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-black py-40 md:py-52 lg:py-64 px-6 flex flex-col items-center relative overflow-hidden"
    >
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-r from-[#6B8E23]/15 via-[#8FBC8F]/10 to-transparent blur-[150px] pointer-events-none" 
      />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[#8FBC8F]/10 blur-[120px] pointer-events-none" 
      />
      
      <div className="max-w-5xl w-full flex flex-col items-center text-center relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: appleEase }}
          className="mb-10"
        >
          <span className="text-[11px] md:text-xs uppercase tracking-[0.4em] text-[#6B8E23] font-medium">
            About us
          </span>
        </motion.div>

        <div className="w-full px-4 md:px-0">
          <ScrollReveal
            baseOpacity={0.06}
            enableBlur
            baseRotation={1}
            blurStrength={4}
            containerClassName="w-full"
            textClassName="text-white text-center !text-[clamp(2rem,5.5vw,4.5rem)] !leading-[1.12] font-semibold tracking-tight"
          >
            Hackathon Hub is where ideas transform into innovation. We're the creative heartbeat of NSBM's tech community.
          </ScrollReveal>
        </div>

        <div className="mt-24 md:mt-32 grid grid-cols-3 gap-6 md:gap-16 lg:gap-24">
          {[
            { value: 50, suffix: "+", label: "Events Hosted", color: "#6B8E23" },
            { value: 2, suffix: "K+", label: "Participants", color: "#8FBC8F" },
            { value: 100, suffix: "%", label: "Innovation", color: "#6B8E23" }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className="text-center relative group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: appleEase }}
            >
              <motion.div 
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
                style={{ backgroundColor: stat.color }}
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: '60%', opacity: 0.5 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.15 + 0.8, ease: appleEase }}
              />
              
              <div className="text-4xl md:text-6xl lg:text-7xl font-semibold">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} delay={i * 0.2} />
              </div>
              <motion.div 
                className="text-[#86868B] text-xs md:text-sm mt-4 tracking-wide font-medium"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 + 1, ease: appleEase }}
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6, ease: appleEase }}
          className="mt-20 md:mt-24"
        >
          <Link href="/about">
            <MagneticButton 
              className="group relative px-12 py-5 rounded-full bg-gradient-to-r from-[#6B8E23] to-[#6B8E23] text-white font-semibold text-sm tracking-wide overflow-hidden transition-all duration-500 hover:shadow-[0_0_60px_rgba(10,132,255,0.5)]"
              strength={0.3}
            >
              <span className="relative z-10 flex items-center gap-3">
                Discover our story
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </span>

              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-[#6B8E23] via-[#8FBC8F] to-[#6B8E23] bg-[length:200%_100%]"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ backgroundPosition: '0% 50%' }}
              />
            </MagneticButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// PERF: Memoized ContactSection with GPU-accelerated GSAP animations
const ContactSection = memo(function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      inputsRef.current.forEach((input, index) => {
        if (!input) return;
        
        // PERF: Add force3D for GPU acceleration
        gsap.fromTo(input, 
          { 
            x: index % 2 === 0 ? -60 : 60, 
            opacity: 0,
            rotateY: index % 2 === 0 ? -10 : 10
          },
          {
            x: 0,
            opacity: 1,
            rotateY: 0,
            duration: 1,
            delay: index * 0.12,
            ease: "power3.out",
            force3D: true,
            scrollTrigger: {
              trigger: input,
              start: "top 85%",
              toggleActions: "play none none reverse",
              fastScrollEnd: true,
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const contactInfo = [
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: "Email",
      value: "hello@hackathonhub.dev",
      color: "#6B8E23"
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: "Location",
      value: "NSBM Green University",
      color: "#6B8E23"
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "Response Time",
      value: "Within 24 hours",
      color: "#8FBC8F"
    }
  ];

  const socialLinks = [
    { name: "GitHub", href: "#", icon: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" },
    { name: "Twitter", href: "#", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
    { name: "LinkedIn", href: "#", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
    { name: "Discord", href: "#", icon: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" }
  ];

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-black py-32 md:py-44 lg:py-52 px-6 flex flex-col items-center relative overflow-hidden"
      style={{ perspective: '1500px' }}
    >
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-l from-[#6B8E23]/10 via-[#8FBC8F]/5 to-transparent blur-[180px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.08, 0.15, 0.08]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[#6B8E23]/10 blur-[150px] pointer-events-none" 
      />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none opacity-50" />
      
      <div className="max-w-6xl w-full relative z-10">
        
        <div className="text-center mb-20 md:mb-28">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="text-[11px] md:text-xs uppercase tracking-[0.4em] text-[#6B8E23] font-medium mb-6 block"
          >
            Get in Touch
          </motion.span>
          
          <h2 className="text-white text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95]">
            <TextReveal delay={0.1}>Let's build</TextReveal>
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4, ease: appleEase }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#6B8E23] via-[#8FBC8F] to-[#6B8E23]"
            >
              together.
            </motion.span>
          </h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6, ease: appleEase }}
            className="text-[#86868B] mt-6 max-w-lg mx-auto text-base md:text-lg font-light leading-relaxed"
          >
            Have a question or want to collaborate? We'd love to hear from you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: appleEase }}
          >
            <GlassCard className="p-8 md:p-10">
              <form ref={formRef} className="space-y-6">
                <div 
                  ref={el => { inputsRef.current[0] = el; }}
                  className="group"
                >
                  <label className="text-[#86868B] text-xs uppercase tracking-wider mb-3 block font-medium">
                    Your Name
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 text-white placeholder:text-[#86868B]/50 focus:outline-none focus:border-[#6B8E23]/50 focus:bg-white/[0.05] transition-all duration-500 text-sm"
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#6B8E23] to-[#8FBC8F] rounded-full"
                      initial={{ width: '0%' }}
                      whileFocus={{ width: '100%' }}
                      transition={{ duration: 0.5, ease: appleEase }}
                    />
                  </div>
                </div>

                <div 
                  ref={el => { inputsRef.current[1] = el; }}
                  className="group"
                >
                  <label className="text-[#86868B] text-xs uppercase tracking-wider mb-3 block font-medium">
                    Email Address
                  </label>
                  <input 
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 text-white placeholder:text-[#86868B]/50 focus:outline-none focus:border-[#6B8E23]/50 focus:bg-white/[0.05] transition-all duration-500 text-sm"
                  />
                </div>

                <div 
                  ref={el => { inputsRef.current[2] = el; }}
                  className="group"
                >
                  <label className="text-[#86868B] text-xs uppercase tracking-wider mb-3 block font-medium">
                    Subject
                  </label>
                  <input 
                    type="text"
                    placeholder="What's this about?"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 text-white placeholder:text-[#86868B]/50 focus:outline-none focus:border-[#6B8E23]/50 focus:bg-white/[0.05] transition-all duration-500 text-sm"
                  />
                </div>

                <div 
                  ref={el => { inputsRef.current[3] = el; }}
                  className="group"
                >
                  <label className="text-[#86868B] text-xs uppercase tracking-wider mb-3 block font-medium">
                    Message
                  </label>
                  <textarea 
                    rows={5}
                    placeholder="Tell us about your idea..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 text-white placeholder:text-[#86868B]/50 focus:outline-none focus:border-[#6B8E23]/50 focus:bg-white/[0.05] transition-all duration-500 resize-none text-sm"
                  />
                </div>

                <div ref={el => { inputsRef.current[4] = el; }}>
                  <MagneticButton 
                    className="w-full py-5 rounded-xl bg-gradient-to-r from-[#6B8E23] to-[#8FBC8F] text-white font-semibold text-sm tracking-wide hover:shadow-[0_0_50px_rgba(10,132,255,0.4)] transition-all duration-500 relative overflow-hidden group"
                    strength={0.2}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Send Message
                      <motion.svg 
                        className="w-5 h-5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </motion.svg>
                    </span>
                    
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </MagneticButton>
                </div>
              </form>
            </GlassCard>
          </motion.div>

          <div className="flex flex-col justify-between gap-10">
            
            <div className="space-y-5">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50, rotateY: 10 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.15, ease: appleEase }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="group cursor-pointer"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <GlassCard className="p-6 flex items-center gap-5 hover:border-white/[0.15] transition-all duration-500">
                    <motion.div 
                      className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.08]"
                      style={{ color: info.color }}
                      whileHover={{ 
                        scale: 1.1, 
                        backgroundColor: `${info.color}20`,
                        boxShadow: `0 0 30px ${info.color}40`
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {info.icon}
                    </motion.div>
                    <div>
                      <p className="text-[#86868B] text-xs uppercase tracking-wider mb-1">{info.label}</p>
                      <p className="text-white text-sm font-medium">{info.value}</p>
                    </div>
                    <motion.svg 
                      className="w-5 h-5 text-[#86868B] ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: appleEase }}
            >
              <GlassCard className="p-8">
                <h4 className="text-white text-lg font-semibold mb-6">Connect with us</h4>
                <div className="flex items-center gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[#86868B] hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300"
                      whileHover={{ 
                        y: -5, 
                        scale: 1.1,
                        boxShadow: '0 10px 30px rgba(107, 142, 35, 0.2)'
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d={social.icon} />
                      </svg>
                    </motion.a>
                  ))}
                </div>

                <motion.p 
                  className="mt-6 text-[#86868B] text-sm"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  Follow us for updates on upcoming events and hackathons.
                </motion.p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.7, ease: appleEase }}
            >
              <GlassCard className="p-6 relative overflow-hidden group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#86868B] text-xs uppercase tracking-wider mb-1">Find us at</p>
                    <p className="text-white text-base font-medium">NSBM Green University</p>
                    <p className="text-[#86868B] text-sm mt-1">Pitipana, Homagama</p>
                  </div>
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6B8E23]/20 to-[#6B8E23]/20 flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      boxShadow: ['0 0 0 0 rgba(107, 142, 35, 0)', '0 0 0 20px rgba(107, 142, 35, 0.1)', '0 0 0 0 rgba(107, 142, 35, 0)']
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg className="w-6 h-6 text-[#6B8E23]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </motion.div>
                </div>
                
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full border border-white/[0.03] pointer-events-none" />
                <div className="absolute -bottom-5 -right-5 w-32 h-32 rounded-full border border-white/[0.05] pointer-events-none" />
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const pageScale = useTransform(scrollYProgress, [0, 0.1], [1, 1]);
  const pageY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  
  useEffect(() => {
    if (!heroRef.current) return;
    
    const ctx = gsap.context(() => {
      // PERF: Add force3D for GPU acceleration
      gsap.to('.hero-orb-1', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          fastScrollEnd: true,
        },
        y: 350,
        scale: 1.5,
        opacity: 0.3,
        ease: "none",
        force3D: true
      });
      
      gsap.to('.hero-orb-2', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          fastScrollEnd: true,
        },
        y: 450,
        scale: 0.6,
        opacity: 0.2,
        ease: "none",
        force3D: true
      });

      gsap.to('.hero-grid', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "50% top",
          scrub: 1,
          fastScrollEnd: true,
        },
        opacity: 0,
        scale: 1.2,
        ease: "none",
        force3D: true
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full bg-black flex flex-col antialiased selection:bg-[#6B8E23]/30 selection:text-white"
    >
      <section 
        ref={heroRef}
        className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center py-20"
      >

        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] rounded-full bg-gradient-radial from-[#6B8E23]/20 via-[#8FBC8F]/8 to-transparent blur-[150px]" 
          />
          
          <motion.div 
            animate={{ 
              x: [0, 80, 0],
              y: [0, -60, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="hero-orb-1 absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full bg-[#6B8E23]/15 blur-[180px]" 
          />
          <motion.div 
            animate={{ 
              x: [0, -70, 0],
              y: [0, 70, 0],
              scale: [1, 0.85, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="hero-orb-2 absolute bottom-1/4 right-1/4 w-[700px] h-[700px] rounded-full bg-[#8FBC8F]/15 blur-[180px]" 
          />
          
          <motion.div 
            animate={{ 
              opacity: [0.08, 0.18, 0.08],
              scale: [1, 1.4, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#556B2F]/10 blur-[120px]" 
          />
          
          <div className="absolute inset-0 opacity-15">
            <LiquidEther
              colors={['#6B8E23', '#8FBC8F', '#000000']}
              mouseForce={25}
              cursorSize={180}
              isViscous={true}
              viscous={60}
              autoDemo={true}
              autoSpeed={0.15}
            />
          </div>
        </div>

        <div className="hero-grid absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />

        <div className="hero-content-wrapper relative z-10 w-full max-w-6xl px-6 flex flex-col items-center text-center" ref={heroContentRef}>
          
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.4, ease: appleEase }}
            className="mb-8"
          >
            <div className="px-6 py-3 rounded-full bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] flex items-center gap-3 shadow-[0_0_60px_rgba(10,132,255,0.15)]">
              <motion.span 
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-2.5 h-2.5 rounded-full bg-[#6B8E23] shadow-[0_0_10px_#6B8E23]" 
              />
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#86868B] font-medium">
                NSBM Computing Society
              </span>
            </div>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: '120%', rotateX: -15 }}
              animate={{ y: 0, rotateX: 0 }}
              transition={{ duration: 1.6, delay: 0.3, ease: appleEase }}
              className="text-5xl md:text-7xl lg:text-[9rem] font-semibold tracking-tighter text-white leading-[0.85]"
            >
              Hackathon
            </motion.h1>
          </div>
          
          <div className="overflow-hidden mt-1">
            <motion.span 
              initial={{ y: '120%', rotateX: -15, opacity: 0 }}
              animate={{ y: 0, rotateX: 0, opacity: 1 }}
              transition={{ duration: 1.6, delay: 0.5, ease: appleEase }}
              className="block text-5xl md:text-7xl lg:text-[9rem] font-semibold tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-r from-[#6B8E23] via-[#8FBC8F] to-[#556B2F]"
            >
              Hub.
            </motion.span>
          </div>

          {/* PERF: Removed filter: blur animation - use opacity + y only */}
          <motion.p 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.9, ease: appleEase }}
            className="mt-8 max-w-xl text-[#86868B] text-lg md:text-xl font-light leading-relaxed"
            style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
          >
            Where innovation meets action. Join the most ambitious tech community 
            at NSBM Green University.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.1, ease: appleEase }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <MagneticButton 
              className="group relative px-12 py-5 rounded-full bg-white text-black font-semibold text-sm tracking-wide transition-all duration-700 hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:bg-white"
              strength={0.4}
              glowColor="rgba(255, 255, 255, 0.5)"
            >
              <span className="relative z-10 flex items-center gap-2">
                Join the Society
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </span>
              
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute -inset-full top-0 bg-gradient-to-r from-transparent via-black/5 to-transparent skew-x-12"
                  animate={{ x: ['0%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                />
              </div>
            </MagneticButton>
            
            <MagneticButton 
              className="group px-12 py-5 rounded-full bg-white/[0.03] backdrop-blur-2xl border border-white/[0.1] text-white font-semibold text-sm tracking-wide hover:bg-white/[0.08] hover:border-white/[0.25] hover:shadow-[0_0_40px_rgba(10,132,255,0.2)] transition-all duration-700"
              strength={0.4}
              glowColor="rgba(107, 142, 35, 0.5)"
            >
              <span className="flex items-center gap-3">
                Explore Events
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </motion.svg>
              </span>
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.5, ease: appleEase }}
          className="absolute bottom-8 inset-x-0 flex justify-center pointer-events-none"
        >
          <motion.div 
            className="flex flex-col items-center gap-3"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center pt-2">
              <motion.div 
                className="w-1 h-2 rounded-full bg-white/60"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="hidden lg:flex absolute top-10 right-10 items-center gap-3"
        >
          <span className="text-[10px] text-[#86868B]/50 font-mono tracking-widest">01</span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-white/15 to-transparent" />
        </motion.div>
      </section>

      <section className="w-full py-20 md:py-24 bg-black overflow-hidden">
        <ScrollVelocity
          texts={[
            'HACKATHON HUB  •  INNOVATION  •', 
            'CODE  •  BUILD  •  LAUNCH  •'
          ]} 
          velocity={35}
          className="text-white/[0.06] font-semibold uppercase tracking-tight text-7xl md:text-9xl"
        />
      </section>

      <BentoEvents />

      <AboutSection />

      <ContactSection />

      <footer className="w-full bg-black relative overflow-hidden">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#6B8E23]/5 via-[#8FBC8F]/3 to-transparent blur-[100px] pointer-events-none" />
        
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">

            <motion.div 
              className="md:col-span-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: appleEase }}
            >
              <h3 className="text-white text-2xl font-semibold tracking-tight mb-4">Hackathon<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B8E23] to-[#8FBC8F]">Hub</span></h3>
              <p className="text-[#86868B] text-sm leading-relaxed mb-6">
                Where innovation meets action. The premier tech community at NSBM Green University.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { name: 'Twitter', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                  { name: 'GitHub', path: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' },
                  { name: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                  { name: 'Discord', path: 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z' }
                ].map((social, index) => (
                  <motion.a
                    key={social.name}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#86868B] hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300"
                    whileHover={{ y: -3, scale: 1.05 }}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            {[
              { title: 'Explore', links: ['Events', 'Hackathons', 'Workshops', 'Community'] },
              { title: 'Resources', links: ['Documentation', 'Blog', 'Tutorials', 'FAQ'] },
              { title: 'Company', links: ['About', 'Team', 'Careers', 'Contact'] }
            ].map((column, colIndex) => (
              <motion.div 
                key={column.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 * (colIndex + 1), ease: appleEase }}
              >
                <h4 className="text-white text-sm font-semibold mb-5 tracking-wide">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={link}>
                      <motion.a 
                        href="#" 
                        className="text-[#86868B] text-sm hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                        whileHover={{ x: 4 }}
                      >
                        <span className="w-0 h-[1px] bg-[#6B8E23] group-hover:w-3 transition-all duration-300" />
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="py-10 border-y border-white/[0.04] mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: appleEase }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-white text-lg font-semibold mb-1">Stay in the loop</h4>
                <p className="text-[#86868B] text-sm">Get notified about upcoming events and hackathons.</p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 md:w-64 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-[#86868B]/50 focus:outline-none focus:border-[#6B8E23]/50 transition-all duration-300"
                />
                <MagneticButton 
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6B8E23] to-[#8FBC8F] text-white text-sm font-medium hover:shadow-[0_0_30px_rgba(10,132,255,0.4)] transition-all duration-300"
                  strength={0.2}
                >
                  Subscribe
                </MagneticButton>
              </div>
            </div>
          </motion.div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.div 
              className="flex flex-col md:flex-row items-center gap-4 md:gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-[#86868B]/50 text-xs">© 2026 Hackathon Hub. All rights reserved.</span>
              <div className="flex items-center gap-5">
                {['Privacy Policy', 'Terms of Service', 'Cookies'].map((link) => (
                  <motion.a 
                    key={link}
                    href="#" 
                    className="text-[#86868B]/60 text-xs hover:text-[#86868B] transition-colors duration-300"
                    whileHover={{ y: -1 }}
                  >
                    {link}
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            <motion.p 
              className="text-[#86868B]/25 text-[10px] tracking-wide"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Crafted by Oshada, Asila, Senuka & Manuja
            </motion.p>
          </div>
        </div>
        
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#6B8E23]/30 to-transparent" />
        
      </footer>

    </div>
  );
}