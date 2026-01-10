import { db } from "@/lib/db";
import { Link } from "@/navigation";
import {
    ArrowLeft,
    Trash2,
    Plus
} from "lucide-react";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AccountStatus } from "@prisma/client";
import { AccountService } from "@/lib/services/account-service";
import { CsvImport } from "@/components/admin/CsvImport";

interface StockPageProps {
    params: Promise<{
        productId: string;
    }>;
}

async function addStock(formData: FormData) {
    "use server";

    const productId = formData.get("productId") as string;
    const accountsRaw = formData.get("accounts") as string; // username:password

    if (!productId || !accountsRaw) return;

    // Get product to determine service type (fallback to product name)
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) return;

    // Split by newlines for bulk add
    const lines = accountsRaw.split('\n').filter(line => line.trim() !== '');

    for (const line of lines) {
        // Expected format: username:password or just username (password generated?) - No, usually pairs.
        // Let's assume username:password
        const [username, password] = line.split(':').map(s => s.trim());

        if (username) {
            await AccountService.addAccount({
                productId,
                serviceType: product.name, // Use product name as service type for now
                username,
                password: password || "ChangeMe123!", // Fallback if missing
                notes: "Bulk added via Product Stock page"
            });
        }
    }

    revalidatePath(`/admin/products/${productId}/stock`);
}

async function deleteAccount(formData: FormData) {
    "use server";
    const accountId = formData.get("accountId") as string;
    const productId = formData.get("productId") as string;

    // Only allow deleting AVAILABLE accounts directly here
    await db.account.deleteMany({
        where: {
            id: accountId,
            status: AccountStatus.AVAILABLE
        }
    });

    revalidatePath(`/admin/products/${productId}/stock`);
}

export default async function ProductStockPage({ params }: StockPageProps) {
    const { productId } = await params;
    const product = await db.product.findUnique({
        where: { id: productId },
        include: {
            accounts: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!product) {
        notFound();
    }

    const activeStock = product.accounts.filter(l => l.status === AccountStatus.AVAILABLE);
    const soldStock = product.accounts.filter(l => l.status === AccountStatus.SOLD);

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
                    <p className="text-gray-400 text-sm">Add or remove account credentials for this product</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Form */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-snow-accent" />
                            Add Accounts
                        </h3>
                        <form action={addStock} className="space-y-4">
                            <input type="hidden" name="productId" value={product.id} />
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Credentials (User:Pass)
                                </label>
                                <textarea
                                    name="accounts"
                                    rows={10}
                                    className="w-full bg-snow-primary/10 border border-snow-primary/20 rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:border-snow-accent/50 transition-colors font-mono"
                                    placeholder={`user1:pass1\nuser2:pass2\n...`}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Paste multiple accounts, one per line. Format: <code>username:password</code>
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

                        <CsvImport productId={product.id} />
                    </div>

                    <div className="bg-[#0a1628] border border-snow-primary/20 rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Available</span>
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
                        <h3 className="font-semibold text-white">Account Inventory</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-0">
                        {product.accounts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8">
                                <p>No accounts found.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-[#020817] sticky top-0 z-10 text-xs uppercase font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Username</th>
                                        <th className="px-4 py-3 w-24">Status</th>
                                        <th className="px-4 py-3 w-24">Order</th>
                                        <th className="px-4 py-3 w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-snow-primary/10">
                                    {product.accounts.map((account) => (
                                        <tr key={account.id} className="hover:bg-white/5 group">
                                            <td className="px-4 py-3 font-mono text-xs text-white break-all">
                                                {account.username}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-0.5 rounded ${account.status === AccountStatus.AVAILABLE ? 'bg-green-500/10 text-green-400' :
                                                    account.status === AccountStatus.SOLD ? 'bg-blue-500/10 text-blue-400' :
                                                        'bg-red-500/10 text-red-400'
                                                    }`}>
                                                    {account.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs whitespace-nowrap">
                                                {account.orderId ? (
                                                    <span className="text-blue-300">Ordered</span>
                                                ) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {account.status === AccountStatus.AVAILABLE && (
                                                    <form action={deleteAccount}>
                                                        <input type="hidden" name="productId" value={product.id} />
                                                        <input type="hidden" name="accountId" value={account.id} />
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
