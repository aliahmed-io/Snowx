import { db } from "@/lib/db";
import Link from "next/link";

export const metadata = {
    title: "Products | Admin | SnowX",
};

export default async function AdminProductsPage() {
    const products = await db.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Products</h1>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 bg-snow-accent text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Product
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                    <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-gray-400 mb-4">No products yet</p>
                    <Link
                        href="/admin/products/new"
                        className="text-snow-accent hover:underline"
                    >
                        Create your first product
                    </Link>
                </div>
            ) : (
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-500 text-sm border-b border-white/10 bg-white/5">
                                <th className="p-4 font-medium">Product</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium">Inventory</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                                {product.images[0] ? (
                                                    <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{product.name}</p>
                                                <p className="text-gray-500 text-sm">{product.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-400">{product.category.name}</td>
                                    <td className="p-4">
                                        <span className="text-white font-medium">${Number(product.price).toFixed(2)}</span>
                                        {product.comparePrice && (
                                            <span className="text-gray-500 line-through text-sm ml-2">
                                                ${Number(product.comparePrice).toFixed(2)}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={`${product.inventory === 0 ? "text-red-400" : product.inventory < 10 ? "text-yellow-400" : "text-gray-400"}`}>
                                            {product.inventory}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                                                {product.isActive ? "Active" : "Inactive"}
                                            </span>
                                            {product.isFeatured && (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-snow-accent/20 text-snow-accent">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <Link
                                                href={`/products/${product.slug}`}
                                                target="_blank"
                                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
