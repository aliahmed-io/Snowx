import 'dotenv/config'
import { db as prisma } from '../lib/db'

console.log('Seed: Using lib/db instance');

async function main() {
    const settings = [
        {
            key: 'common',
            value: JSON.stringify({
                pageSize: 9,
                isMaintenanceMode: false,
                freeShippingMinPrice: 35,
                defaultTheme: 'light',
                defaultColor: 'gold',
            }),
            description: 'Common application settings'
        },
        {
            key: 'site',
            value: JSON.stringify({
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
            }),
            description: 'Site information'
        },
        {
            key: 'carousels',
            value: JSON.stringify([
                {
                    title: 'Premium Access',
                    url: '/products',
                    image: '/images/banner1.jpg',
                    buttonCaption: 'Shop Now',
                }
            ]),
            description: 'Homepage carousel items'
        },
        {
            key: 'localization',
            value: JSON.stringify({
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
            }),
            description: 'Localization settings'
        },
        {
            key: 'payment',
            value: JSON.stringify({
                availablePaymentMethods: [
                    { name: 'Stripe', commission: 0 },
                ],
                defaultPaymentMethod: 'Stripe',
            }),
            description: 'Payment settings'
        },
        {
            key: 'delivery',
            value: JSON.stringify({
                availableDeliveryDates: [
                    { name: 'Instant', daysToDeliver: 0, shippingPrice: 0, freeShippingMinPrice: 0 },
                ],
                defaultDeliveryDate: 'Instant',
            }),
            description: 'Delivery settings'
        }
    ]

    // Clear existing and insert new settings
    try {
        await prisma.systemSetting.deleteMany()

        for (const setting of settings) {
            await prisma.systemSetting.upsert({
                where: { key: setting.key },
                update: { value: setting.value, description: setting.description },
                create: setting
            })
        }

        console.log('✅ Settings seeded successfully')
    } catch (e) {
        console.error('❌ Seeding failed:', e)
        throw e
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
