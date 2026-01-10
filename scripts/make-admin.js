const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function makeUserAdmin() {
    const userEmail = 'alihassan182006@gmail.com';

    try {
        console.log('🔍 Looking for user:', userEmail);

        // Find the user by email
        const user = await db.user.findUnique({
            where: { email: userEmail }
        });

        if (!user) {
            console.error(`❌ User with email "${userEmail}" not found`);
            console.log('\n💡 Make sure you\'ve signed up with this email first!');
            process.exit(1);
        }

        console.log('✅ User found:', user.email);

        // Update user role to ADMIN
        const updatedUser = await db.user.update({
            where: { id: user.id },
            data: { role: 'ADMIN' }
        });

        console.log('\n✅ Successfully updated user to ADMIN role:');
        console.log(`   Email: ${updatedUser.email}`);
        console.log(`   Name: ${updatedUser.firstName} ${updatedUser.lastName}`);
        console.log(`   Role: ${updatedUser.role}`);
        console.log('\n🎉 You can now access the admin panel at /admin');

    } catch (error) {
        console.error('❌ Error updating user:', error);
        process.exit(1);
    } finally {
        await db.$disconnect();
    }
}

makeUserAdmin();
