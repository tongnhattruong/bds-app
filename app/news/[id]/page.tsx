import { prisma } from '../../lib/prisma';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import NewsDetailClient from '../NewsDetailClient';
import { News, NewsCategory, SystemConfig } from '../../lib/store';

const getNewsItem = unstable_cache(
    async (id: string) => {
        return prisma.news.findUnique({
            where: { id }
        });
    },
    ['news-detail'],
    { revalidate: 60 }
);

const getRelatedNews = unstable_cache(
    async (categoryId: string, excludeId: string, limit: number) => {
        return prisma.news.findMany({
            where: {
                categoryId,
                id: { not: excludeId },
                isPublished: true
            },
            take: limit,
            orderBy: { createdAt: 'desc' }
        });
    },
    ['related-news'],
    { revalidate: 3600 }
);

const getSystemConfig = unstable_cache(
    async () => prisma.systemConfig.findUnique({ where: { id: 'global' } }),
    ['system-config'],
    { revalidate: 1 }
);

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [newsItemData, systemConfigData] = await Promise.all([
        getNewsItem(id),
        getSystemConfig()
    ]);

    if (!newsItemData) {
        notFound();
    }

    const newsItem: News = {
        ...newsItemData,
        createdAt: new Date(newsItemData.createdAt).toLocaleDateString('vi-VN'),
    } as any;
    const categoryName = newsItem.categoryId || 'Tin tức';

    const relatedRaw = await getRelatedNews(
        newsItem.categoryId || '',
        newsItem.id,
        systemConfigData?.relatedPostsLimit || 3
    );
    const relatedNews: News[] = relatedRaw.map(n => ({
        ...n,
        createdAt: new Date(n.createdAt).toLocaleDateString('vi-VN'),
    })) as any;

    return (
        <NewsDetailClient
            newsItem={newsItem}
            categoryName={categoryName as any}
            relatedNews={relatedNews}
            systemConfig={systemConfigData as any}
        />
    );
}
