import { PrismaClient } from '@prisma/client';

// Hardcoded Pooler URL for testing
const url = "postgresql://postgres:wRAFETFzxEncCEdH@db.akfwucgwryhvxhlekode.supabase.co:6543/postgres?pgbouncer=true";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: url,
        },
    },
});

async function main() {
    console.log('Attempting to connect to: ' + url.replace(/:[^:@]*@/, ':****@')); // Hide password in logs
    try {
        await prisma.$connect();
        console.log('✅ Successfully connected to DB via port 6543!');
        const result = await prisma.$queryRaw`SELECT 1 as result`;
        console.log('Query result:', result);
    } catch (e) {
        console.error('❌ Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
