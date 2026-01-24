import { getCustomerById } from "@/actions/admin";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/navigation";
import { ArrowLeft, Mail, Calendar, MapPin, Package, ShoppingBag, Star } from "lucide-react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function CustomerDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const customer = await getCustomerById(id);

    if (!customer) {
        notFound();
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/customers"
                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-white tracking-tight">Customer Details</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile */}
                <div className="space-y-6">
                    {/* Profile Card */}
                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-snow-primary/20 to-transparent" />
                        <div className="relative z-10">
                            <div className="w-24 h-24 mx-auto bg-snow-accent/20 rounded-full flex items-center justify-center text-snow-accent text-3xl font-bold mb-4 border-4 border-[#0a1628]">
                                {customer.profileImage ? (
                                    <Image
                                        src={customer.profileImage}
                                        alt={customer.firstName || "Customer"}
                                        width={96}
                                        height={96}
                                        className="rounded-full object-cover"
                                    />
                                ) : (
                                    (customer.firstName?.[0] || customer.email[0]).toUpperCase()
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-white mb-1">
                                {customer.firstName} {customer.lastName}
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">{customer.email}</p>

                            <div className="grid grid-cols-2 gap-4 border-t border-snow-primary/20 pt-4">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase font-medium">Joined</p>
                                    <p className="text-white text-sm">{new Date(customer.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase font-medium">Orders</p>
                                    <p className="text-white text-sm">{customer._count.orders}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact / Info */}
                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6 space-y-4">
                        <h3 className="font-semibold text-white mb-2">Information</h3>

                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <a href={`mailto:${customer.email}`} className="text-snow-accent hover:underline truncate">
                                {customer.email}
                            </a>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-300">
                                Member since {new Date(customer.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        {customer.address && (
                            <div className="flex items-start gap-3 text-sm">
                                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                                <div className="text-gray-300">
                                    <p>{customer.address.street1} {customer.address.street2}</p>
                                    <p>{customer.address.city}, {customer.address.state} {customer.address.postalCode}</p>
                                    <p>{customer.address.country}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Stats & Order History */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                                    <ShoppingBag className="w-4 h-4" />
                                </div>
                                <span className="text-gray-400 text-sm">Total Spent</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{formatPrice(customer.totalSpent)}</p>
                        </div>
                        <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                    <Package className="w-4 h-4" />
                                </div>
                                <span className="text-gray-400 text-sm">Orders</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{customer._count.orders}</p>
                        </div>
                        <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                                    <Star className="w-4 h-4" />
                                </div>
                                <span className="text-gray-400 text-sm">Reviews</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{customer._count.reviews}</p>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-snow-primary/20 flex justify-between items-center">
                            <h3 className="font-semibold text-white">Order History</h3>
                        </div>

                        {customer.orders.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No orders yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-[#020817] text-xs uppercase font-medium">
                                        <tr>
                                            <th className="px-6 py-3">Order ID</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Items</th>
                                            <th className="px-6 py-3 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-snow-primary/10">
                                        {customer.orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <Link href={`/admin/orders/${order.id}`} className="text-snow-accent hover:underline font-mono text-xs">
                                                        #{order.orderNumber}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-400' :
                                                            order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400' :
                                                                order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400' :
                                                                    'bg-gray-500/10 text-gray-400'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {order._count.orderItems}
                                                </td>
                                                <td className="px-6 py-4 text-right text-white font-medium">
                                                    {formatPrice(Number(order.total))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
