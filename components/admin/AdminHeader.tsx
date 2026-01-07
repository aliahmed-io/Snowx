import { Bell, Search, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function AdminHeader() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // Fetch alerts
    const lowStockCount = await db.product.count({
        where: { inventory: { lt: 10 } }
    });

    return (
        <header className="h-16 border-b border-snow-primary/20 bg-[#0a1628]/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
            {/* Search (Placeholder) */}
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search orders, products, or users..."
                    className="w-full bg-snow-primary/20 border border-snow-primary/20 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-snow-accent/50 transition-colors"
                />
            </div>

            <div className="flex items-center gap-6">
                {/* Notifications */}
                <div className="relative group cursor-pointer">
                    <div className="relative">
                        <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                        {lowStockCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0a1628]" />
                        )}
                    </div>

                    {/* Simple Dropdown on Hover */}
                    <div className="absolute right-0 mt-2 w-64 bg-[#0a1628] border border-snow-primary/20 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all transform origin-top-right">
                        <div className="p-3 border-b border-snow-primary/20">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Notifications</h4>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {lowStockCount > 0 ? (
                                <Link href="/admin/products" className="block p-3 hover:bg-white/5 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shrink-0" />
                                        <div>
                                            <p className="text-sm text-white font-medium">Low Stock Alert</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{lowStockCount} products are running low.</p>
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div className="p-4 text-center text-sm text-gray-500">
                                    No new notifications
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-6 border-l border-snow-primary/20">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-white">{user?.given_name} {user?.family_name}</p>
                        <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    {user?.picture ? (
                        <div className="relative w-9 h-9 rounded-full border border-snow-primary/20 overflow-hidden">
                            <Image
                                src={user.picture}
                                alt=""
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-snow-accent/10 flex items-center justify-center text-snow-accent">
                            <UserIcon className="w-5 h-5" />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
