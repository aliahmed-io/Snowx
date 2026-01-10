import { Bell, Search, User as UserIcon, ShoppingBag, Package, RotateCcw, AlertTriangle, MessageSquare } from "lucide-react";
import Image from "next/image";
import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface Notification {
    id: string;
    type: "warning" | "info" | "urgent";
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
}

export async function AdminHeader() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // Fetch notification data
    const [lowStockCount, pendingOrders, pendingReturns] = await Promise.all([
        // Low stock products (< 10 accounts available)
        db.product.count({
            where: {
                accounts: {
                    none: { status: "AVAILABLE" }
                }
            }
        }).catch(() => 0),

        // Pending orders
        db.order.count({
            where: { status: "PENDING" }
        }).catch(() => 0),

        // Pending return requests
        db.returnRequest.count({
            where: { status: "pending" }
        }).catch(() => 0),
    ]);

    // Temporarily 0 as ContactMessage model is not yet implemented in DB (frontend uses mock data)
    const unreadMessages = 0;

    // Build notifications list
    const notifications: Notification[] = [];

    if (pendingReturns > 0) {
        notifications.push({
            id: "returns",
            type: "urgent",
            title: "Pending Returns",
            description: `${pendingReturns} return request${pendingReturns > 1 ? "s" : ""} awaiting review`,
            href: "/admin/returns",
            icon: <RotateCcw className="w-4 h-4 text-orange-400" />,
        });
    }

    if (pendingOrders > 0) {
        notifications.push({
            id: "orders",
            type: "warning",
            title: "Pending Orders",
            description: `${pendingOrders} order${pendingOrders > 1 ? "s" : ""} need processing`,
            href: "/admin/orders?status=PENDING",
            icon: <Package className="w-4 h-4 text-yellow-400" />,
        });
    }

    if (lowStockCount > 0) {
        notifications.push({
            id: "stock",
            type: "warning",
            title: "Out of Stock",
            description: `${lowStockCount} product${lowStockCount > 1 ? "s" : ""} have no available accounts`,
            href: "/admin/inventory?status=AVAILABLE",
            icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
        });
    }

    if (unreadMessages > 0) {
        notifications.push({
            id: "messages",
            type: "info",
            title: "New Messages",
            description: `${unreadMessages} unread contact message${unreadMessages > 1 ? "s" : ""}`,
            href: "/admin/contact",
            icon: <MessageSquare className="w-4 h-4 text-blue-400" />,
        });
    }

    const totalNotifications = notifications.length;

    const getTypeColor = (type: Notification["type"]) => {
        switch (type) {
            case "urgent": return "bg-orange-500";
            case "warning": return "bg-yellow-500";
            case "info": return "bg-blue-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <header className="h-16 border-b border-snow-primary/20 bg-[#0a1628]/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
            {/* Search */}
            <form
                action="/admin/products"
                method="GET"
                className="relative w-96"
            >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                    type="text"
                    name="search"
                    placeholder="Search products..."
                    className="w-full h-10 bg-snow-primary/20 border border-snow-primary/20 rounded-full pl-10 pr-4 text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:border-snow-accent/50 transition-colors"
                />
            </form>

            <div className="flex items-center gap-6">
                {/* Notifications */}
                <div className="relative group cursor-pointer">
                    <div className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
                        <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                        {totalNotifications > 0 && (
                            <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                                {totalNotifications}
                            </span>
                        )}
                    </div>

                    {/* Dropdown on Hover */}
                    <div className="absolute right-0 mt-2 w-80 bg-[#0a1628] border border-snow-primary/20 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all transform origin-top-right">
                        <div className="p-3 border-b border-snow-primary/20 flex items-center justify-between">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Notifications</h4>
                            {totalNotifications > 0 && (
                                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
                                    {totalNotifications} active
                                </span>
                            )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <Link
                                        key={notification.id}
                                        href={notification.href}
                                        className="block p-3 hover:bg-white/5 transition-colors border-b border-snow-primary/10 last:border-b-0"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-2 h-2 mt-2 rounded-full ${getTypeColor(notification.type)} shrink-0`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    {notification.icon}
                                                    <p className="text-sm text-white font-medium">{notification.title}</p>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">{notification.description}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-6 text-center">
                                    <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">All caught up!</p>
                                    <p className="text-xs text-gray-600 mt-1">No notifications at this time</p>
                                </div>
                            )}
                        </div>
                        {notifications.length > 0 && (
                            <div className="p-2 border-t border-snow-primary/20">
                                <Link
                                    href="/admin/dashboard"
                                    className="block text-center text-xs text-snow-accent hover:text-snow-accent/80 py-1 transition-colors"
                                >
                                    View Dashboard →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Return to Store Button */}
                <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all text-sm hover:scale-105 active:scale-95">
                    <ShoppingBag className="w-4 h-4 text-snow-accent" />
                    <span className="font-semibold">Return to Store</span>
                </Link>

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
