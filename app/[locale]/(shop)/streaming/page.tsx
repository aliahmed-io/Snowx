import { Suspense } from "react";
import { getProducts } from "@/actions/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Navbar' }); // detailed titles later
    return {
        title: `Streaming | SnowX`,
    };
}

export default async function StreamingPage() {
    const products = await getProducts({
        categorySlug: "streaming",
        sortBy: "newest"
    });

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Streaming
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Premium streaming services at unbeatable prices.
                </p>
            </div>

            <ProductGrid products={products} />
        </div>
    );
}
