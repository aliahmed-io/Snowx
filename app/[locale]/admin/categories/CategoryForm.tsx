"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "@/actions/categories";

export function CategoryForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        image: "",
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
        setSuccess(false);

        try {
            await createCategory({
                name: formData.name,
                slug: formData.slug || generateSlug(formData.name),
                description: formData.description || undefined,
                image: formData.image || undefined,
            });

            setSuccess(true);
            setFormData({ name: "", slug: "", description: "", image: "" });
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg p-3 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-300 rounded-lg p-3 text-sm">
                    Category created successfully!
                </div>
            )}

            <div>
                <label className="block text-gray-400 text-sm mb-2">Name *</label>
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
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-snow-accent"
                    placeholder="AI Tools"
                />
            </div>

            <div>
                <label className="block text-gray-400 text-sm mb-2">Slug *</label>
                <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-snow-accent"
                    placeholder="ai-tools"
                />
            </div>

            <div>
                <label className="block text-gray-400 text-sm mb-2">Description</label>
                <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-snow-accent resize-none"
                    placeholder="Premium AI subscriptions..."
                />
            </div>

            <div>
                <label className="block text-gray-400 text-sm mb-2">Image URL</label>
                <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-snow-accent"
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-snow-accent text-gray-900 font-bold py-3 rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50"
            >
                {loading ? "Creating..." : "Create Category"}
            </button>
        </form>
    );
}
