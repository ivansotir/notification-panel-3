import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma";

export async function PUT(request: Request) {
    const { id } = await request.json();
    await prisma.notification.update({where: {id}, data: {read: true}});
    return NextResponse.json({ message: "Notification read" });
}