"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { EventWithMedia } from "@/app/actions/public-events";

const appleEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function EventGalleryModal({
    event,
    onClose,
}: {
    event: EventWithMedia;
    onClose: () => void;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const galleryImages = event.media.filter((m) => m.type === "GALLERY");

    // Fallback: use thumbnailUrl if no gallery images
    const hasImages = galleryImages.length > 0 || !!event.thumbnailUrl;
    const displayImages =
        galleryImages.length > 0
            ? galleryImages.map((m) => m.url)
            : event.thumbnailUrl
                ? [event.thumbnailUrl]
                : [];

    const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: appleEase }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal container — strictly fixed size */}
            <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.45, ease: appleEase }}
                className="relative w-[90vw] max-w-5xl h-[80vh] max-h-[800px] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/[0.08] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all duration-300 cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Image scroll indicators */}
                {displayImages.length > 1 && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
                        {displayImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    scrollRef.current?.children[i]?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "nearest",
                                        inline: "start",
                                    });
                                }}
                                className="w-2 h-2 rounded-full bg-white/30 hover:bg-white/60 transition-colors cursor-pointer"
                            />
                        ))}
                    </div>
                )}

                {/* Horizontally scrollable gallery */}
                {hasImages ? (
                    <div
                        ref={scrollRef}
                        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {displayImages.map((url, index) => (
                            <div
                                key={index}
                                className="relative flex-shrink-0 w-full h-full snap-start"
                            >
                                <Image
                                    src={url}
                                    alt={`${event.title} — image ${index + 1}`}
                                    fill
                                    sizes="90vw"
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Dark placeholder when no images */
                    <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] via-[#111] to-[#0a0a0a] flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3 opacity-30">
                            <svg
                                className="w-16 h-16 text-white/30"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={0.8}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <span className="text-xs tracking-[0.2em] text-white/20 uppercase">
                                No gallery images
                            </span>
                        </div>
                    </div>
                )}

                {/* Description overlay */}
                <div className="absolute bottom-0 left-0 w-full z-20 bg-gradient-to-t from-black via-black/80 to-transparent p-8 pt-24 pointer-events-none">
                    {/* Status + Date */}
                    <div className="flex items-center gap-3 mb-3 pointer-events-auto">
                        <span
                            className={`px-2.5 py-1 rounded-full text-[9px] tracking-[0.2em] font-medium backdrop-blur-sm border ${new Date(event.date) >= new Date()
                                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                    : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                                }`}
                        >
                            {new Date(event.date) >= new Date() ? "UPCOMING" : "PAST"}
                        </span>
                        <span className="text-white/40 text-xs tracking-wider">
                            {formattedDate}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-white/40 text-xs">{event.location}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-white text-2xl md:text-4xl font-bold tracking-tight leading-tight">
                        {event.title}
                    </h2>

                    {/* Description */}
                    {event.description && (
                        <p className="mt-3 text-white/50 text-sm md:text-base leading-relaxed line-clamp-3">
                            {event.description}
                        </p>
                    )}

                    {/* Registration link */}
                    {event.registrationLink && new Date(event.date) >= new Date() && (
                        <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pointer-events-auto mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#6B8E23] to-[#556B2F] text-white font-semibold text-sm tracking-wide hover:shadow-[0_0_30px_rgba(107,142,35,0.3)] transition-all duration-500"
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
