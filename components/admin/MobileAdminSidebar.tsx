"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Component,
    Activity,
    FileText,
    ShieldAlert,
    Mail,
    MessageSquare,
    Settings,
    LogOut,
    BarChart3,
    Key,
    SlidersHorizontal,
    Menu,
    X
} from "lucide-react";

const sidebarGroups = [
    {
        title: "Overview",
        items: [
            { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
            { title: "Analytics", href: "/admin/analytics", icon: BarChart3 }
        ]
    },
    {
        title: "Manage Store",
        items: [
            { title: "Orders", href: "/admin/orders", icon: ShoppingBag },
            { title: "Products", href: "/admin/products", icon: Package },
            { title: "Categories", href: "/admin/categories", icon: Component },
            { title: "Inventory", href: "/admin/inventory", icon: Key },
            { title: "Filters", href: "/admin/filters", icon: SlidersHorizontal }
        ]
    },
    {
        title: "Admin Tools",
        items: [
            { title: "System Health", href: "/admin/health", icon: Activity },
            { title: "Audit Logs", href: "/admin/audit", icon: FileText },
            { title: "Security Alerts", href: "/admin/alerts", icon: ShieldAlert }
        ]
    },
    {
        title: "Messages",
        items: [
            { title: "Email", href: "/admin/email", icon: Mail },
            { title: "Contact", href: "/admin/contact", icon: MessageSquare }
        ]
    },
    {
        title: "Settings",
        items: [
            { title: "Settings", href: "/admin/settings", icon: Settings }
        ]
    }
];

export function MobileAdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const prevPathnameRef = useRef(pathname);

    // Close on route change
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (prevPathnameRef.current !== pathname) {
            prevPathnameRef.current = pathname;
            setIsOpen(false);
        }
    }, [pathname]);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Prevent body scroll when open
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
            {/* Mobile Menu Button - Fixed position */}
            <button
                onClick={() => setIsOpen(true)}
                className={`md:hidden fixed top-4 left-4 z-50 p-2.5 bg-[#1e293b] rounded-lg text-white hover:bg-[#334155] transition-colors ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-100 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-[#020817] border-r border-[#1e293b] z-100 md:hidden transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex flex-col h-full text-slate-300">
                    {/* Header */}
                    <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/snowx2-icon.png"
                                alt="SnowX"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                            <h1 className="text-xl font-bold text-white">Admin</h1>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-[#1e293b] rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-4 px-3">
                            {sidebarGroups.map((group) => (
                                <li key={group.title}>
                                    <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                                        {group.title}
                                    </h2>
                                    <ul className="space-y-1">
                                        {group.items.map((item) => {
                                            const Icon = item.icon;
                                            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                                            return (
                                                <li key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={cn(
                                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm",
                                                            isActive
                                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                                                : "text-slate-400 hover:text-slate-100 hover:bg-[#1e293b] active:scale-95"
                                                        )}
                                                    >
                                                        <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-100")} />
                                                        <span className="font-medium">{item.title}</span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="p-3 border-t border-[#1e293b]">
                        <Link
                            href="/api/auth/logout"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors active:scale-95"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
