export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import BoardMemberForm from "./BoardMemberForm";
import { deleteBoardMember } from "@/app/actions/admin-board";

export default async function AdminBoardPage() {
    const boardMembers = await prisma.boardMember.findMany({
        orderBy: { order: "asc" },
    });

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <Link
                            href="/admin"
                            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Board Members
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage the society's board members for the About page
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <LogoutButton />
                    </div>
                </div>

                {/* Form to Create New Member */}
                <div className="mb-10">
                    <BoardMemberForm />
                </div>

                {/* List of Board Members */}
                <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Current Board Members
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({boardMembers.length})
                        </span>
                    </h2>

                    {boardMembers.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
                            <p className="text-sm text-muted-foreground">
                                No board members added yet. Add your first one above.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {boardMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/50"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Avatar / Image Thumbnail */}
                                        <div className="h-12 w-12 shrink-0 rounded-full bg-muted overflow-hidden">
                                            <img
                                                src={member.imageUrl}
                                                alt={member.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-medium text-card-foreground">
                                                    {member.name}
                                                </h3>
                                                {member.featured && (
                                                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                <span>{member.position}</span>
                                                <span>·</span>
                                                <span>Order: {member.order}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <form action={async () => {
                                        "use server";
                                        await deleteBoardMember(member.id);
                                    }}>
                                        <button
                                            type="submit"
                                            className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                                            title="Delete Member"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
