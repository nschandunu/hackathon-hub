"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export type ContactActionState = {
    success: boolean;
    error?: string;
};

type ContactFormInput = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

function validateContactForm(data: ContactFormInput): string | null {
    const { name, email, subject, message } = data;

    if (!name || name.trim().length === 0) {
        return "Name is required.";
    }
    if (!email || email.trim().length === 0) {
        return "Email is required.";
    }
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return "Please enter a valid email address.";
    }
    if (!subject || subject.trim().length === 0) {
        return "Subject is required.";
    }
    if (!message || message.trim().length === 0) {
        return "Message is required.";
    }

    return null; // No validation errors
}

export async function submitContactForm(
    data: ContactFormInput,
): Promise<ContactActionState> {
    try {
        const validationError = validateContactForm(data);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const { name, email, subject, message } = data;

        await prisma.contactMessage.create({
            data: {
                name: name.trim(),
                email: email.trim(),
                subject: subject.trim(),
                message: message.trim(),
            },
        });

        revalidatePath("/admin/messages");

        return { success: true };
    } catch (err) {
        console.error("Failed to submit contact form:", err);
        return {
            success: false,
            error:
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again.",
        };
    }
}
