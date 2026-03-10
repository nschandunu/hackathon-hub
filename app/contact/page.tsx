import Navbar from "@/components/Navbar";
import ContactForm from "./contact-form";
import LiquidEther from "@/components/LiquidEther";


import { Send, Mail } from "lucide-react";
import Link from "next/link";
import { MessageSquare, MessageCircle, ArrowRight } from "lucide-react";

export default function Contact() {
    return (
        <>
            
            <Navbar />

            <main className="relative min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-15">
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
                <style>{`
                    @keyframes float-bounce {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-8px); }
                    }
                    @keyframes pulse-glow {
                        0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); }
                        50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.4); }
                    }
                    @keyframes pulse-glow-emerald {
                        0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.2); }
                        50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.4); }
                    }
                    @keyframes shake {
                        0%, 100% { transform: rotate(0deg); }
                        25% { transform: rotate(-2deg); }
                        75% { transform: rotate(2deg); }
                    }
                    .animate-float-bounce {
                        animation: float-bounce 2s ease-in-out infinite;
                    }
                    .animate-pulse-glow-icon {
                        animation: pulse-glow 2s ease-in-out infinite;
                    }
                    .animate-pulse-glow-icon-emerald {
                        animation: pulse-glow-emerald 2s ease-in-out infinite;
                    }
                    .animate-mini-shake {
                        animation: shake 0.5s ease-in-out infinite;
                    }
                `}</style>

                <div className="relative z-10 flex-1 w-full flex flex-col items-center">
                    {/* ── Hero Header ── */}
                    <section className="w-full pt-32 pb-16 px-6 text-center relative overflow-hidden">
                        {/* Ambient glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-indigo-500/15 via-transparent to-transparent pointer-events-none animate-pulse-glow" />

                        <h1 className="relative text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                            Get in Touch
                        </h1>
                        <p className="relative mt-5 max-w-xl mx-auto text-lg md:text-xl text-white/50 leading-relaxed">
                            Have questions about the hackathon? Want to partner with us or need
                            help getting started? Reach out — our organising team is always
                            happy to help.
                        </p>
                    </section>

                    {/* ── Content Grid ── */}
                    <section className="w-full max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* ─── Left Column: Community Cards ─── */}
                        <div className="flex flex-col gap-6">
                            {/* Discord Card */}
                            <Link
                                href="#"
                                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 transition-all duration-500 hover:border-indigo-500/30 hover:bg-indigo-500/[0.04] hover:shadow-[0_0_40px_-12px_rgba(99,102,241,0.25)] overflow-hidden"
                            >
                                {/* Hover gradient wash */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/[0.06] group-hover:via-transparent group-hover:to-indigo-400/[0.03] transition-all duration-700 pointer-events-none" />

                                <div className="relative flex items-start gap-5">
                                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:border-indigo-400/30 transition-all duration-500 group-hover:animate-pulse-glow-icon">
                                        <MessageSquare className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300 animate-float-bounce" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-xl font-semibold text-white group-hover:text-indigo-100 transition-colors duration-300">
                                                Join our Discord
                                            </h3>
                                            <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300" />
                                        </div>
                                        <p className="text-white/40 leading-relaxed group-hover:text-white/55 transition-colors duration-300">
                                            The best place to find teammates and get live help from
                                            mentors. Join hundreds of hackers already in the
                                            community.
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom accent line */}
                                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/40 transition-all duration-700" />
                            </Link>

                            {/* WhatsApp Community Card */}
                            <Link
                                href="#"
                                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 transition-all duration-500 hover:border-emerald-500/30 hover:bg-emerald-500/[0.04] hover:shadow-[0_0_40px_-12px_rgba(16,185,129,0.25)] overflow-hidden"
                            >
                                {/* Hover gradient wash */}
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/[0.06] group-hover:via-transparent group-hover:to-emerald-400/[0.03] transition-all duration-700 pointer-events-none" />

                                <div className="relative flex items-start gap-5">
                                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-400/30 transition-all duration-500 group-hover:animate-pulse-glow-icon-emerald">
                                        <MessageCircle className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300 animate-mini-shake" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-xl font-semibold text-white group-hover:text-emerald-100 transition-colors duration-300">
                                                WhatsApp Community
                                            </h3>
                                            <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" />
                                        </div>
                                        <p className="text-white/40 leading-relaxed group-hover:text-white/55 transition-colors duration-300">
                                            Instant announcements and quick chats. Get real-time
                                            updates and connect with participants on the go.
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom accent line */}
                                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/40 transition-all duration-700" />
                            </Link>
                        </div>

                        <ContactForm />
                    </section>
                </div>
            </main>
        </>
    );
}