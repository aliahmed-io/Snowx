"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory, updateCategory } from "@/actions/categories";
import { Pencil, Trash2, X, Check, Loader2 } from "lucide-react";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    productCount: number;
}

interface CategoryActionsProps {
    category: Category;
}

export function CategoryActions({ category }: CategoryActionsProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
    });

    const handleDelete = async () => {
        if (category.productCount > 0) {
            alert(`Cannot delete category with ${category.productCount} products. Please reassign or delete the products first.`);
            return;
        }

        if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteCategory(category.id);
            router.refresh();
        } catch (error) {
            console.error("Failed to delete category:", error);
            alert("Failed to delete category");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await updateCategory(category.id, {
                name: editData.name,
                slug: editData.slug,
                description: editData.description || null,
            });
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to update category:", error);
            alert("Failed to update category");
        } finally {
            setLoading(false);
        }
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="bg-white/10 border border-white/20 text-white rounded px-2 py-1 text-sm w-24"
                    placeholder="Name"
                />
                <input
                    type="text"
                    value={editData.slug}
                    onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                    className="bg-white/10 border border-white/20 text-white rounded px-2 py-1 text-sm w-24"
                    placeholder="Slug"
                />
                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                </button>
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setEditData({
                            name: category.name,
                            slug: category.slug,
                            description: category.description || "",
                        });
                    }}
                    className="p-1.5 rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm mr-2">{category.slug}</span>
            <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                title="Edit"
            >
                <Pencil className="w-4 h-4" />
            </button>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                title={category.productCount > 0 ? `Cannot delete: ${category.productCount} products` : "Delete"}
            >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
        </div>
    );
}
