import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./navigation";

const intlMiddleware = createMiddleware(routing);

export default withAuth(
    async function middleware(req: NextRequest) {
        return intlMiddleware(req);
    },
    {
        isReturnToCurrentPage: true,
        loginPage: "/api/auth/login",
        publicPaths: [
            "/",
            "/fr",
            "/en",
            "/api/auth/(.*)",
            "/api/webhooks/(.*)",
            "/products(.*)",
            "/fr/products(.*)",
            "/en/products(.*)",
            "/categories(.*)",
            "/fr/categories(.*)",
            "/en/categories(.*)",
            "/cart",
            "/fr/cart",
            "/en/cart"
        ],
    }
);

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
