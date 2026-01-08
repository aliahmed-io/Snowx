import { Suspense } from "react";
import { getProducts } from "@/actions/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return {
        title: `AI Tools | SnowX`,
    };
}

export default async function AiPage() {
    const products = await getProducts({
        categorySlug: "ai",
        sortBy: "newest"
    });

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    AI Tools
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Unlock the power of AI with premium subscriptions.
                </p>
            </div>

            <ProductGrid products={products} />
        </div>
    );
}
