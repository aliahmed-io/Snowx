
/* eslint-disable */
import { PrismaClient, OrderStatus, PaymentStatus, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Clean up (optional - decided to keep usage safe/upsert usually, but for fresh demo clear might be better. 
    // For now, we will just create if not exists or uses upsert)

    // 2. Categories
    const categories = [
        { name: 'Entertainment', slug: 'entertainment', description: 'Streaming services and entertainment apps' },
        { name: 'Productivity', slug: 'productivity', description: 'Tools to boost your efficiency' },
        { name: 'Design', slug: 'design', description: 'Creative software for designers' },
        { name: 'Development', slug: 'development', description: 'IDEs and developer tools' },
        { name: 'Security', slug: 'security', description: 'Antivirus and VPN services' }
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: {
                name: cat.name,
                slug: cat.slug,
                description: cat.description,
                image: `/categories/${cat.slug}.jpg` // Placeholder
            }
        });
    }

    console.log('✅ Categories seeded');

    // 3. Products
    const entertainment = await prisma.category.findUnique({ where: { slug: 'entertainment' } });
    const design = await prisma.category.findUnique({ where: { slug: 'design' } });

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

        // Convert status string to enum
        const status = p.status as ProductStatus;

        const product = await prisma.product.upsert({
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
                status: status,
                isActive: true,
                stockQuantity: 100
            }
        });

        // Seed License Keys (Product Pool)
        // 50 Active (Sold), 50 Available (Unsold) for each product

        // Check keys count
        const count = await prisma.licenseKey.count({ where: { productId: product.id } });

        if (count === 0) {
            const keysData = [];

            // 50 Sold keys
            for (let i = 0; i < 50; i++) {
                keysData.push({
                    key: `LICENSE-${product.slug.toUpperCase()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
                    productId: product.id,
                    status: 'ACTIVE', // Sold
                    // usage of enum string if TS complains, cast as any or import enum
                });
            }

            // 50 Available keys
            for (let i = 0; i < 50; i++) {
                keysData.push({
                    key: `POOL-${product.slug.toUpperCase()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
                    productId: product.id,
                    status: 'AVAILABLE'
                });
            }

            // Create many does not allow setting relations to other records easily in many cases if they differ
            // But here we are just setting pool. Sold ones usually need User/Order.
            // For simplicity in seed, we will create them "loose" first, then maybe link some.
            // Or just map and create.

            // Let's rely on type-safe loop for better relation handling if needed, 
            // or just createMany and assume 'ACTIVE' ones are just "sold" conceptually but not linked yet in this block.
            // We will link them in the Order loop later? Or just leave them as "Active" orphan for now (legacy data sim).

            // Actually best to create Available ones only here.
            // Sold ones will be created via Order simulation.

            // 100 Available Keys
            const poolData = Array(100).fill(null).map((_, i) => ({
                key: `POOL-${product.slug.toUpperCase()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
                productId: product.id,
                status: 'AVAILABLE'
            }));

            await prisma.licenseKey.createMany({ data: poolData as any }); // cast any to avoid enum strictness in pure script
        }
    }

    console.log('✅ Products & License Pool seeded');

    // 4. Users (Admin already exists likely, but let's ensure a test user)
    const testUser = await prisma.user.upsert({
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

    console.log('✅ Users seeded');

    // 5. Orders & Daily Stats (Historical Data for Charts)
    // Generate data for last 30 days
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(12, 0, 0, 0);

        // Random daily revenue between 500 and 2000
        const dailyOrderCount = Math.floor(Math.random() * 5) + 1;
        let dailyRevenue = 0;

        for (let k = 0; k < dailyOrderCount; k++) {
            const orderTotal = Math.floor(Math.random() * 100) + 20;
            dailyRevenue += orderTotal;

            // Create Order (only if not already plenty)
            // Check loosely or just create. For seed, creating extra is usually fine unless unique constraints.
            // Order number unique.
            const orderNum = `ORD-${date.getFullYear()}${date.getMonth()}-${date.getDate()}-${k}`;

            await prisma.order.upsert({
                where: { orderNumber: orderNum },
                update: {},
                create: {
                    orderNumber: orderNum,
                    status: OrderStatus.DELIVERED,
                    total: orderTotal,
                    subtotal: orderTotal, // Simplified
                    tax: 0,
                    shipping: 0,
                    userId: testUser.id,
                    createdAt: date,
                    payment: {
                        create: {
                            amount: orderTotal,
                            provider: 'paypal',
                            status: PaymentStatus.COMPLETED,
                            currency: 'USD'
                        }
                    },
                    // Create a sold license for this order (conceptually linking to one of the products)
                    // For simplicity, we just create a NEW license here key rather than taking from pool
                    // to avoid complex logic in seed.
                    licenses: {
                        create: {
                            key: `SOLD-${orderNum}-Key`,
                            status: 'ACTIVE',
                            productId: entertainment?.id || products[0].categoryId || 'unknown', // Fallback
                            userId: testUser.id
                        }
                    }
                }
            });
        }

        // Upsert DailyStat
        await prisma.dailyStat.upsert({
            where: { date: date }, // Date unique? Schema says yes. Needs exact ISO match maybe?
            // Schema: date DateTime @unique @default(now())
            // Prisma typically handles Date objects well.
            update: {
                totalRevenue: dailyRevenue,
                totalOrders: dailyOrderCount
            },
            create: {
                date: date,
                totalRevenue: dailyRevenue,
                totalOrders: dailyOrderCount,
                totalVisitors: Math.floor(Math.random() * 100) + dailyOrderCount * 2
            }
        });
    }

    console.log('✅ Orders & Stats seeded');

    // 6. Banners
    await prisma.banner.upsert({
        where: { id: 'seed-banner-1' },
        update: {},
        create: {
            id: 'seed-banner-1',
            title: 'Summer Sale',
            description: 'Get 50% off all productivity apps',
            image: 'https://placehold.co/1920x600/101010/FFF?text=Summer+Sale',
            link: '/products?category=productivity',
            type: 'MAIN',
            isActive: true,
            order: 1
        }
    });

    console.log('✅ Banners seeded');
    console.log('🏁 Seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
