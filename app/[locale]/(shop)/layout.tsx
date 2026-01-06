import { CartProvider } from "@/components/providers/CartProvider";
import { CartSidebar } from "@/components/shop/CartSidebar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
                {children}
            </div>
            <CartSidebar />
        </CartProvider>
    );
}
