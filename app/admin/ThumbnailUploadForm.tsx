"use client";

import { useState } from "react";
import { useActionState } from "react";
import { updateEventThumbnail, type ActionState } from "@/app/actions/admin-actions";

const initialState: ActionState = { success: false };

type EventOption = {
    id: string;
    title: string;
    thumbnailUrl: string | null;
};

export default function ThumbnailUploadForm({
    events,
}: {
    events: EventOption[];
}) {
    const [selectedEventId, setSelectedEventId] = useState("");

    const boundAction = async (_prevState: ActionState, formData: FormData) => {
        return updateEventThumbnail(selectedEventId, formData);
    };

    const [state, formAction, isPending] = useActionState(
        boundAction,
        initialState,
    );

    const selectedEvent = events.find((e) => e.id === selectedEventId);

    const inputClass =
        "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-shadow disabled:opacity-50";

    return (
        <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-1">
                Update Main Event Flyer (Thumbnail)
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
                This image will be used as the main display card for the event.
            </p>

            {state.error && (
                <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                    <p className="text-sm text-destructive">{state.error}</p>
                </div>
            )}

            {state.success && (
                <div className="mb-6 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3">
                    <p className="text-sm text-green-600 dark:text-green-400">
                        Thumbnail updated successfully!
                    </p>
                </div>
            )}

            {events.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No events available. Create an event first.
                </p>
            ) : (
                <form action={formAction} className="space-y-5">
                    <div>
                        <label
                            htmlFor="thumbnailEventId"
                            className="block text-sm font-medium text-foreground mb-1.5"
                        >
                            Select Event <span className="text-destructive">*</span>
                        </label>
                        <select
                            id="thumbnailEventId"
                            name="thumbnailEventId"
                            required
                            disabled={isPending}
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            className={inputClass}
                        >
                            <option value="">Choose an event…</option>
                            {events.map((event) => (
                                <option key={event.id} value={event.id}>
                                    {event.title}
                                    {event.thumbnailUrl ? " ✓ (has thumbnail)" : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Thumbnail preview for the selected event */}
                    {selectedEvent?.thumbnailUrl && (
                        <div className="rounded-lg border border-border bg-accent/30 p-3">
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                                Current thumbnail
                            </p>
                            <img
                                src={selectedEvent.thumbnailUrl}
                                alt={`${selectedEvent.title} thumbnail`}
                                className="h-32 w-auto rounded-md object-cover border border-border"
                            />
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="thumbnail"
                            className="block text-sm font-medium text-foreground mb-1.5"
                        >
                            Thumbnail Image <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="thumbnail"
                            name="thumbnail"
                            type="file"
                            accept="image/*"
                            required
                            disabled={isPending}
                            className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer file:transition-colors"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                            Recommended: 16:9 aspect ratio, at least 800×450px
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending || !selectedEventId}
                        className="w-full sm:w-auto rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isPending && (
                            <svg
                                className="animate-spin h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                        )}
                        {isPending ? "Uploading…" : "Upload Thumbnail"}
                    </button>
                </form>
            )}
        </div>
    );
}
