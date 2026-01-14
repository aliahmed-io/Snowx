"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface AdminKeyboardShortcutsProps {
    onSearch?: () => void;
    onEscape?: () => void;
    refreshInterval?: number; // in milliseconds
}

export function AdminKeyboardShortcuts({
    onSearch,
    onEscape,
    refreshInterval = 30000 // Default 30 seconds
}: AdminKeyboardShortcutsProps) {
    const router = useRouter();

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Ctrl+K or Cmd+K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            onSearch?.();
        }

        // Escape to close modals/dialogs
        if (e.key === 'Escape') {
            onEscape?.();
        }

        // Ctrl+R or Cmd+R to refresh (prevent default browser refresh)
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            router.refresh();
        }
    }, [onSearch, onEscape, router]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Auto-refresh/polling
    useEffect(() => {
        if (refreshInterval > 0) {
            const interval = setInterval(() => {
                router.refresh();
            }, refreshInterval);

            return () => clearInterval(interval);
        }
    }, [refreshInterval, router]);

    return null;
}
