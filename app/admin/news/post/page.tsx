'use client';

import { useState, useEffect, Suspense } from 'react';
import { Save, ArrowLeft, Image as ImageIcon, Globe } from 'lucide-react';
import { useBDS } from '../../../lib/store'; // Adjust path based on depth
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RichTextEditor from '../../../../components/RichTextEditor';

// Hàm chuyển đổi tiêu đề thành slug
const convertToSlug = (text: string) => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/([^0-9a-z-\s])/g, '')
        .replace(/(\s+)/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
};

function NewsPostContent() {
    const { addNews, updateNews, news, newsCategories } = useBDS();
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');

    const isEditMode = !!editId;

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        summary: '',
        content: '',
        thumbnail: '',
        categoryId: '',
        isPublished: true,
        author: 'Admin', // Default
        // SEO
        seoTitle: '',
        seoDescription: '',
        seoKeywords: ''
    });

    const [isAutoSlug, setIsAutoSlug] = useState(!isEditMode);

    useEffect(() => {
        if (isEditMode && editId) {
            const existingNews = news.find(n => n.id === editId);
            if (existingNews) {
                setFormData({
                    title: existingNews.title,
                    slug: existingNews.slug || '',
                    summary: existingNews.summary,
                    content: existingNews.content,
                    thumbnail: existingNews.thumbnail,
                    categoryId: existingNews.categoryId,
                    isPublished: existingNews.isPublished,
                    author: existingNews.author,
                    seoTitle: existingNews.seoTitle || '',
                    seoDescription: existingNews.seoDescription || '',
                    seoKeywords: existingNews.seoKeywords || ''
                });
                setIsAutoSlug(false);
            }
        }
    }, [editId, isEditMode, news]);

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

        const newsData = {
            id: isEditMode && editId ? editId : Date.now().toString(),
            ...formData,
            createdAt: isEditMode && editId ? (news.find(n => n.id === editId)?.createdAt || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]
        };

        if (isEditMode && editId) {
            updateNews(newsData);
            alert('Cập nhật bài viết thành công!');
        } else {
            addNews(newsData);
            alert('Đăng bài viết thành công!');
        }

        router.push('/admin/news');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Cập nhật bài viết' : 'Đăng bài viết mới'}</h1>
                    <p className="text-gray-500">Soạn thảo nội dung tin tức, thị trường</p>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bài viết *</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            type="text"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                            placeholder="Nhập tiêu đề bài viết..."
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
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm italic">example.com/news/</span>
                            <input
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                type="text"
                                className={`w-full border rounded-lg pl-36 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm ${isAutoSlug ? 'bg-gray-50 text-gray-500' : ''}`}
                                placeholder="duong-dan-bai-viet"
                                readOnly={isAutoSlug}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {newsCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                            <select
                                name="isPublished"
                                value={formData.isPublished.toString()}
                                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.value === 'true' }))}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="true">Công khai (Đăng ngay)</option>
                                <option value="false">Lưu nháp</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện (URL)</label>
                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <input
                                    name="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={handleChange}
                                    type="text"
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none mb-2"
                                    placeholder="https://example.com/image.jpg"
                                />
                                <p className="text-xs text-gray-500">Nhập đường dẫn hình ảnh cho bài viết.</p>
                            </div>
                            <div className="w-32 h-20 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
                                {formData.thumbnail ? (
                                    <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SEO Section */}
                    <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-green-600" /> Cấu hình SEO
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề SEO</label>
                                    <input
                                        type="text"
                                        value={formData.seoTitle || ''}
                                        onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                                        placeholder={formData.title || 'Tiêu đề bài viết'}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Để trống nếu muốn dùng tiêu đề bài viết.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả SEO</label>
                                    <textarea
                                        value={formData.seoDescription || ''}
                                        onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                                        placeholder={formData.summary || 'Mô tả ngắn...'}
                                        rows={4}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    ></textarea>
                                    <p className="text-xs text-gray-500 mt-1">Để trống nếu muốn dùng tóm tắt bài viết.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Từ khóa SEO</label>
                                    <input
                                        type="text"
                                        value={formData.seoKeywords || ''}
                                        onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                                        placeholder="tin tuc, bds..."
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Google Preview */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-fit">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Google Search Preview</h4>
                                <div className="bg-white p-4 rounded shadow-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500">Logo</div>
                                        <div>
                                            <div className="text-xs text-gray-800">example.com</div>
                                            <div className="text-xs text-green-700">https://example.com/news/...</div>
                                        </div>
                                    </div>
                                    <div className="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer truncate">
                                        {formData.seoTitle || formData.title || 'Tiêu đề bài viết'}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                                        {formData.seoDescription || formData.summary || 'Mô tả bài viết sẽ hiện thị ở đây...'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt ngắn</label>
                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Mô tả ngắn gọn về nội dung bài viết (hiển thị ở danh sách tin tức)..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chi tiết</label>
                        <RichTextEditor
                            value={formData.content}
                            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                            placeholder="Viết nội dung bài viết chi tiết..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 sticky bottom-0 bg-white py-4 border-t mt-4 z-10">
                        <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-lg hover:bg-gray-50 font-medium text-gray-700">Hủy</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2 shadow-lg">
                            <Save className="w-4 h-4" /> {isEditMode ? 'Cập nhật bài viết' : 'Đăng bài viết'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function NewsPostPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewsPostContent />
        </Suspense>
    );
}

