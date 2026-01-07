import { db } from "@/lib/db";
import { formatPrice, cn } from "@/lib/utils";
import { sendEmail } from "@/lib/mail";
import { Link } from "@/navigation";
import Image from "next/image";
import {
    ArrowLeft,
    Mail,
    Package,
    Calendar,
    MapPin,
    User as UserIcon,
    Printer
} from "lucide-react";
import { notFound } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { OrderStatusForm } from "./OrderStatusForm";

interface OrderDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function sendReceipt(formData: FormData) {
    "use server";
    const orderId = formData.get("orderId") as string;

    const order = await db.order.findUnique({
        where: { id: orderId },
        include: { user: true }
    });

    if (!order) return;

    await sendEmail({
        to: order.user.email,
        subject: `Receipt for Order #${order.orderNumber}`,
        html: `
            <h1>Thank you for your order!</h1>
            <p>Order ID: ${order.id}</p>
            <p>Total: ${formatPrice(Number(order.total))}</p>
            <p>Status: ${order.status}</p>
        `
    });
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
    const { id: orderId } = await params;
    const order = await db.order.findUnique({
        where: { id: orderId },
        include: {
            user: true,
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!order) notFound();

    const statuses = Object.values(OrderStatus);

    interface Address {
        line1?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
    }

    // Helper to safely parse JSON address
    const getAddress = (json: unknown): Address | null => {
        if (!json || typeof json !== 'object') return null;
        return json as Address;
    };

    const shippingAddress = getAddress(order.shippingAddress);

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/orders"
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Order #{order.orderNumber.slice(-8)}</h2>
                            <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide",
                                order.status === OrderStatus.DELIVERED ? "bg-green-500/10 text-green-400" :
                                    order.status === OrderStatus.PENDING ? "bg-yellow-500/10 text-yellow-400" :
                                        order.status === OrderStatus.CANCELLED ? "bg-red-500/10 text-red-400" :
                                            "bg-gray-500/10 text-gray-400"
                            )}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <form action={sendReceipt}>
                        <input type="hidden" name="orderId" value={order.id} />
                        <button
                            type="submit"
                            className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                        >
                            <Mail className="w-4 h-4" />
                            Send Receipt
                        </button>
                    </form>
                    <button className="bg-snow-accent text-[#020817] px-4 py-2 rounded-lg font-bold hover:bg-snow-accent/90 transition-colors flex items-center gap-2 text-sm">
                        <Printer className="w-4 h-4" />
                        Print Invoice
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-snow-primary/20 bg-white/5">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Package className="w-4 h-4 text-snow-accent" />
                                Order Items
                            </h3>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-[#020817] text-xs uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Product</th>
                                        <th className="px-6 py-3">Price</th>
                                        <th className="px-6 py-3 text-center">Qty</th>
                                        <th className="px-6 py-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-snow-primary/10">
                                    {order.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-white/5">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Ideally show image/link */}
                                                    <div>
                                                        <p className="text-white font-medium">{item.product.name}</p>
                                                        <p className="text-xs text-gray-500">ID: {item.product.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{formatPrice(Number(item.price))}</td>
                                            <td className="px-6 py-4 text-center">{item.quantity}</td>
                                            <td className="px-6 py-4 text-right text-white font-medium">
                                                {formatPrice(Number(item.price) * item.quantity)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 bg-white/5 border-t border-snow-primary/20">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(Number(order.subtotal))}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Tax</span>
                                    <span>{formatPrice(Number(order.tax))}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span>{formatPrice(Number(order.shipping))}</span>
                                </div>
                                <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-snow-primary/10">
                                    <span>Total</span>
                                    <span>{formatPrice(Number(order.total))}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Logs Placeholder */}
                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4">Timeline</h3>
                        <div className="relative border-l border-snow-primary/20 ml-3 space-y-6 pl-6 pb-2">
                            <div className="relative">
                                <div className="absolute -left-[31px] bg-[#0a1628] w-2.5 h-2.5 rounded-full border-2 border-green-500" />
                                <p className="text-sm text-gray-300">Order Created</p>
                                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                            {/* Payment Log */}
                            {order.stripePaymentId && (
                                <div className="relative">
                                    <div className="absolute -left-[31px] bg-[#0a1628] w-2.5 h-2.5 rounded-full border-2 border-blue-500" />
                                    <p className="text-sm text-gray-300">Payment Processed</p>
                                    <p className="text-xs text-gray-500">Stripe ID: {order.stripePaymentId}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Status Card */}
                    <OrderStatusForm orderId={order.id} initialStatus={order.status} />

                    {/* Customer Info */}
                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-snow-accent" />
                            Customer
                        </h3>
                        <div className="flex items-center gap-3 mb-6">
                            {order.user.profileImage ? (
                                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                    <Image
                                        src={order.user.profileImage}
                                        alt=""
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-snow-accent/20 flex items-center justify-center text-snow-accent">
                                    {order.user.firstName?.[0] || order.user.email[0].toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="text-white font-medium">{order.user.firstName} {order.user.lastName}</p>
                                <p className="text-xs text-gray-500">{order.user.email}</p>
                            </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-snow-primary/20">
                            <div className="flex gap-3">
                                <Mail className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="text-gray-400">Email</p>
                                    <p className="text-gray-300">{order.user.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="text-gray-400">Shipping Address</p>
                                    {shippingAddress ? (
                                        <p className="text-gray-300">
                                            {shippingAddress.line1}<br />
                                            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}<br />
                                            {shippingAddress.country}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 italic">No address provided</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
