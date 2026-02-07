'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useBDS } from '../../../lib/store';
import Link from 'next/link';

export default function NewsCategoriesPage() {
    const { newsCategories, addNewsCategory, deleteNewsCategory } = useBDS();

    // Simple state for inline editing/adding
    const [isAdding, setIsAdding] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatId, setNewCatId] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName || !newCatId) return;

        addNewsCategory({
            id: newCatId,
            name: newCatName
        });

        setIsAdding(false);
        setNewCatName('');
        setNewCatId('');
    };

    const handleDelete = (id: string) => {
        if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
            deleteNewsCategory(id);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Danh mục tin tức</h1>
                    <p className="text-gray-500">Quản lý các chuyên mục bài viết</p>
                </div>
                <Link
                    href="/admin/news"
                    className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1"
                >
                    &larr; Quay lại tin tức
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                {/* Add Category Form */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600" /> Thêm danh mục mới
                    </h3>
                    <form onSubmit={handleAdd} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Mã danh mục (ID)</label>
                            <input
                                type="text"
                                value={newCatId}
                                onChange={(e) => setNewCatId(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                placeholder="VD: market, tips..."
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Tên danh mục</label>
                            <input
                                type="text"
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                placeholder="VD: Thị trường BĐS..."
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            Thêm
                        </button>
                    </form>
                </div>

                <h3 className="font-bold text-lg mb-4">Danh sách hiện tại</h3>
                <div className="overflow-hidden border rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3 border-b">ID</th>
                                <th className="px-6 py-3 border-b">Tên danh mục</th>
                                <th className="px-6 py-3 border-b text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {newsCategories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-gray-600">{cat.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                                            title="Xóa danh mục"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

