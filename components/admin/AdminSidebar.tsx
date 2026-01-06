"use client";

import { Link, usePathname } from "@/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    Bell,
    BarChart3
} from "lucide-react";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard
    },
    {
        title: "Orders",
        href: "/admin/orders",
        icon: ShoppingBag
    },
    {
        title: "Products & Stock",
        href: "/admin/products",
        icon: Package
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users
    },
    {
        title: "CMS & Content",
        href: "/admin/cms",
        icon: MessageSquare
    },
    {
        title: "Broadcasts",
        href: "/admin/broadcasts",
        icon: Bell
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings
    }
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-[#0a1628] border-r border-snow-primary/20 w-64 text-white">
            <div className="p-6 border-b border-snow-primary/20">
                <h1 className="text-xl font-bold bg-gradient-to-r from-snow-accent to-blue-400 bg-clip-text text-transparent">
                    Snow X Admin
                </h1>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                                        isActive
                                            ? "bg-snow-accent/10 text-snow-accent"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Icon className={cn("w-5 h-5", isActive ? "text-snow-accent" : "text-gray-400 group-hover:text-white")} />
                                    <span className="font-medium">{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-snow-primary/20">
                <Link
                    href="/api/auth/logout"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </Link>
            </div>
        </div>
    );
}
