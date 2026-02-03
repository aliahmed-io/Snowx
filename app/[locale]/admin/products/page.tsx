import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/navigation";
import Image from "next/image";
import {
    Plus,
    Edit,
    Trash,
    Package,
    Key
} from "lucide-react";
import { AdminSearchInput } from "@/components/admin/AdminSearchInput";
import { AdminPagination } from "@/components/admin/AdminPagination";



interface ProductsPageProps {
    searchParams: Promise<{
        search?: string;
        page?: string;
    }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const { search, page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;
    const PAGE_SIZE = 20;
    const skip = (page - 1) * PAGE_SIZE;

    const [products, totalProducts] = await Promise.all([
        db.product.findMany({
            where: search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { slug: { contains: search, mode: 'insensitive' } }
                ]
            } : undefined,
            include: {
                category: true,
                _count: {
                    select: { accounts: { where: { status: 'AVAILABLE' } } }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: PAGE_SIZE,
            skip
        }),
        db.product.count({
            where: search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { slug: { contains: search, mode: 'insensitive' } }
                ]
            } : undefined
        })
    ]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Products</h2>
                    <p className="text-gray-400 mt-2">Manage your digital products and inventory</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 bg-snow-accent text-[#020817] px-4 py-2 rounded-lg font-medium hover:bg-snow-accent/90 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    New Product
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="flex items-center gap-4 bg-[#0a1628] border border-snow-primary/20 p-4 rounded-xl">
                <AdminSearchInput
                    placeholder="Search products..."
                    paramName="search"
                    className="flex-1 max-w-md"
                />
            </div>

            {/* Products Table */}
            <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-gray-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Inventory (Active)</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-snow-primary/10">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                <Package className="w-6 h-6 text-gray-500" />
                                            </div>
                                            <p className="text-gray-400 font-medium">No products found</p>
                                            <p className="text-gray-500 text-xs">Get started by creating your first product.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.images[0] ? (
                                                    <div className="relative w-10 h-10 rounded-lg bg-white/5 overflow-hidden">
                                                        <Image
                                                            src={product.images[0]}
                                                            alt=""
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-snow-accent/10 flex items-center justify-center text-snow-accent">
                                                        <Package className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-white font-medium">{product.name}</p>
                                                    <p className="text-xs text-gray-500">/{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-white/5 px-2 py-1 rounded-md text-xs font-medium">
                                                {product.category.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-white">
                                            {formatPrice(Number(product.price))}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Key className="w-4 h-4 text-gray-500" />
                                                <span className={product._count.accounts > 0 ? "text-green-400" : "text-red-400"}>
                                                    {product._count.accounts}
                                                </span>
                                                <span className="text-gray-600">/ {product.stockQuantity} Total</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.isActive ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/products/${product.id}/stock`}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-snow-accent transition-colors"
                                                    title="Manage Stock"
                                                >
                                                    <Key className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AdminPagination currentPage={page} totalItems={totalProducts} pageSize={PAGE_SIZE} />
        </div>
    );
}
