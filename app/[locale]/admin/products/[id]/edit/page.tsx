import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { getCategories } from "@/actions/categories";
import { ProductForm } from "../../new/ProductForm";

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditProductPageProps) {
    const { id } = await params;
    const product = await db.product.findUnique({ where: { id } });
    return {
        title: product ? `Edit ${product.name} | Admin | SnowX` : "Product Not Found",
    };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;

    const [product, categories] = await Promise.all([
        db.product.findUnique({ where: { id } }),
        getCategories(),
    ]);

    if (!product) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Edit Product</h1>
            <ProductForm
                categories={categories}
                product={{
                    ...product,
                    price: Number(product.price),
                    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
                }}
            />
        </div>
    );
}
