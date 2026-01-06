import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { ArrowLeft, Plus, Save, Trash, Upload } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface StockPageProps {
    params: {
        productId: string;
    };
}

async function addStock(formData: FormData) {
    "use server";

    const productId = formData.get("productId") as string;
    const credentials = formData.get("credentials") as string;

    if (!productId || !credentials) return;

    // Split by newlines for bulk add
    const lines = credentials.split('\n').filter(line => line.trim() !== '');

    if (lines.length > 0) {
        await db.account.createMany({
            data: lines.map(cred => ({
                credentials: cred.trim(),
                productId,
                isSold: false
            }))
        });

        revalidatePath(`/admin/products/${productId}/stock`);
    }
}

async function deleteAccount(formData: FormData) {
    "use server";
    const accountId = formData.get("accountId") as string;
    const productId = formData.get("productId") as string;

    await db.account.delete({
        where: { id: accountId }
    });

    revalidatePath(`/admin/products/${productId}/stock`);
}

export default async function ProductStockPage({ params }: StockPageProps) {
    const product = await db.product.findUnique({
        where: { id: params.productId },
        include: {
            accounts: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!product) {
        notFound();
    }

    const activeStock = product.accounts.filter(a => !a.isSold);
    const soldStock = product.accounts.filter(a => a.isSold);

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
                    <p className="text-gray-400 text-sm">Add or remove digital accounts for this product</p>
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
                                    Credentials / Codes
                                </label>
                                <textarea
                                    name="credentials"
                                    rows={10}
                                    className="w-full bg-snow-primary/10 border border-snow-primary/20 rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:border-snow-accent/50 transition-colors font-mono"
                                    placeholder={`username:password\nkey-1234-5678\n...`}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Paste multiple credentials, one per line.
                                </p>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-snow-accent text-[#020817] py-2.5 rounded-lg font-bold hover:bg-snow-accent/90 transition-colors flex items-center justify-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                Upload Stock
                            </button>
                        </form>
                    </div>

                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Active Stock</span>
                                <span className="text-green-400 font-mono">{activeStock.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Sold</span>
                                <span className="text-blue-400 font-mono">{soldStock.length}</span>
                            </div>
                            <div className="pt-3 border-t border-snow-primary/20 flex justify-between font-medium">
                                <span className="text-white">Total</span>
                                <span className="text-white font-mono">{product.accounts.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stock List */}
                <div className="lg:col-span-2 bg-[#0a1628] border border-snow-primary/20 rounded-xl overflow-hidden flex flex-col h-[600px]">
                    <div className="p-4 border-b border-snow-primary/20 bg-white/5">
                        <h3 className="font-semibold text-white">Inventory List</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-0">
                        {product.accounts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8">
                                <p>No stock available.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-[#020817] sticky top-0 z-10 text-xs uppercase font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Credentials</th>
                                        <th className="px-4 py-3 w-24">Status</th>
                                        <th className="px-4 py-3 w-24">Added</th>
                                        <th className="px-4 py-3 w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-snow-primary/10">
                                    {product.accounts.map((account) => (
                                        <tr key={account.id} className="hover:bg-white/5 group">
                                            <td className="px-4 py-3 font-mono text-xs text-white break-all">
                                                {account.isSold ? (
                                                    <span className="opacity-50 blur-[2px] hover:blur-none transition-all cursor-help" title="Sold">
                                                        {account.credentials}
                                                    </span>
                                                ) : (
                                                    account.credentials
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {account.isSold ? (
                                                    <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Sold</span>
                                                ) : (
                                                    <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded">Active</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-xs whitespace-nowrap">
                                                {new Date(account.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {!account.isSold && (
                                                    <form action={deleteAccount}>
                                                        <input type="hidden" name="productId" value={product.id} />
                                                        <input type="hidden" name="accountId" value={account.id} />
                                                        <button
                                                            type="submit"
                                                            className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                            title="Delete"
                                                        >
                                                            <Trash className="w-4 h-4" />
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
