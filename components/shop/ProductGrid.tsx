import { ProductCard } from "./ProductCard";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    images: string[];
    category: { name: string };
    avgRating: number;
    reviewCount: number;
}

interface ProductGridProps {
    products: Product[];
    emptyMessage?: string;
}

export function ProductGrid({ products, emptyMessage = "No products found" }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-20">
                <svg className="w-20 h-20 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-400 text-lg">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    price={product.price}
                    comparePrice={product.comparePrice}
                    image={product.images[0] || ""}
                    category={product.category.name}
                />
            ))}
        </div>
    );
}
