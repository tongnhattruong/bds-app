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

    // Fetch master data with error handling
    let allCities: any[] = [];
    let allDistricts: any[] = [];
    let systemConfigData: any = null;

    try {
        // Fetch cities, districts, and config in parallel
        const [cities, districts, config] = await Promise.all([
            prisma.city.findMany(),
            prisma.district.findMany(),
            prisma.systemConfig.findUnique({ where: { id: 'global' } })
        ]);
        allCities = cities;
        allDistricts = districts;
        systemConfigData = config;
    } catch (error) {
        console.error("Database fetch error:", error);
    }

    const systemConfig: SystemConfig = systemConfigData ? {
        postsPerPage: systemConfigData.postsPerPage || 6,
        relatedPostsLimit: systemConfigData.relatedPostsLimit || 3,
        ...systemConfigData
    } : {
        postsPerPage: 6,
        relatedPostsLimit: 3
    };

    const cityFilterName = cityId ? allCities.find((c: any) => c.id === cityId)?.name : '';
    const districtFilterName = districtId ? allDistricts.find((d: any) => d.id === districtId)?.name : '';

    // Prepare DB Filter Object
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

    // Fetch filtered properties directly from DB
    let allPropertiesRaw: any[] = [];
    try {
        allPropertiesRaw = await prisma.property.findMany({
            where: where,
            orderBy: { createdAt: 'desc' }
        });
    } catch (e) {
        console.error("Error fetching properties from Database:", e);
    }

    // Transform and parse images
    let filtered = allPropertiesRaw.map((p: any) => {
        let parsedImages = [];
        try {
            parsedImages = p.images ? JSON.parse(p.images) : [];
        } catch (e) {
            console.error(`Error parsing images for property ${p.id}:`, e);
        }

        return {
            ...p,
            images: Array.isArray(parsedImages) ? parsedImages : [],
            type: p.type as any,
            category: p.category as any,
            createdAt: p.createdAt ? (typeof p.createdAt === 'string' ? p.createdAt : p.createdAt.toISOString()) : new Date().toISOString()
        } as Property;
    });

    // In-Memory Filtering for complex price logic (since currency is separate)
    if (price !== 'all') {
        filtered = filtered.filter(p => {
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
            return true;
        });
    }

    // Sorting
    if (sort === 'price-asc' || sort === 'price-desc') {
        const getAbsPrice = (p: Property) => p.currency === 'Triệu' ? p.price / 1000 : p.price;
        filtered.sort((a, b) => {
            const priceA = getAbsPrice(a);
            const priceB = getAbsPrice(b);
            return sort === 'price-asc' ? priceA - priceB : priceB - priceA;
        });
    }
    // 'newest' is already handled by DB orderBy

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
            <div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm font-bold mb-4 rounded">
                🚀 Test Sync: Dự án đã được đồng bộ từ GitHub sang Vercel thành công!
            </div>
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
