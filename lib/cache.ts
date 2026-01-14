import { unstable_cache } from "next/cache";
import { db } from "./db";

/**
 * Cache configuration for different data types
 */
const CACHE_TAGS = {
    products: "products",
    categories: "categories",
    filters: "filters",
    product: (slug: string) => `product-${slug}`,
} as const;

const CACHE_TTL = {
    products: 60,      // 1 minute - frequently accessed
    categories: 300,   // 5 minutes - rarely changes
    filters: 300,      // 5 minutes - rarely changes
    productDetail: 120, // 2 minutes
} as const;

/**
 * Cached product listing query
 */
export const getCachedProducts = unstable_cache(
    async (options: {
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
    } = {}) => {
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
        } = options;

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

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {
                ...(minPrice !== undefined && { gte: minPrice }),
                ...(maxPrice !== undefined && { lte: maxPrice }),
            };
        }

        if (platforms && platforms.length > 0) {
            where.platform = { in: platforms };
        }

        if (duration) {
            where.duration = duration;
        }

        let orderBy: Record<string, string> = { createdAt: "desc" };
        if (sortBy === "price-asc") orderBy = { price: "asc" };
        if (sortBy === "price-desc") orderBy = { price: "desc" };
        if (sortBy === "name") orderBy = { name: "asc" };

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
    },
    [CACHE_TAGS.products],
    { revalidate: CACHE_TTL.products, tags: [CACHE_TAGS.products] }
);

/**
 * Cached single product query
 */
export const getCachedProductBySlug = (slug: string) =>
    unstable_cache(
        async () => {
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
        },
        [CACHE_TAGS.product(slug)],
        { revalidate: CACHE_TTL.productDetail, tags: [CACHE_TAGS.products, CACHE_TAGS.product(slug)] }
    )();

/**
 * Cached categories query
 */
export const getCachedCategories = unstable_cache(
    async () => {
        const categories = await db.category.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { products: { where: { isActive: true } } }
                }
            }
        });

        // Map to expected format with productCount
        return categories.map(cat => ({
            ...cat,
            productCount: cat._count.products
        }));
    },
    [CACHE_TAGS.categories],
    { revalidate: CACHE_TTL.categories, tags: [CACHE_TAGS.categories] }
);

/**
 * Cached filter options query
 */
export const getCachedFilterOptions = (type: string) =>
    unstable_cache(
        async () => {
            return db.filterOption.findMany({
                where: { type, isActive: true },
                orderBy: { order: "asc" },
            });
        },
        [`${CACHE_TAGS.filters}-${type}`],
        { revalidate: CACHE_TTL.filters, tags: [CACHE_TAGS.filters] }
    )();

/**
 * Cached featured products for homepage
 */
export const getCachedFeaturedProducts = unstable_cache(
    async (limit = 6) => {
        const products = await db.product.findMany({
            where: { isActive: true, isFeatured: true },
            take: limit,
            orderBy: { createdAt: "desc" },
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
    },
    ["featured-products"],
    { revalidate: 300, tags: [CACHE_TAGS.products] }
);

/**
 * Cached system settings query
 */
export const getCachedSettings = unstable_cache(
    async () => {
        const systemSetting = await db.systemSetting.findUnique({
            where: { key: 'client-settings' }
        });
        return systemSetting;
    },
    ['client-settings'],
    { revalidate: 3600, tags: ['settings'] }
);
