
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderStatus, PaymentStatus, LicenseStatus, ProductStatus } from "@prisma/client";

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

            // Seed License Pool
            const count = await db.licenseKey.count({ where: { productId: product.id } });
            if (count === 0) {
                const poolData = Array(50).fill(null).map(() => ({
                    key: `POOL-${product.slug.toUpperCase()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
                    productId: product.id,
                    status: LicenseStatus.AVAILABLE
                }));
                await db.licenseKey.createMany({ data: poolData });
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
                    licenses: {
                        create: {
                            key: `SOLD-${orderNum}-KEY`,
                            status: LicenseStatus.ACTIVE,
                            productId: products[0].slug === 'netflix-premium-1-year' ? (await db.product.findUnique({ where: { slug: products[0].slug } }))!.id : 'unknown',
                            userId: testUser.id
                        }
                    }
                }
            });
        }

        return NextResponse.json({ success: true, message: "Database seeded successfully" });
    } catch (error) {
        console.error("Seed failed:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
