"use client";

import { useEffect, useState, useTransition } from "react";
import { ProductCard } from "./ProductCard";
import { getProducts } from "@/actions/products";
// import { useInView } from "react-intersection-observer"; // Removed dependency

// Since we can't install react-intersection-observer, we'll write a custom hook or just use a simple button first, 
// then I will realize I can't assume packages. 
// Actually, I can use the native IntersectionObserver API directly in a useEffect.
// I will rewrite this component below to be dependency-free.

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

interface InfiniteProductGridProps {
    initialProducts: Product[];
    initialTotal: number;
    categorySlug?: string;
    search?: string;
    sortBy?: string;
    minPrice?: number;
    maxPrice?: number;
    platforms?: string[];
    duration?: string;
    className?: string;
}

export function InfiniteProductGrid({
    initialProducts,
    initialTotal,
    categorySlug,
    search,
    sortBy,
    minPrice,
    maxPrice,
    platforms,
    duration,
    className
}: InfiniteProductGridProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initialProducts.length < initialTotal);
    const [isPending, startTransition] = useTransition();

    // Reset when initial props change (filtering)
    useEffect(() => {
        setProducts(initialProducts);
        setPage(1);
        setHasMore(initialProducts.length < initialTotal);
    }, [initialProducts, initialTotal, categorySlug, search, sortBy, minPrice, maxPrice, platforms, duration]);

    const loadMore = async () => {
        if (isPending || !hasMore) return;

        startTransition(async () => {
            const nextPage = page + 1;
            const result = await getProducts({
                page: nextPage,
                limit: 12,
                categorySlug,
                search,
                sortBy: sortBy as "newest" | "price-asc" | "price-desc" | "name" | undefined,
                minPrice,
                maxPrice,
                platforms,
                duration
            });

            if (result.products.length > 0) {
                setProducts(prev => [...prev, ...result.products as Product[]]); // Type assertion needed due to serialization
                setPage(nextPage);
                setHasMore(products.length + result.products.length < result.total);
            } else {
                setHasMore(false);
            }
        });
    };

    // Infinite Scroll Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isPending) {
                    loadMore();
                }
            },
            { threshold: 0.5 }
        );

        const sentinel = document.getElementById("scroll-sentinel");
        if (sentinel) observer.observe(sentinel);

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- loadMore uses the correct deps internally
    }, [hasMore, isPending, page, categorySlug, search, sortBy, minPrice, maxPrice, platforms, duration]); // Dependencies for closure freshness

    if (products.length === 0) {
        return (
            <div className="text-center py-20 pb-0 w-full">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                <p className="text-gray-400">Try adjusting your filters or search terms.</p>
            </div>
        );
    }

    return (
        <div>
            <div className={className || "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"}>
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

            {/* Loading Indicator / Sentinel */}
            <div id="scroll-sentinel" className="h-20 flex items-center justify-center mt-8">
                {isPending && (
                    <div className="flex items-center gap-2 text-snow-accent">
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                )}
            </div>
        </div>
    );
}
