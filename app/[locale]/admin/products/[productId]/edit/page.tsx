import { db } from "@/lib/db";
import { ProductForm } from "../../new/ProductForm";
import { getFilterOptions } from "@/actions/filters";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface EditPageProps {
    params: Promise<{
        productId: string;
    }>;
}

export default async function EditProductPage({ params }: EditPageProps) {
    const { productId } = await params;

    const [product, categories, durationOptions, platformOptions] = await Promise.all([
        db.product.findUnique({ where: { id: productId } }),
        db.category.findMany({ orderBy: { name: 'asc' } }),
        getFilterOptions("duration"),
        getFilterOptions("platform")
    ]);

    if (!product) notFound();

    return (
        <ProductForm
            categories={categories}
            durations={durationOptions.map(d => d.value)}
            platforms={platformOptions.map(p => p.value)}
            product={{
                id: product.id,
                name: product.name,
                nameAr: product.nameAr,
                slug: product.slug,
                description: product.description,
                descriptionAr: product.descriptionAr,
                price: Number(product.price),
                discountPercentage: product.discountPercentage,
                images: product.images,
                categoryId: product.categoryId,
                inventory: product.stockQuantity,
                isActive: product.isActive,
                duration: product.duration,
                platform: product.platform,
            }}
        />
    );
}
