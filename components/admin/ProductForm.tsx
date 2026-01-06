"use client";

import { useState } from "react";
import { useRouter } from "@/navigation";
import { Loader2, Plus, Save, Upload, X } from "lucide-react";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";

interface Category {
    id: string;
    name: string;
}

interface ProductFormProps {
    categories: Category[];
    initialData?: {
        id: string;
        name: string;
        description: string;
        price: number;
        categoryId: string;
        images: string[];
        isActive: boolean;
        isFeatured: boolean;
    };
    action: (formData: FormData) => Promise<void>;
}

export function ProductForm({ categories, initialData, action }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>(initialData?.images || []);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        try {
            // Append images manually since they are state-managed (mocking upload for now)
            formData.set("images", JSON.stringify(images));
            await action(formData);
            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleImageAdd = () => {
        // Mock image upload functionality
        const url = prompt("Enter image URL:");
        if (url) {
            setImages([...images, url]);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#0a1628] border border-snow-primary/20 p-6 rounded-xl space-y-4">
                        <h3 className="text-lg font-semibold text-white">Product Details</h3>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-400">Name</label>
                            <input
                                name="name"
                                defaultValue={initialData?.name}
                                required
                                className="bg-snow-primary/10 border border-snow-primary/20 rounded-lg p-2.5 text-white focus:border-snow-accent/50 focus:outline-none"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-400">Description</label>
                            <textarea
                                name="description"
                                defaultValue={initialData?.description}
                                required
                                rows={4}
                                className="bg-snow-primary/10 border border-snow-primary/20 rounded-lg p-2.5 text-white focus:border-snow-accent/50 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-[#0a1628] border border-snow-primary/20 p-6 rounded-xl space-y-4">
                        <h3 className="text-lg font-semibold text-white">Media</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {images.map((url, i) => (
                                <div key={i} className="relative aspect-square rounded-lg overflow-hidden group bg-black/40">
                                    <Image src={url} alt="" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                        className="absolute top-2 right-2 bg-red-500/80 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleImageAdd}
                                className="aspect-square rounded-lg border-2 border-dashed border-snow-primary/20 hover:border-snow-accent/50 hover:bg-snow-accent/5 flex flex-col items-center justify-center text-gray-500 hover:text-snow-accent transition-all"
                            >
                                <Upload className="w-8 h-8 mb-2" />
                                <span className="text-xs">Add Image</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[#0a1628] border border-snow-primary/20 p-6 rounded-xl space-y-4">
                        <h3 className="text-lg font-semibold text-white">Status</h3>

                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-400">Active Status</label>
                            <input
                                type="checkbox"
                                name="isActive"
                                defaultChecked={initialData?.isActive ?? true}
                                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-snow-accent"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-400">Featured Product</label>
                            <input
                                type="checkbox"
                                name="isFeatured"
                                defaultChecked={initialData?.isFeatured ?? false}
                                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-snow-accent"
                            />
                        </div>
                    </div>

                    <div className="bg-[#0a1628] border border-snow-primary/20 p-6 rounded-xl space-y-4">
                        <h3 className="text-lg font-semibold text-white">Pricing & Category</h3>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-400">Price (USD)</label>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                defaultValue={initialData?.price}
                                required
                                className="bg-snow-primary/10 border border-snow-primary/20 rounded-lg p-2.5 text-white focus:border-snow-accent/50 focus:outline-none"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-400">Category</label>
                            <select
                                name="categoryId"
                                defaultValue={initialData?.categoryId}
                                required
                                className="bg-snow-primary/10 border border-snow-primary/20 rounded-lg p-2.5 text-white focus:border-snow-accent/50 focus:outline-none"
                            >
                                <option value="" disabled>Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 rounded-lg text-gray-400 hover:text-white"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-snow-accent text-[#020817] px-8 py-2.5 rounded-lg font-bold hover:bg-snow-accent/90 transition-colors flex items-center gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Product
                </button>
            </div>
        </form>
    );
}
