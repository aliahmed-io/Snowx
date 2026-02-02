"use client";

import { createPortal } from "react-dom";

interface PortalProps {
    children: React.ReactNode;
}

/**
 * Portal component to render children into document.body.
 * Returns null during SSR.
 */
export function Portal({ children }: PortalProps) {
    if (typeof window === "undefined") return null;
    return createPortal(children, document.body);
}
