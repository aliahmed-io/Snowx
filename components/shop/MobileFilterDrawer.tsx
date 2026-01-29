"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductSidebarFilters } from "./ProductSidebarFilters";

interface Category {
    id: string;
    name: string;
    slug: string;
    productCount: number;
}

interface FilterOption {
    id: string;
    value: string;
    label?: string | null;
    productCount?: number;
}

interface MobileFilterDrawerProps {
    categories: Category[];
    durations?: FilterOption[];
    platforms?: FilterOption[];
}

export function MobileFilterDrawer({ categories, durations = [], platforms = [] }: MobileFilterDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            {/* Mobile Filter Toggle Button - Only visible on mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors active:scale-95"
            >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
            </button>

            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-100 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-snow-primary border-r border-white/10 z-100 md:hidden transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-5 h-5 text-snow-accent" />
                            <span className="text-lg font-bold text-white">Filters</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Filter Content */}
                    <div className="flex-1 overflow-y-auto p-5">
                        <ProductSidebarFilters
                            categories={categories}
                            durations={durations}
                            platforms={platforms}
                        />
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-white/10">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full py-3 bg-snow-accent text-[#020817] rounded-xl text-sm font-bold hover:bg-snow-accent/90 transition-all shadow-lg shadow-snow-accent/20 active:scale-95"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
