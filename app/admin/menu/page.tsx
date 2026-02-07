'use client';

import { useBDS, MenuItem, Page } from '../../lib/store';
import { useState, useEffect } from 'react';
import {
    Plus, Trash2, GripVertical, Save, ExternalLink,
    Link as LinkIcon, FileText, ChevronUp, ChevronDown
} from 'lucide-react';
import { useToast } from '../../components/Toast';

export default function MenuAdminPage() {
    const { menuItems, pages, addMenuItem, deleteMenuItem, updateMenuItems, fetchAllData } = useBDS();
    const { showToast } = useToast();
    const [localItems, setLocalItems] = useState<MenuItem[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    // New item state
    const [newLabel, setNewLabel] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [selectedPage, setSelectedPage] = useState('');

    useEffect(() => {
        setLocalItems(menuItems);
    }, [menuItems]);

    const handleAddCustomLink = async () => {
        if (!newLabel || !newUrl) {
            showToast('Vui lòng nhập tên và liên kết', 'error');
            return;
        }

        const newItem: MenuItem = {
            id: `temp-${Date.now()}`,
            label: newLabel,
            url: newUrl,
            order: localItems.length,
            target: '_self'
        };

        const success = await addMenuItem(newItem);
        if (success) {
            showToast('Đã thêm mục menu', 'success');
            setNewLabel('');
            setNewUrl('');
        }
    };

    const handleAddPageLink = async () => {
        if (!selectedPage) return;
        const page = pages.find(p => p.id === selectedPage);
        if (!page) return;

        const newItem: MenuItem = {
            id: `temp-${Date.now()}`,
            label: page.title,
            url: `/${page.slug}`,
            order: localItems.length,
            target: '_self'
        };

        const success = await addMenuItem(newItem);
        if (success) {
            showToast('Đã thêm trang vào menu', 'success');
            setSelectedPage('');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bạn có chắc muốn xóa mục này?')) {
            const success = await deleteMenuItem(id);
            if (success) showToast('Đã xóa', 'info');
        }
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newItems = [...localItems];
        if (direction === 'up' && index > 0) {
            [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
        } else if (direction === 'down' && index < newItems.length - 1) {
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        }

        // Update orders
        const updatedItems = newItems.map((item, idx) => ({ ...item, order: idx }));
        setLocalItems(updatedItems);
        setIsEditing(true);
    };

    const handleSaveOrder = async () => {
        const success = await updateMenuItems(localItems);
        if (success) {
            showToast('Đã lưu thứ tự menu', 'success');
            setIsEditing(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Menu</h1>
                    <p className="text-gray-500">Tùy chỉnh thanh điều hướng chính của website</p>
                </div>
                {isEditing && (
                    <button
                        onClick={handleSaveOrder}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-md"
                    >
                        <Save className="w-4 h-4" /> Lưu thay đổi
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: Add elements */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" /> Thêm từ Trang
                        </h2>
                        <select
                            value={selectedPage}
                            onChange={(e) => setSelectedPage(e.target.value)}
                            className="w-full p-2 border rounded-lg mb-4 text-sm"
                        >
                            <option value="">-- Chọn trang --</option>
                            {pages.map(page => (
                                <option key={page.id} value={page.id}>{page.title}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddPageLink}
                            disabled={!selectedPage}
                            className="w-full bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-bold border border-gray-200 hover:bg-gray-100 transition"
                        >
                            Thêm vào menu
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4 text-blue-600" /> Liên kết tự chọn
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Tên hiển thị</label>
                                <input
                                    type="text"
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    placeholder="Ví dụ: Giới thiệu"
                                    className="w-full p-2 border rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Đường dẫn (URL)</label>
                                <input
                                    type="text"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    placeholder="Ví dụ: /about"
                                    className="w-full p-2 border rounded-lg text-sm"
                                />
                            </div>
                            <button
                                onClick={handleAddCustomLink}
                                className="w-full bg-blue-50 text-blue-700 py-2 rounded-lg text-sm font-bold border border-blue-100 hover:bg-blue-100 transition"
                            >
                                Thêm liên kết
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right side: Menu structure */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                            <span className="font-bold text-gray-700">Cấu trúc Menu</span>
                            <span className="text-xs text-gray-500">{localItems.length} mục</span>
                        </div>

                        <div className="p-4">
                            {localItems.length === 0 ? (
                                <div className="py-12 text-center text-gray-400">
                                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Plus className="w-8 h-8" />
                                    </div>
                                    <p>Chưa có mục menu nào. Hãy thêm từ bên trái.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {localItems.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 bg-white border rounded-lg p-3 hover:border-blue-300 transition group shadow-sm"
                                        >
                                            <div className="text-gray-400 cursor-move">
                                                <GripVertical className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900">{item.label}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <ExternalLink className="w-3 h-3" /> {item.url}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                                <button
                                                    onClick={() => moveItem(index, 'up')}
                                                    className="p-1 hover:bg-gray-100 rounded text-gray-500"
                                                    disabled={index === 0}
                                                >
                                                    <ChevronUp className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => moveItem(index, 'down')}
                                                    className="p-1 hover:bg-gray-100 rounded text-gray-500"
                                                    disabled={index === localItems.length - 1}
                                                >
                                                    <ChevronDown className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-1 hover:bg-red-50 rounded text-red-500 ml-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
                        <div className="bg-blue-100 p-2 h-fit rounded-full text-blue-600">
                            <ExternalLink className="w-4 h-4" />
                        </div>
                        <div className="text-sm text-blue-800">
                            <p className="font-bold mb-1">Mẹo nhỏ:</p>
                            <p>Bác có thể thêm các link nhanh như <code className="bg-white px-1 rounded">/listings</code> (Mua bán), <code className="bg-white px-1 rounded">/news</code> (Tin tức) hoặc link ngoài tùy ý.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
