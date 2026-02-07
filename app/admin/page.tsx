'use client';

import Link from 'next/link';
import { Plus, Trash2, Eye } from 'lucide-react';
import { useBDS } from '../lib/store';
import { useEffect } from 'react';

export default function AdminDashboardPage() {
    const { properties, deleteProperty, fetchAllData } = useBDS();

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleDelete = (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa tin đăng này?')) {
            deleteProperty(id);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
                <Link href="/admin/post" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm transition">
                    <Plus className="w-5 h-5" />
                    Đăng tin mới
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Tổng số tin đăng</h3>
                    <p className="text-3xl font-bold text-gray-900">{properties.length}</p>
                    <span className="text-green-500 text-sm font-medium mt-2 inline-block">Đang hoạt động</span>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Lượt xem tuần này</h3>
                    <p className="text-3xl font-bold text-gray-900">1,240</p>
                    <span className="text-green-500 text-sm font-medium mt-2 inline-block">+15% so với tuần trước</span>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Tin đang hiển thị</h3>
                    <p className="text-3xl font-bold text-gray-900">{properties.length}</p>
                    <span className="text-gray-500 text-sm font-medium mt-2 inline-block">Dữ liệu thời gian thực</span>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800">Danh sách tin đăng</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Tiêu đề</th>
                                <th className="px-6 py-3">Giá</th>
                                <th className="px-6 py-3">Trạng thái</th>
                                <th className="px-6 py-3">Ngày đăng</th>
                                <th className="px-6 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {properties.map((property) => (
                                <tr key={property.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="max-w-xs truncate" title={property.title}>{property.title}</div>
                                    </td>
                                    <td className="px-6 py-4">{property.price} {property.currency}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded ${property.type === 'sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {property.type === 'sale' ? 'Cần bán' : 'Cho thuê'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{property.createdAt}</td>
                                    <td className="px-6 py-4 flex gap-3">
                                        <Link href={`/listings/${property.id}`} className="text-gray-500 hover:text-blue-600">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => handleDelete(property.id)} className="text-red-500 hover:text-red-700">
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

