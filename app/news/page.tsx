'use client';

import { useBDS } from '../lib/store';
import Link from 'next/link';
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';

export default function NewsPage() {
    const { news, newsCategories, systemConfig } = useBDS();
    const [activeCategory, setActiveCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Reset pagination when category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory]);

    const publishedNews = news.filter(item => item.isPublished);

    // Featured News Logic: Always the latest published item generally, or specific flag. 
    // Here we take the first item of ALL published news as featured.
    const featuredNews = publishedNews[0];

    // Filtering logic for the grid
    let filteredNews = activeCategory === 'all'
        ? publishedNews
        : publishedNews.filter(item => item.categoryId === activeCategory);

    // Exclude featured news from grid if it serves as the main featured item (only if activeCategory is all or matches)
    const showFeatured = featuredNews && (activeCategory === 'all' || activeCategory === featuredNews.categoryId);

    if (showFeatured) {
        filteredNews = filteredNews.filter(item => item.id !== featuredNews.id);
    }

    // Pagination Logic
    const postsPerPage = systemConfig.postsPerPage || 6;
    const totalPages = Math.ceil(filteredNews.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const currentNews = filteredNews.slice(startIndex, startIndex + postsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Optional: smooth scroll to top of grid
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <SEOHead
                title="Tin tức bất động sản mới nhất - Thị trường nhà đất"
                description="Cập nhật tin tức thị trường bất động sản, phân tích, nhận định chuyên sâu từ các chuyên gia."
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Tin tức thị trường Bất động sản</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Cập nhật những thông tin mới nhất, kiến thức và xu hướng thị trường bất động sản Việt Nam.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition ${activeCategory === 'all' ? 'bg-blue-600 text-white shadow-md transform scale-105' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}
                    >
                        Tất cả
                    </button>
                    {newsCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition ${activeCategory === cat.id ? 'bg-blue-600 text-white shadow-md transform scale-105' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Featured News */}
                {showFeatured && (
                    <div className="mb-12">
                        <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="h-64 lg:h-auto overflow-hidden">
                                    <img
                                        src={featuredNews.thumbnail}
                                        alt={featuredNews.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                                    />
                                </div>
                                <div className="p-8 flex flex-col justify-center">
                                    <div className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">
                                        Nổi bật
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 hover:text-blue-700 transition">
                                        <Link href={`/news/${featuredNews.id}`}>
                                            {featuredNews.title}
                                        </Link>
                                    </h2>
                                    <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                                        {featuredNews.summary}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" /> {featuredNews.createdAt}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="w-4 h-4" /> {featuredNews.author}
                                            </span>
                                        </div>
                                        <Link href={`/news/${featuredNews.id}`} className="text-blue-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                            Đọc tiếp <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {currentNews.map(item => (
                        <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition group flex flex-col h-full">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded">
                                    {newsCategories.find(c => c.id === item.categoryId)?.name || item.categoryId}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 line-clamp-2">
                                    <Link href={`/news/${item.id}`}>
                                        {item.title}
                                    </Link>
                                </h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                                    {item.summary}
                                </p>
                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {item.createdAt}
                                    </span>
                                    <Link href={`/news/${item.id}`} className="text-sm font-bold text-blue-600 hover:text-blue-800">
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredNews.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Chưa có bài viết nào trong danh mục này.
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 rounded-lg font-bold border transition ${currentPage === page
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

