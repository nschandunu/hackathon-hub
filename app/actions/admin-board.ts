"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export type BoardActionState = {
    success: boolean;
    error?: string;
};

export async function createBoardMember(
    _prevState: BoardActionState,
    formData: FormData,
): Promise<BoardActionState> {
    try {
        const name = formData.get("name") as string;
        const position = formData.get("position") as string;
        const description = formData.get("description") as string;
        const linkedin = formData.get("linkedin") as string;
        const twitter = formData.get("twitter") as string;
        const github = formData.get("github") as string;
        const featured = formData.get("featured") === "on";
        const order = parseInt((formData.get("order") as string) || "0", 10);
        const image = formData.get("image") as File;

        if (!name || !position || !description || !image || image.size === 0) {
            return { success: false, error: "Name, position, description, and image are required." };
        }

        const supabase = await createClient();
        const ext = image.name.split(".").pop();
        const fileName = `board-members/${Date.now()}-${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from("event-media")
            .upload(fileName, image, {
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from("event-media").getPublicUrl(fileName);

        await prisma.boardMember.create({
            data: {
                name,
                position,
                description,
                linkedin: linkedin || null,
                twitter: twitter || null,
                github: github || null,
                featured,
                order,
                imageUrl: publicUrl,
            },
        });

        revalidatePath("/admin/board");
        revalidatePath("/about");
        return { success: true };
    } catch (err) {
        console.error("Failed to create board member:", err);
        return {
            success: false,
            error: err instanceof Error ? err.message : "Something went wrong.",
        };
    }
}

export async function deleteBoardMember(id: string): Promise<BoardActionState> {
    try {
        await prisma.boardMember.delete({ where: { id } });

        revalidatePath("/admin/board");
        revalidatePath("/about");
        return { success: true };
    } catch (err) {
        console.error("Failed to delete board member:", err);
        return {
            success: false,
            error: err instanceof Error ? err.message : "Something went wrong.",
        };
    }
}
