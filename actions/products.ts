"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProducts(options?: {
    categorySlug?: string;
    search?: string;
    sortBy?: "price-asc" | "price-desc" | "newest" | "name";
    featured?: boolean;
    limit?: number;
    page?: number;
    minPrice?: number;
    maxPrice?: number;
    platforms?: string[];
    duration?: string;
}) {
    const {
        categorySlug,
        search,
        sortBy,
        featured,
        limit = 12,
        page = 1,
        minPrice,
        maxPrice,
        duration,
        platforms
    } = options || {};

    const where: Record<string, unknown> = { isActive: true };

    if (categorySlug && categorySlug !== 'all') {
        where.category = { slug: categorySlug };
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    if (featured) {
        where.isFeatured = true;
    }

    // Price Filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
        };
    }

    // Platform Filtering - use exact field match
    if (platforms && platforms.length > 0) {
        where.platform = { in: platforms };
    }

    // Duration Filtering - use exact field match
    if (duration) {
        where.duration = duration;
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (sortBy === "price-asc") orderBy = { price: "asc" };
    if (sortBy === "price-desc") orderBy = { price: "desc" };
    if (sortBy === "name") orderBy = { name: "asc" };
    // "newest" uses default createdAt: desc

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        db.product.findMany({
            where,
            orderBy,
            take: limit,
            skip,
            include: {
                category: true,
                reviews: { select: { rating: true } },
            },
        }),
        db.product.count({ where }),
    ]);

    const mappedProducts = products.map((p) => ({
        ...p,
        price: Number(p.price),
        comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
        avgRating:
            p.reviews.length > 0
                ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length
                : 0,
        reviewCount: p.reviews.length,
    }));

    return {
        products: mappedProducts,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
    };
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
    nameAr?: string;
    slug: string;
    description: string;
    descriptionAr?: string;
    price: number;
    discountPercentage?: number;
    images: string[];
    categoryId: string;
    inventory: number;
    isActive: boolean;
    isFeatured: boolean;
    duration?: string;
    platform?: string;
}) {
    const product = await db.product.create({
        data: {
            name: data.name,
            nameAr: data.nameAr,
            slug: data.slug,
            description: data.description,
            descriptionAr: data.descriptionAr,
            price: data.price,
            discountPercentage: data.discountPercentage || 0,
            images: data.images,
            categoryId: data.categoryId,
            stockQuantity: data.inventory,
            isActive: data.isActive,
            isFeatured: data.isFeatured,
            duration: data.duration,
            platform: data.platform,
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
        nameAr: string | null;
        slug: string;
        description: string;
        descriptionAr: string | null;
        price: number;
        discountPercentage: number;
        images: string[];
        categoryId: string;
        inventory: number;
        isActive: boolean;
        isFeatured: boolean;
        duration: string | null;
        platform: string | null;
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
