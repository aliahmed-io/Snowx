import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import { slugify } from "@/lib/utils";
import { redirect } from "next/navigation";

async function createProduct(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const categoryId = formData.get("categoryId") as string;
    const isActive = formData.get("isActive") === "on";
    const isFeatured = formData.get("isFeatured") === "on";
    const images = formData.getAll("images") as string[];

    if (!name || !price || !categoryId) return;

    await db.product.create({
        data: {
            name,
            slug: slugify(name) + "-" + Date.now().toString().slice(-4), // Simple unique slug
            description,
            price,
            categoryId,
            isActive,
            isFeatured,
            images
        }
    });

    redirect("/admin/products");
}

export default async function NewProductPage() {
    const categories = await db.category.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Create Product</h2>
                <p className="text-gray-400 mt-2">Add a new item to your catalog</p>
            </div>

            <ProductForm categories={categories} action={createProduct} />
        </div>
    );
}
