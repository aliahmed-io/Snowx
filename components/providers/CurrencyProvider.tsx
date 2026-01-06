"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP";

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
    EUR: 0.92,
    GBP: 0.79,
};

const SYMBOLS = {
    USD: "$",
    EUR: "€",
    GBP: "£",
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState<CurrencyCode>("USD");
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("snowx-currency");
        if (stored && (stored === "USD" || stored === "EUR" || stored === "GBP")) {
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
        return new Intl.NumberFormat(undefined, {
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
