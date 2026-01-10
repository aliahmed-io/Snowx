"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface AdminSearchInputProps {
    placeholder?: string;
    paramName?: string;
    className?: string;
    onSearch?: (query: string) => void;
    debounceMs?: number;
}

export function AdminSearchInput({
    placeholder = "Search...",
    paramName = "q",
    className = "",
    onSearch,
    debounceMs = 300,
}: AdminSearchInputProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initialValue = searchParams.get(paramName) || "";
    const [query, setQuery] = useState(initialValue);

    // Debounced search
    const debouncedSearch = useCallback(
        (value: string) => {
            const timer = setTimeout(() => {
                if (onSearch) {
                    onSearch(value);
                } else {
                    // Update URL params
                    const params = new URLSearchParams(searchParams.toString());
                    if (value) {
                        params.set(paramName, value);
                    } else {
                        params.delete(paramName);
                    }
                    router.push(`${pathname}?${params.toString()}`);
                }
            }, debounceMs);
            return () => clearTimeout(timer);
        },
        [onSearch, paramName, pathname, router, searchParams, debounceMs]
    );

    useEffect(() => {
        if (query !== initialValue) {
            const cleanup = debouncedSearch(query);
            return cleanup;
        }
    }, [query, debouncedSearch, initialValue]);

    const handleClear = () => {
        setQuery("");
        if (onSearch) {
            onSearch("");
        } else {
            const params = new URLSearchParams(searchParams.toString());
            params.delete(paramName);
            router.push(`${pathname}?${params.toString()}`);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full h-10 bg-snow-primary/10 border border-snow-primary/20 rounded-lg pl-10 pr-10 text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:border-snow-accent/50 transition-colors"
            />
            {query && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
