export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import EventForm from "./EventForm";
import GalleryUploadForm from "./GalleryUploadForm";
import { LogoutButton } from "@/components/logout-button";

export default async function AdminDashboardPage() {
    const events = await prisma.event.findMany({
        include: { media: true },
        orderBy: { createdAt: "desc" },
    });

    const eventOptions = events.map((e) => ({ id: e.id, title: e.title }));

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Admin Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage your hackathon events
                        </p>
                    </div>
                    <LogoutButton />
                </div>

                {/* Two-section forms */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    {/* Section A: Create New Event */}
                    <EventForm />

                    {/* Section B: Update Event Gallery */}
                    <GalleryUploadForm events={eventOptions} />
                </div>

                {/* Events List */}
                <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        All Events
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({events.length})
                        </span>
                    </h2>

                    {events.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
                            <p className="text-sm text-muted-foreground">
                                No events yet. Create your first event above.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {events.map((event) => {
                                const flyerCount = event.media.filter(
                                    (m) => m.type === "FLYER",
                                ).length;
                                const galleryCount = event.media.filter(
                                    (m) => m.type === "GALLERY",
                                ).length;

                                return (
                                    <div
                                        key={event.id}
                                        className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/50"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-sm font-medium text-card-foreground truncate">
                                                        {event.title}
                                                    </h3>
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${event.status === "UPCOMING"
                                                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                                            : "bg-muted text-muted-foreground"
                                                            }`}
                                                    >
                                                        {event.status}
                                                    </span>
                                                    {!event.isPublished && (
                                                        <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                                                            Draft
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                    <span>
                                                        {new Date(event.date).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                    <span>·</span>
                                                    <span>{event.location}</span>
                                                    {(flyerCount > 0 || galleryCount > 0) && (
                                                        <>
                                                            <span>·</span>
                                                            <span>
                                                                {flyerCount > 0 &&
                                                                    `${flyerCount} flyer${flyerCount !== 1 ? "s" : ""}`}
                                                                {flyerCount > 0 && galleryCount > 0 && ", "}
                                                                {galleryCount > 0 &&
                                                                    `${galleryCount} gallery`}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            {event.registrationLink && (
                                                <a
                                                    href={event.registrationLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                                                >
                                                    Registration ↗
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
