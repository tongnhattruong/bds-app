'use client';

import { useBDS, MenuItem, Page } from '../../lib/store';
import { useState, useEffect } from 'react';
import {
    Plus, Trash2, GripVertical, Save, ExternalLink,
    Link as LinkIcon, FileText, ChevronUp, ChevronDown,
    Home, Building2, Landmark, Briefcase, Info, Mail, Phone,
    Search, MapPin, Tag, Edit2, X, Check
} from 'lucide-react';
import { useToast } from '../../components/Toast';
import * as LucideIcons from 'lucide-react';

const ICON_LIST = [
    { name: 'Home', icon: Home },
    { name: 'Building2', icon: Building2 },
    { name: 'Landmark', icon: Landmark },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Info', icon: Info },
    { name: 'Mail', icon: Mail },
    { name: 'Phone', icon: Phone },
    { name: 'Search', icon: Search },
    { name: 'MapPin', icon: MapPin },
    { name: 'Tag', icon: Tag },
];

export default function MenuAdminPage() {
    const { menuItems, pages, addMenuItem, deleteMenuItem, updateMenuItems, fetchAllData } = useBDS();
    const { showToast } = useToast();
    const [localItems, setLocalItems] = useState<MenuItem[]>([]);
    const [isEditingOrder, setIsEditingOrder] = useState(false);

    // New item state
    const [newLabel, setNewLabel] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('Home');
    const [selectedPage, setSelectedPage] = useState('');

    // Editing state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editLabel, setEditLabel] = useState('');
    const [editUrl, setEditUrl] = useState('');
    const [editIcon, setEditIcon] = useState('');

    useEffect(() => {
        setLocalItems(menuItems);
    }, [menuItems]);

    const handleAddCustomLink = async () => {
        if (!newLabel || !newUrl) {
            showToast('Vui lòng nhập tên và liên kết', 'error');
            return;
        }

        const newItem: any = {
            label: newLabel,
            url: newUrl,
            icon: selectedIcon,
            order: localItems.length,
            target: '_self'
        };

        const success = await addMenuItem(newItem);
        if (success) {
            showToast('Đã thêm mục menu', 'success');
            setNewLabel('');
            setNewUrl('');
            setSelectedIcon('Home');
        }
    };

    const handleAddPageLink = async () => {
        if (!selectedPage) return;
        const page = pages.find(p => p.id === selectedPage);
        if (!page) return;

        const newItem: any = {
            label: page.title,
            url: `/${page.slug}`,
            icon: 'FileText',
            order: localItems.length,
            target: '_self'
        };

        const success = await addMenuItem(newItem);
        if (success) {
            showToast('Đã thêm trang vào menu', 'success');
            setSelectedPage('');
        }
    };

    const handleSeedDefaults = async () => {
        if (confirm('Khởi tạo menu mặc định (Mua bán, Cho thuê, Trang chủ)?')) {
            const defaults: any[] = [
                { label: 'Trang chủ', url: '/', icon: 'Home', order: 0, target: '_self' },
                { label: 'Mua bán', url: '/listings', icon: 'Tag', order: 1, target: '_self' },
                { label: 'Cho thuê', url: '/listings?type=rent', icon: 'Key', order: 2, target: '_self' }
            ];

            for (const item of defaults) {
                await addMenuItem(item);
            }
            showToast('Đã khởi tạo menu mặc định', 'success');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bạn có chắc muốn xóa mục này?')) {
            const success = await deleteMenuItem(id);
            if (success) showToast('Đã xóa', 'info');
        }
    };

    const startEditing = (item: MenuItem) => {
        setEditingId(item.id);
        setEditLabel(item.label);
        setEditUrl(item.url);
        setEditIcon(item.icon || 'Home');
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    const saveEdit = async () => {
        const updatedItems = localItems.map(item =>
            item.id === editingId
                ? { ...item, label: editLabel, url: editUrl, icon: editIcon }
                : item
        );
        const success = await updateMenuItems(updatedItems);
        if (success) {
            showToast('Đã cập nhật mục menu', 'success');
            setEditingId(null);
        }
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newItems = [...localItems];
        if (direction === 'up' && index > 0) {
            [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
        } else if (direction === 'down' && index < newItems.length - 1) {
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        }

        const updatedItems = newItems.map((item, idx) => ({ ...item, order: idx }));
        setLocalItems(updatedItems);
        setIsEditingOrder(true);
    };

    const handleSaveOrder = async () => {
        const success = await updateMenuItems(localItems);
        if (success) {
            showToast('Đã lưu thứ tự menu', 'success');
            setIsEditingOrder(false);
        }
    };

    const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
        const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
        return <IconComponent className={className} />;
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Menu</h1>
                    <p className="text-gray-500">Tùy chỉnh thanh điều hướng chính của website</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSeedDefaults}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition"
                    >
                        Khởi tạo Menu mặc định
                    </button>
                    {isEditingOrder && (
                        <button
                            onClick={handleSaveOrder}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-md"
                        >
                            <Save className="w-4 h-4" /> Lưu thứ tự
                        </button>
                    )}
                </div>
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
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase">Chọn Icon</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {ICON_LIST.map(item => (
                                        <button
                                            key={item.name}
                                            onClick={() => setSelectedIcon(item.name)}
                                            className={`p-2 rounded border transition ${selectedIcon === item.name ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 hover:bg-gray-50 text-gray-400'}`}
                                            title={item.name}
                                        >
                                            <item.icon className="w-5 h-5 mx-auto" />
                                        </button>
                                    ))}
                                </div>
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
                                    <p>Chưa có mục menu nào. Hãy thêm từ bên trái hoặc Khởi tạo mặc định.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {localItems.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className={`flex items-center gap-4 bg-white border rounded-lg p-3 transition group shadow-sm ${editingId === item.id ? 'border-blue-500 ring-2 ring-blue-100' : 'hover:border-blue-300'}`}
                                        >
                                            <div className="text-gray-400 cursor-move">
                                                <GripVertical className="w-5 h-5" />
                                            </div>

                                            {editingId === item.id ? (
                                                <div className="flex-1 grid grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        value={editLabel}
                                                        onChange={(e) => setEditLabel(e.target.value)}
                                                        className="p-1 border rounded text-sm font-bold"
                                                        placeholder="Tên mục"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editUrl}
                                                        onChange={(e) => setEditUrl(e.target.value)}
                                                        className="p-1 border rounded text-sm"
                                                        placeholder="URL"
                                                    />
                                                    <div className="col-span-2 flex items-center gap-4 py-2 border-t mt-1">
                                                        <span className="text-xs font-medium text-gray-500">Icon:</span>
                                                        <div className="flex gap-2 flex-wrap">
                                                            {ICON_LIST.map(ic => (
                                                                <button
                                                                    key={ic.name}
                                                                    onClick={() => setEditIcon(ic.name)}
                                                                    className={`p-1.5 rounded border ${editIcon === ic.name ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400'}`}
                                                                >
                                                                    <ic.icon className="w-4 h-4" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex-1 flex items-center gap-3">
                                                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                                        <IconRenderer name={item.icon || 'HelpCircle'} className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{item.label}</p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                                            <ExternalLink className="w-3 h-3" /> {item.url}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-1">
                                                {editingId === item.id ? (
                                                    <>
                                                        <button
                                                            onClick={saveEdit}
                                                            className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition"
                                                            title="Lưu"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            className="p-2 bg-gray-50 text-gray-500 rounded hover:bg-gray-100 transition"
                                                            title="Hủy"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => startEditing(item)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
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
                                                        </div>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition ml-2"
                                                            title="Xóa"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
