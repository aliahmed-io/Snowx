import { getProducts } from "@/actions/products";
import { getCachedCategories, getCachedFilterOptions } from "@/lib/cache";
import { InfiniteProductGrid } from "@/components/shop/InfiniteProductGrid";
import { ProductSidebarFilters } from "@/components/shop/ProductSidebarFilters";
import { SortSelector } from "@/components/shop/SortSelector";
import { getTranslations } from "next-intl/server";

// ISR: Regenerate products page every minute
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Shop' });
    return {
        title: `${t('title')} | SnowX`,
        description: t('subtitle'),
    };
}

interface ProductsPageProps {
    searchParams: Promise<{
        category?: string;
        sort?: string;
        search?: string;
        minPrice?: string;
        maxPrice?: string;
        duration?: string;
        platforms?: string;
    }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const resolvedSearchParams = await searchParams;

    const [productData, categories, durationOptions, platformOptions] = await Promise.all([
        getProducts({
            categorySlug: resolvedSearchParams.category,
            sortBy: resolvedSearchParams.sort as "price-asc" | "price-desc" | "newest" | "name",
            search: resolvedSearchParams.search,
            minPrice: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
            maxPrice: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
            duration: resolvedSearchParams.duration,
            platforms: resolvedSearchParams.platforms ? resolvedSearchParams.platforms.split(',') : undefined,
        }),
        getCachedCategories(),
        getCachedFilterOptions("duration"),
        getCachedFilterOptions("platform")
    ]);

    return (
        <div className="pt-24 pb-16 md:pt-20 md:pb-0 md:h-screen md:overflow-hidden flex flex-col">
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full md:h-full">
                <div className="grid grid-cols-1 md:grid-cols-[288px_1fr] gap-8 md:h-full">
                    {/* Sidebar Filters */}
                    <aside className="md:h-full md:overflow-y-auto md:scrollbar-hide md:py-6">
                        <ProductSidebarFilters
                            categories={categories}
                            durations={durationOptions}
                            platforms={platformOptions}
                        />
                    </aside>

                    {/* Main Content */}
                    <div className="min-w-0 md:flex md:flex-col md:h-full md:py-6">
                        {/* Top Bar: Sort & Count */}
                        {/* Mobile: sticky. Desktop: static (part of flex col) */}
                        <div className="sticky top-20 md:static z-10 bg-snow-primary/95 backdrop-blur-sm pb-4 mb-2 md:mb-4 md:bg-transparent md:backdrop-filter-none">
                            <div className="flex items-center justify-between gap-4 flex-wrap bg-snow-primary/95 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-2 md:p-0 rounded-xl md:rounded-none">
                                <SortSelector />
                                <div className="text-sm text-gray-400">
                                    <span className="font-semibold text-white">{productData.total}</span> products
                                </div>
                            </div>
                        </div>

                        {/* Products Grid - Scrollable Area */}
                        <div className="md:flex-1 md:overflow-y-auto md:premium-scrollbar md:pb-8">
                            <InfiniteProductGrid
                                initialProducts={productData.products}
                                initialTotal={productData.total}
                                categorySlug={resolvedSearchParams.category}
                                search={resolvedSearchParams.search}
                                sortBy={resolvedSearchParams.sort}
                                minPrice={resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined}
                                maxPrice={resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined}
                                duration={resolvedSearchParams.duration}
                                platforms={resolvedSearchParams.platforms ? resolvedSearchParams.platforms.split(',') : undefined}
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-8"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
