'use client';

import { Save, Trash2, ArrowLeft } from 'lucide-react';
import { useBDS } from '../../../lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Property, PropertyCategory, PropertyType } from '../../../lib/mock-data';
import Link from 'next/link';
import { use } from 'react';
import { useToast } from '../../../components/Toast';

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getPropertyById, updateProperty, cities, districts, deleteProperty } = useBDS();
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        type: 'sale' as PropertyType,
        category: 'house' as PropertyCategory,
        price: '',
        currency: 'Tỷ',
        area: '',
        address: '',
        city: '',
        district: '', // Add district field to form
        description: '',
        bedrooms: '',
        bathrooms: '',
        contactName: '',
        contactPhone: ''
    });

    useEffect(() => {
        const property = getPropertyById(id);
        if (property) {
            // Attempt to find district from address if not explicitly stored (migration)
            // For now, simple binding
            setFormData({
                title: property.title,
                type: property.type,
                category: property.category,
                price: property.price.toString(),
                currency: property.currency,
                area: property.area.toString(),
                address: property.address,
                city: property.city, // If city stored is name, might need mapping to ID if we switch to ID-based
                district: '', // Need to extract or infer
                description: property.description || '',
                bedrooms: property.bedrooms?.toString() || '',
                bathrooms: property.bathrooms?.toString() || '',
                contactName: property.contactName,
                contactPhone: property.contactPhone
            });
            setIsLoading(false);
        } else {
            // Redirect if not found
            router.push('/bds/admin');
        }
    }, [id, getPropertyById, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Find city/district names if IDs are used
        // Assuming formData.city stores the ID (from Select value) or Name (legacy)
        // Ideally should store Name for display, or ID for relation. Stick to stored strings for now to match interface.

        const selectedCity = cities.find(c => c.id === formData.city)?.name || formData.city;
        const selectedDistrict = districts.find(d => d.id === formData.district)?.name || formData.district;

        const fullAddress = selectedDistrict ? `${formData.address}, ${selectedDistrict}` : formData.address;

        const updatedProperty: Property = {
            id: id,
            title: formData.title,
            price: Number(formData.price),
            currency: formData.currency,
            area: Number(formData.area),
            address: formData.address, // Prefer keeping address street only, and city field for filtering.
            city: selectedCity, // Updating city name
            type: formData.type,
            category: formData.category,
            description: formData.description,
            images: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2573&auto=format&fit=crop'],
            bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
            bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
            createdAt: new Date().toISOString().split('T')[0], // Preserve original date ideally, or update?
            contactName: formData.contactName,
            contactPhone: formData.contactPhone
        };

        updateProperty(updatedProperty);
        showToast('Cập nhật tin thành công!', 'success');
        router.push('/bds/admin');
    };

    const handleDelete = () => {
        if (confirm('Bạn chắc chắn muốn xoá tin này?')) {
            deleteProperty(id);
            showToast('Đã xóa tin đăng', 'info');
            router.push('/bds/admin');
        }
    }

    if (isLoading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

    // Filter districts
    const currentDistricts = districts.filter(d => d.cityId === formData.city || d.cityId === cities.find(c => c.name === formData.city)?.id);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link href="/bds/admin" className="text-gray-500 hover:text-blue-600 flex items-center gap-1 text-sm mb-2">
                        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Sửa tin đăng</h1>
                </div>
                <button onClick={handleDelete} className="text-red-500 hover:bg-red-50 px-4 py-2 rounded flex items-center gap-2 border border-red-200">
                    <Trash2 className="w-4 h-4" /> Xoá tin
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold border-b pb-2">Thông tin cơ bản</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề tin đăng *</label>
                                <input name="title" value={formData.title} onChange={handleChange} type="text" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
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
                                <input name="price" value={formData.price} onChange={handleChange} type="number" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
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
                                <input name="area" value={formData.area} onChange={handleChange} type="number" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố *</label>
                                <select name="city" value={formData.city} onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value, district: '' }))} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">-- Chọn thành phố --</option>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option> // Storing ID in value
                                    ))}
                                    {/* Fallback if current city is not in list (legacy data) */}
                                    {!cities.some(c => c.id === formData.city) && formData.city && (
                                        <option value={formData.city}>{formData.city}</option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quận / Huyện</label>
                                <select name="district" value={formData.district} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">-- Chọn Quận/Huyện --</option>
                                    {currentDistricts.map(dist => (
                                        <option key={dist.id} value={dist.id}>{dist.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết (Đường, số nhà) *</label>
                            <input name="address" value={formData.address} onChange={handleChange} type="text" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
                        </div>
                    </div>

                    {/* Additional Details & Submit Button... (Same as Post Page) */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-bold border-b pb-2">Thông tin chi tiết</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Số phòng ngủ</label><input name="bedrooms" value={formData.bedrooms} onChange={handleChange} type="number" className="w-full border rounded-lg px-3 py-2" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Số phòng vệ sinh</label><input name="bathrooms" value={formData.bathrooms} onChange={handleChange} type="number" className="w-full border rounded-lg px-3 py-2" /></div>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label><textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full border rounded-lg px-3 py-2" /></div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-bold border-b pb-2">Liên hệ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tên liên hệ</label><input name="contactName" value={formData.contactName} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">SĐT liên hệ</label><input name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-lg hover:bg-gray-50 font-medium text-gray-700">Hủy</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2">
                            <Save className="w-4 h-4" /> Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
