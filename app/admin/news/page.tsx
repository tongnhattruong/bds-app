'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { useBDS } from '../../lib/store';

export default function AdminNewsPage() {
    const { news, deleteNews, newsCategories } = useBDS();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const handleDelete = (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa tin tức này không?')) {
            deleteNews(id);
        }
    };

    const filteredNews = news.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || item.categoryId === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryName = (id: string) => {
        const cat = newsCategories.find(c => c.id === id);
        return cat ? cat.name : id;
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý tin tức</h1>
                    <p className="text-gray-500">Danh sách bài viết và thông tin thị trường</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/admin/news/categories"
                        className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2 transition"
                    >
                        <Filter className="w-4 h-4" /> Danh mục
                    </Link>
                    <Link
                        href="/admin/news/post"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 transition shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Đăng tin mới
                    </Link>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="all">Tất cả danh mục</option>
                        {newsCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* News List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Hình ảnh</th>
                                <th className="px-6 py-4">Tiêu đề</th>
                                <th className="px-6 py-4">Danh mục</th>
                                <th className="px-6 py-4">Ngày đăng</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredNews.length > 0 ? (
                                filteredNews.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="w-16 h-12 rounded overflow-hidden bg-gray-200">
                                                <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate" title={item.title}>
                                            {item.title}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                                {getCategoryName(item.categoryId)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{item.createdAt}</td>
                                        <td className="px-6 py-4">
                                            {item.isPublished ? (
                                                <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">Đã đăng</span>
                                            ) : (
                                                <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-bold">Nháp</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 flex gap-3 justify-center">
                                            <Link href={`/news/${item.id}`} className="text-gray-500 hover:text-blue-600" title="Xem">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link href={`/admin/news/post?id=${item.id}`} className="text-blue-500 hover:text-blue-700" title="Sửa">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700" title="Xóa">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Không tìm thấy bài viết nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

