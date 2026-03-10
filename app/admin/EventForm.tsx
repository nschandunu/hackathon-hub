"use client";

import { useActionState, useRef, useEffect } from "react";
import { createEvent, type ActionState } from "./actions";

const initialState: ActionState = { success: false };

export default function EventForm() {
    const [state, formAction, isPending] = useActionState(createEvent, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.success) {
            formRef.current?.reset();
        }
    }, [state]);

    const inputClass =
        "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-shadow disabled:opacity-50";

    const labelClass = "block text-sm font-medium text-foreground mb-1.5";

    return (
        <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-6">
                Create New Event
            </h2>

            {state.error && (
                <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                    <p className="text-sm text-destructive">{state.error}</p>
                </div>
            )}

            {state.success && (
                <div className="mb-6 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3">
                    <p className="text-sm text-green-600 dark:text-green-400">
                        Event created successfully!
                    </p>
                </div>
            )}

            <form ref={formRef} action={formAction} className="space-y-5">
                {/* Title & Location row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="title" className={labelClass}>
                            Title <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            required
                            disabled={isPending}
                            placeholder='e.g. "UpsideDown CTF"'
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className={labelClass}>
                            Location <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            required
                            disabled={isPending}
                            placeholder="e.g. Main Auditorium"
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Date & Registration Link row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className={labelClass}>
                            Date <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="date"
                            name="date"
                            type="datetime-local"
                            required
                            disabled={isPending}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label htmlFor="registrationLink" className={labelClass}>
                            Registration Link
                        </label>
                        <input
                            id="registrationLink"
                            name="registrationLink"
                            type="url"
                            disabled={isPending}
                            placeholder="https://..."
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className={labelClass}>
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        disabled={isPending}
                        placeholder="Tell people about this event..."
                        className={`${inputClass} resize-none`}
                    />
                </div>

                {/* File uploads */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="flyers" className={labelClass}>
                            Flyers
                        </label>
                        <input
                            id="flyers"
                            name="flyers"
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={isPending}
                            className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer file:transition-colors"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                            Event flyer images
                        </p>
                    </div>
                    <div>
                        <label htmlFor="gallery" className={labelClass}>
                            Gallery Images
                        </label>
                        <input
                            id="gallery"
                            name="gallery"
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={isPending}
                            className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer file:transition-colors"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                            Photos from the event
                        </p>
                    </div>
                </div>

                {/* Submit */}
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
                    {isPending ? "Creating…" : "Create Event"}
                </button>
            </form>
        </div>
    );
}
