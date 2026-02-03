const http = require('http');

const baseUrl = 'http://localhost:3000';
const routes = [
    '/en-US/admin',
    '/en-US/admin/products',
    '/en-US',
    '/en-US/products',
    '/en-US/cart',
    '/en-US/checkout',
    '/admin', // Try without locale
    '/products', // Try without locale
    '/cart',
    '/checkout'
];

console.log('Starting Smoke Test...');

async function checkRoute(route) {
    return new Promise((resolve) => {
        http.get(baseUrl + route, (res) => {
            console.log(`[${res.statusCode}] ${route}`);
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                console.log(`  -> Redirect to: ${res.headers.location}`);
            }
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve(true);
            } else {
                console.error(`  FAIL: Expected 200-399, got ${res.statusCode}`);
                resolve(false);
            }
        }).on('error', (e) => {
            console.error(`  ERROR: ${route} - ${e.message}`);
            resolve(false);
        });
    });
}

(async () => {
    let passed = 0;
    for (const route of routes) {
        if (await checkRoute(route)) {
            passed++;
        }
    }

    console.log('-----------------------------------');
    console.log(`Test Complete. Passed: ${passed}/${routes.length}`);

    if (passed === routes.length) {
        console.log('SUCCESS: All core routes are accessible.');
        process.exit(0);
    } else {
        console.log('FAILURE: Some routes failed.');
        process.exit(1);
    }
})();
