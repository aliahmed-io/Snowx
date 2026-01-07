import { CartProvider } from "@/components/providers/CartProvider";
import { CartSidebar } from "@/components/shop/CartSidebar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <div className="fixed inset-0 bg-linear-to-b from-[#020817] via-[#050b1d] to-[#020817] z-[-1]" />
            {children}
            <CartSidebar />
        </CartProvider>
    );
}
