import { Suspense } from "react";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductFilters } from "@/components/shop/ProductFilters";
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
    searchParams: Promise<{ category?: string; sort?: string; search?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const params = await searchParams;
    const t = await getTranslations('Shop');

    const [products, categories] = await Promise.all([
        getProducts({
            categorySlug: params.category,
            sortBy: params.sort as "price-asc" | "price-desc" | "newest" | "name",
            search: params.search,
        }),
        getCategories(),
    ]);

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {t('title')}
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    {t('subtitle')}
                </p>
            </div>

            {/* Search bar */}
            <form className="mb-8">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        name="search"
                        placeholder={t('searchPlaceholder')}
                        defaultValue={params.search}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-snow-accent transition-colors"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </form>

            {/* Filters */}
            <Suspense fallback={<div className="h-12" />}>
                <ProductFilters
                    categories={categories}
                    currentCategory={params.category}
                    currentSort={params.sort}
                />
            </Suspense>

            {/* Products Grid */}
            <ProductGrid
                products={products}
                emptyMessage={t('noResults')}
            />
        </div>
    );
}
