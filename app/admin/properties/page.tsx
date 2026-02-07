'use client';

import Link from 'next/link';
import { Plus, Trash2, Eye, Pencil } from 'lucide-react';
import { useBDS } from '../../lib/store';

export default function AdminPropertiesPage() {
    const { properties, deleteProperty } = useBDS();

    const handleDelete = (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa tin đăng này?')) {
            deleteProperty(id);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý tin đăng</h1>
                <Link href="/admin/post" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm transition">
                    <Plus className="w-5 h-5" />
                    Đăng tin mới
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Tất cả tin đăng ({properties.length})</h3>
                    <div className="flex gap-2">
                        <input type="text" placeholder="Tìm kiếm..." className="border rounded px-3 py-1 text-sm outline-none focus:border-blue-500" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Tiêu đề</th>
                                <th className="px-6 py-3">Giá</th>
                                <th className="px-6 py-3">Loại</th>
                                <th className="px-6 py-3">Ngày đăng</th>
                                <th className="px-6 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {properties.map((property) => (
                                <tr key={property.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-200">
                                                {property.images && property.images[0] && (
                                                    <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="max-w-xs truncate" title={property.title}>{property.title}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{property.price} {property.currency}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded ${property.type === 'sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {property.type === 'sale' ? 'Bán' : 'Cho thuê'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{property.createdAt}</td>
                                    <td className="px-6 py-4 flex gap-3">
                                        <Link href={`/listings/${property.id}`} className="text-gray-500 hover:text-blue-600" title="Xem">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link href={`/admin/post?id=${property.id}`} className="text-blue-500 hover:text-blue-700" title="Sửa">
                                            <Pencil className="w-4 h-4" />
                                        </Link>

                                        <button onClick={() => handleDelete(property.id)} className="text-red-500 hover:text-red-700" title="Xóa">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {properties.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Chưa có tin đăng nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

