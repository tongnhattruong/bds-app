import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const start = Date.now();
        // Test 1: Simple query
        const result = await prisma.$queryRaw`SELECT 1 as connected`;
        const end = Date.now();

        // Test 2: Fetch cities
        const cities = await prisma.city.findMany({ take: 1 });

        return NextResponse.json({
            status: 'success',
            message: 'Database connected successfully',
            duration: `${end - start}ms`,
            testResult: result,
            cityCount: cities.length,
            envUsed: process.env.POSTGRES_PRISMA_URL ? 'PRESENT' : 'MISSING',
            envStart: process.env.POSTGRES_PRISMA_URL?.split('@')[1]?.substring(0, 20) || 'N/A'
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            code: error.code,
            meta: error.meta,
            clientVersion: error.clientVersion,
            stack: error.stack?.substring(0, 500),
            envUsed: process.env.POSTGRES_PRISMA_URL ? 'PRESENT' : 'MISSING',
            envStart: process.env.POSTGRES_PRISMA_URL?.split('@')[1]?.substring(0, 20) || 'N/A'
        }, { status: 500 });
    }
}
