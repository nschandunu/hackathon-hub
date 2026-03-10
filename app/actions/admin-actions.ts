"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { MediaType, EventStatus } from "@/lib/generated/prisma/client";

export type ActionState = {
    success: boolean;
    error?: string;
};

export async function addGalleryImages(
    _prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    try {
        const eventId = formData.get("eventId") as string;
        const images = formData.getAll("images") as File[];

        if (!eventId) {
            return { success: false, error: "Please select an event." };
        }

        const validFiles = images.filter((f) => f.size > 0);
        if (validFiles.length === 0) {
            return { success: false, error: "Please select at least one image." };
        }

        // Look up the event to get the slug for the storage path
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { slug: true },
        });

        if (!event) {
            return { success: false, error: "Event not found." };
        }

        const supabase = await createClient();
        const uploadedUrls: string[] = [];

        for (const file of validFiles) {
            const ext = file.name.split(".").pop();
            const fileName = `${event.slug}/${crypto.randomUUID()}.${ext}`;

            const { error } = await supabase.storage
                .from("event-media")
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (error) throw new Error(`Upload failed: ${error.message}`);

            const {
                data: { publicUrl },
            } = supabase.storage.from("event-media").getPublicUrl(fileName);

            uploadedUrls.push(publicUrl);
        }

        // Create Media records and optionally mark event as PAST
        await prisma.$transaction([
            prisma.media.createMany({
                data: uploadedUrls.map((url) => ({
                    url,
                    type: MediaType.GALLERY,
                    eventId,
                })),
            }),
            prisma.event.update({
                where: { id: eventId },
                data: { status: EventStatus.PAST },
            }),
        ]);

        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true };
    } catch (err) {
        console.error("Failed to add gallery images:", err);
        return {
            success: false,
            error: err instanceof Error ? err.message : "Something went wrong.",
        };
    }
}

export async function updateEventThumbnail(
    eventId: string,
    formData: FormData,
): Promise<ActionState> {
    try {
        if (!eventId) {
            return { success: false, error: "Event ID is required." };
        }

        const file = formData.get("thumbnail") as File | null;
        if (!file || file.size === 0) {
            return { success: false, error: "Please select an image file." };
        }

        // Look up the event to get the slug for the storage path
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { slug: true },
        });

        if (!event) {
            return { success: false, error: "Event not found." };
        }

        const supabase = await createClient();

        const ext = file.name.split(".").pop();
        const fileName = `${event.slug}/thumbnail-${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from("event-media")
            .upload(fileName, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from("event-media").getPublicUrl(fileName);

        await prisma.event.update({
            where: { id: eventId },
            data: { thumbnailUrl: publicUrl },
        });

        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true };
    } catch (err) {
        console.error("Failed to update event thumbnail:", err);
        return {
            success: false,
            error: err instanceof Error ? err.message : "Something went wrong.",
        };
    }
}
