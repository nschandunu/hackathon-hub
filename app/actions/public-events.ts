"use server";

import { prisma } from "@/lib/db";

export async function getUpcomingEvents() {
    return prisma.event.findMany({
        where: {
            status: "UPCOMING",
            isPublished: true,
        },
        include: {
            media: {
                where: { type: "FLYER" },
            },
        },
        orderBy: { date: "asc" },
    });
}

export async function getPastEvents() {
    return prisma.event.findMany({
        where: {
            status: "PAST",
            isPublished: true,
        },
        include: {
            media: {
                where: { type: "GALLERY" },
            },
        },
        orderBy: { date: "desc" },
    });
}

export async function getAllEvents() {
    return prisma.event.findMany({
        where: {
            isPublished: true,
        },
        include: {
            media: true,
        },
        orderBy: { date: "desc" },
    });
}

export type UpcomingEvent = Awaited<ReturnType<typeof getUpcomingEvents>>[number];
export type PastEvent = Awaited<ReturnType<typeof getPastEvents>>[number];
export type EventWithMedia = Awaited<ReturnType<typeof getAllEvents>>[number];
