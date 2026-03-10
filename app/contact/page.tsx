import Navbar from "@/components/Navbar";
import ClientLoader from "@/components/ClientLoader";
import { Send, Mail } from "lucide-react";
import Link from "next/link";
import { MessageSquare, MessageCircle, ArrowRight } from "lucide-react";

export default function Contact() {
    return (
        <>
            <ClientLoader />
            <Navbar />

            <main className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
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

                <div className="flex-1 w-full flex flex-col items-center">
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

                        {/* ─── Right Column: Contact Form ─── */}
                        <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 lg:p-10">
                            {/* Subtle top accent */}
                            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            <h2 className="text-2xl font-semibold text-white mb-1">
                                Send us a message
                            </h2>
                            <p className="text-white/40 text-sm mb-8">
                                For sponsorships, partnerships, or any specific inquiry.
                            </p>

                            <form className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="contact-name"
                                        className="block text-sm font-medium text-white/60 mb-1.5"
                                    >
                                        Name
                                    </label>
                                    <input
                                        id="contact-name"
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Your full name"
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/25 transition-all duration-300 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white/[0.06] hover:border-white/[0.14]"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="contact-email"
                                        className="block text-sm font-medium text-white/60 mb-1.5"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="contact-email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/25 transition-all duration-300 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white/[0.06] hover:border-white/[0.14]"
                                    />
                                </div>

                                {/* Subject Category */}
                                <div>
                                    <label
                                        htmlFor="contact-subject"
                                        className="block text-sm font-medium text-white/60 mb-1.5"
                                    >
                                        Subject
                                    </label>
                                    <select
                                        id="contact-subject"
                                        name="subject"
                                        required
                                        defaultValue=""
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-white appearance-none transition-all duration-300 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white/[0.06] hover:border-white/[0.14] [&>option]:bg-neutral-900 [&>option]:text-white"
                                    >
                                        <option value="" disabled className="text-white/25">
                                            Select a category…
                                        </option>
                                        <option value="general">General Question</option>
                                        <option value="sponsorship">Sponsorship</option>
                                        <option value="partnership">Event Partnership</option>
                                        <option value="feedback">Website Feedback</option>
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label
                                        htmlFor="contact-message"
                                        className="block text-sm font-medium text-white/60 mb-1.5"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        required
                                        rows={4}
                                        placeholder="Tell us what's on your mind…"
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/25 resize-y min-h-[120px] transition-all duration-300 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white/[0.06] hover:border-white/[0.14]"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-black font-semibold px-6 py-3.5 transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_30px_-6px_rgba(255,255,255,0.25)] active:scale-[0.98]"
                                >
                                    <Send className="w-4 h-4" />
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}