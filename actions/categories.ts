"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getCategories() {
    const categories = await db.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
    });

    return categories.map((c) => ({
        ...c,
        productCount: c._count.products,
    }));
}

export async function getCategoryBySlug(slug: string) {
    return db.category.findUnique({
        where: { slug },
        include: { _count: { select: { products: true } } },
    });
}

export async function createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
}) {
    const category = await db.category.create({ data });
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return category;
}

export async function updateCategory(
    id: string,
    data: Partial<{
        name: string;
        slug: string;
        description: string | null;
        image: string | null;
    }>
) {
    const category = await db.category.update({
        where: { id },
        data,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return category;
}

export async function deleteCategory(id: string) {
    await db.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/products");
}
