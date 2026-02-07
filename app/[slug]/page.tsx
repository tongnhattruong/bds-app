'use client';

import { useBDS } from '../lib/store';
import { use } from 'react';
import SEOHead from '../components/SEOHead';
import Link from 'next/link';

export default function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { getPageBySlug, isLoading } = useBDS();

    const page = getPageBySlug(slug);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!page || !page.isPublished) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-32 text-center">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">404 - Không tìm thấy trang</h1>
                <p className="text-gray-600 mb-8">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.</p>
                <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                    Quay lại trang chủ
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            <SEOHead
                title={page.seoTitle || page.title}
                description={page.seoDescription}
                keywords={page.seoKeywords}
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
                        className="prose prose-lg max-w-none prose-img:rounded-xl prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />

                    <div className="mt-16 pt-8 border-t text-sm text-gray-500">
                        Cập nhật lần cuối: {new Date(page.updatedAt).toLocaleDateString('vi-VN')}
                    </div>
                </div>
            </div>
        </div>
    );
}
