

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const licenseCount = await prisma.licenseKey.count();
    const availableCount = await prisma.licenseKey.count({ where: { status: 'AVAILABLE' } });
    const activeCount = await prisma.licenseKey.count({ where: { status: 'ACTIVE' } });
    const products = await prisma.product.findMany({ include: { licenses: true } });
    const orders = await prisma.order.findMany({ include: { licenses: true } });

    console.log(`Total Licenses: ${licenseCount}`);
    console.log(`Available Licenses: ${availableCount}`);
    console.log(`Active (Sold) Licenses: ${activeCount}`);
    console.log(`Products with licenses: ${products.filter(p => p.licenses.length > 0).length}`);
    console.log(`Orders with licenses: ${orders.filter(o => o.licenses.length > 0).length}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
