import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default withAuth(async function middleware(request: NextRequest) {
    // Additional middleware logic can be added here
}, {
    isReturnToCurrentPage: true,
    loginPage: "/api/auth/login",
    publicPaths: [
        "/",
        "/api/auth/(.*)",
        "/api/webhooks/(.*)",
        "/api/preview",
        "/api/exit-preview",
        "/products(.*)",
        "/categories(.*)",
    ],
});

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*$).*)",
    ],
};
