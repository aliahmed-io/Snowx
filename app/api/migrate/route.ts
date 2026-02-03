
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        console.log('Starting migration via API...');

        // 1. Fetch products with legacy strings but no IDs
        const products = await db.product.findMany({
            where: {
                OR: [
                    { durationId: null, duration: { not: null } },
                    { platformId: null, platform: { not: null } }
                ]
            }
        });

        const durationOptions = await db.filterOption.findMany({ where: { type: 'duration' } });
        const platformOptions = await db.filterOption.findMany({ where: { type: 'platform' } });

        let updated = 0;

        for (const p of products) {
            const data: { durationId?: string; platformId?: string } = {};

            if (p.duration && !p.durationId) {
                const match = durationOptions.find(o => o.value === p.duration || o.label === p.duration);
                if (match) data.durationId = match.id;
            }

            if (p.platform && !p.platformId) {
                const match = platformOptions.find(o => o.value === p.platform || o.label === p.platform);
                if (match) data.platformId = match.id;
            }

            if (Object.keys(data).length > 0) {
                await db.product.update({ where: { id: p.id }, data });
                updated++;
            }
        }

        return NextResponse.json({ success: true, updated, total: products.length });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
