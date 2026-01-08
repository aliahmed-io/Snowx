
/* eslint-disable */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Enums manually defined since we can't import from client in JS easily without compilation sometimes
// But actually require('@prisma/client') exports them usually.
// We'll use strings to be safe or try to destructure.
const { OrderStatus, PaymentStatus, ProductStatus } = require('@prisma/client');

async function main() {
    console.log('🌱 Starting seed...');

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
                image: `/categories/${cat.slug}.jpg`
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

        await prisma.product.upsert({
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
                status: p.status || 'published',
                isActive: true,
                stockQuantity: 100
            }
        });

        // Get product to get ID
        const product = await prisma.product.findUnique({ where: { slug: p.slug } });
        if (!product) continue;

        // Seed License Pool
        const count = await prisma.licenseKey.count({ where: { productId: product.id } });
        if (count === 0) {
            const poolData = Array(50).fill(null).map((_, i) => ({
                key: `POOL-${product.slug.toUpperCase()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
                productId: product.id,
                status: 'AVAILABLE'
            }));
            await prisma.licenseKey.createMany({ data: poolData });
        }
    }

    console.log('✅ Products & License Pool seeded');

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
                    status: 'DELIVERED', // String if enum issue, but imported constant preferred
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
                            status: 'COMPLETED',
                            currency: 'USD'
                        }
                    },
                    licenses: {
                        create: {
                            key: `SOLD-${orderNum}-KEY`,
                            status: 'ACTIVE',
                            productId: entertainment?.id, // Simplified
                            userId: testUser.id
                        }
                    }
                }
            });
        }

        await prisma.dailyStat.upsert({
            where: { date: date },
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
