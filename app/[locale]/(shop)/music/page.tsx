import { Suspense } from "react";
import { getProducts } from "@/actions/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return {
        title: `Music | SnowX`,
    };
}

export default async function MusicPage() {
    const products = await getProducts({
        categorySlug: "music",
        sortBy: "newest"
    });

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Music
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Ad-free music streaming for less.
                </p>
            </div>

            <ProductGrid products={products} />
        </div>
    );
}
