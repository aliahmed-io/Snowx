import { getProducts } from "@/actions/products";
import { getCachedCategories, getCachedFilterOptions } from "@/lib/cache";
import { InfiniteProductGrid } from "@/components/shop/InfiniteProductGrid";
import { ProductSidebarFilters } from "@/components/shop/ProductSidebarFilters";
import { MobileFilterDrawer } from "@/components/shop/MobileFilterDrawer";
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
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[288px_1fr] gap-8">
                {/* Sidebar Filters - Hidden on mobile/tablet, visible on lg+ */}
                <aside className="hidden lg:block">
                    <ProductSidebarFilters
                        categories={categories}
                        durations={durationOptions}
                        platforms={platformOptions}
                    />
                </aside>

                {/* Main Content - Scrollable */}
                <div className="min-w-0">
                    {/* Top Bar: Sort & Count - Sticky */}
                    <div className="sticky top-20 z-10 bg-snow-primary/95 backdrop-blur-sm pb-4 mb-2">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-3">
                                <MobileFilterDrawer
                                    categories={categories}
                                    durations={durationOptions}
                                    platforms={platformOptions}
                                />
                                <SortSelector />
                            </div>
                            <div className="text-sm text-gray-400">
                                <span className="font-semibold text-white">{productData.total}</span> products
                            </div>
                        </div>
                    </div>

                    {/* Products Grid - Scrollable Area */}
                    <div className="h-[calc(100vh-12rem)] overflow-y-auto premium-scrollbar">
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
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
