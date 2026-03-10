"use client";

import { useState } from "react";
import { markMessageAsRead } from "@/app/actions/contact-actions";
import { ContactMessage } from "@/lib/generated/prisma/client";

export default function MessagesClient({ initialMessages }: { initialMessages: ContactMessage[] }) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    async function handleMarkAsRead(id: string) {
        await markMessageAsRead(id);
    }

    if (initialMessages.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
                <p className="text-sm text-muted-foreground">
                    No messages yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {initialMessages.map((message) => {
                const isExpanded = expandedId === message.id;
                const dateFormatted = new Date(message.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                });

                return (
                    <div
                        key={message.id}
                        className={`rounded-xl border transition-all ${message.isRead
                                ? "border-border bg-card hover:bg-accent/50 text-muted-foreground"
                                : "border-indigo-500/50 bg-indigo-500/[0.03] hover:bg-indigo-500/[0.05] shadow-[0_0_15px_-3px_rgba(99,102,241,0.1)]"
                            }`}
                    >
                        <div
                            className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            onClick={() => setExpandedId(isExpanded ? null : message.id)}
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3
                                        className={`truncate ${message.isRead ? "text-sm font-medium" : "text-base font-bold text-foreground"
                                            }`}
                                    >
                                        {message.name}
                                    </h3>
                                    {!message.isRead && (
                                        <span className="inline-flex items-center rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-400">
                                            New
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                                    <span className="truncate max-w-[200px]">{message.email}</span>
                                    <span>·</span>
                                    <span>{dateFormatted}</span>
                                </div>
                                <div className={`mt-2 text-sm ${message.isRead ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                                    Subject: {message.subject}
                                </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-3">
                                {!message.isRead && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMarkAsRead(message.id);
                                        }}
                                        className="rounded-lg bg-indigo-500 text-white px-3 py-1.5 text-xs font-medium hover:bg-indigo-600 transition-colors"
                                    >
                                        Mark as Read
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Expandable Message Content */}
                        {isExpanded && (
                            <div className="px-5 pb-5 pt-2 border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
                                <div className="rounded-lg bg-black/20 p-4 text-sm whitespace-pre-wrap leading-relaxed">
                                    {message.message}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
