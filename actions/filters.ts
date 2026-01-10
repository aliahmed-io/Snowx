"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type FilterType = "duration" | "platform" | "price_settings";

export async function getFilterOptions(type: FilterType) {
    return db.filterOption.findMany({
        where: { type, isActive: true },
        orderBy: { order: "asc" }
    });
}

export async function getAllFilterOptions(type: FilterType) {
    return db.filterOption.findMany({
        where: { type },
        orderBy: { order: "asc" }
    });
}

export async function createFilterOption(data: {
    type: FilterType;
    value: string;
    label?: string;
    order?: number;
}) {
    const option = await db.filterOption.create({
        data: {
            type: data.type,
            value: data.value,
            label: data.label || data.value,
            order: data.order ?? 0
        }
    });
    revalidatePath("/admin/filters");
    revalidatePath("/products");
    return option;
}

export async function updateFilterOption(
    id: string,
    data: Partial<{
        value: string;
        label: string;
        order: number;
        isActive: boolean;
    }>
) {
    const option = await db.filterOption.update({
        where: { id },
        data
    });
    revalidatePath("/admin/filters");
    revalidatePath("/products");
    return option;
}

export async function deleteFilterOption(id: string) {
    await db.filterOption.delete({ where: { id } });
    revalidatePath("/admin/filters");
    revalidatePath("/products");
}

export async function seedDefaultFilters() {
    // Default duration options
    const durations = ["1 Month", "3 Months", "6 Months", "12 Months", "Lifetime"];
    for (let i = 0; i < durations.length; i++) {
        await db.filterOption.upsert({
            where: { type_value: { type: "duration", value: durations[i] } },
            update: {},
            create: { type: "duration", value: durations[i], order: i }
        });
    }

    // Default platform options
    const platforms = ["Netflix", "Spotify", "YouTube", "Adobe", "Microsoft"];
    for (let i = 0; i < platforms.length; i++) {
        await db.filterOption.upsert({
            where: { type_value: { type: "platform", value: platforms[i] } },
            update: {},
            create: { type: "platform", value: platforms[i], order: i }
        });
    }

    // Default price settings
    await db.filterOption.upsert({
        where: { type_value: { type: "price_settings", value: "default" } },
        update: {},
        create: {
            type: "price_settings",
            value: "default",
            label: JSON.stringify({ min: 0, max: 1000, step: 10 })
        }
    });
}
