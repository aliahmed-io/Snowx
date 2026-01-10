"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { LiveChat } from "@/components/ui/LiveChat";
import { CartSidebar } from "@/components/shop/CartSidebar";

interface ConditionalLayoutProps {
    user: {
        id: string;
        email?: string | null;
        given_name?: string | null;
        family_name?: string | null;
        picture?: string | null;
    } | null;
    role?: string | null;
    children: React.ReactNode;
}

export function ConditionalLayout({ user, role, children }: ConditionalLayoutProps) {
    const pathname = usePathname();

    // Check if we're on an admin path (handles both /admin and /en-US/admin etc.)
    const isAdminPath = pathname.includes("/admin");

    if (isAdminPath) {
        // Admin layout - no navbar/footer (admin has its own)
        return <>{children}</>;
    }

    // User/public layout - with navbar and footer
    return (
        <>
            <Navbar user={user} role={role} />
            <CartSidebar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <LiveChat />
        </>
    );
}
