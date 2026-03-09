"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { EventWithMedia } from "@/app/actions/public-events";

// ─── Constants ───────────────────────────────────────────────────────
const appleEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

// ─── Types ───────────────────────────────────────────────────────────
interface EventCardData {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string | null;
  status: string;
  imageUrl: string;
  slug: string;
  registrationLink: string | null;
}

// ─── Event Modal ─────────────────────────────────────────────────────
function EventModal({
  event,
  onClose,
}: {
  event: EventCardData;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: appleEase }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      {/* Modal content */}
      <motion.div
        initial={{ scale: 0.9, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 40, opacity: 0 }}
        transition={{ duration: 0.5, ease: appleEase }}
        className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#111]/90 backdrop-blur-2xl border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Hero image */}
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-3xl">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />

          {/* Status badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1.5 rounded-full text-[10px] tracking-[0.2em] font-medium backdrop-blur-sm border ${
                event.status === "UPCOMING"
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  : "text-amber-400 bg-amber-500/10 border-amber-500/20"
              }`}
            >
              {event.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 -mt-10 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
            {event.title}
          </h2>

          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {event.date}
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </div>
          </div>

          {event.description && (
            <p className="mt-6 text-white/50 text-base leading-relaxed">
              {event.description}
            </p>
          )}

          {event.registrationLink && event.status === "UPCOMING" && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#6B8E23] to-[#556B2F] text-white font-semibold text-sm tracking-wide hover:shadow-[0_0_40px_rgba(107,142,35,0.4)] transition-all duration-500"
            >
              Register Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Fallback Gallery (2D) for when no 3D or few events ──────────────
function FlatGallery({
  events,
  onSelect,
}: {
  events: EventCardData[];
  onSelect: (data: EventCardData) => void;
}) {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              ease: appleEase,
            }}
            onClick={() => onSelect(event)}
            className="group cursor-pointer relative rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] hover:border-white/[0.15] transition-all duration-500"
          >
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Status badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-[9px] tracking-[0.2em] font-medium backdrop-blur-md border ${
                    event.status === "UPCOMING"
                      ? "text-emerald-400 bg-emerald-500/15 border-emerald-500/25"
                      : "text-amber-400 bg-amber-500/15 border-amber-500/25"
                  }`}
                >
                  {event.status}
                </span>
              </div>

              {/* Hover shimmer */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                <div
                  className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 animate-shimmer"
                  style={{ animationDuration: "1.5s" }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-white text-lg font-semibold tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                {event.title}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-white/40 text-xs tracking-wider">
                  {event.date}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-white/40 text-xs">{event.location}</span>
              </div>

              {/* Hover arrow */}
              <motion.div
                className="flex items-center gap-2 mt-3 text-[#6B8E23] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                View details
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Glow border on hover */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-2xl ring-1 ring-[#6B8E23]/30" />
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-[#6B8E23]/10 via-transparent to-[#6B8E23]/5 blur-sm -z-10" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative w-full pt-32 pb-16 px-6 flex flex-col items-center text-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-gradient-to-r from-[#6B8E23]/10 via-[#8FBC8F]/5 to-transparent blur-[150px] pointer-events-none" />

      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: appleEase }}
        className="text-[11px] md:text-xs uppercase tracking-[0.4em] text-[#6B8E23] font-medium mb-6"
      >
        Our Events
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 1, delay: 0.2, ease: appleEase }}
        className="text-white text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
      >
        Every{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B8E23] via-[#8FBC8F] to-[#556B2F]">
          moment
        </span>
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 1, delay: 0.35, ease: appleEase }}
        className="text-white/80 text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.95] mt-2"
      >
        captured.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.5, ease: appleEase }}
        className="text-[#86868B] mt-6 max-w-lg text-base md:text-lg font-light leading-relaxed"
      >
        Browse through our collection of hackathons, workshops, and tech
        gatherings that shaped our community.
      </motion.p>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.7, ease: appleEase }}
        className="mt-10"
      >
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]">
          {["All", "Upcoming", "Past"].map((tab) => (
            <span
              key={tab}
              className="px-5 py-2 rounded-full text-xs tracking-wider font-medium text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-300 cursor-default select-none"
            >
              {tab}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function EventsPage({
  events: rawEvents,
}: {
  events: EventWithMedia[];
}) {
  const [selectedEvent, setSelectedEvent] = useState<EventCardData | null>(null);

  // Transform events into card data
  const events: EventCardData[] = useMemo(() => {
    return rawEvents.map((event) => {
      // Use flyer as primary image, fallback to gallery, then placeholder
      const flyer = event.media.find((m) => m.type === "FLYER");
      const gallery = event.media.find((m) => m.type === "GALLERY");
      const imageUrl =
        flyer?.url ||
        gallery?.url ||
        `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop`;

      return {
        id: event.id,
        title: event.title,
        date: new Date(event.date).toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        location: event.location,
        description: event.description,
        status: event.status,
        imageUrl,
        slug: event.slug,
        registrationLink: event.registrationLink,
      };
    });
  }, [rawEvents]);

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Hero */}
      <HeroSection />

      {/* Gallery */}
      {events.length > 0 ? (
        <FlatGallery events={events} onSelect={setSelectedEvent} />
      ) : (
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-white/60 text-xl font-medium">
              No events yet
            </h3>
            <p className="text-white/30 text-sm mt-2">
              Stay tuned for exciting events coming soon.
            </p>
          </motion.div>
        </div>
      )}

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>

      {/* Bottom gradient fade */}
      <div className="w-full h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
