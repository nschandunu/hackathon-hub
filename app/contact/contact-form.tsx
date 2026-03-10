"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { submitContactForm } from "@/app/actions/contact-actions";

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            subject: formData.get("subject") as string,
            message: formData.get("message") as string,
        };

        const result = await submitContactForm(data);

        setIsSubmitting(false);

        if (result.success) {
            setSuccess(true);
            (e.target as HTMLFormElement).reset();
        } else {
            setErrorMsg(result.error || "An error occurred. Please try again.");
        }
    }

    return (
        <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 lg:p-10">
            {/* Subtle top accent */}
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {success ? (
                <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-2">
                        Message Sent!
                    </h2>
                    <p className="text-white/60 mb-8 max-w-[250px] mx-auto">
                        Thank you, we'll get back to you soon!
                    </p>
                    <button
                        onClick={() => setSuccess(false)}
                        className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        Send another message
                    </button>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-semibold text-white mb-1">
                        Send us a message
                    </h2>
                    <p className="text-white/40 text-sm mb-8">
                        For sponsorships, partnerships, or any specific inquiry.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errorMsg && (
                            <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl">
                                {errorMsg}
                            </div>
                        )}
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-black font-semibold px-6 py-3.5 transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_30px_-6px_rgba(255,255,255,0.25)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
                            {isSubmitting ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
