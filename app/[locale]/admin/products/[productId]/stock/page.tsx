import { db } from "@/lib/db";
import { Link } from "@/navigation";
import {
    ArrowLeft,
    Trash2,
    Plus
} from "lucide-react";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { LicenseStatus } from "@prisma/client";

interface StockPageProps {
    params: Promise<{
        productId: string;
    }>;
}

async function addStock(formData: FormData) {
    "use server";

    const productId = formData.get("productId") as string;
    const keysRaw = formData.get("keys") as string;

    if (!productId || !keysRaw) return;

    // Split by newlines for bulk add
    const lines = keysRaw.split('\n').filter(line => line.trim() !== '');

    if (lines.length > 0) {
        await db.licenseKey.createMany({
            data: lines.map(k => ({
                key: k.trim(),
                productId,
                status: LicenseStatus.AVAILABLE
            }))
        });

        revalidatePath(`/admin/products/${productId}/stock`);
    }
}

async function deleteLicense(formData: FormData) {
    "use server";
    const licenseId = formData.get("licenseId") as string;
    const productId = formData.get("productId") as string;

    await db.licenseKey.delete({
        where: { id: licenseId }
    });

    revalidatePath(`/admin/products/${productId}/stock`);
}

export default async function ProductStockPage({ params }: StockPageProps) {
    const { productId } = await params;
    const product = await db.product.findUnique({
        where: { id: productId },
        include: {
            licenses: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!product) {
        notFound();
    }

    const activeStock = product.licenses.filter(l => l.status === LicenseStatus.AVAILABLE);
    const soldStock = product.licenses.filter(l => l.status === LicenseStatus.ACTIVE);

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/products"
                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Manage Stock: {product.name}</h2>
                    <p className="text-gray-400 text-sm">Add or remove digital license keys for this product</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Form */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-snow-accent" />
                            Add Stock
                        </h3>
                        <form action={addStock} className="space-y-4">
                            <input type="hidden" name="productId" value={product.id} />
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    License Keys
                                </label>
                                <textarea
                                    name="keys"
                                    rows={10}
                                    className="w-full bg-snow-primary/10 border border-snow-primary/20 rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:border-snow-accent/50 transition-colors font-mono"
                                    placeholder={`XXXX-XXXX-XXXX\nYYYY-YYYY-YYYY\n...`}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Paste multiple keys, one per line.
                                </p>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-snow-accent text-[#020817] py-2.5 rounded-lg font-bold hover:bg-snow-accent/90 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Upload Stock
                            </button>
                        </form>
                    </div>

                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Available</span>
                                <span className="text-green-400 font-mono">{activeStock.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Sold (Active)</span>
                                <span className="text-blue-400 font-mono">{soldStock.length}</span>
                            </div>
                            <div className="pt-3 border-t border-snow-primary/20 flex justify-between font-medium">
                                <span className="text-white">Total</span>
                                <span className="text-white font-mono">{product.licenses.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stock List */}
                <div className="lg:col-span-2 bg-[#0a1628] border border-snow-primary/20 rounded-xl overflow-hidden flex flex-col h-[600px]">
                    <div className="p-4 border-b border-snow-primary/20 bg-white/5">
                        <h3 className="font-semibold text-white">License Inventory</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-0">
                        {product.licenses.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8">
                                <p>No licenses found.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-[#020817] sticky top-0 z-10 text-xs uppercase font-medium">
                                    <tr>
                                        <th className="px-4 py-3">License Key</th>
                                        <th className="px-4 py-3 w-24">Status</th>
                                        <th className="px-4 py-3 w-24">Order</th>
                                        <th className="px-4 py-3 w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-snow-primary/10">
                                    {product.licenses.map((license) => (
                                        <tr key={license.id} className="hover:bg-white/5 group">
                                            <td className="px-4 py-3 font-mono text-xs text-white break-all">
                                                {license.status !== LicenseStatus.AVAILABLE ? (
                                                    <span className="opacity-70">
                                                        {license.key}
                                                    </span>
                                                ) : (
                                                    license.key
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-0.5 rounded ${license.status === LicenseStatus.AVAILABLE ? 'bg-green-500/10 text-green-400' :
                                                        license.status === LicenseStatus.ACTIVE ? 'bg-blue-500/10 text-blue-400' :
                                                            'bg-red-500/10 text-red-400'
                                                    }`}>
                                                    {license.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs whitespace-nowrap">
                                                {license.orderId ? (
                                                    <span className="text-blue-300">Ordered</span>
                                                ) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {license.status === LicenseStatus.AVAILABLE && (
                                                    <form action={deleteLicense}>
                                                        <input type="hidden" name="productId" value={product.id} />
                                                        <input type="hidden" name="licenseId" value={license.id} />
                                                        <button
                                                            type="submit"
                                                            className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </form>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
