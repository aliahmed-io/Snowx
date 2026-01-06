import { getCategories } from "@/actions/categories";
import { ProductForm } from "./ProductForm";

export const metadata = {
    title: "New Product | Admin | SnowX",
};

export default async function NewProductPage() {
    const categories = await getCategories();

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">New Product</h1>
            <ProductForm categories={categories} />
        </div>
    );
}
