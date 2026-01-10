"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SortSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "newest";

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "newest") {
            params.delete("sort");
        } else {
            params.set("sort", value);
        }
        params.delete("page");
        router.push(`/products?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Sort By:</span>
            <div className="relative">
                <select
                    className="bg-black/20 text-white text-sm border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-snow-accent appearance-none pr-8 cursor-pointer"
                    value={currentSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
