import { getCategories } from "@/actions/categories";
import { CategoryForm } from "./CategoryForm";
import { CategoryActions } from "./CategoryActions";
import Image from "next/image";

export const metadata = {
    title: "Categories | Admin | SnowX",
};

export default async function AdminCategoriesPage() {
    const categories = await getCategories();

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Categories</h1>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Add Category Form */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Add Category</h2>
                    <CategoryForm />
                </div>

                {/* Categories List */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">All Categories</h2>

                    {categories.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No categories yet</p>
                    ) : (
                        <div className="space-y-3">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        {category.image ? (
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                                                <Image
                                                    src={category.image}
                                                    alt=""
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-600">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-white font-medium">{category.name}</p>
                                            <p className="text-gray-500 text-sm">{category.productCount} products</p>
                                        </div>
                                    </div>
                                    <CategoryActions category={category} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

