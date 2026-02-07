'use client';

import { useState } from 'react';
import { useBDS, City, District } from '../../lib/store';
import { Plus, Trash2, MapPin } from 'lucide-react';

export default function LocationsPage() {
    const { cities, districts, addCity, deleteCity, addDistrict, deleteDistrict, getDistrictsByCity } = useBDS();

    // State for inputs
    const [newCityName, setNewCityName] = useState('');
    const [selectedCityId, setSelectedCityId] = useState<string>('');
    const [newDistrictName, setNewDistrictName] = useState('');

    const handleAddCity = () => {
        if (!newCityName.trim()) return;
        const newCity: City = {
            id: newCityName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
            name: newCityName.trim()
        };
        addCity(newCity);
        setNewCityName('');
    };

    const handleAddDistrict = () => {
        if (!newDistrictName.trim() || !selectedCityId) return;
        const newDistrict: District = {
            id: newDistrictName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + selectedCityId,
            name: newDistrictName.trim(),
            cityId: selectedCityId
        };
        addDistrict(newDistrict);
        setNewDistrictName('');
    };

    // Filter districts based on selected city
    const currentDistricts = selectedCityId ? getDistrictsByCity(selectedCityId) : [];

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý Địa điểm</h1>
            <p className="mb-8 text-gray-500">Thêm và quản lý danh sách Tỉnh/Thành phố và Quận/Huyện để sử dụng trong bộ lọc.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cities Column */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Tỉnh / Thành phố
                    </h2>

                    {/* Add City Form */}
                    <div className="flex gap-2 mb-6">
                        <input
                            value={newCityName}
                            onChange={(e) => setNewCityName(e.target.value)}
                            placeholder="Nhập tên Tỉnh/Thành..."
                            className="flex-1 border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCity()}
                        />
                        <button
                            onClick={handleAddCity}
                            disabled={!newCityName.trim()}
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            Thêm
                        </button>
                    </div>

                    {/* Cities List */}
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {cities.map((city) => (
                            <div
                                key={city.id}
                                onClick={() => setSelectedCityId(city.id)}
                                className={`flex justify-between items-center p-3 rounded border cursor-pointer transition ${selectedCityId === city.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                                <span className="font-medium">{city.name}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); if (confirm('Xoá TP này sẽ xoá cả các quận liên quan. Tiếp tục?')) deleteCity(city.id); }}
                                    className="text-gray-400 hover:text-red-500 p-1"
                                    title="Xoá"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {cities.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Chưa có dữ liệu</p>}
                    </div>
                </div>

                {/* Districts Column */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        Quận / Huyện
                    </h2>

                    {!selectedCityId ? (
                        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                            <p>Chọn một Thành phố bên trái để xem Quận/Huyện</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-blue-600 font-medium bg-blue-50 p-2 rounded">
                                Đang chọn: {cities.find(c => c.id === selectedCityId)?.name}
                            </div>

                            {/* Add District Form */}
                            <div className="flex gap-2 mb-6">
                                <input
                                    value={newDistrictName}
                                    onChange={(e) => setNewDistrictName(e.target.value)}
                                    placeholder="Nhập tên Quận/Huyện..."
                                    className="flex-1 border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddDistrict()}
                                />
                                <button
                                    onClick={handleAddDistrict}
                                    disabled={!newDistrictName.trim()}
                                    className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                                >
                                    Thêm
                                </button>
                            </div>

                            {/* Districts List */}
                            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                {currentDistricts.map((district) => (
                                    <div key={district.id} className="flex justify-between items-center p-3 rounded border border-gray-200 bg-white hover:bg-gray-50">
                                        <span>{district.name}</span>
                                        <button
                                            onClick={() => deleteDistrict(district.id)}
                                            className="text-gray-400 hover:text-red-500 p-1"
                                            title="Xoá"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {currentDistricts.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Thành phố này chưa có quận/huyện nào</p>}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

