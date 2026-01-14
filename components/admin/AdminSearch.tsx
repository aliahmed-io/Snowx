"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useRef, useState } from "react";

interface AdminSearchProps {
    placeholder?: string;
    paramName?: string;
}

export function AdminSearch({
    placeholder = "Search...",
    paramName = "search"
}: AdminSearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const inputRef = useRef<HTMLInputElement>(null);
    const initialValue = searchParams.get(paramName);
    const [value, setValue] = useState(initialValue ?? "");
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const updateSearch = useCallback((searchValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue.trim()) {
            params.set(paramName, searchValue);
        } else {
            params.delete(paramName);
        }
        router.push(`?${params.toString()}`);
    }, [searchParams, paramName, router]);

    // Debounced search
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            updateSearch(newValue);
        }, 300);
    }, [updateSearch]);

    // Handle Ctrl+K to focus search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    return (
        <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
                ref={inputRef}
                placeholder={`${placeholder} (Ctrl+K)`}
                className="pl-9 bg-[#1e293b] border-[#020817] text-white focus-visible:ring-blue-600"
                value={value}
                onChange={handleChange}
            />
        </div>
    );
}
