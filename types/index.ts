import { z } from "zod";
import {
    CarouselSchema,
    DeliveryDateSchema,
    PaymentMethodSchema,
    SettingInputSchema,
    SiteCurrencySchema,
    SiteLanguageSchema,
} from "@/lib/validator";

// User types
export interface UserProfile {
    id: string;
    kindeId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
    role: "ADMIN" | "CUSTOMER";
}

// Product types
export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    comparePrice: number | null;
    images: string[];
    categoryId: string;
    category?: Category;
    inventory: number;
    isActive: boolean;
    isFeatured: boolean;
    reviews?: Review[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    products?: Product[];
}

// Order types
export type OrderStatus =
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";

export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    status: OrderStatus;
    total: number;
    subtotal: number;
    tax: number;
    shipping: number;
    stripePaymentId: string | null;
    items: OrderItem[];
    shippingAddress: Address | null;
    billingAddress: Address | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    product?: Product;
    quantity: number;
    price: number;
}

export interface Address {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

// Review types
export interface Review {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    title: string | null;
    comment: string | null;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Cart types (client-side)
export interface CartItem {
    productId: string;
    quantity: number;
    product: Product;
}

export interface Cart {
    items: CartItem[];
    total: number;
    itemCount: number;
}

// API response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasMore: boolean;
}

// Filter types
export interface ProductFilters {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest";
    isFeatured?: boolean;
    isActive?: boolean;
}

// setting
export type ICarousel = z.infer<typeof CarouselSchema>;
export type ISettingInput = z.infer<typeof SettingInputSchema>;
export type ClientSetting = ISettingInput & {
    currency: string;
};
export type SiteLanguage = z.infer<typeof SiteLanguageSchema>;
export type SiteCurrency = z.infer<typeof SiteCurrencySchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type DeliveryDate = z.infer<typeof DeliveryDateSchema>;
