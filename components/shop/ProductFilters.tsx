"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Category {
    id: string;
    name: string;
    slug: string;
    productCount: number;
}

interface ProductFiltersProps {
    categories: Category[];
    currentCategory?: string;
    currentSort?: string;
}

export function ProductFilters({ categories, currentCategory, currentSort }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateParams = useCallback((key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/products?${params.toString()}`);
    }, [router, searchParams]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8">
            {/* Category filters - Horizontal scroll on mobile */}
            <div className="w-full lg:w-auto overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
                <div className="flex flex-nowrap lg:flex-wrap gap-2 pb-2 lg:pb-0">
                    <button
                        onClick={() => updateParams("category", null)}
                        className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all ${!currentCategory
                            ? "bg-snow-accent text-gray-900 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                            : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                            }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => updateParams("category", cat.slug)}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all ${currentCategory === cat.slug
                                ? "bg-snow-accent text-gray-900 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                                }`}
                        >
                            {cat.name} <span className="opacity-60 text-xs ml-1">({cat.productCount})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Sort by:</span>
                <select
                    value={currentSort || "newest"}
                    onChange={(e) => updateParams("sort", e.target.value)}
                    className="bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-snow-accent"
                >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name</option>
                </select>
            </div>
        </div>
    );
}
