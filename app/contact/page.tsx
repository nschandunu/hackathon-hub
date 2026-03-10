'use client';

import Navbar from "@/components/Navbar";
import ClientLoader from "@/components/ClientLoader";
import { Send, Mail, MessageSquare, MessageCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { submitContactForm } from "@/app/actions/contact-actions";
// Note: Hardcoding the enum values here or fetching from Prisma isn't directly possible in a "use client" file 
// without passing it as a prop from a server component. We'll use the raw strings that map to the Prisma enum.
// The prisma enum is: GENERAL, SPONSORSHIP, PARTNERSHIP, FEEDBACK

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');
        
        try {
            const result = await submitContactForm(formData);
            if (result.success) {
                setSubmitStatus('success');
                formRef.current?.reset();
            } else {
                setSubmitStatus('error');
                setErrorMessage(result.error || 'Something went wrong.');
            }
        } catch (error) {
            setSubmitStatus('error');
            setErrorMessage('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <ClientLoader />
            <Navbar />

            <main className="min-h-screen flex flex-col bg-zinc-950 text-zinc-200 selection:bg-indigo-500/30 selection:text-white pb-20">
                {/* Simplified Animations */}
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-5px); }
                    }
                    .animate-float {
                        animation: float 3s ease-in-out infinite;
                    }
                `}</style>
                
                {/* Background Grid */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
                </div>

                <div className="relative z-10 flex-1 w-full flex flex-col items-center pt-32 px-6">
                    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">
                        
                        {/* ─── Left Column: Details & Links ─── */}
                        <div className="flex flex-col gap-8">
                            <div>
                                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-6">
                                    Let's Talk.
                                </h1>
                                <p className="text-lg text-zinc-400 leading-relaxed max-w-md">
                                    Have a question, want to sponsor us, or just want to say hi? Reach out using the form, or connect with us directly on our community channels.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 mt-4">
                                {/* Discord */}
                                <Link 
                                    href="#"
                                    className="group relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-indigo-500/50"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
                                        <MessageSquare className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white">Join our Discord</h3>
                                        <p className="text-sm text-zinc-400">Connect with the community</p>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-zinc-500 transition-all group-hover:translate-x-1 group-hover:text-white mr-2" />
                                </Link>

                                {/* WhatsApp */}
                                <Link 
                                    href="#"
                                    className="group relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-emerald-500/50"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                                        <MessageCircle className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white">WhatsApp Updates</h3>
                                        <p className="text-sm text-zinc-400">Get real-time announcements</p>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-zinc-500 transition-all group-hover:translate-x-1 group-hover:text-white mr-2" />
                                </Link>

                                {/* Email */}
                                <a 
                                    href="mailto:organizers@hackathonhub.com"
                                    className="group relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-rose-500/50"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 transition-colors group-hover:bg-rose-500 group-hover:text-white">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white">Direct Email</h3>
                                        <p className="text-sm text-zinc-400">organizers@hackathonhub.com</p>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-zinc-500 transition-all group-hover:translate-x-1 group-hover:text-white mr-2" />
                                </a>
                            </div>
                        </div>

                        {/* ─── Right Column: Form ─── */}
                        <div className="w-full max-w-lg mx-auto lg:mx-0">
                            <div className="rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-md p-8 shadow-2xl relative overflow-hidden">
                                {/* Decor */}
                                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/20 blur-[60px] pointer-events-none"></div>
                                
                                {submitStatus === 'success' ? (
                                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center animate-in fade-in zoom-in duration-500">
                                        <div className="h-20 w-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-float">
                                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                        <p className="text-zinc-400 mb-8">
                                            Thanks for reaching out. We'll get back to you as soon as possible.
                                        </p>
                                        <button 
                                            onClick={() => setSubmitStatus('idle')}
                                            className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-5">
                                        <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
                                        
                                        {submitStatus === 'error' && (
                                            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                                                {errorMessage}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <label htmlFor="name" className="text-sm font-medium text-zinc-400">Name</label>
                                                <input 
                                                    id="name"
                                                    name="name"
                                                    type="text" 
                                                    required
                                                    className="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-white placeholder-zinc-600 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label htmlFor="email" className="text-sm font-medium text-zinc-400">Email</label>
                                                <input 
                                                    id="email"
                                                    name="email"
                                                    type="email" 
                                                    required
                                                    className="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-white placeholder-zinc-600 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label htmlFor="category" className="text-sm font-medium text-zinc-400">Subject</label>
                                            <select 
                                                id="category"
                                                name="category"
                                                required
                                                defaultValue="GENERAL"
                                                className="w-full appearance-none rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-white outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [&>option]:bg-zinc-900"
                                            >
                                                <option value="GENERAL">General Inquiry</option>
                                                <option value="SPONSORSHIP">Sponsorship</option>
                                                <option value="PARTNERSHIP">Partnership</option>
                                                <option value="FEEDBACK">Feedback</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label htmlFor="message" className="text-sm font-medium text-zinc-400">Message</label>
                                            <textarea 
                                                id="message"
                                                name="message"
                                                rows={5}
                                                required
                                                className="w-full resize-none rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-white placeholder-zinc-600 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                placeholder="How can we help you?"
                                            />
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </>
    );
}