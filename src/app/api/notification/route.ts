import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma";
import * as z from "zod";
import { NotificationType } from "@/types/notification";

const notificationSchema = z.object({
    type: z.nativeEnum(NotificationType),
    releaseNumber: z.number().optional(),
    update: z.string().optional(),
    personName: z.string().optional(),
}).refine(data => {
    if (data.type === NotificationType.PLATFORM_UPDATE) {
        return data.releaseNumber !== undefined && data.update !== undefined;
    } else {
        return data.personName !== undefined;
    }
}, {
    message: "Either releaseNumber and update should not be empty for PLATFORM_UPDATE, or personName for other types"
});

export async function GET(_request: Request) {
    const notifications = await prisma.notification.findMany({where: {read: false}});
    return NextResponse.json(notifications);
}

export async function POST(request: Request) {
    const data = await request.json();
    try {
        const transformedData = notificationSchema.parse(data);
        await prisma.notification.create({
            data: transformedData
        });
        return NextResponse.json({ message: "Notification created" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: `Failed to create notification: ${error}` }, { status: 500 });
    }
}
