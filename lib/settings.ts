import { ClientSetting } from "@/types";

export const defaultSettings: ClientSetting = {
    common: {
        pageSize: 9,
        isMaintenanceMode: false,
        freeShippingMinPrice: 0,
        defaultTheme: "light",
        defaultColor: "gold"
    },
    site: {
        name: "SnowX",
        slogan: "Premium Subscriptions",
        logo: "/snowx2-icon.png",
        url: "",
        description: "Get discounted access to GPT, Netflix, Spotify, and more.",
        keywords: "digital subscriptions, GPT, Netflix, Spotify, discount, premium",
        email: "support@snowx.com",
        phone: "",
        author: "SnowX Team",
        copyright: "2024 SnowX Inc.",
        address: ""
    },
    availableLanguages: [
        { code: 'en-US', name: 'English' },
        { code: 'ar', name: 'Arabic' }
    ],
    defaultLanguage: 'en-US',
    availableCurrencies: [
        { name: 'USD', code: 'USD', symbol: '$', convertRate: 1 }
    ],
    defaultCurrency: 'USD',
    availablePaymentMethods: [
        { name: 'Stripe', commission: 0 }
    ],
    defaultPaymentMethod: 'Stripe',
    availableDeliveryDates: [],
    defaultDeliveryDate: '',
    carousels: [],
    currency: 'USD'
};
