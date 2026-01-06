"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/actions/products";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface ProductFormProps {
    categories: Category[];
    product?: {
        id: string;
        name: string;
        slug: string;
        description: string;
        price: number;
        comparePrice?: number | null;
        images: string[];
        categoryId: string;
        inventory: number;
        isActive: boolean;
        isFeatured: boolean;
    };
}

export function ProductForm({ categories, product }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: product?.name || "",
        slug: product?.slug || "",
        description: product?.description || "",
        price: product?.price?.toString() || "",
        comparePrice: product?.comparePrice?.toString() || "",
        images: product?.images?.join("\n") || "",
        categoryId: product?.categoryId || "",
        inventory: product?.inventory?.toString() || "0",
        isActive: product?.isActive ?? true,
        isFeatured: product?.isFeatured || false,
    });

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = {
                name: formData.name,
                slug: formData.slug || generateSlug(formData.name),
                description: formData.description,
                price: parseFloat(formData.price),
                comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
                images: formData.images.split("\n").filter((url) => url.trim()),
                categoryId: formData.categoryId,
                inventory: parseInt(formData.inventory),
                isActive: formData.isActive,
                isFeatured: formData.isFeatured,
            };

            if (product) {
                await updateProduct(product.id, data);
            } else {
                await createProduct(data);
            }

            router.push("/admin/products");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg p-4">
                    {error}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-400 text-sm mb-2">Product Name *</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                name: e.target.value,
                                slug: formData.slug || generateSlug(e.target.value),
                            });
                        }}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-snow-accent"
                        placeholder="GPT Plus Subscription"
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-2">Slug *</label>
                    <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-snow-accent"
                        placeholder="gpt-plus-subscription"
                    />
                </div>
            </div>

            <div>
                <label className="block text-gray-400 text-sm mb-2">Description *</label>
                <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-snow-accent resize-none"
                    placeholder="Full access to ChatGPT Plus with all premium features..."
                />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-gray-400 text-sm mb-2">Price ($) *</label>
                    <input
                        type="number"
                        required
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-snow-accent"
                        placeholder="19.99"
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-2">Compare Price ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.comparePrice}
                        onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-snow-accent"
                        placeholder="29.99"
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-2">Inventory</label>
                    <input
                        type="number"
                        min="0"
                        value={formData.inventory}
                        onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-snow-accent"
                        placeholder="100"
                    />
                </div>
            </div>

            <div>
                <label className="block text-gray-400 text-sm mb-2">Category *</label>
                <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-snow-accent"
                >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-gray-400 text-sm mb-2">Image URLs (one per line)</label>
                <textarea
                    rows={3}
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-snow-accent resize-none font-mono text-sm"
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                />
            </div>

            <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-5 h-5 rounded border-white/20 bg-white/10 text-snow-accent focus:ring-snow-accent"
                    />
                    <span className="text-white">Active</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-5 h-5 rounded border-white/20 bg-white/10 text-snow-accent focus:ring-snow-accent"
                    />
                    <span className="text-white">Featured</span>
                </label>
            </div>

            <div className="flex items-center gap-4 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-snow-accent text-gray-900 font-bold px-6 py-3 rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Saving...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {product ? "Update Product" : "Create Product"}
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="text-gray-400 hover:text-white transition-colors px-6 py-3"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
