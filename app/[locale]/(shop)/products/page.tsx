import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { InfiniteProductGrid } from "@/components/shop/InfiniteProductGrid";
import { ProductSidebarFilters } from "@/components/shop/ProductSidebarFilters";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Shop' });
    return {
        title: `${t('title')} | SnowX`,
        description: t('subtitle'),
    };
}

interface ProductsPageProps {
    searchParams: Promise<{ category?: string; sort?: string; search?: string; minPrice?: string; maxPrice?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const params = await searchParams;

    const [productData, categories] = await Promise.all([
        getProducts({
            categorySlug: params.category,
            sortBy: params.sort as "price-asc" | "price-desc" | "newest" | "name",
            search: params.search,
            minPrice: params.minPrice ? Number(params.minPrice) : undefined,
            maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        }),
        getCategories(),
    ]);

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start gap-8">
                {/* Sidebar Filters */}
                <ProductSidebarFilters categories={categories} />

                {/* Main Content */}
                <div className="flex-1">
                    {/* Top Bar: Sort & Count */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-400">Sort By:</span>
                            <div className="relative">
                                <select
                                    className="bg-black/20 text-white text-sm border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-snow-accent appearance-none pr-8 cursor-pointer"
                                    defaultValue={params.sort || "newest"}
                                // In a real client component we'd use router.push, here we just show the UI for now or minimal interactions
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="name">Name</option>
                                </select>
                                {/* Custom arrow pointer-events-none */}
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="text-sm text-gray-400">
                            <span className="font-semibold text-white">{productData.total}</span> products
                        </div>
                    </div>

                    <InfiniteProductGrid
                        initialProducts={productData.products}
                        initialTotal={productData.total}
                        categorySlug={params.category}
                        search={params.search}
                        sortBy={params.sort}
                        minPrice={params.minPrice ? Number(params.minPrice) : undefined}
                        maxPrice={params.maxPrice ? Number(params.maxPrice) : undefined}
                    />
                </div>
            </div>
        </div>
    );
}
