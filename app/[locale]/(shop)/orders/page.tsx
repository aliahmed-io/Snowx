import { getUserOrders } from "@/actions/orders";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Link } from "@/navigation";

export const metadata = {
    title: "My Orders | SnowX",
};

export default async function OrdersPage() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        redirect("/api/auth/login");
    }

    const orders = await getUserOrders();

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                    <svg className="w-20 h-20 mx-auto text-gray-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h2 className="text-2xl font-bold text-white mb-4">No orders yet</h2>
                    <p className="text-gray-400 mb-8">Start shopping to see your orders here.</p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 bg-linear-to-r from-snow-accent to-cyan-400 text-gray-900 font-bold px-8 py-3 rounded-xl hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all"
                    >
                        Browse Products
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                            {/* Order Header */}
                            <div className="flex flex-wrap items-center justify-between p-4 bg-white/5 border-b border-white/10 gap-4">
                                <div className="flex flex-wrap items-center gap-6">
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase">Order Number</p>
                                        <p className="text-white font-medium">#{order.orderNumber.slice(0, 8)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase">Date</p>
                                        <p className="text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase">Total</p>
                                        <p className="text-white font-bold">${order.total.toFixed(2)}</p>
                                    </div>
                                </div>
                                <OrderStatusBadge status={order.status} />
                            </div>

                            {/* Order Items */}
                            <div className="p-4 space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-16 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                                            {item.product.images[0] ? (
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt=""
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <Link href={`/products/${item.product.slug}`} className="text-white font-medium hover:text-snow-accent transition-colors">
                                                {item.product.name}
                                            </Link>
                                            <p className="text-gray-400 text-sm">
                                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <p className="text-white font-medium">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function OrderStatusBadge({ status }: { status: string }) {
    const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
        PENDING: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Pending" },
        PROCESSING: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Processing" },
        SHIPPED: { bg: "bg-purple-500/20", text: "text-purple-400", label: "Shipped" },
        DELIVERED: { bg: "bg-green-500/20", text: "text-green-400", label: "Delivered" },
        CANCELLED: { bg: "bg-red-500/20", text: "text-red-400", label: "Cancelled" },
        REFUNDED: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Refunded" },
    };

    const style = statusStyles[status] || statusStyles.PENDING;

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    );
}
