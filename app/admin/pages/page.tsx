'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search, FileText } from 'lucide-react';
import Link from 'next/link';
import { useBDS } from '../../lib/store';

export default function AdminPagesList() {
    const { pages, deletePage } = useBDS();
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa trang này không?')) {
            deletePage(id);
        }
    };

    const filteredPages = pages.filter(page =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Trang tĩnh</h1>
                    <p className="text-gray-500">Tạo và chỉnh sửa các trang như Giới thiệu, Liên hệ, Chính sách...</p>
                </div>
                <Link
                    href="/admin/pages/post"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 transition shadow-sm w-fit"
                >
                    <Plus className="w-4 h-4" /> Tạo trang mới
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm trang theo tiêu đề hoặc slug..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Pages List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Tiêu đề</th>
                                <th className="px-6 py-4">Đường dẫn (Slug)</th>
                                <th className="px-6 py-4">Ngày tạo</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPages.length > 0 ? (
                                filteredPages.map((page) => (
                                    <tr key={page.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-gray-900">{page.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">/{page.slug}</code>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{page.createdAt}</td>
                                        <td className="px-6 py-4">
                                            {page.isPublished ? (
                                                <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">Đã đăng</span>
                                            ) : (
                                                <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-bold">Nháp</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 flex gap-3 justify-center">
                                            <Link href={`/${page.slug}`} target="_blank" className="text-gray-500 hover:text-blue-600" title="Xem">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link href={`/admin/pages/post?id=${page.id}`} className="text-blue-500 hover:text-blue-700" title="Sửa">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDelete(page.id)} className="text-red-500 hover:text-red-700" title="Xóa">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        Không tìm thấy trang nào
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
