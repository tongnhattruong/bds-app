import { Suspense } from 'react';
import ListingsClient from './ListingsClient';
import { prisma } from '../lib/prisma';
import SEOHead from '../components/SEOHead';
import { Property, SystemConfig } from '../lib/store';

export const dynamic = 'force-dynamic'; // Ensure we read fresh searchParams

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

    // Fetch master data
    // Use Promise.all for concurrency
    // Use Raw Query to fetch config because Prisma Client might be outdated during dev (missing new fields)
    const [allCities, allDistricts, systemConfigs] = await Promise.all([
        prisma.city.findMany(),
        prisma.district.findMany(),
        prisma.$queryRaw<any[]>`SELECT * FROM "SystemConfig" WHERE "id" = 'global'`
    ]);

    // queryRaw returns an array
    const systemConfigData = systemConfigs[0] || null;

    // Map system config to our interface type (or use default)
    const systemConfig: SystemConfig = systemConfigData ? {
        postsPerPage: systemConfigData.postsPerPage,
        relatedPostsLimit: systemConfigData.relatedPostsLimit,
        ...systemConfigData
    } : {
        postsPerPage: 6,
        relatedPostsLimit: 3
    };

    // Prepare Filter Logic
    // We need to resolve City ID -> Name and District ID -> Name because Property table stores Names
    const cityFilterName = cityId ? allCities.find((c: any) => c.id === cityId)?.name : '';
    const districtFilterName = districtId ? allDistricts.find((d: any) => d.id === districtId)?.name : '';

    // Fetch Properties
    // Ideally we filter in DB. 
    // But 'price' requires complex logic (currency conversion).
    // And 'city'/'district' in Property are free-text or names, while we have IDS.
    // Let's fetch ALL for now (assuming dataset < 1000 items) and filter in memory.
    // If dataset grows, we MUST normalize Property schema to use cityId/districtId.
    const allPropertiesRaw = await prisma.property.findMany({
        orderBy: { createdAt: 'desc' }
    });

    // Transform to Interface format (images JSON parsing)
    const allProperties: Property[] = allPropertiesRaw.map((p: any) => {
        let parsedImages = [];
        try {
            parsedImages = p.images ? JSON.parse(p.images) : [];
            if (!Array.isArray(parsedImages)) parsedImages = [];
        } catch (e) {
            console.error(`Error parsing images for property ${p.id}:`, e);
            parsedImages = [];
        }

        return {
            ...p,
            images: parsedImages,
            // Ensure type compatibility
            type: p.type as any,
            category: p.category as any,
            createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString()
        };
    });

    // In-Memory Filtering
    let filtered = allProperties.filter(p => {
        if (type !== 'all' && p.type?.toLowerCase() !== type.toLowerCase()) return false;
        if (category !== 'all' && p.category?.toLowerCase() !== category.toLowerCase()) return false;

        if (cityId) {
            // Check if property city matches Name OR ID (to handle legacy data)
            const matchesName = cityFilterName ? p.city?.toLowerCase().includes(cityFilterName.toLowerCase()) : false;
            const matchesId = p.city?.toLowerCase() === cityId.toLowerCase();
            if (!matchesName && !matchesId) return false;
        }

        if (districtFilterName) {
            // District search is loose on address
            if (!p.address?.toLowerCase().includes(districtFilterName.toLowerCase())) return false;
        }

        if (price !== 'all') {
            const pPrice = p.price;
            const unit = p.currency;
            let priceInBillion = pPrice;
            if (unit === 'Triệu') priceInBillion = pPrice / 1000;

            switch (price) {
                case 'under-1': if (priceInBillion >= 1) return false; break;
                case '1-3': if (priceInBillion < 1 || priceInBillion > 3) return false; break;
                case '3-5': if (priceInBillion < 1 || priceInBillion > 5) return false; break;
                case 'over-5': if (priceInBillion <= 5) return false; break;
            }
        }

        return true;
    });

    // Sorting
    filtered.sort((a, b) => {
        if (sort === 'newest') {
            // Already sorted by DB fetch but filtering might scramble if we didn't preserve order? 
            // DB fetch was orderBy createdAt desc.
            return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
        } else if (sort === 'price-asc') {
            return a.price - b.price; // Simplified
        } else if (sort === 'price-desc') {
            return b.price - a.price;
        }
        return 0;
    });

    // Better Sorting taking currency into account
    if (sort === 'price-asc' || sort === 'price-desc') {
        const getAbsPrice = (p: Property) => p.currency === 'Triệu' ? p.price / 1000 : p.price;
        filtered.sort((a, b) => {
            const priceA = getAbsPrice(a);
            const priceB = getAbsPrice(b);
            return sort === 'price-asc' ? priceA - priceB : priceB - priceA;
        });
    }

    // Pagination
    const postsPerPage = systemConfig.postsPerPage;
    const totalPages = Math.ceil(filtered.length / postsPerPage);
    const currentPage = Math.max(1, Math.min(page, totalPages || 1));
    const startIndex = (currentPage - 1) * postsPerPage;
    const currentProperties = filtered.slice(startIndex, startIndex + postsPerPage);

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
