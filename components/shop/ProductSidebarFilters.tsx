"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@/navigation";

interface Category {
    id: string;
    name: string;
    slug: string;
    productCount: number;
}

interface ProductSidebarFiltersProps {
    categories: Category[];
    durations?: string[];
    platforms?: string[];
}

export function ProductSidebarFilters({ categories, durations = [], platforms = [] }: ProductSidebarFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();


    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    // Track if the change is internal (user sliding) to avoid circular updates
    const isInternalUpdate = useRef(false);

    // Sync state with URL params on mount or when URL changes externally
    useEffect(() => {
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }

        const min = searchParams.get('minPrice');
        const max = searchParams.get('maxPrice');

        const newMin = min ? Number(min) : 0;
        const newMax = max ? Number(max) : 1000;

        // Only update state if values differ significantly to prevent loop
        if (newMin !== priceRange[0] || newMax !== priceRange[1]) {
            setPriceRange([newMin, newMax]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentional: sync URL to state
    }, [searchParams]); // Removing priceRange from deps effectively

    const handlePriceChange = (value: [number, number]) => {
        isInternalUpdate.current = true;
        setPriceRange(value);
    };

    // Debounce price update to URL
    useEffect(() => {
        const timer = setTimeout(() => {
            // Only push if we initiated the change
            if (!isInternalUpdate.current && (priceRange[0] === 0 && priceRange[1] === 1000)) return;

            const params = new URLSearchParams(searchParams.toString());

            const currentMin = params.get('minPrice');
            const currentMax = params.get('maxPrice');

            // Only update URL if values are different from current params
            let needsUpdate = false;

            if (priceRange[0] > 0) {
                if (currentMin !== priceRange[0].toString()) {
                    params.set('minPrice', priceRange[0].toString());
                    needsUpdate = true;
                }
            } else {
                if (currentMin) {
                    params.delete('minPrice');
                    needsUpdate = true;
                }
            }

            if (priceRange[1] < 1000) { // Changed default max to 1000 to match slider max
                if (currentMax !== priceRange[1].toString()) {
                    params.set('maxPrice', priceRange[1].toString());
                    needsUpdate = true;
                }
            } else {
                if (currentMax) {
                    params.delete('maxPrice');
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                params.delete('page');
                router.push(`/products?${params.toString()}`, { scroll: false });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [priceRange, router, searchParams]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6">Filters</h2>
            </div>

            {/* Categories */}
            <div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                    Categories
                    <span className="text-xs text-snow-accent-light bg-snow-accent/10 px-2 py-1 rounded-md">
                        {categories.reduce((acc, c) => acc + c.productCount, 0)} items
                    </span>
                </h3>
                <div className="space-y-3">
                    <Link
                        href="/products"
                        className={`flex items-center gap-3 text-sm group ${!searchParams.get('category')
                            ? 'text-snow-accent font-semibold'
                            : 'text-snow-gray hover:text-white'
                            }`}
                    >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${!searchParams.get('category')
                            ? 'border-snow-accent bg-snow-accent'
                            : 'border-white/20 group-hover:border-white/40'
                            }`}>
                            {!searchParams.get('category') && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        All Apps
                    </Link>
                    {categories.map((cat) => {
                        const isActive = searchParams.get('category') === cat.slug;
                        return (
                            <Link
                                key={cat.id}
                                href={`/products?category=${cat.slug}`}
                                className={`flex items-center gap-3 text-sm group ${isActive
                                    ? 'text-snow-accent font-semibold'
                                    : 'text-snow-gray hover:text-white'
                                    }`}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isActive
                                    ? 'border-snow-accent bg-snow-accent'
                                    : 'border-white/20 group-hover:border-white/40'
                                    }`}>
                                    {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                </div>
                                {cat.name}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-lg font-bold text-white mb-6">Price Range</h3>
                <div className="px-2">
                    <Slider
                        min={0}
                        max={1000}
                        step={10}
                        defaultValue={[0, 1000]}
                        onValueChange={handlePriceChange}
                        formatLabel={(val) => `$${val}`}
                    />
                </div>
            </div>

            {/* Subscription Duration */}
            {durations.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-white mb-6">Duration</h3>
                    <div className="space-y-3">
                        {durations.map((duration) => (
                            <label key={duration} className="flex items-center gap-3 cursor-pointer group">
                                <Checkbox
                                    checked={searchParams.get('duration') === duration}
                                    onCheckedChange={(checked) => {
                                        const params = new URLSearchParams(searchParams.toString());
                                        if (checked) {
                                            params.set('duration', duration);
                                        } else {
                                            params.delete('duration');
                                        }
                                        params.delete('page');
                                        router.push(`/products?${params.toString()}`, { scroll: false });
                                    }}
                                />
                                <span className={`text-sm transition-colors ${searchParams.get('duration') === duration ? 'text-snow-accent' : 'text-snow-gray group-hover:text-white'}`}>{duration}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Platform */}
            {platforms.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-white mb-6">Platform</h3>
                    <div className="space-y-3">
                        {platforms.map((platform) => {
                            const currentPlatforms = searchParams.get('platforms')?.split(',') || [];
                            const isActive = currentPlatforms.includes(platform);
                            return (
                                <label key={platform} className="flex items-center gap-3 cursor-pointer group">
                                    <Checkbox
                                        checked={isActive}
                                        onCheckedChange={(checked) => {
                                            const params = new URLSearchParams(searchParams.toString());
                                            let newPlatforms = [...currentPlatforms];
                                            if (checked) {
                                                newPlatforms.push(platform);
                                            } else {
                                                newPlatforms = newPlatforms.filter(p => p !== platform);
                                            }

                                            if (newPlatforms.length > 0) {
                                                params.set('platforms', newPlatforms.join(','));
                                            } else {
                                                params.delete('platforms');
                                            }
                                            params.delete('page');
                                            router.push(`/products?${params.toString()}`, { scroll: false });
                                        }}
                                    />
                                    <span className={`text-sm transition-colors ${isActive ? 'text-snow-accent' : 'text-snow-gray group-hover:text-white'}`}>{platform}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
