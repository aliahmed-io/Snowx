"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { AccountStatus } from "@prisma/client";

export async function createAccount(data: {
    productId: string;
    serviceType: string;
    username: string;
    password: string; // Will be encrypted in a real app, storing plain for now as per schema
    notes?: string;
    status: AccountStatus;
}) {
    await requireAdmin();

    const account = await db.account.create({
        data: {
            productId: data.productId,
            serviceType: data.serviceType,
            username: data.username,
            password: data.password,
            notes: data.notes,
            status: data.status,
        },
    });

    // Update product stock count
    await db.product.update({
        where: { id: data.productId },
        data: {
            stockQuantity: { increment: 1 }
        }
    });

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");
    return account;
}

export async function updateAccount(
    id: string,
    data: Partial<{
        productId: string;
        serviceType: string;
        username: string;
        password: string;
        notes: string;
        status: AccountStatus;
    }>
) {
    await requireAdmin();

    const account = await db.account.update({
        where: { id },
        data,
    });

    revalidatePath("/admin/inventory");
    return account;
}

export async function deleteAccount(id: string) {
    await requireAdmin();

    const account = await db.account.findUnique({ where: { id } });

    if (account) {
        await db.account.delete({ where: { id } });

        // Decrement stock if it was available
        if (account.status === "AVAILABLE") {
            await db.product.update({
                where: { id: account.productId },
                data: {
                    stockQuantity: { decrement: 1 }
                }
            });
        }
    }

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");
}
