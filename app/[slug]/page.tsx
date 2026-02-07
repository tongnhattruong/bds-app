import { prisma } from '../lib/prisma';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import SEOHead from '../components/SEOHead';
import Link from 'next/link';

const getPage = unstable_cache(
    async (slug: string) => {
        return prisma.page.findUnique({
            where: { slug }
        });
    },
    ['static-page'],
    { revalidate: 3600 }
);

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getPage(slug);

    if (!page || !page.isPublished) {
        notFound();
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            <SEOHead
                title={page.seoTitle || page.title}
                description={page.seoDescription || undefined}
                keywords={page.seoKeywords || undefined}
            />

            {/* Header / Hero */}
            <div className="bg-gray-50 border-b py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        {page.title}
                    </h1>
                    <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="max-w-4xl mx-auto">
                    <div
                        className="prose prose-lg max-w-none prose-img:rounded-xl prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 leading-relaxed ql-editor-display"
                        dangerouslySetInnerHTML={{ __html: page.content || '' }}
                    />

                    <div className="mt-16 pt-8 border-t text-sm text-gray-500">
                        Cập nhật lần cuối: {new Date(page.updatedAt).toLocaleDateString('vi-VN')}
                    </div>
                </div>
            </div>
        </div>
    );
}
