import { prisma } from "@/lib/db";

export async function getBoardMembers() {
    try {
        const members = await prisma.boardMember.findMany({
            orderBy: {
                order: 'asc'
            }
        });
        return members;
    } catch (error) {
        console.error("Failed to fetch board members:", error);
        return [];
    }
}
