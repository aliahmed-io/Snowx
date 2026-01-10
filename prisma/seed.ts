
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

        // Seed Account Inventory (Product Pool)
        // 50 Sold, 50 Available for each product

        // Check keys count
        const count = await prisma.account.count({ where: { productId: product.id } });

        if (count === 0) {
            const accountsData = [];

            // 50 Available Accounts
            for (let i = 0; i < 50; i++) {
                accountsData.push({
                    serviceType: "Netflix", // Placeholder, ideally mapped from product category/slug
                    username: `user_${product.slug}_${i}@example.com`,
                    password: `encrypted_pass_${i}`, // Placeholder encryption
                    productId: product.id,
                    status: 'AVAILABLE'
                    // usage of enum string if TS complains
                });
            }

            // Create Available
            // Using implicit 'any' cast for simpler seed logic with enums
            await prisma.account.createMany({ data: accountsData as any });
        }
    }

    console.log('✅ Products & Account Pool seeded');

    // 4. Users
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

    // 5. Orders & Daily Stats
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(12, 0, 0, 0);

        const dailyOrderCount = Math.floor(Math.random() * 5) + 1;
        let dailyRevenue = 0;

        for (let k = 0; k < dailyOrderCount; k++) {
            const orderTotal = Math.floor(Math.random() * 100) + 20;
            dailyRevenue += orderTotal;

            const orderNum = `ORD-${date.getFullYear()}${date.getMonth()}-${date.getDate()}-${k}`;

            await prisma.order.upsert({
                where: { orderNumber: orderNum },
                update: {},
                create: {
                    orderNumber: orderNum,
                    status: OrderStatus.DELIVERED,
                    total: orderTotal,
                    subtotal: orderTotal,
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
                    // Create a sold account for this order
                    accounts: {
                        create: {
                            serviceType: 'Netflix',
                            username: `sold_user_${k}@example.com`,
                            password: `encrypted_pass_${k}`,
                            productId: entertainment?.id || products[0].categoryId || 'unknown',
                            userId: testUser.id,
                            status: 'SOLD',
                            purchaseDate: date
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
