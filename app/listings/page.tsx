import { Suspense } from 'react';
import ListingsClient from './ListingsClient';
import { prisma } from '../lib/prisma';
import SEOHead from '../components/SEOHead';
import { Property, SystemConfig } from '../lib/store';
import { unstable_cache } from 'next/cache';

const getCachedCities = unstable_cache(
    async () => prisma.city.findMany(),
    ['cities-list'],
    { revalidate: 3600 } // Cache within 1 hour
);

const getCachedDistricts = unstable_cache(
    async () => prisma.district.findMany(),
    ['districts-list'],
    { revalidate: 3600 }
);

const getCachedConfig = unstable_cache(
    async () => prisma.systemConfig.findUnique({ where: { id: 'global' } }),
    ['system-config'],
    { revalidate: 3600 }
);

const getCachedProperties = unstable_cache(
    async (where: any) => {
        return prisma.property.findMany({
            where: where,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                price: true,
                currency: true,
                area: true,
                address: true,
                city: true,
                type: true,
                category: true,
                images: true,
                createdAt: true
            }
        });
    },
    ['properties-list'],
    { revalidate: 60, tags: ['properties'] }
);

export const dynamic = 'force-dynamic';

export default async function ListingsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined } | Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Handle both Next.js 14 and 15 (where searchParams might be a Promise)
    const resolvedSearchParams = await searchParams;

    const page = parseInt(typeof resolvedSearchParams?.page === 'string' ? resolvedSearchParams.page : '1');
    const type = typeof resolvedSearchParams?.type === 'string' ? resolvedSearchParams.type : 'all';

    const category = typeof resolvedSearchParams?.category === 'string' ? resolvedSearchParams.category : 'all';
    const price = typeof resolvedSearchParams?.price === 'string' ? resolvedSearchParams.price : 'all';
    const cityId = typeof resolvedSearchParams?.city === 'string' ? resolvedSearchParams.city : '';
    const districtId = typeof resolvedSearchParams?.district === 'string' ? resolvedSearchParams.district : '';
    const sort = typeof resolvedSearchParams?.sort === 'string' ? resolvedSearchParams.sort : 'newest';

    // 1. Fetch Master Data (Fast from Cache)
    const [allCities, allDistricts, systemConfigData] = await Promise.all([
        getCachedCities().catch(() => []),
        getCachedDistricts().catch(() => []),
        getCachedConfig().catch(() => null)
    ]);

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

    // 2. Resolve Names for DB filtering
    const cityFilterName = cityId ? allCities.find((c: any) => c.id === cityId)?.name : '';
    const districtFilterName = districtId ? allDistricts.find((d: any) => d.id === districtId)?.name : '';

    // 3. Prepare DB Filter Object
    const where: any = {};
    if (type !== 'all') where.type = { equals: type, mode: 'insensitive' };
    if (category !== 'all') where.category = { equals: category, mode: 'insensitive' };

    // City and District are tricky because they are stored as strings/names
    if (cityFilterName) {
        where.city = { contains: cityFilterName, mode: 'insensitive' };
    }

    // District fuzzy search 
    if (districtFilterName) {
        where.address = { contains: districtFilterName, mode: 'insensitive' };
    }

    // 4. Fetch Properties (Using Cache)
    let allPropertiesRaw: any[] = [];
    try {
        allPropertiesRaw = await getCachedProperties(where);
    } catch (e) {
        console.error("Database fetch error:", e);
    }

    // 5. Transform and process
    let filtered = allPropertiesRaw.map((p: any) => {
        let parsedImages = [];
        try {
            parsedImages = p.images ? JSON.parse(p.images) : [];
        } catch (e) {
            console.error(`Images parse error for ${p.id}`);
        }

        return {
            ...p,
            images: Array.isArray(parsedImages) ? parsedImages : [],
            type: p.type as any,
            category: p.category as any,
            createdAt: p.createdAt ? (typeof p.createdAt === 'string' ? p.createdAt : p.createdAt.toISOString()) : new Date().toISOString()
        } as Property;
    });

    // In-memory Price filter (complex due to units)
    if (price !== 'all') {
        filtered = filtered.filter(p => {
            let pBillion = p.price;
            if (p.currency === 'Triệu') pBillion = p.price / 1000;
            switch (price) {
                case 'under-1': return pBillion < 1;
                case '1-3': return pBillion >= 1 && pBillion <= 3;
                case '3-5': return pBillion > 3 && pBillion <= 5;
                case 'over-5': return pBillion > 5;
            }
            return true;
        });
    }

    // Sorting overrides
    if (sort === 'price-asc' || sort === 'price-desc') {
        const getAbs = (p: Property) => p.currency === 'Triệu' ? p.price / 1000 : p.price;
        filtered.sort((a, b) => sort === 'price-asc' ? getAbs(a) - getAbs(b) : getAbs(b) - getAbs(a));
    }
    // 'newest' is already handled by DB orderBy

    // Pagination
    const postsPerPage = systemConfig.postsPerPage;
    const totalPages = Math.ceil(filtered.length / postsPerPage);
    const currentPage = Math.max(1, Math.min(page, totalPages || 1));
    const startIndex = (currentPage - 1) * postsPerPage;
    const currentProperties = filtered.slice(startIndex, currentPage * postsPerPage);

    return (
        <>
            <SEOHead
                title="Mua bán nhà đất, bất động sản chính chủ - Giá tốt"
                description="Tìm mua nhà đất, căn hộ, đất nền giá rẻ, chính chủ."
            />
            <ListingsClient
                initialProperties={currentProperties}
                cities={allCities}
                districts={allDistricts}
                systemConfig={systemConfig}
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </>
    );
}
