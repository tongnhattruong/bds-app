import { prisma } from '../../lib/prisma';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import ListingDetailClient from '../ListingDetailClient';
import { Property, SystemConfig } from '../../lib/store';

const getProperty = unstable_cache(
    async (id: string) => {
        return prisma.property.findUnique({
            where: { id }
        });
    },
    ['property-detail'],
    { revalidate: 60 }
);

const getRelatedProperties = unstable_cache(
    async (category: string, city: string, excludeId: string, limit: number) => {
        return prisma.property.findMany({
            where: {
                id: { not: excludeId },
                OR: [
                    { category: { equals: category, mode: 'insensitive' } },
                    { city: { equals: city, mode: 'insensitive' } }
                ]
            },
            take: limit,
            orderBy: { createdAt: 'desc' }
        });
    },
    ['related-properties'],
    { revalidate: 3600 }
);

const getSystemConfig = unstable_cache(
    async () => prisma.systemConfig.findUnique({ where: { id: 'global' } }),
    ['system-config'],
    { revalidate: 3600 }
);

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Parallel fetching for performance
    const [propertyData, systemConfigData] = await Promise.all([
        getProperty(id),
        getSystemConfig()
    ]);

    if (!propertyData) {
        notFound();
    }

    const systemConfig: SystemConfig = systemConfigData ? {
        postsPerPage: systemConfigData.postsPerPage ?? 6,
        relatedPostsLimit: systemConfigData.relatedPostsLimit ?? 3,
        siteTitle: systemConfigData.siteTitle ?? undefined,
        siteDescription: systemConfigData.siteDescription ?? undefined,
        siteKeywords: systemConfigData.siteKeywords ?? undefined,
        ogImage: systemConfigData.ogImage ?? undefined,
        headerTitle: systemConfigData.headerTitle ?? undefined,
        logoUrl: systemConfigData.logoUrl ?? undefined,
        faviconUrl: systemConfigData.faviconUrl ?? undefined,
        footerAbout: systemConfigData.footerAbout ?? undefined,
        footerAddress: systemConfigData.footerAddress ?? undefined,
        footerEmail: systemConfigData.footerEmail ?? undefined,
        footerPhone: systemConfigData.footerPhone ?? undefined,
        socialFacebook: systemConfigData.socialFacebook ?? undefined,
        socialZalo: systemConfigData.socialZalo ?? undefined,
        socialYoutube: systemConfigData.socialYoutube ?? undefined,
        defaultViewMode: (systemConfigData.defaultViewMode as any) ?? undefined,
        gridColumns: systemConfigData.gridColumns ?? undefined,
    } : {
        postsPerPage: 6,
        relatedPostsLimit: 3
    };

    const property: Property = {
        ...propertyData,
        images: typeof propertyData.images === 'string' ? JSON.parse(propertyData.images) : (propertyData.images || []),
        createdAt: propertyData.createdAt.toLocaleDateString('vi-VN'),
    } as any;

    const relatedRaw = await getRelatedProperties(
        property.category,
        property.city,
        property.id,
        systemConfig.relatedPostsLimit || 3
    );

    const relatedProperties: Property[] = relatedRaw.map(p => ({
        ...p,
        images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
        createdAt: p.createdAt.toLocaleDateString('vi-VN'),
    })) as any;

    return (
        <ListingDetailClient
            property={property}
            relatedProperties={relatedProperties}
            systemConfig={systemConfig}
        />
    );
}
