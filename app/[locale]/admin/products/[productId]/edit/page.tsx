import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import { notFound, redirect } from "next/navigation";

interface EditPageProps {
    params: Promise<{
        productId: string;
    }>;
}

async function updateProduct(id: string, formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const categoryId = formData.get("categoryId") as string;
    const isActive = formData.get("isActive") === "on";
    const isFeatured = formData.get("isFeatured") === "on";
    const images = formData.getAll("images") as string[];

    await db.product.update({
        where: { id },
        data: {
            name,
            description,
            price,
            categoryId,
            isActive,
            isFeatured,
            images,
            // Only update slug if name changes? Simplification: Don't update slug to preserve SEO URLs
        }
    });

    redirect("/admin/products");
}

export default async function EditProductPage({ params }: EditPageProps) {
    const { productId } = await params;
    const [product, categories] = await Promise.all([
        db.product.findUnique({ where: { id: productId } }),
        db.category.findMany({ orderBy: { name: 'asc' } })
    ]);

    if (!product) notFound();

    const updateAction = updateProduct.bind(null, product.id);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Edit Product</h2>
                <p className="text-gray-400 mt-2">Update product details</p>
            </div>

            <ProductForm
                categories={categories}
                initialData={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: Number(product.price),
                    categoryId: product.categoryId,
                    images: product.images,
                    isActive: product.isActive,
                    isFeatured: product.isFeatured,
                    stockQuantity: product.stockQuantity
                }}
                action={updateAction}
            />
        </div>
    );
}
