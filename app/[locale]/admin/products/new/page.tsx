import { db } from "@/lib/db";
import { ProductForm } from "./ProductForm";
import { getFilterOptions } from "@/actions/filters";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "New Product | Admin | SnowX",
};

export default async function NewProductPage() {
    const [categories, durationOptions, platformOptions] = await Promise.all([
        db.category.findMany({ orderBy: { name: 'asc' } }),
        getFilterOptions("duration"),
        getFilterOptions("platform")
    ]);

    return (
        <ProductForm
            categories={categories}
            durations={durationOptions.map(d => d.value)}
            platforms={platformOptions.map(p => p.value)}
        />
    );
}
