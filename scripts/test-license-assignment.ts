
import 'dotenv/config';
import { LicenseAssignmentService } from "../lib/services/license-service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log('🧪 Testing License Assignment...');

    // 1. Find a product with available licenses
    const product = await prisma.product.findFirst({
        where: {
            licenses: {
                some: { status: 'AVAILABLE' }
            }
        }
    });

    if (!product) {
        console.error('❌ No product with available licenses found. Run seed first.');
        return;
    }

    console.log(`Found product: ${product.name} (${product.id})`);

    // 2. Find a user
    const user = await prisma.user.findFirst();
    if (!user) {
        console.error('❌ No user found.');
        return;
    }

    // 3. Create a dummy order
    const order = await prisma.order.create({
        data: {
            total: 0,
            subtotal: 0,
            tax: 0,
            shipping: 0,
            userId: user.id,
            status: 'PROCESSING'
        }
    });

    console.log(`Created dummy order: ${order.orderNumber}`);

    // 4. Assign License
    try {
        const result = await LicenseAssignmentService.assignLicenseToOrder(
            order.id,
            user.id,
            [{ productId: product.id, quantity: 1 }]
        );
        console.log('✅ License Assigned:', JSON.stringify(result, null, 2));

        // 5. Verify in DB
        const license = await prisma.licenseKey.findFirst({
            where: { orderId: order.id }
        });

        if (license && license.status === 'ACTIVE') {
            console.log(`✅ Verification Successful: License ${license.key} is ACTIVE and linked to order.`);
        } else {
            console.error('❌ Verification Failed: License not found or not active.');
        }

    } catch (error) {
        console.error('❌ Assignment Failed:', error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
