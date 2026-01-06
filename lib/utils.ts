import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function formatPrice(price: number | string): string {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(numericPrice);
}

export function formatDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(dateObj);
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
}

export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length) + "...";
}

export function getInitials(firstName?: string, lastName?: string): string {
    const first = firstName?.charAt(0).toUpperCase() || "";
    const last = lastName?.charAt(0).toUpperCase() || "";
    return first + last || "U";
}

export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function absoluteUrl(path: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return `${baseUrl}${path}`;
}
