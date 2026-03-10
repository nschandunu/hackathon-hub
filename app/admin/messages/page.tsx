import { prisma } from "@/lib/db";
import { LogoutButton } from "@/components/logout-button";
import MessagesClient from "./messages-client";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
    const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Messages
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Review and manage contact submissions
                        </p>
                    </div>
                    <LogoutButton />
                </div>

                {/* Main Client Content */}
                <MessagesClient initialMessages={messages} />
            </div>
        </div>
    );
}
