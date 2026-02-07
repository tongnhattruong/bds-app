'use client';

import { useBDS, MenuItem, Page } from '../../lib/store';
import { supabase } from '../../../utils/supabase/client';
import { useState, useEffect, useMemo } from 'react';
import {
    Plus, Trash2, GripVertical, Save, ExternalLink,
    Link as LinkIcon, FileText, ChevronUp, ChevronDown,
    Home, Building2, Landmark, Briefcase, Info, Mail, Phone,
    Search, MapPin, Tag, Edit2, X, Check, HelpCircle, Key, Users, Loader2
} from 'lucide-react';
import { useToast } from '../../components/Toast';
import * as LucideIcons from 'lucide-react';

const SUGGESTED_ICONS = [
    'Home', 'Building2', 'Landmark', 'Briefcase', 'Info', 'Mail', 'Phone',
    'Search', 'MapPin', 'Tag', 'Key', 'Users', 'FileText', 'Newspaper', 'Settings',
    'Heart', 'Star', 'Map', 'Compass', 'Layout'
];

const DEFAULT_MENU_ITEMS: any[] = [
    { label: 'Trang chủ', url: '/', icon: 'Home', order: 0, target: '_self' },
    { label: 'Mua bán', url: '/listings', icon: 'Tag', order: 1, target: '_self' },
    { label: 'Cho thuê', url: '/listings?type=rent', icon: 'Key', order: 2, target: '_self' },
    { label: 'Tin tức', url: '/news', icon: 'Newspaper', order: 3, target: '_self' }
];

