"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProducts(options?: {
    categorySlug?: string;
    search?: string;
    sortBy?: "price-asc" | "price-desc" | "newest" | "name";
    featured?: boolean;
    limit?: number;
}) {
    const where: Record<string, unknown> = { isActive: true };

    if (options?.categorySlug) {
        where.category = { slug: options.categorySlug };
    }

    if (options?.search) {
        where.OR = [
            { name: { contains: options.search, mode: "insensitive" } },
            { description: { contains: options.search, mode: "insensitive" } },
        ];
    }

    if (options?.featured) {
        where.isFeatured = true;
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (options?.sortBy === "price-asc") orderBy = { price: "asc" };
    if (options?.sortBy === "price-desc") orderBy = { price: "desc" };
    if (options?.sortBy === "name") orderBy = { name: "asc" };

    const products = await db.product.findMany({
        where,
        orderBy,
        take: options?.limit,
        include: {
            category: true,
            reviews: { select: { rating: true } },
        },
    });

    return products.map((p) => ({
        ...p,
        price: Number(p.price),
        comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
        avgRating:
            p.reviews.length > 0
                ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length
                : 0,
        reviewCount: p.reviews.length,
    }));
}

export async function getProductBySlug(slug: string) {
    const product = await db.product.findUnique({
        where: { slug },
        include: {
            category: true,
            reviews: {
                include: { user: { select: { firstName: true, lastName: true, profileImage: true } } },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!product) return null;

    return {
        ...product,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        avgRating:
            product.reviews.length > 0
                ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
                : 0,
    };
}

export async function createProduct(data: {
    name: string;
    slug: string;
    description: string;
    price: number;
    comparePrice?: number;
    images: string[];
    categoryId: string;
    inventory: number;
    isActive: boolean;
    isFeatured: boolean;
}) {
    const product = await db.product.create({
        data: {
            ...data,
            price: data.price,
            comparePrice: data.comparePrice,
        },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return product;
}

export async function updateProduct(
    id: string,
    data: Partial<{
        name: string;
        slug: string;
        description: string;
        price: number;
        comparePrice: number | null;
        images: string[];
        categoryId: string;
        inventory: number;
        isActive: boolean;
        isFeatured: boolean;
    }>
) {
    const product = await db.product.update({
        where: { id },
        data,
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);
    return product;
}

export async function deleteProduct(id: string) {
    await db.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/products");
}
