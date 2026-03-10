"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const appleEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

// Deterministic pseudo-random generator for consistent SSR/client rendering
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// Pre-computed particle positions for hero section (20 particles)
const HERO_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: seededRandom(i * 7 + 1) * 100,
  top: seededRandom(i * 13 + 2) * 100,
  opacity: seededRandom(i * 3 + 5) * 0.5 + 0.2,
  scale: seededRandom(i * 11 + 7) * 2 + 0.5,
}));

// Pre-computed particle positions for CTA section (15 particles)
const CTA_PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  left: seededRandom(i * 17 + 3) * 100,
  top: seededRandom(i * 23 + 11) * 100,
}));

// ==================== UTILITY COMPONENTS ====================

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.06] ${className}`}>
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.06] via-transparent to-transparent opacity-60" />
      <div className="absolute inset-0 rounded-3xl opacity-[0.012] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function TextReveal({ 
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
  const words = children.split(' ');

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
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

function CharacterReveal({ 
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
  const characters = children.split('');

  return (
    <div ref={ref} className={`${className} inline-flex flex-wrap justify-center`}>
      {characters.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={isInView ? { 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)' 
          } : { 
            opacity: 0, 
            y: 40, 
            filter: 'blur(10px)' 
          }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.02,
            ease: appleEase
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
}

function MagneticButton({ 
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) * strength;
    const distY = (e.clientY - centerY) * strength;
    x.set(distX);
    y.set(distY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const springConfig = { stiffness: 150, damping: 15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={`${className} relative overflow-hidden`}
    >
      <motion.div 
        className="absolute -inset-[1px] rounded-full opacity-0 blur-sm"
        style={{ background: `linear-gradient(90deg, ${glowColor}, transparent, ${glowColor})` }}
        animate={{ 
          opacity: isHovered ? 0.8 : 0,
          rotate: isHovered ? 360 : 0 
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      {children}
    </motion.button>
  );
}

function ParallaxImage({ 
  src, 
  alt, 
  className = "",
  speed = 0.5 
}: { 
  src: string; 
  alt: string; 
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div ref={ref} className={`${className} overflow-hidden`}>
      <motion.div style={{ y: smoothY, scale }} className="w-full h-full">
        <Image 
          src={src} 
          alt={alt} 
          fill 
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>
    </motion.div>
  );
}

// ==================== HERO SECTION ====================

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  useEffect(() => {
    if (!titleRef.current) return;
    
    const ctx = gsap.context(() => {
      // Floating particles
      gsap.to(".hero-particle", {
        y: -30,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: {
          each: 0.2,
          from: "random"
        }
      });

      // Glowing lines
      gsap.to(".glow-line", {
        backgroundPosition: "200% center",
        duration: 3,
        repeat: -1,
        ease: "none"
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.section 
      ref={heroRef}
      style={{ opacity, scale, y }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-transparent" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Floating Particles */}
      {HERO_PARTICLES.map((particle, i) => (
        <motion.div
          key={i}
          className="hero-particle absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: particle.opacity, scale: particle.scale }}
          transition={{ duration: 2, delay: i * 0.1 }}
        />
      ))}

      {/* Glowing Orbs */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6B8E23]/20 rounded-full blur-[150px]"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#556B2F]/20 rounded-full blur-[150px]"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Main Content */}
      <div ref={titleRef} className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <span className="text-[11px] md:text-xs uppercase tracking-[0.5em] text-[#6B8E23] font-medium px-6 py-2 rounded-full border border-[#6B8E23]/20 bg-[#6B8E23]/5 backdrop-blur-sm">
            About Us
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight mb-8">
          <CharacterReveal delay={0.5} className="text-white block">
            Pioneering
          </CharacterReveal>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 1.2, ease: appleEase }}
            className="block text-transparent bg-clip-text bg-gradient-to-r from-[#6B8E23] via-[#8FBC8F] to-[#556B2F] animate-gradient bg-[length:200%_auto]"
          >
            Tomorrow.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: appleEase }}
          className="text-[#86868B] text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto font-light leading-relaxed mb-32"
        >
          We are the nexus of innovation, creativity, and technical excellence. 
          Building the future, one hackathon at a time.
        </motion.p>
      </div>

      {/* Scroll Indicator - Positioned outside main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[#86868B] text-xs tracking-widest uppercase">Scroll</span>
          <motion.div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2">
            <motion.div 
              className="w-1.5 h-1.5 bg-[#6B8E23] rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

// ==================== ABOUT CONTENT SECTION ====================

function AboutContentSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate images on scroll
      imageRefs.current.forEach((img, index) => {
        if (!img) return;
        
        gsap.fromTo(img, 
          { 
            y: 100, 
            opacity: 0,
            scale: 0.8,
            rotateY: index % 2 === 0 ? -15 : 15
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: img,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Hover 3D effect
        const handleMouseMove = (e: MouseEvent) => {
          const rect = img.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = (y - centerY) / 25;
          const rotateY = (centerX - x) / 25;
          
          gsap.to(img, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.02,
            duration: 0.5,
            ease: "power2.out",
            transformPerspective: 1000
          });
        };

        const handleMouseLeave = () => {
          gsap.to(img, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.7,
            ease: "elastic.out(1, 0.5)"
          });
        };

        img.addEventListener('mousemove', handleMouseMove);
        img.addEventListener('mouseleave', handleMouseLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-32 md:py-48 px-6 bg-black overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6B8E23]/5 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 md:mb-32">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="text-[11px] md:text-xs uppercase tracking-[0.4em] text-[#6B8E23] font-medium mb-6 block"
          >
            Our Story
          </motion.span>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white">
            <TextReveal delay={0.2}>Crafting the future of</TextReveal>
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5, ease: appleEase }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#6B8E23] via-[#8FBC8F] to-[#556B2F]"
            >
              tech innovation.
            </motion.span>
          </h2>
        </div>

        {/* Image Grid with Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left Column - Large Image */}
          <div className="relative">
            <div 
              ref={el => { imageRefs.current[0] = el; }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer"
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              <GlassCard className="h-full">
                <div className="relative w-full h-full">
                  <Image 
                    src="/news.jpeg" 
                    alt="Our Vision" 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  
                  {/* Floating Label */}
                  <motion.div 
                    className="absolute bottom-8 left-8 right-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-[#6B8E23] text-xs tracking-[0.2em] uppercase font-medium">Established 2020</span>
                    <h3 className="text-white text-2xl md:text-3xl font-semibold mt-2">Where Ideas Come Alive</h3>
                  </motion.div>

                  {/* Shine Effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                    whileHover={{ translateX: '200%' }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Right Column - Text + Small Images */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: appleEase }}
            >
              <p className="text-[#86868B] text-lg md:text-xl leading-relaxed">
                The Computing Society was born from a simple idea: create a community where 
                passionate technologists could collaborate, learn, and build amazing things together.
              </p>
              <p className="text-[#86868B] text-lg md:text-xl leading-relaxed mt-6">
                What started as a small group of enthusiastic students has evolved into 
                the premier hub for technological innovation at NSBM, hosting flagship events 
                like Hack-In-Shell and bringing together hundreds of developers annually.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: appleEase }}
              className="grid grid-cols-3 gap-6 py-8 border-y border-white/10"
            >
              {[
                { value: "50+", label: "Events Hosted" },
                { value: "2000+", label: "Members" },
                { value: "100+", label: "Projects Built" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <motion.span 
                    className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: appleEase }}
                  >
                    {stat.value}
                  </motion.span>
                  <p className="text-[#86868B] text-xs md:text-sm mt-2 tracking-wide">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Small Images Row */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((_, index) => (
                <div 
                  key={index}
                  ref={el => { imageRefs.current[index + 1] = el; }}
                  className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                  style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                >
                  <GlassCard className="h-full">
                    <Image 
                      src="/news.jpeg" 
                      alt={`Event ${index + 1}`} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    
                    {/* Hover Overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-[#6B8E23]/20 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Width Image Section */}
        <div className="mt-20 md:mt-32">
          <div 
            ref={el => { imageRefs.current[3] = el; }}
            className="relative w-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px] rounded-3xl overflow-hidden group cursor-pointer"
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          >
            <GlassCard className="h-full">
              <Image 
                src="/news.jpeg" 
                alt="Community" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/60" />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center p-8 py-16">
                <div className="text-center">
                  <motion.h3 
                    className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3, ease: appleEase }}
                  >
                    Building Together.
                  </motion.h3>
                  <motion.p 
                    className="text-white/70 text-base sm:text-lg md:text-xl mt-4 max-w-xl mx-auto px-4"
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5, ease: appleEase }}
                  >
                    Join a community of innovators, dreamers, and builders
                  </motion.p>
                </div>
              </div>

              {/* Animated Border */}
              <motion.div 
                className="absolute inset-0 rounded-3xl pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <div className="absolute inset-0 rounded-3xl border-2 border-[#6B8E23]/50" />
              </motion.div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== BOARD MEMBER DATA ====================

interface BoardMember {
  id: number;
  name: string;
  position: string;
  description: string;
  linkedin: string;
  twitter?: string;
  github?: string;
  image: string;
  featured?: boolean;
}

const BOARD_MEMBERS: BoardMember[] = [
  {
    id: 1,
    name: "Dr. James Wellington",
    position: "Master in Charge",
    description: "Visionary leader with 15+ years in tech education. Dr. Wellington has been instrumental in shaping the computing society into the thriving community it is today. His passion for innovation and student development has produced countless successful tech professionals.",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    image: "/steve.jpeg",
    featured: true
  },
  {
    id: 2,
    name: "Sarah Chen",
    position: "President",
    description: "Computer Science senior with expertise in AI/ML. Sarah leads the society with unwavering dedication and has organized multiple successful hackathons. Her leadership has doubled member engagement this year.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    image: "/steve.jpeg"
  },
  {
    id: 3,
    name: "Michael Frost",
    position: "Vice President",
    description: "Full-stack developer and cloud architecture enthusiast. Michael oversees technical operations and mentor programs, ensuring every member has access to cutting-edge resources and guidance.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    image: "/steve.jpeg"
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    position: "Secretary",
    description: "Detail-oriented organizer with a passion for community building. Emily manages communications and ensures seamless coordination across all society activities and events.",
    linkedin: "https://linkedin.com",
    image: "/steve.jpeg"
  },
  {
    id: 5,
    name: "David Park",
    position: "Treasurer",
    description: "Finance and tech dual major. David manages the society's resources with precision, enabling ambitious projects and ensuring sustainable growth for years to come.",
    linkedin: "https://linkedin.com",
    image: "/steve.jpeg"
  },
  {
    id: 6,
    name: "Amanda Foster",
    position: "Events Director",
    description: "Creative strategist behind our flagship events. Amanda transforms ideas into unforgettable experiences, from intimate workshops to large-scale hackathons that attract participants nationwide.",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    image: "/steve.jpeg"
  },
  {
    id: 7,
    name: "Ryan Mitchell",
    position: "Technical Lead",
    description: "Systems architect and open-source contributor. Ryan drives technical excellence across all projects, maintaining our infrastructure and mentoring aspiring developers.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    image: "/steve.jpeg"
  },
  {
    id: 8,
    name: "Jessica Wong",
    position: "Marketing Director",
    description: "Digital marketing expert and content strategist. Jessica has grown our social media presence by 300% and built partnerships with leading tech companies.",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    image: "/steve.jpeg"
  },
  {
    id: 9,
    name: "Christopher Lee",
    position: "Community Manager",
    description: "People person with strong organizational skills. Christopher nurtures our member community, organizing networking events and ensuring everyone feels welcome and supported.",
    linkedin: "https://linkedin.com",
    image: "/steve.jpeg"
  },
  {
    id: 10,
    name: "Natalie Brooks",
    position: "Workshop Coordinator",
    description: "Educator and curriculum designer. Natalie develops and delivers hands-on technical workshops that have helped hundreds of students gain practical skills in emerging technologies.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    image: "/steve.jpeg"
  },
  {
    id: 11,
    name: "Alexander Kim",
    position: "Sponsorship Lead",
    description: "Business development specialist. Alexander bridges the gap between academia and industry, securing partnerships that provide members with internships, mentorship, and resources.",
    linkedin: "https://linkedin.com",
    image: "/steve.jpeg"
  },
  {
    id: 12,
    name: "Sophia Martinez",
    position: "Design Director",
    description: "UI/UX designer with an eye for aesthetics. Sophia crafts the visual identity of all society projects and ensures every touchpoint reflects our commitment to excellence.",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    image: "/steve.jpeg"
  },
  {
    id: 13,
    name: "Daniel Thompson",
    position: "Hackathon Coordinator",
    description: "Competition veteran and event specialist. Daniel orchestrates our hackathons with military precision, creating experiences that challenge and inspire participants.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    image: "/steve.jpeg"
  },
  {
    id: 14,
    name: "Rachel Green",
    position: "Outreach Coordinator",
    description: "Passionate advocate for tech diversity. Rachel runs programs that introduce underrepresented groups to computing, expanding our community and fostering inclusion.",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    image: "/steve.jpeg"
  },
  {
    id: 15,
    name: "Kevin Patel",
    position: "Documentation Lead",
    description: "Technical writer and knowledge manager. Kevin ensures all projects are well-documented and creates resources that help members learn and contribute effectively.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    image: "/steve.jpeg"
  },
  {
    id: 16,
    name: "Olivia Anderson",
    position: "Social Media Manager",
    description: "Creative content creator and community voice. Olivia manages our digital presence, sharing stories that inspire and connect our vibrant tech community.",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    image: "/steve.jpeg"
  }
];

// ==================== BOARD MEMBER CARD COMPONENT ====================

function BoardMemberCard({ member, index }: { member: BoardMember; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ y: 80, opacity: 0, scale: 0.9 }}
      animate={isInView ? { y: 0, opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.05, ease: appleEase }}
      className={`relative cursor-pointer ${member.featured ? 'md:col-span-2 md:row-span-2' : ''}`}
      onClick={toggleExpand}
    >
      <GlassCard className="h-full">
        <div className="p-6 md:p-8 h-full flex flex-col">
          {/* Image and Basic Info */}
          <div className={`flex ${isExpanded ? 'flex-col' : 'flex-row items-center'} gap-4 md:gap-6 transition-all duration-500`}>
            {/* Profile Image */}
            <div 
              className={`relative ${isExpanded ? 'w-32 h-32 md:w-40 md:h-40 mx-auto' : 'w-16 h-16 md:w-20 md:h-20'} rounded-full overflow-hidden flex-shrink-0 transition-all duration-500`}
            >
              <Image 
                src={member.image} 
                alt={member.name} 
                fill 
                className="object-cover"
                sizes="160px"
              />
              
              {/* Glow Ring */}
              <div 
                className={`absolute -inset-1 rounded-full border-2 border-[#6B8E23]/50 transition-all duration-500 ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
              />
              
              {/* Rotating Glow */}
              {member.featured && (
                <motion.div 
                  className="absolute -inset-2 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent, #6B8E23, transparent)',
                    opacity: 0.5
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>

            {/* Name and Position */}
            <div className={`${isExpanded ? 'text-center' : ''} transition-all duration-500`}>
              <h3 
                className={`text-white font-semibold tracking-tight transition-all duration-500 ${isExpanded ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}
              >
                {member.name}
              </h3>
              <p 
                className={`text-[#6B8E23] font-medium transition-all duration-500 ${isExpanded ? 'text-base md:text-lg mt-2' : 'text-sm mt-1'}`}
              >
                {member.position}
              </p>
              
              {/* Featured Badge */}
              {member.featured && (
                <span 
                  className="inline-block mt-2 px-3 py-1 text-[10px] tracking-widest uppercase bg-[#6B8E23]/20 text-[#6B8E23] rounded-full border border-[#6B8E23]/30"
                >
                  Master in Charge
                </span>
              )}
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                key="expanded-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {/* Description */}
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="text-[#86868B] text-sm md:text-base leading-relaxed mt-6 text-center"
                >
                  {member.description}
                </motion.p>

                {/* Social Links */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  className="flex justify-center gap-4 mt-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <MagneticButton 
                        className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-[#6B8E23]/20 hover:border-[#6B8E23]/30 transition-all duration-300"
                        strength={0.3}
                        glowColor="rgba(107, 142, 35, 0.5)"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </MagneticButton>
                    </a>
                  )}
                  {member.twitter && (
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <MagneticButton 
                        className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-[#1DA1F2]/20 hover:border-[#1DA1F2]/30 transition-all duration-300"
                        strength={0.3}
                        glowColor="rgba(29, 161, 242, 0.5)"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </MagneticButton>
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <MagneticButton 
                        className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                        strength={0.3}
                        glowColor="rgba(255, 255, 255, 0.3)"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </MagneticButton>
                    </a>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Click Indicator */}
          <div className="mt-auto pt-4 flex items-center justify-center">
            <div 
              className={`flex items-center gap-2 text-[#86868B] text-xs transition-opacity duration-300 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}
            >
              <span className="tracking-wider">{isExpanded ? 'CLICK TO COLLAPSE' : 'CLICK TO EXPAND'}</span>
              <motion.svg 
                className="w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                animate={{ 
                  y: [0, 3, 0],
                  rotate: isExpanded ? 180 : 0 
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div 
            className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#6B8E23]/0 via-[#6B8E23]/20 to-[#556B2F]/0 opacity-0 hover:opacity-100 blur-xl -z-10 transition-opacity duration-500"
          />
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ==================== BOARD SECTION ====================

function BoardSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate section background
      gsap.fromTo(sectionRef.current,
        { opacity: 0.5 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1
          }
        }
      );

      // Floating effect for decorative elements
      gsap.to(".board-float", {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.5
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Separate featured member (Master in Charge) from others
  const masterInCharge = BOARD_MEMBERS.find(m => m.featured);
  const otherMembers = BOARD_MEMBERS.filter(m => !m.featured);

  return (
    <section ref={sectionRef} className="relative w-full py-32 md:py-48 px-6 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <motion.div 
          className="board-float absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#6B8E23]/10 rounded-full blur-[200px]"
          animate={{ 
            x: [0, 50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="board-float absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-[#556B2F]/10 rounded-full blur-[200px]"
          animate={{ 
            x: [0, -50, 0],
            scale: [1.1, 1, 1.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
      </div>

      {/* Tech Lines */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent"
            style={{
              top: `${20 + i * 20}%`,
              left: 0,
              right: 0
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scaleX: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              delay: i * 0.5,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-20 md:mb-32">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="text-[11px] md:text-xs uppercase tracking-[0.4em] text-[#6B8E23] font-medium mb-6 block"
          >
            Leadership
          </motion.span>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white">
            <TextReveal delay={0.2}>Meet the visionaries</TextReveal>
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5, ease: appleEase }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#6B8E23] via-[#8FBC8F] to-[#556B2F]"
            >
              behind the code.
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.7, ease: appleEase }}
            className="text-[#86868B] mt-6 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed"
          >
            Our dedicated team of leaders who work tirelessly to create opportunities, 
            foster growth, and build a community where innovation thrives.
          </motion.p>
        </div>

        {/* Master in Charge - Featured */}
        {masterInCharge && (
          <div className="mb-16">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: appleEase }}
              className="text-white text-xl md:text-2xl font-semibold mb-8 flex items-center gap-4"
            >
              <span className="w-12 h-px bg-gradient-to-r from-[#6B8E23] to-transparent" />
              Master in Charge
            </motion.h3>
            <div className="max-w-3xl mx-auto">
              <BoardMemberCard member={masterInCharge} index={0} />
            </div>
          </div>
        )}

        {/* Top Board Members */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="text-white text-xl md:text-2xl font-semibold mb-8 flex items-center gap-4"
          >
            <span className="w-12 h-px bg-gradient-to-r from-[#8FBC8F] to-transparent" />
            Top Board
          </motion.h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherMembers.map((member, index) => (
              <BoardMemberCard key={member.id} member={member} index={index + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== CALL TO ACTION SECTION ====================

function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(".cta-particle", {
        y: "random(-30, 30)",
        x: "random(-30, 30)",
        rotation: "random(-15, 15)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: {
          each: 0.1,
          from: "random"
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-32 md:py-48 px-6 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#6B8E23]/10 via-transparent to-transparent" />
      
      {/* Floating Particles */}
      {CTA_PARTICLES.map((particle, i) => (
        <div
          key={i}
          className="cta-particle absolute w-2 h-2 bg-white/10 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: appleEase }}
          className="text-[11px] md:text-xs uppercase tracking-[0.4em] text-[#6B8E23] font-medium mb-6 block"
        >
          Join Us
        </motion.span>

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8">
          <TextReveal delay={0.2}>Ready to build</TextReveal>
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5, ease: appleEase }}
            className="block text-transparent bg-clip-text bg-gradient-to-r from-[#6B8E23] via-[#8FBC8F] to-[#556B2F]"
          >
            something amazing?
          </motion.span>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7, ease: appleEase }}
          className="text-[#86868B] text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          Join our community of innovators and be part of the next generation of tech leaders. 
          Your journey starts here.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.9, ease: appleEase }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <MagneticButton 
            className="group px-8 py-4 rounded-full bg-[#6B8E23] text-white font-medium text-sm tracking-wide hover:bg-[#6B8E23]/90 transition-all duration-500"
            strength={0.4}
            glowColor="rgba(107, 142, 35, 0.6)"
          >
            <span className="flex items-center gap-3">
              Join the Community
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

          <MagneticButton 
            className="group px-8 py-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white font-medium text-sm tracking-wide hover:bg-white/10 hover:border-white/20 transition-all duration-500"
            strength={0.4}
          >
            <span className="flex items-center gap-3">
              View Events
              <motion.svg 
                className="w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </motion.svg>
            </span>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}

// ==================== FOOTER ====================

function Footer() {
  return (
    <footer className="relative w-full py-16 px-6 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#86868B] text-sm"
          >
            © 2026 Computing Society. All rights reserved.
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-6"
          >
            {['Privacy', 'Terms', 'Contact'].map((link, i) => (
              <motion.a
                key={link}
                href="#"
                className="text-[#86868B] text-sm hover:text-white transition-colors duration-300"
                whileHover={{ y: -2 }}
              >
                {link}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

// ==================== MAIN COMPONENT ====================

export default function AboutPage() {
  return (
    <div className="w-full">
      <HeroSection />
      <AboutContentSection />
      <BoardSection />
      <CTASection />
      <Footer />
    </div>
  );
}
