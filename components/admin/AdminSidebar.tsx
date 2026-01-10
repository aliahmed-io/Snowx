"use client";

import Image from "next/image";

import { Link, usePathname } from "@/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Component,
    Undo2,
    Activity,
    FileText,
    ShieldAlert,
    Mail,
    MessageSquare,
    Settings,
    LogOut,
    BarChart3,
    Key,
    SlidersHorizontal
} from "lucide-react";

const sidebarGroups = [
    {
        title: "Overview",
        items: [
            {
                title: "Dashboard",
                href: "/admin",
                icon: LayoutDashboard
            },
            {
                title: "Analytics",
                href: "/admin/analytics",
                icon: BarChart3
            }
        ]
    },
    {
        title: "Manage Store",
        items: [
            {
                title: "Orders",
                href: "/admin/orders",
                icon: ShoppingBag
            },
            {
                title: "Products",
                href: "/admin/products",
                icon: Package
            },
            {
                title: "Categories",
                href: "/admin/categories",
                icon: Component
            },
            {
                title: "Inventory",
                href: "/admin/inventory",
                icon: Key
            },
            {
                title: "Filters",
                href: "/admin/filters",
                icon: SlidersHorizontal
            },
            {
                title: "Returns",
                href: "/admin/returns",
                icon: Undo2
            }
        ]
    },
    {
        title: "Admin Tools",
        items: [
            {
                title: "System Health",
                href: "/admin/health",
                icon: Activity
            },
            {
                title: "Audit Logs",
                href: "/admin/audit",
                icon: FileText
            },
            {
                title: "Security Alerts",
                href: "/admin/alerts",
                icon: ShieldAlert
            }
        ]
    },
    {
        title: "Messages",
        items: [
            {
                title: "Email",
                href: "/admin/email",
                icon: Mail
            },
            {
                title: "Contact",
                href: "/admin/contact",
                icon: MessageSquare
            }
        ]
    },
    {
        title: "Settings",
        items: [
            {
                title: "Settings",
                href: "/admin/settings",
                icon: Settings
            }
        ]
    }
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-[#020817] border-r border-[#1e293b] w-64 text-slate-300">
            <div className="p-6 border-b border-[#1e293b] flex items-center gap-3">
                <Image
                    src="/snowx2-icon.png"
                    alt="SnowX"
                    width={32}
                    height={32}
                    className="object-contain"
                />
                <h1 className="text-xl font-bold text-white">
                    Admin
                </h1>
            </div>

            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-6 px-4">
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
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group text-sm",
                                                    isActive
                                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                                        : "text-slate-400 hover:text-slate-100 hover:bg-[#1e293b]"
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
