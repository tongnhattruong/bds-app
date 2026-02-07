'use client';

import { Save, ArrowLeft, User, Globe } from 'lucide-react';
import { useBDS } from '../../lib/store';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { Property, PropertyCategory, PropertyType } from '../../lib/mock-data';
import RichTextEditor from '../../../components/RichTextEditor';

function PostPropertyContent() {
    const { addProperty, updateProperty, getPropertyById, cities, districts, fetchAllData, systemConfig } = useBDS();
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');

    const isEditMode = !!editId;

    const [formData, setFormData] = useState({
        title: '',
        type: 'sale' as PropertyType,
        category: 'house' as PropertyCategory,
        price: '',
        currency: 'Tỷ',
        area: '',
        address: '',
        city: '',
        district: '',
        description: '',
        bedrooms: '',
        bathrooms: '',
        contactName: '', // Initialize empty, will load in useEffect
        contactPhone: '',
        contactEmail: '',
        youtubeUrl: '',
        images: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2573&auto=format&fit=crop'] as string[],
        // SEO
        seoTitle: '',
        seoDescription: '',
        seoKeywords: ''
    });

    useEffect(() => {
        if (isEditMode && editId) {
            // EDIT MODE: Load existing property data
            const existingProperty = getPropertyById(editId);
            if (existingProperty) {
                setFormData({
                    title: existingProperty.title,
                    type: existingProperty.type,
                    category: existingProperty.category,
                    price: existingProperty.price.toString(),
                    currency: existingProperty.currency,
                    area: existingProperty.area.toString(),
                    address: existingProperty.address,
                    city: existingProperty.city,
                    district: '', // District info not in basic mock, user has to re-select
                    description: existingProperty.description || '',
                    bedrooms: existingProperty.bedrooms ? existingProperty.bedrooms.toString() : '',
                    bathrooms: existingProperty.bathrooms ? existingProperty.bathrooms.toString() : '',
                    contactName: existingProperty.contactName,
                    contactPhone: existingProperty.contactPhone,
                    contactEmail: existingProperty.contactEmail || '',
                    youtubeUrl: existingProperty.youtubeUrl || '',
                    images: existingProperty.images.length > 0 ? existingProperty.images : [''],
                    seoTitle: existingProperty.seoTitle || '',
                    seoDescription: existingProperty.seoDescription || '',
                    seoKeywords: existingProperty.seoKeywords || ''
                });
            }
        } else {
            // NEW POST MODE: Load default contact info from System Configuration (Database)
            setFormData(prev => ({
                ...prev,
                contactName: systemConfig.defaultContactName || 'Admin',
                contactPhone: systemConfig.footerPhone || '0909000111',
                contactEmail: systemConfig.footerEmail || 'admin@bds.com'
            }));
        }
    }, [editId, isEditMode, getPropertyById, systemConfig]);

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedCity = cities.find(c => c.id === formData.city)?.name || formData.city;
        const selectedDistrict = districts.find(d => d.id === formData.district)?.name || formData.district;

        let finalAddress = formData.address;
        if (selectedDistrict && !finalAddress.includes(selectedDistrict)) {
            finalAddress = `${formData.address}, ${selectedDistrict}`;
        }

        const propertyData: Property = {
            id: isEditMode && editId ? editId : Date.now().toString(),
            title: formData.title,
            price: Number(formData.price),
            currency: formData.currency,
            area: Number(formData.area),
            address: finalAddress,
            city: selectedCity,
            type: formData.type,
            category: formData.category,
            description: formData.description,
            images: formData.images.filter(img => img.trim() !== ''),
            bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
            bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
            createdAt: isEditMode && editId ? (getPropertyById(editId)?.createdAt || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
            contactName: formData.contactName,
            contactPhone: formData.contactPhone,
            contactEmail: formData.contactEmail,
            youtubeUrl: formData.youtubeUrl,
            seoTitle: formData.seoTitle,
            seoDescription: formData.seoDescription,
            seoKeywords: formData.seoKeywords
        };

        if (isEditMode && editId) {
            updateProperty(propertyData);
            alert('Cập nhật tin thành công!');
        } else {
            addProperty(propertyData);
            alert('Đăng tin thành công!');
        }

        router.push('/admin');
    };

    const currentDistricts = districts.filter(d => d.cityId === formData.city);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Cập nhật tin đăng' : 'Đăng tin mới'}</h1>
                    <p className="text-gray-500">Điền thông tin chi tiết về bất động sản</p>
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
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold border-b pb-2">Thông tin cơ bản</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề tin đăng *</label>
                                <input name="title" value={formData.title} onChange={handleChange} type="text" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: Bán nhà mặt tiền..." required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Loại hình *</label>
                                <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="house">Nhà riêng</option>
                                    <option value="apartment">Căn hộ chung cư</option>
                                    <option value="land">Đất nền</option>
                                    <option value="office">Văn phòng</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hình thức *</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="sale">Cần bán</option>
                                    <option value="rent">Cho thuê</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mức giá *</label>
                                <input name="price" value={formData.price} onChange={handleChange} type="number" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị *</label>
                                <select name="currency" value={formData.currency} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="Tỷ">Tỷ</option>
                                    <option value="Triệu">Triệu</option>
                                    <option value="Triệu/m2">Triệu/m²</option>
                                    <option value="Triệu/tháng">Triệu/tháng</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Diện tích (m²) *</label>
                                <input name="area" value={formData.area} onChange={handleChange} type="number" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố *</label>
                                <select name="city" value={formData.city} onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value, district: '' }))} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none mb-4" required>
                                    <option value="">-- Chọn thành phố --</option>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quận / Huyện</label>
                                <select name="district" value={formData.district} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none mb-4">
                                    <option value="">-- Chọn Quận/Huyện --</option>
                                    {currentDistricts.map(dist => (
                                        <option key={dist.id} value={dist.id}>{dist.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết (Đường, số nhà) *</label>
                            <input name="address" value={formData.address} onChange={handleChange} type="text" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Số nhà, đường, phường, quận..." required />
                        </div>
                    </div>

                    <h3 className="text-lg font-bold border-b pb-2">Thông tin liên hệ</h3>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                        <div className="text-blue-600 mt-1">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900 mb-1">
                                Tin đăng sẽ sử dụng thông tin liên hệ từ cấu hình tài khoản của bạn:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800 mt-2">
                                <div>
                                    <span className="font-semibold">Người liên hệ:</span> {formData.contactName}
                                </div>
                                <div>
                                    <span className="font-semibold">Điện thoại:</span> {formData.contactPhone}
                                </div>
                                <div>
                                    <span className="font-semibold">Email:</span> {formData.contactEmail}
                                </div>
                            </div>
                            <div className="mt-3">
                                <Link href="/admin/settings" className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1">
                                    Thay đổi thông tin liên hệ trong Cài đặt &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-bold border-b pb-2">Thông tin chi tiết</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số phòng ngủ</label>
                                <input name="bedrooms" value={formData.bedrooms} onChange={handleChange} type="number" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số phòng vệ sinh</label>
                                <input name="bathrooms" value={formData.bathrooms} onChange={handleChange} type="number" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link Youtube Video (Tùy chọn)</label>
                            <input name="youtubeUrl" value={formData.youtubeUrl} onChange={handleChange} type="url" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://www.youtube.com/watch?v=..." />
                            <div className="text-xs text-gray-500 mt-1 flex gap-2">
                                <span>Hỗ trợ link: https://www.youtube.com/watch?v=...</span>
                                <span>hoặc https://youtu.be/...</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                            <RichTextEditor
                                value={formData.description}
                                onChange={(content: string) => setFormData(prev => ({ ...prev, description: content }))}
                                placeholder="Mô tả về vị trí, tiện ích, pháp lý..."
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="text-lg font-bold">Hình ảnh ({formData.images.filter(i => i).length})</h3>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-4">Danh sách đường dẫn ảnh (URL)</label>

                            <div className="space-y-3">
                                {formData.images.map((url, index) => (
                                    <div key={index} className="flex gap-3 items-center group">
                                        <div className="flex-none w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-xs font-bold text-gray-500">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={url}
                                                onChange={(e) => {
                                                    const newImages = [...formData.images];
                                                    newImages[index] = e.target.value;
                                                    setFormData(prev => ({ ...prev, images: newImages }));
                                                }}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                        {url && (
                                            <div className="flex-none w-12 h-12 rounded-lg border bg-white overflow-hidden relative">
                                                <img src={url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newImages = formData.images.filter((_, i) => i !== index);
                                                setFormData(prev => ({ ...prev, images: newImages }));
                                            }}
                                            className="flex-none p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                            title="Xóa ảnh"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-1 2-1h4c1 0 2 1 2 1v2" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, images: [...prev.images, ''] }))}
                                className="mt-4 flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
                                Thêm đường dẫn ảnh
                            </button>

                            {/* Grid View */}
                            {formData.images.filter(i => i).length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-sm font-medium text-gray-700 mb-3">Xem trước:</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {formData.images.filter(url => url).map((url, index) => (
                                            <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden border relative group shadow-sm hover:shadow-md transition">
                                                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SEO Section */}
                    <div className="pt-6 border-t border-gray-100 mt-6">
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
                                        placeholder={formData.title || 'Tiêu đề tin đăng'}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Để trống nếu muốn dùng tiêu đề tin đăng.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả SEO</label>
                                    <textarea
                                        value={formData.seoDescription || ''}
                                        onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                                        placeholder={formData.description || 'Mô tả ngắn...'}
                                        rows={4}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    ></textarea>
                                    <p className="text-xs text-gray-500 mt-1">Để trống nếu muốn dùng mô tả tin đăng.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Từ khóa SEO</label>
                                    <input
                                        type="text"
                                        value={formData.seoKeywords || ''}
                                        onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                                        placeholder="ban nha, thue nha, q7..."
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
                                            <div className="text-xs text-green-700">https://example.com/listings/...</div>
                                        </div>
                                    </div>
                                    <div className="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer truncate">
                                        {formData.seoTitle || formData.title || 'Tiêu đề tin đăng'}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                                        {formData.seoDescription || formData.description || 'Mô tả tin đăng sẽ hiện thị ở đây...'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 sticky bottom-0 bg-white py-4 border-t mt-4 z-10">
                        <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-lg hover:bg-gray-50 font-medium text-gray-700">Hủy</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2 shadow-lg">
                            <Save className="w-4 h-4" /> {isEditMode ? 'Cập nhật tin' : 'Đăng tin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function PostPropertyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PostPropertyContent />
        </Suspense>
    );
}

