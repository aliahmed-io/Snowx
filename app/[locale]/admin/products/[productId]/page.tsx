import { redirect } from "next/navigation";

interface AdminProductPageProps {
    params: Promise<{ productId: string }>;
}

export default async function AdminProductPage({ params }: AdminProductPageProps) {
    const { productId } = await params;
    redirect(`/admin/products/${productId}/edit`);
}
