import { prisma } from './lib/prisma';
import { unstable_cache } from 'next/cache';
import HomePageClient from './HomePageClient';
import { Property, City } from './lib/store';

const getFeaturedProperties = unstable_cache(
    async () => {
        return prisma.property.findMany({
            take: 6,
            orderBy: { createdAt: 'desc' }
        });
    },
    ['featured-properties'],
    { revalidate: 60 }
);

const getCities = unstable_cache(
    async () => {
        return prisma.city.findMany();
    },
    ['cities-list'],
    { revalidate: 3600 }
);

export default async function BDSPage() {
    const [featuredData, citiesData] = await Promise.all([
        getFeaturedProperties(),
        getCities()
    ]);

    const featuredProperties: Property[] = featuredData.map(p => ({
        ...p,
        images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
        createdAt: new Date(p.createdAt).toLocaleDateString('vi-VN')
    })) as any;

    const cities: City[] = citiesData as any;

    return (
        <HomePageClient
            featuredProperties={featuredProperties}
            cities={cities}
        />
    );
}

