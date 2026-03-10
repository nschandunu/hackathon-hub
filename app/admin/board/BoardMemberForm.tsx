"use client";

import { useActionState, useRef, useEffect } from "react";
import { createBoardMember, type BoardActionState } from "@/app/actions/admin-board";

const initialState: BoardActionState = { success: false };

export default function BoardMemberForm() {
    const [state, formAction, isPending] = useActionState(createBoardMember, initialState);
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
                Add Board Member
            </h2>

            {state.error && (
                <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                    <p className="text-sm text-destructive">{state.error}</p>
                </div>
            )}

            {state.success && (
                <div className="mb-6 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3">
                    <p className="text-sm text-green-600 dark:text-green-400">
                        Board member added successfully!
                    </p>
                </div>
            )}

            <form ref={formRef} action={formAction} className="space-y-5">
                {/* Name & Position */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className={labelClass}>
                            Name <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            disabled={isPending}
                            placeholder='e.g. "Jane Doe"'
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label htmlFor="position" className={labelClass}>
                            Position <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="position"
                            name="position"
                            type="text"
                            required
                            disabled={isPending}
                            placeholder='e.g. "President"'
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className={labelClass}>
                        Description <span className="text-destructive">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        required
                        disabled={isPending}
                        placeholder="Tell us about this member..."
                        className={`${inputClass} resize-none`}
                    />
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="linkedin" className={labelClass}>
                            LinkedIn URL
                        </label>
                        <input
                            id="linkedin"
                            name="linkedin"
                            type="url"
                            disabled={isPending}
                            placeholder="https://linkedin.com/in/..."
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label htmlFor="github" className={labelClass}>
                            GitHub URL
                        </label>
                        <input
                            id="github"
                            name="github"
                            type="url"
                            disabled={isPending}
                            placeholder="https://github.com/..."
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label htmlFor="twitter" className={labelClass}>
                            X (Twitter) URL
                        </label>
                        <input
                            id="twitter"
                            name="twitter"
                            type="url"
                            disabled={isPending}
                            placeholder="https://x.com/..."
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Image and Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="image" className={labelClass}>
                            Profile Picture <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            required
                            disabled={isPending}
                            className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer file:transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="order" className={labelClass}>
                            Display Order (Lower comes first)
                        </label>
                        <input
                            id="order"
                            name="order"
                            type="number"
                            defaultValue={0}
                            disabled={isPending}
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center gap-2">
                    <input
                        id="featured"
                        name="featured"
                        type="checkbox"
                        disabled={isPending}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-foreground">
                        Featured (Shows up larger or prominently)
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full sm:w-auto rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isPending && (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    )}
                    {isPending ? "Adding Member…" : "Add Board Member"}
                </button>
            </form>
        </div>
    );
}
