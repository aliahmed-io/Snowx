import { Suspense } from "react";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { getTranslations } from "next-intl/server";
import { Search } from "lucide-react";

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

            {/* Search and Filters Layout */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
                {/* Search bar */}
                <form className="w-full md:max-w-md">
                    <div className="flex items-center w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 focus-within:bg-white/10 focus-within:border-white/20 transition-all duration-300">
                        <Search className="w-5 h-5 text-white/40 mr-3" />
                        <input
                            type="text"
                            name="search"
                            placeholder={t('searchPlaceholder')}
                            defaultValue={params.search}
                            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40 text-sm h-full w-full"
                        />
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
            </div>

            {/* Products Grid */}
            <ProductGrid
                products={products}
                emptyMessage={t('noResults')}
            />
        </div>
    );
}
