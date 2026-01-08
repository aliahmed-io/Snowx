
/* eslint-disable */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const licenseCount = await prisma.licenseKey.count();
    const availableCount = await prisma.licenseKey.count({ where: { status: 'AVAILABLE' } });
    const activeCount = await prisma.licenseKey.count({ where: { status: 'ACTIVE' } });

    // Use include to check relations
    const productLicenses = await prisma.product.findFirst({ include: { licenses: true } });

    console.log(`Total Licenses: ${licenseCount}`);
    console.log(`Available Licenses: ${availableCount}`);
    console.log(`Active (Sold) Licenses: ${activeCount}`);

    if (productLicenses) {
        console.log(`Sample Product has ${productLicenses.licenses.length} licenses.`);
    } else {
        console.log('No products found.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
