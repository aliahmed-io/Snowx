import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";

import { Link } from "@/navigation";

interface RecentOrderUser {
    firstName?: string | null;
    email?: string | null;
    profileImage?: string | null;
}

interface RecentOrder {
    id: string;
    total: number | string;
    User?: RecentOrderUser | null;
}

interface RecentSalesProps {
    orders: RecentOrder[];
}

export function RecentSales({ orders }: RecentSalesProps) {
    return (
        <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6 h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Sales</h3>
            <div className="space-y-6">
                {orders.map((order) => (
                    <Link
                        key={order.id}
                        href={`/admin/orders/${order.id}`}
                        className="block hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10">
                                    {order.User?.profileImage ? (
                                        <Image
                                            src={order.User.profileImage}
                                            alt={order.User.firstName || "User"}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-snow-accent/10 flex items-center justify-center text-snow-accent">
                                            <UserIcon className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-white leading-none">
                                        {order.User?.firstName || "Guest"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                        {order.User?.email || "No email"}
                                    </p>
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="font-medium text-white">
                                +{formatPrice(Number(order.total))}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
