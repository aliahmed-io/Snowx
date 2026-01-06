import { getOrderById, updateOrderStatus } from "@/actions/orders";
import { notFound } from "next/navigation";
import { OrderStatusForm } from "./OrderStatusForm";
import Link from "next/link";

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps) {
    const { id } = await params;
    const order = await getOrderById(id);
    return {
        title: order ? `Order #${order.orderNumber.slice(0, 8)} | Admin | SnowX` : "Order Not Found",
    };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
        notFound();
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link href="/admin/orders" className="text-gray-400 hover:text-white transition-colors text-sm mb-2 inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Orders
                    </Link>
                    <h1 className="text-3xl font-bold text-white">
                        Order #{order.orderNumber.slice(0, 8)}
                    </h1>
                </div>
                <OrderStatusForm orderId={order.id} currentStatus={order.status} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-white/5 rounded-lg">
                                    <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.product.images[0] ? (
                                            <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
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
                                        <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-white font-medium">${item.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Timeline</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-3 h-3 rounded-full bg-snow-accent mt-1.5" />
                                <div>
                                    <p className="text-white font-medium">Order Created</p>
                                    <p className="text-gray-500 text-sm">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            {order.status !== "PENDING" && (
                                <div className="flex items-start gap-3">
                                    <div className="w-3 h-3 rounded-full bg-blue-400 mt-1.5" />
                                    <div>
                                        <p className="text-white font-medium">Status: {order.status}</p>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(order.updatedAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Summary</h2>
                        <div className="space-y-3 text-gray-400">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-white">${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span className="text-white">${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-white">${order.shipping.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-white/10 pt-3 flex justify-between">
                                <span className="text-white font-semibold">Total</span>
                                <span className="text-white text-xl font-bold">${order.total.toFixed(2)}</span>
                            </div>
                        </div>

                        {order.stripePaymentId && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-gray-500 text-sm">Payment ID</p>
                                <p className="text-gray-400 text-xs font-mono break-all">{order.stripePaymentId}</p>
                            </div>
                        )}
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Customer</h2>
                        <div className="space-y-2">
                            <p className="text-white font-medium">
                                {order.user.firstName} {order.user.lastName}
                            </p>
                            <p className="text-gray-400">{order.user.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
