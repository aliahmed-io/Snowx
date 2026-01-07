import path from "node:path";
import { defineConfig } from "prisma/config";
import 'dotenv/config';

console.log('Prisma Config: DATABASE_URL exists:', !!process.env.DATABASE_URL);

export default defineConfig({
    schema: path.join(__dirname, "prisma", "schema.prisma"),
    datasource: {
        url: process.env.DATABASE_URL,
    },
});
