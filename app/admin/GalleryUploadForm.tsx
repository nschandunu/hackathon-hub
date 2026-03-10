"use client";

import { useActionState } from "react";
import { addGalleryImages, type ActionState } from "@/app/actions/admin-actions";

const initialState: ActionState = { success: false };

type EventOption = {
    id: string;
    title: string;
};

export default function GalleryUploadForm({
    events,
}: {
    events: EventOption[];
}) {
    const [state, formAction, isPending] = useActionState(
        addGalleryImages,
        initialState,
    );

    const inputClass =
        "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-shadow disabled:opacity-50";

    return (
        <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-6">
                Update Event Gallery
            </h2>

            {state.error && (
                <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                    <p className="text-sm text-destructive">{state.error}</p>
                </div>
            )}

            {state.success && (
                <div className="mb-6 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3">
                    <p className="text-sm text-green-600 dark:text-green-400">
                        Gallery images added successfully! Event marked as past.
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
                            htmlFor="eventId"
                            className="block text-sm font-medium text-foreground mb-1.5"
                        >
                            Select Event <span className="text-destructive">*</span>
                        </label>
                        <select
                            id="eventId"
                            name="eventId"
                            required
                            disabled={isPending}
                            className={inputClass}
                        >
                            <option value="">Choose an event…</option>
                            {events.map((event) => (
                                <option key={event.id} value={event.id}>
                                    {event.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="images"
                            className="block text-sm font-medium text-foreground mb-1.5"
                        >
                            Gallery Photos <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="images"
                            name="images"
                            type="file"
                            accept="image/*"
                            multiple
                            required
                            disabled={isPending}
                            className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer file:transition-colors"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                            Select multiple photos from the event
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
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
                        {isPending ? "Uploading…" : "Upload Gallery Images"}
                    </button>
                </form>
            )}
        </div>
    );
}
