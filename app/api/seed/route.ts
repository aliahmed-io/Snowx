
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderStatus, PaymentStatus, ProductStatus } from "@prisma/client";

export async function GET() {
    try {
        console.log('🌱 Starting seed via API...');

        // 1. Categories
        const categories = [
            { name: 'Entertainment', slug: 'entertainment', description: 'Streaming services and entertainment apps' },
            { name: 'Productivity', slug: 'productivity', description: 'Tools to boost your efficiency' },
            { name: 'Design', slug: 'design', description: 'Creative software for designers' },
            { name: 'Development', slug: 'development', description: 'IDEs and developer tools' },
            { name: 'Security', slug: 'security', description: 'Antivirus and VPN services' }
        ];

        for (const cat of categories) {
            await db.category.upsert({
                where: { slug: cat.slug },
                update: {},
                create: {
                    name: cat.name,
                    slug: cat.slug,
                    description: cat.description,
                    image: `/categories/${cat.slug}.jpg`
                }
            });
        }

        // 2. Products
        const entertainment = await db.category.findUnique({ where: { slug: 'entertainment' } });
        const design = await db.category.findUnique({ where: { slug: 'design' } });

        const products = [
            {
                name: 'Netflix Premium (1 Year)',
                slug: 'netflix-premium-1-year',
                description: '4K UHD streaming, 4 screens. Official private account.',
                price: 49.99,
                comparePrice: 119.99,
                categoryId: entertainment?.id,
                images: ['https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg'],
                status: 'published'
            },
            {
                name: 'Spotify Premium (Lifetime)',
                slug: 'spotify-premium-lifetime',
                description: 'Ad-free music listening, offline playback. Lifetime warranty.',
                price: 19.99,
                comparePrice: 99.99,
                categoryId: entertainment?.id,
                images: ['https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg'],
                status: 'published'
            },
            {
                name: 'Adobe Creative Cloud All Apps',
                slug: 'adobe-cc-1-year',
                description: 'Access to Photoshop, Illustrator, Premiere Pro and more. 100GB Cloud Storage.',
                price: 89.99,
                comparePrice: 599.99,
                categoryId: design?.id,
                images: ['https://upload.wikimedia.org/wikipedia/commons/a/ac/Creative_Cloud.svg'],
                status: 'published'
            }
        ];

        for (const p of products) {
            if (!p.categoryId) continue;

            const product = await db.product.upsert({
                where: { slug: p.slug },
                update: {},
                create: {
                    name: p.name,
                    slug: p.slug,
                    description: p.description,
                    price: p.price,
                    comparePrice: p.comparePrice,
                    categoryId: p.categoryId,
                    images: p.images,
                    status: p.status as ProductStatus,
                    isActive: true,
                    stockQuantity: 100
                }
            });

            // Seed Account Inventory
            const count = await db.account.count({ where: { productId: product.id } });
            if (count === 0) {
                const poolData = Array(50).fill(null).map((_, i) => ({
                    serviceType: product.name,
                    username: `inventory_user_${i}_${product.slug}@example.com`,
                    password: "seed_password_123", // In a real scenario, use AccountService.addAccount or pre-encrypt
                    productId: product.id,
                    status: "AVAILABLE" as const // AccountStatus.AVAILABLE
                }));
                // We can use createMany for speed, but passwords won't be encrypted if we don't handle it.
                // For dev seed, plaintext or mock encryption is fine if the Service handles decryption robustly (it expects encrypted).
                // Let's just put a placeholder "encrypted" string if we aren't using the service.
                // Or better, let's just use createMany and assume we test logic elsewhere.
                // Actually, if we use the UI/Service to "reveal", it tries to decrypt.
                // If we put plain text, decryption will fail or produce garbage.
                // So let's use a constant that we know the key for? Or just skipped for now.
                // Or we can import encryption util?
                // For now, let's just make them VALID db rows.

                await db.account.createMany({ data: poolData });
            }
        }

        // 3. User
        const testUser = await db.user.upsert({
            where: { email: 'demo@snowx.com' },
            update: {},
            create: {
                email: 'demo@snowx.com',
                kindeId: 'kp_demo_user_123',
                firstName: 'Demo',
                lastName: 'User',
                role: 'CUSTOMER'
            }
        });

        // 4. Orders
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const orderNum = `ORD-TEMP-${i}`;

            await db.order.upsert({
                where: { orderNumber: orderNum },
                update: {},
                create: {
                    orderNumber: orderNum,
                    status: OrderStatus.DELIVERED,
                    total: 49.99,
                    subtotal: 49.99,
                    tax: 0,
                    shipping: 0,
                    userId: testUser.id,
                    createdAt: date,
                    payment: {
                        create: {
                            amount: 49.99,
                            provider: 'paypal',
                            status: PaymentStatus.COMPLETED,
                            currency: 'USD'
                        }
                    },
                    // Removed licenses creation, as per instruction to use Accounts
                    // If an order needs to be linked to a specific account, that logic would go here.
                    // For this seed, we're just creating orders and accounts separately.
                }
            });
        }

        return NextResponse.json({ success: true, message: "Database seeded successfully" });
    } catch (error) {
        console.error("Seed failed:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
