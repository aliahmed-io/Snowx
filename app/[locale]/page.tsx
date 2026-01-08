import { HomeBanner } from "@/components/home/HomeBanner";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { getProducts } from "@/actions/products";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations('Home');
  const featuredProducts = await getProducts({ featured: true, limit: 4 });

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. Banner Section */}
      <HomeBanner />

      {/* 2. Category Showcase */}
      <CategoryShowcase />

      {/* 3. Featured Items */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{t('featuredItems')}</h2>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
    </main>
  );
}
