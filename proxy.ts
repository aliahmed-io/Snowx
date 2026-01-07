import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Matcher for internationalized routes
    matcher: [
        // Match all pathnames except for
        // - API routes
        // - static files (_next, images, etc.)
        // - metadata files (favicon, robots, etc.)
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
        // Match / even if it's empty
        '/'
    ]
};
