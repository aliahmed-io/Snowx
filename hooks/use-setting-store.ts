import { create } from 'zustand'
import { ClientSetting, SiteCurrency } from '@/types'

// Default settings based on File 36 data.ts (adapted)
const defaultSettings: ClientSetting = {
    common: {
        freeShippingMinPrice: 35,
        isMaintenanceMode: false,
        defaultTheme: 'light',
        defaultColor: 'gold',
        pageSize: 9,
    },
    site: {
        name: 'SnowX',
        description: 'SnowX Premium Ecommerce',
        keywords: 'SnowX, Ecommerce, Premium',
        url: 'http://localhost:3000',
        logo: '/snowx2-icon.png',
        slogan: 'Premium Ice Experience',
        author: 'SnowX Team',
        copyright: '2024 SnowX Inc.',
        email: 'contact@snowx.io',
        address: '123 Ice Street',
        phone: '+123456789',
    },
    availableLanguages: [
        { code: 'en-US', name: 'English' },
        { code: 'ar', name: 'Arabic' },
    ],
    defaultLanguage: 'en-US',
    availableCurrencies: [
        { name: 'United States Dollar', code: 'USD', symbol: '$', convertRate: 1 },
        { name: 'Euro', code: 'EUR', symbol: '€', convertRate: 0.96 },
        { name: 'UAE Dirham', code: 'AED', symbol: 'AED', convertRate: 3.67 },
    ],
    defaultCurrency: 'USD',
    availablePaymentMethods: [
        { name: 'PayPal', commission: 0 },
        { name: 'Stripe', commission: 0 },
        { name: 'Cash On Delivery', commission: 0 },
    ],
    defaultPaymentMethod: 'Stripe',
    availableDeliveryDates: [
        { name: 'Tomorrow', daysToDeliver: 1, shippingPrice: 12.9, freeShippingMinPrice: 0 },
    ],
    defaultDeliveryDate: 'Tomorrow',
    carousels: [],
    currency: 'USD',
}

interface SettingState {
    setting: ClientSetting
    setSetting: (newSetting: ClientSetting) => void
    getCurrency: () => SiteCurrency
    setCurrency: (currency: string) => void
}

const useSettingStore = create<SettingState>((set, get) => ({
    setting: defaultSettings,
    setSetting: (newSetting: ClientSetting) => {
        set({
            setting: {
                ...newSetting,
                currency: newSetting.currency || get().setting.currency,
            },
        })
    },
    getCurrency: () => {
        return (
            get().setting.availableCurrencies.find(
                (c) => c.code === get().setting.currency
            ) || defaultSettings.availableCurrencies[0]
        )
    },
    setCurrency: async (currency: string) => {
        set({ setting: { ...get().setting, currency } })
    },
}))

export default useSettingStore
