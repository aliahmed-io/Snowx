import { z } from 'zod'

export const SiteLanguageSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    code: z.string().min(1, 'Code is required'),
})

export const CarouselSchema = z.object({
    title: z.string().min(1, 'title is required'),
    url: z.string().min(1, 'url is required'),
    image: z.string().min(1, 'image is required'),
    buttonCaption: z.string().min(1, 'buttonCaption is required'),
})

export const SiteCurrencySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    code: z.string().min(1, 'Code is required'),
    convertRate: z.coerce.number().min(0, 'Convert rate must be at least 0'),
    symbol: z.string().min(1, 'Symbol is required'),
})

export const PaymentMethodSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    commission: z.coerce.number().min(0, 'Commission must be at least 0'),
})

export const DeliveryDateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    daysToDeliver: z.number().min(0, 'Days to deliver must be at least 0'),
    shippingPrice: z.coerce.number().min(0, 'Shipping price must be at least 0'),
    freeShippingMinPrice: z.coerce
        .number()
        .min(0, 'Free shipping min amount must be at least 0'),
})

export const SettingInputSchema = z.object({
    common: z.object({
        pageSize: z.coerce
            .number()
            .min(1, 'Page size must be at least 1')
            .default(9),
        isMaintenanceMode: z.boolean().default(false),
        freeShippingMinPrice: z.coerce
            .number()
            .min(0, 'Free shipping min price must be at least 0')
            .default(0),
        enableLiveChat: z.boolean().default(true),
        defaultTheme: z
            .string()
            .min(1, 'Default theme is required')
            .default('light'),
        defaultColor: z
            .string()
            .min(1, 'Default color is required')
            .default('gold'),
    }),
    site: z.object({
        name: z.string().min(1, 'Name is required'),
        logo: z.string().min(1, 'logo is required'),
        slogan: z.string().min(1, 'Slogan is required'),
        description: z.string().min(1, 'Description is required'),
        keywords: z.string().min(1, 'Keywords is required'),
        url: z.string().min(1, 'Url is required'),
        email: z.string().min(1, 'Email is required'),
        phone: z.string().min(1, 'Phone is required'),
        author: z.string().min(1, 'Author is required'),
        copyright: z.string().min(1, 'Copyright is required'),
        address: z.string().min(1, 'Address is required'),
    }),
    availableLanguages: z
        .array(SiteLanguageSchema)
        .min(1, 'At least one language is required'),

    carousels: z
        .array(CarouselSchema)
        .min(1, 'At least one language is required'),
    defaultLanguage: z.string().min(1, 'Language is required'),
    availableCurrencies: z
        .array(SiteCurrencySchema)
        .min(1, 'At least one currency is required'),
    defaultCurrency: z.string().min(1, 'Currency is required'),
    availablePaymentMethods: z
        .array(PaymentMethodSchema)
        .min(1, 'At least one payment method is required'),
    defaultPaymentMethod: z.string().min(1, 'Payment method is required'),
    availableDeliveryDates: z
        .array(DeliveryDateSchema)
        .min(1, 'At least one delivery date is required'),
    defaultDeliveryDate: z.string().min(1, 'Delivery date is required'),
})
