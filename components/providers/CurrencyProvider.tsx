"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CurrencyCode = "USD" | "SAR" | "AED";

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (code: CurrencyCode) => void;
    formatPrice: (amount: number) => string;
    convertPrice: (amount: number) => number;
    symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const RATES = {
    USD: 1,
    SAR: 3.75,
    AED: 3.67,
};

const SYMBOLS = {
    USD: "$",
    SAR: "ر.س",
    AED: "د.إ",
};

const LOCALE_MAP = {
    USD: 'en-US',
    SAR: 'ar-SA',
    AED: 'ar-AE',
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState<CurrencyCode>("USD");
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("snowx-currency");
        if (stored && (stored === "USD" || stored === "SAR" || stored === "AED")) {
            setCurrency(stored as CurrencyCode);
        }
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem("snowx-currency", currency);
        }
    }, [currency, isHydrated]);

    const convertPrice = (amount: number) => {
        return amount * RATES[currency];
    };

    const formatPrice = (amount: number) => {
        const converted = convertPrice(amount);
        return new Intl.NumberFormat(LOCALE_MAP[currency], {
            style: "currency",
            currency: currency,
        }).format(converted);
    };

    return (
        <CurrencyContext.Provider
            value={{
                currency,
                setCurrency,
                formatPrice,
                convertPrice,
                symbol: SYMBOLS[currency],
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
}
