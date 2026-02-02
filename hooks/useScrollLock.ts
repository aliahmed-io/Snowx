"use client";

import { useEffect, useRef } from "react";

/**
 * Hook to lock body scroll when a modal/overlay is open.
 * Stores and restores the original overflow value.
 */
export function useScrollLock(isLocked: boolean) {
    const originalOverflow = useRef<string | null>(null);

    useEffect(() => {
        if (isLocked) {
            if (originalOverflow.current === null) {
                originalOverflow.current = document.body.style.overflow;
            }
            document.body.style.overflow = "hidden";
        } else if (originalOverflow.current !== null) {
            document.body.style.overflow = originalOverflow.current;
            originalOverflow.current = null;
        }
    }, [isLocked]);
}
