'use client';

import { useBDS } from '../../lib/store';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { use } from 'react';
import SEOHead from '../../components/SEOHead';

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { news, newsCategories, systemConfig } = useBDS();

    const newsItem = news.find(n => n.id === id);

    if (!newsItem) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Không tìm thấy bài viết</h1>
                <Link href="/bds/news" className="text-blue-600 hover:underline">
                    &larr; Quay lại trang tin tức
                </Link>
            </div>
        );
    }

    const categoryName = newsCategories.find(c => c.id === newsItem.categoryId)?.name || newsItem.categoryId;
    const relatedNews = news
        .filter(n => n.categoryId === newsItem.categoryId && n.id !== newsItem.id && n.isPublished)
        .slice(0, systemConfig.relatedPostsLimit);

    return (
        <div className="bg-white min-h-screen pb-12">
            <SEOHead
                title={newsItem.seoTitle || newsItem.title}
                description={newsItem.seoDescription || newsItem.summary}
                keywords={newsItem.seoKeywords}
                image={newsItem.thumbnail}
            />

            {/* Hero Image */}
            <div className="w-full h-[400px] relative">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img src={newsItem.thumbnail} alt={newsItem.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="max-w-4xl px-4 text-center text-white">
                        <span className="bg-blue-600 px-3 py-1 rounded text-sm font-bold uppercase tracking-wider mb-4 inline-block">
                            {categoryName}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-shadow-lg">
                            {newsItem.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-sm md:text-base font-medium">
                            <span className="flex items-center gap-2">
                                <User className="w-5 h-5" /> {newsItem.author}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" /> {newsItem.createdAt}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30">
                <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12">
                    {/* Summary */}
                    <p className="text-xl font-medium text-gray-700 mb-8 italic border-l-4 border-blue-600 pl-4 leading-relaxed">
                        {newsItem.summary}
                    </p>

                    {/* Content (HTML) */}
                    <div
                        className="prose prose-lg max-w-none prose-img:rounded-xl prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800"
                        dangerouslySetInnerHTML={{ __html: newsItem.content }}
                    />

                    {/* Share & Tags */}
                    <div className="border-t border-gray-100 mt-12 pt-8 flex items-center justify-between">
                        <Link href="/bds/news" className="text-gray-600 hover:text-blue-600 font-bold flex items-center gap-2 transition">
                            <ArrowLeft className="w-4 h-4" /> Xem tin khác
                        </Link>

                        <div className="flex items-center gap-4">
                            <span className="text-gray-500 font-medium text-sm">Chia sẻ:</span>
                            <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition"><Facebook className="w-4 h-4" /></button>
                            <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-400 transition"><Twitter className="w-4 h-4" /></button>
                            <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-700 transition"><Linkedin className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                {/* Related News */}
                {relatedNews.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Bài viết liên quan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedNews.map(item => (
                                <Link key={item.id} href={`/bds/news/${item.id}`} className="group block">
                                    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition">
                                        <div className="aspect-video overflow-hidden">
                                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" />
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition mb-2">
                                                {item.title}
                                            </h4>
                                            <span className="text-xs text-gray-500">{item.createdAt}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
