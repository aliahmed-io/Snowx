import 'dotenv/config'
import { db as prisma } from '../lib/db'

console.log('Seed: Using lib/db instance');

async function main() {
    const setting = {
        common: {
            pageSize: 9,
            isMaintenanceMode: false,
            freeShippingMinPrice: 35,
            defaultTheme: 'light',
            defaultColor: 'gold',
        },
        site: {
            name: 'SnowX',
            url: 'https://snowx.io',
            logo: '/snowx2-icon.png',
            slogan: 'Premium Ice Experience',
            description: 'SnowX Premium Digital Subscriptions',
            keywords: 'subscriptions, gpt, netflix, spotify',
            email: 'contact@snowx.io',
            phone: '+123456789',
            author: 'SnowX Team',
            copyright: '2024 SnowX Inc.',
            address: '123 Ice Street',
        },
        carousels: [
            {
                title: 'Premium Access',
                url: '/products',
                image: '/images/banner1.jpg',
                buttonCaption: 'Shop Now',
            }
        ],
        availableLanguages: [
            { name: 'English', code: 'en-US' },
            { name: 'Arabic', code: 'ar' },
        ],
        defaultLanguage: 'en-US',
        availableCurrencies: [
            { name: 'United States Dollar', code: 'USD', symbol: '$', convertRate: 1 },
            { name: 'UAE Dirham', code: 'AED', symbol: 'AED', convertRate: 3.67 },
        ],
        defaultCurrency: 'USD',
        availablePaymentMethods: [
            { name: 'Stripe', commission: 0 },
        ],
        defaultPaymentMethod: 'Stripe',
        availableDeliveryDates: [
            { name: 'Instant', daysToDeliver: 0, shippingPrice: 0, freeShippingMinPrice: 0 },
        ],
        defaultDeliveryDate: 'Instant',
    }

    // Try to find first to see if it connects
    try {
        await prisma.setting.deleteMany()
        await prisma.setting.create({
            data: setting
        })
        console.log('✅ Settings seeded successfully')
    } catch (e) {
        console.error('❌ Seeding failed:', e)
        throw e
    }
}

main()
    .catch((e) => {
        console.error(e)
        // Ensure process exits with error code
        process.exit(1)
    })
// db connection management is handled by lib/db, but we can try to disconnect if needed
// In a script, usually not strictly necessary if process exits, but good practice if direct instance
