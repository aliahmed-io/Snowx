"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function markAlertAsRead(id: string) {
    await db.alert.update({
        where: { id },
        data: { isRead: true }
    });
    revalidatePath("/admin/alerts");
}

export async function dismissAlert(id: string) {
    await db.alert.delete({
        where: { id }
    });
    revalidatePath("/admin/alerts");
}

export async function createAlert(data: {
    type: string;
    severity: string;
    message: string;
    metadata?: object;
}) {
    const alert = await db.alert.create({
        data: {
            type: data.type,
            severity: data.severity,
            message: data.message,
            metadata: data.metadata
        }
    });
    revalidatePath("/admin/alerts");
    return alert;
}
