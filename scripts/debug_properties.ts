
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const props = await prisma.property.findMany({
        select: { id: true, title: true, type: true, category: true, city: true }
    });
    console.log('Properties found:', props.length);
    props.forEach(p => {
        console.log(`[${p.id}] Type: '${p.type}' Category: '${p.category}' City: '${p.city}'`);
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
