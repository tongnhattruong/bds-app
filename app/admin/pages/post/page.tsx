'use client';

import { useState, useEffect, Suspense } from 'react';
import { Save, ArrowLeft, Globe, Link as LinkIcon } from 'lucide-react';
import { useBDS } from '../../../lib/store';
import { useRouter, useSearchParams } from 'next/navigation';
import RichTextEditor from '../../../../components/RichTextEditor';

// Hàm chuyển đổi tiêu đề thành slug
const convertToSlug = (text: string) => {
    return text
        .toLowerCase()
        .normalize('NFD') // Chuẩn hóa Unicode để tách dấu
        .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
        .replace(/[đĐ]/g, 'd')
        .replace(/([^0-9a-z-\s])/g, '') // Xóa ký tự đặc biệt
        .replace(/(\s+)/g, '-') // Thay dấu cách bằng -
        .replace(/-+/g, '-') // Xóa nhiều dấu - liên tiếp
        .replace(/^-+|-+$/g, ''); // Xóa dấu - ở đầu và cuối
};

function PagePostContent() {
    const { addPage, updatePage, pages } = useBDS();
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');

    const isEditMode = !!editId;

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        isPublished: true,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: ''
    });

    const [isAutoSlug, setIsAutoSlug] = useState(!isEditMode);

    useEffect(() => {
        if (isEditMode && editId) {
            const existingPage = pages.find(p => p.id === editId);
            if (existingPage) {
                setFormData({
                    title: existingPage.title,
                    slug: existingPage.slug,
                    content: existingPage.content,
                    isPublished: existingPage.isPublished,
                    seoTitle: existingPage.seoTitle || '',
                    seoDescription: existingPage.seoDescription || '',
                    seoKeywords: existingPage.seoKeywords || ''
                });
                setIsAutoSlug(false);
            }
        }
    }, [editId, isEditMode, pages]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'title' && isAutoSlug) {
            setFormData(prev => ({
                ...prev,
                title: value,
                slug: convertToSlug(value)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const now = new Date().toISOString();
        const pageData = {
            id: isEditMode && editId ? editId : Date.now().toString(),
            ...formData,
            createdAt: isEditMode && editId ? (pages.find(p => p.id === editId)?.createdAt || now) : now,
            updatedAt: now
        };

        if (isEditMode && editId) {
            updatePage(pageData);
            alert('Cập nhật trang thành công!');
        } else {
            addPage(pageData);
            alert('Tạo trang thành công!');
        }

        router.push('/admin/pages');
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Chỉnh sửa Trang' : 'Tạo Trang mới'}</h1>
                    <p className="text-gray-500">Thiết lập nội dung trang tĩnh cho website</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition"
                >
                    <ArrowLeft className="w-5 h-5" /> Quay lại
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề Trang *</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            type="text"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-lg"
                            placeholder="Nhập tiêu đề (VD: Giới thiệu, Liên hệ...)"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            Đường dẫn (Slug) *
                            <button
                                type="button"
                                onClick={() => setIsAutoSlug(!isAutoSlug)}
                                className={`text-[10px] px-2 py-0.5 rounded ${isAutoSlug ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}
                            >
                                {isAutoSlug ? 'Tự động' : 'Thủ công'}
                            </button>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm italic">example.com/</span>
                            <input
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                type="text"
                                className={`w-full border rounded-lg pl-28 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm ${isAutoSlug ? 'bg-gray-50 text-gray-500' : ''}`}
                                placeholder="duong-dan-bai-viet"
                                readOnly={isAutoSlug}
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Đường dẫn thân thiện cho trang web.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <select
                            name="isPublished"
                            value={formData.isPublished.toString()}
                            onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.value === 'true' }))}
                            className="w-full md:w-48 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="true">Công khai</option>
                            <option value="false">Nháp</option>
                        </select>
                    </div>

                    {/* Content Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung trang</label>
                        <RichTextEditor
                            value={formData.content}
                            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                            placeholder="Nhập nội dung trang web tại đây..."
                        />
                    </div>

                    {/* SEO Section */}
                    <div className="pt-6 border-t border-gray-100 mt-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-green-600" /> Cấu hình SEO (Meta)
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề SEO (Meta Title)</label>
                                    <input
                                        type="text"
                                        value={formData.seoTitle || ''}
                                        onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                                        placeholder={formData.title || 'Tiêu đề trang'}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Sử dụng tiêu đề trang nếu để trống.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả SEO (Meta Description)</label>
                                    <textarea
                                        value={formData.seoDescription || ''}
                                        onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                                        placeholder="Mô tả ngắn gọn về trang cho Google..."
                                        rows={4}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Từ khóa SEO</label>
                                    <input
                                        type="text"
                                        value={formData.seoKeywords || ''}
                                        onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                                        placeholder="gioi thieu, bds, lien he..."
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Google Preview */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-fit">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Google Search Preview</h4>
                                <div className="bg-white p-4 rounded shadow-sm border">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-[8px] text-gray-500">Logo</div>
                                        <div>
                                            <div className="text-[10px] text-gray-800">example.com</div>
                                            <div className="text-[10px] text-green-700 truncate max-w-[150px]">
                                                https://example.com/{formData.slug || '...'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-lg text-[#1a0dab] font-medium hover:underline cursor-pointer truncate">
                                        {formData.seoTitle || formData.title || 'Tiêu đề trang'}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                                        {formData.seoDescription || 'Nội dung mô tả trang web sẽ được Google hiển thị tại đây để thu hút khách hàng click...'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 sticky bottom-0 bg-white py-4 border-t mt-4 z-10 shadow-[-10px_0_10px_rgba(0,0,0,0.02)]">
                        <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-lg hover:bg-gray-50 font-medium text-gray-700">Hủy</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2 shadow-lg">
                            <Save className="w-4 h-4" /> {isEditMode ? 'Cập nhật' : 'Lưu trang'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function PagePostPage() {
    return (
        <Suspense fallback={<div>Đang tải form...</div>}>
            <PagePostContent />
        </Suspense>
    );
}