export default function MenuAdminPage() {
    const { menuItems, pages, addMenuItem, deleteMenuItem, updateMenuItems, fetchAllData, isLoading } = useBDS();
    const { showToast } = useToast();
    const [localItems, setLocalItems] = useState<MenuItem[]>([]);
    const [isEditingOrder, setIsEditingOrder] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

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

    // Icon Search
    const [iconSearch, setIconSearch] = useState('');

    useEffect(() => {
        setLocalItems(menuItems);
    }, [menuItems]);

    const filteredIcons = useMemo(() => {
        const query = iconSearch.toLowerCase();
        if (!query) return SUGGESTED_ICONS;
        return Object.keys(LucideIcons).filter(name =>
            name.toLowerCase().includes(query) &&
            typeof (LucideIcons as any)[name] === 'function'
        ).slice(0, 30);
    }, [iconSearch]);

    const handleAddCustomLink = async () => {
        if (!newLabel || !newUrl) {
            showToast('Vui lòng nhập tên và liên kết', 'error');
            return;
        }

        setIsProcessing(true);
        const newItem: any = {
            label: newLabel,
            url: newUrl,
            icon: selectedIcon,
            order: localItems.length,
            target: '_self'
        };

        try {
            const success = await addMenuItem(newItem);
            if (success) {
                showToast('Đã thêm thành công', 'success');
                setNewLabel('');
                setNewUrl('');
                setSelectedIcon('Home');
            } else {
                showToast('Lỗi: Không thể lưu. Có thể bảng MenuItem chưa được tạo trong Database.', 'error');
            }
        } catch (e) {
            showToast('Lỗi kỹ thuật khi kết nối Database', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAddPageLink = async () => {
        if (!selectedPage) return;
        const page = pages.find(p => p.id === selectedPage);
        if (!page) return;

        setIsProcessing(true);
        const newItem: any = {
            label: page.title,
            url: `/${page.slug}`,
            icon: 'FileText',
            order: localItems.length,
            target: '_self'
        };

        try {
            const success = await addMenuItem(newItem);
            if (success) {
                showToast('Đã thêm trang thành công', 'success');
                setSelectedPage('');
            } else {
                showToast('Lỗi khi lưu liên kết trang', 'error');
            }
        } catch (e) {
            showToast('Lỗi kết nối', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSeedDefaults = async () => {
        // Cản phá mọi nỗ lực thực thi tự động (SSR hoặc Hydration)
        if (typeof window === 'undefined') return;

        const hasItems = menuItems.length > 0;
        const msg = hasItems
            ? 'Cảnh báo: Bạn đã có menu. Nếu tiếp tục, TOÀN BỘ menu cũ sẽ bị xóa để thay bằng mặc định. Bạn có chắc chắn?'
            : 'Khởi tạo danh sách menu mặc định?';

        if (window.confirm(msg)) {
            setIsProcessing(true);
            try {
                // 1. Chỉ thực hiện dọn dẹp nếu người dùng đã xác nhận qua confirm
                const { error: deleteError } = await supabase.from('MenuItem').delete().neq('id', '_none_');

                if (deleteError) {
                    showToast('Lỗi khi dọn dẹp menu cũ', 'error');
                    setIsProcessing(false);
                    return;
                }

                // 2. Insert new default items
                let count = 0;
                for (const item of DEFAULT_MENU_ITEMS) {
                    const success = await addMenuItem({
                        ...item,
                        id: crypto.randomUUID()
                    });
                    if (success) count++;
                }

                if (count > 0) {
                    showToast(`Đã khởi tạo ${count} mục menu thành công`, 'success');
                    // fetchAllData() đã được gọi trong addMenuItem
                } else {
                    showToast('Lỗi: Không thể khởi tạo menu mới.', 'error');
                }
            } catch (error) {
                console.error('Seed error:', error);
                showToast('Có lỗi xảy ra trong quá trình khởi tạo', 'error');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Xác nhận xóa?')) {
            setIsProcessing(true);
            const success = await deleteMenuItem(id);
            if (success) {
                showToast('Đã xóa', 'info');
                await fetchAllData();
            } else {
                showToast('Lỗi khi xóa', 'error');
            }
            setIsProcessing(false);
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
        setIsProcessing(true);
        const updatedItems = localItems.map(item =>
            item.id === editingId
                ? { ...item, label: editLabel, url: editUrl, icon: editIcon }
                : item
        );
        const success = await updateMenuItems(updatedItems);
        if (success) {
            showToast('Đã cập nhật', 'success');
            setEditingId(null);
            await fetchAllData();
        } else {
            showToast('Lỗi khi cập nhật', 'error');
        }
        setIsProcessing(false);
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
        setIsProcessing(true);
        const success = await updateMenuItems(localItems);
        if (success) {
            showToast('Đã lưu thứ tự', 'success');
            setIsEditingOrder(false);
            await fetchAllData();
        } else {
            showToast('Lỗi khi lưu thứ tự', 'error');
        }
        setIsProcessing(false);
    };

    const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
        const IconComponent = (LucideIcons as any)[name] || HelpCircle;
        return <IconComponent className={className} />;
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <LucideIcons.Menu className="w-6 h-6 text-blue-600" /> Quản lý Menu
                    </h1>
                    <p className="text-gray-500">Chỉnh sửa thanh điều hướng chính của website</p>
                </div>
                <div className="flex gap-3">
                    {localItems.length === 0 && !isLoading && (
                        <button
                            onClick={handleSeedDefaults}
                            disabled={isProcessing}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Khởi tạo Menu Mặc định
                        </button>
                    )}
                    {isEditingOrder && (
                        <button
                            onClick={handleSaveOrder}
                            disabled={isProcessing}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 transition shadow-md disabled:opacity-50"
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Lưu thứ tự
                        </button>
                    )}
                </div>
            </div>

            {isProcessing && (
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl mb-6 flex items-center gap-3 text-blue-600 font-medium animate-pulse">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang xử lý dữ liệu, vui lòng đợi trong giây lát...
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: Add Elements */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" /> Thêm từ Trang
                        </h2>
                        <select
                            value={selectedPage}
                            onChange={(e) => setSelectedPage(e.target.value)}
                            disabled={isProcessing}
                            className="w-full p-2.5 border rounded-xl mb-4 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none border-gray-200 transition disabled:opacity-50"
                        >
                            <option value="">-- Chọn một trang --</option>
                            {pages.map(page => (
                                <option key={page.id} value={page.id}>{page.title}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddPageLink}
                            disabled={!selectedPage || isProcessing}
                            className="w-full bg-blue-50 text-blue-700 py-2.5 rounded-xl text-sm font-bold border border-blue-100 hover:bg-blue-100 transition disabled:opacity-50"
                        >
                            Thêm vào menu
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4 text-orange-500" /> Liên kết tự chọn
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Tên hiển thị</label>
                                <input
                                    type="text"
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    disabled={isProcessing}
                                    placeholder="Ví dụ: Facebook, TikTok..."
                                    className="w-full p-2.5 border rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none border-gray-200"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Đường dẫn (URL)</label>
                                <input
                                    type="text"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    disabled={isProcessing}
                                    placeholder="Ví dụ: /gioi-thieu"
                                    className="w-full p-2.5 border rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none border-gray-200"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Chọn Icon</label>
                                    <div className="relative">
                                        <Search className="w-3 h-3 absolute left-2 top-1.5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Tìm..."
                                            className="pl-6 py-0.5 text-xs border rounded-md outline-none bg-gray-50 w-24"
                                            value={iconSearch}
                                            onChange={(e) => setIconSearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-200 px-1">
                                    {filteredIcons.map(name => (
                                        <button
                                            key={name}
                                            onClick={() => setSelectedIcon(name)}
                                            disabled={isProcessing}
                                            className={`p-2 rounded-xl border transition flex flex-col items-center gap-1 ${selectedIcon === name ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-gray-100 hover:bg-gray-50 text-gray-400'}`}
                                            title={name}
                                        >
                                            <IconRenderer name={name} className="w-5 h-5" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleAddCustomLink}
                                disabled={isProcessing}
                                className="w-full bg-orange-50 text-orange-700 py-2.5 rounded-xl text-sm font-bold border border-orange-100 hover:bg-orange-100 transition disabled:opacity-50"
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Thêm vào menu'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right side: Menu Structure */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                            <span className="font-bold text-gray-700 flex items-center gap-2">
                                Danh sách Menu <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] uppercase">{localItems.length}</span>
                            </span>
                        </div>

                        <div className="p-4">
                            {isLoading ? (
                                <div className="py-20 text-center">
                                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                                    <p className="text-gray-500">Đang tải danh sách menu...</p>
                                </div>
                            ) : localItems.length === 0 ? (
                                <div className="py-20 text-center">
                                    <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-300">
                                        <LucideIcons.Layout className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có menu nào</h3>
                                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Vui lòng thêm các mục từ bên trái hoặc khởi tạo mặc định.</p>
                                    <button
                                        onClick={handleSeedDefaults}
                                        disabled={isProcessing}
                                        className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-xl mx-auto disabled:opacity-50"
                                    >
                                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                        Khởi tạo ngay
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {localItems.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className={`flex items-center gap-4 bg-white border rounded-2xl p-4 transition-all group shadow-sm ${editingId === item.id ? 'border-blue-500 ring-4 ring-blue-50' : 'hover:border-blue-200'}`}
                                        >
                                            <div className="text-gray-300 group-hover:text-blue-400 transition cursor-move">
                                                <GripVertical className="w-6 h-6" />
                                            </div>

                                            {editingId === item.id ? (
                                                <div className="flex-1 space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Tên mục</label>
                                                            <input
                                                                type="text"
                                                                value={editLabel}
                                                                onChange={(e) => setEditLabel(e.target.value)}
                                                                disabled={isProcessing}
                                                                className="w-full p-2 border rounded-xl text-sm font-bold bg-gray-50 outline-none border-gray-200"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Đường dẫn</label>
                                                            <input
                                                                type="text"
                                                                value={editUrl}
                                                                onChange={(e) => setEditUrl(e.target.value)}
                                                                disabled={isProcessing}
                                                                className="w-full p-2 border rounded-xl text-sm bg-gray-50 outline-none border-gray-200"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="border-t pt-2 flex items-center gap-3">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Icon:</span>
                                                        <div className="flex gap-1.5 flex-wrap">
                                                            {SUGGESTED_ICONS.slice(0, 10).map(icName => (
                                                                <button
                                                                    key={icName}
                                                                    onClick={() => setEditIcon(icName)}
                                                                    disabled={isProcessing}
                                                                    className={`p-1.5 rounded-lg border transition ${editIcon === icName ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'}`}
                                                                >
                                                                    <IconRenderer name={icName} className="w-4 h-4" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex-1 flex items-center gap-4">
                                                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 shadow-inner group-hover:scale-110 transition">
                                                        <IconRenderer name={item.icon || 'HelpCircle'} className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 leading-tight mb-1">{item.label}</p>
                                                        <p className="text-xs text-gray-400 flex items-center gap-1 group-hover:text-blue-500 transition">
                                                            <ExternalLink className="w-3 h-3" /> {item.url}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2">
                                                {editingId === item.id ? (
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={saveEdit}
                                                            disabled={isProcessing}
                                                            className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition shadow-sm border border-green-100"
                                                        >
                                                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            disabled={isProcessing}
                                                            className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition border border-gray-100"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => startEditing(item)}
                                                            disabled={isProcessing}
                                                            className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition group/btn border border-transparent hover:border-blue-100"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Edit2 className="w-5 h-5" />
                                                        </button>
                                                        <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto">
                                                            <button
                                                                onClick={() => moveItem(index, 'up')}
                                                                className={`p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600 ${index === 0 ? 'invisible' : ''}`}
                                                                disabled={isProcessing}
                                                            >
                                                                <ChevronUp className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => moveItem(index, 'down')}
                                                                className={`p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600 ${index === localItems.length - 1 ? 'invisible' : ''}`}
                                                                disabled={isProcessing}
                                                            >
                                                                <ChevronDown className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            disabled={isProcessing}
                                                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100 ml-1"
                                                            title="Xóa"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
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
