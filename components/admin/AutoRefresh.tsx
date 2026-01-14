"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AutoRefreshProps {
    intervalMs?: number; // Default 30 seconds
}

export function AutoRefresh({ intervalMs = 30000 }: AutoRefreshProps) {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, intervalMs);

        return () => clearInterval(interval);
    }, [intervalMs, router]);

    return null;
}
