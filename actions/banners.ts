"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getBanners() {
    return await db.banner.findMany({
        orderBy: { order: 'asc' }
    });
}

export async function createBanner(data: {
    title: string;
    image: string;
    link: string;
    type: "MAIN" | "CATEGORY";
    isActive: boolean; // allow passing
    order: number;
}) {
    if (!data.title || !data.image) {
        throw new Error("Title and Image are required");
    }

    const banner = await db.banner.create({
        data
    });

    revalidatePath("/admin/banners");
    return banner;
}

export async function deleteBanner(id: string) {
    await db.banner.delete({
        where: { id }
    });
    revalidatePath("/admin/banners");
}

export async function toggleBannerStatus(id: string, isActive: boolean) {
    await db.banner.update({
        where: { id },
        data: { isActive }
    });
    revalidatePath("/admin/banners");
}
