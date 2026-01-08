import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/actions/products";
import { AddToCartButton } from "./AddToCartButton";
import Image from "next/image";
import { Link } from "@/navigation";

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Product Not Found | SnowX" };

    return {
        title: `${product.name} | SnowX`,
        description: product.description.slice(0, 160),
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const discount = product.comparePrice
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;

    // Get related products
    const { products: relatedProducts } = await getProducts({
        categorySlug: product.category.slug,
        limit: 4,
    });

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm">
                <ol className="flex items-center gap-2 text-gray-400">
                    <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                    <li>/</li>
                    <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
                    <li>/</li>
                    <li><Link href={`/products?category=${product.category.slug}`} className="hover:text-white transition-colors">{product.category.name}</Link></li>
                    <li>/</li>
                    <li className="text-white">{product.name}</li>
                </ol>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square relative rounded-3xl overflow-hidden bg-linear-to-br from-gray-800 to-gray-900 border border-white/10">
                        {product.images[0] ? (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Thumbnail gallery */}
                    {product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.slice(0, 4).map((img, i) => (
                                <div key={i} className="aspect-square relative bg-gray-900/50 rounded-lg overflow-hidden border border-white/10">
                                    <Image
                                        src={img}
                                        alt=""
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <span className="text-snow-accent text-sm font-medium uppercase tracking-wider">
                        {product.category.name}
                    </span>

                    <h1 className="text-4xl font-bold text-white mt-2 mb-4">{product.name}</h1>

                    {/* Rating */}
                    {product.reviews.length > 0 && (
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.round(product.avgRating) ? "text-yellow-400" : "text-gray-600"}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-gray-400">({product.reviews.length} reviews)</span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-4xl font-bold text-white">${product.price.toFixed(2)}</span>
                        {product.comparePrice && (
                            <>
                                <span className="text-xl text-gray-500 line-through">${product.comparePrice.toFixed(2)}</span>
                                <span className="bg-linear-to-r from-rose-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                    Save {discount}%
                                </span>
                            </>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 mb-8 leading-relaxed">{product.description}</p>

                    {/* Add to Cart */}
                    <AddToCartButton
                        product={{
                            id: product.id,
                            name: product.name,
                            slug: product.slug,
                            price: product.price,
                            image: product.images[0] || "",
                        }}
                    />

                    {/* Features */}
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <h3 className="text-white font-semibold mb-4">Why SnowX?</h3>
                        <ul className="space-y-3">
                            {[
                                "Instant digital delivery",
                                "Secure payment with Stripe",
                                "24/7 customer support",
                                "Money-back guarantee",
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-400">
                                    <svg className="w-5 h-5 text-snow-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Reviews section */}
            {product.reviews.length > 0 && (
                <div className="mt-16 pt-16 border-t border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-8">Customer Reviews</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {product.reviews.map((review) => (
                            <div key={review.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-snow-accent/20 flex items-center justify-center text-snow-accent font-bold">
                                        {review.user.firstName?.[0] || "U"}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">
                                            {review.user.firstName} {review.user.lastName}
                                        </p>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-600"}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {review.title && <h4 className="text-white font-medium mb-2">{review.title}</h4>}
                                {review.comment && <p className="text-gray-400">{review.comment}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Related products */}
            {relatedProducts.filter((p) => p.id !== product.id).length > 0 && (
                <div className="mt-16 pt-16 border-t border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-8">Related Products</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts
                            .filter((p) => p.id !== product.id)
                            .slice(0, 4)
                            .map((p) => (
                                <Link key={p.id} href={`/products/${p.slug}`} className="group">
                                    <div className="aspect-square relative bg-gray-900/50 rounded-xl overflow-hidden border border-white/10 group-hover:border-snow-accent/50 transition-all mb-3">
                                        {p.images[0] ? (
                                            <Image
                                                src={p.images[0]}
                                                alt={p.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-white font-medium group-hover:text-snow-accent transition-colors">{p.name}</h3>
                                    <p className="text-snow-accent font-bold">${p.price.toFixed(2)}</p>
                                </Link>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
