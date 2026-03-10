"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { MediaType } from "@/lib/generated/prisma/client";

export type ActionState = {
    success: boolean;
    error?: string;
};

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function uploadFile(
    supabase: Awaited<ReturnType<typeof createClient>>,
    file: File,
    eventSlug: string,
): Promise<string> {
    const ext = file.name.split(".").pop();
    const fileName = `${eventSlug}/${crypto.randomUUID()}.${ext}`;

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

    return publicUrl;
}

export async function createEvent(
    _prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    try {
        const title = formData.get("title") as string;
        const description = (formData.get("description") as string) || undefined;
        const date = formData.get("date") as string;
        const location = formData.get("location") as string;
        const registrationLink =
            (formData.get("registrationLink") as string) || undefined;
        const flyers = formData.getAll("flyers") as File[];
        const gallery = formData.getAll("gallery") as File[];

        if (!title || !date || !location) {
            return { success: false, error: "Title, date, and location are required." };
        }

        const slug = slugify(title) + "-" + Date.now().toString(36);
        const supabase = await createClient();

        // Upload flyers
        const flyerUrls: string[] = [];
        for (const file of flyers) {
            if (file.size > 0) {
                const url = await uploadFile(supabase, file, slug);
                flyerUrls.push(url);
            }
        }

        // Upload gallery images
        const galleryUrls: string[] = [];
        for (const file of gallery) {
            if (file.size > 0) {
                const url = await uploadFile(supabase, file, slug);
                galleryUrls.push(url);
            }
        }

        // Create event with nested media records
        await prisma.event.create({
            data: {
                title,
                slug,
                description,
                date: new Date(date),
                location,
                registrationLink,
                media: {
                    create: [
                        ...flyerUrls.map((url) => ({ url, type: MediaType.FLYER })),
                        ...galleryUrls.map((url) => ({ url, type: MediaType.GALLERY })),
                    ],
                },
            },
        });

        revalidatePath("/admin");
        return { success: true };
    } catch (err) {
        console.error("Failed to create event:", err);
        return {
            success: false,
            error: err instanceof Error ? err.message : "Something went wrong.",
        };
    }
}
