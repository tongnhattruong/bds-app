'use client';

import { useBDS } from './lib/store';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, Maximize, ArrowRight, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SEOHead from './components/SEOHead';

export default function BDSPage() {
    const router = useRouter();
    const [searchType, setSearchType] = useState('');
    const [searchPrice, setSearchPrice] = useState('');
    const [searchCity, setSearchCity] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { properties, cities, isLoading } = useBDS();
    const featuredProperties = properties.slice(0, 3);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchType) params.append('type', searchType);
        if (searchCity) params.append('city', searchCity);
        if (searchPrice) params.append('priceRange', searchPrice);
        if (searchTerm) params.append('searchTerm', searchTerm);

        router.push(`/listings?${params.toString()}`);
    };

    return (
        <div>
            <SEOHead />
            {/* Hero Section */}
            <div className="relative bg-blue-700 h-[500px]">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2573&auto=format&fit=crop"
                    alt="Real Estate Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-20 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Tìm ngôi nhà mơ ước của bạn
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-2xl">
                        Hàng ngàn tin đăng mua bán, cho thuê nhà đất được cập nhật mới mỗi ngày.
                    </p>

                    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-5xl flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm theo tên dự án, đường..."
                            className="flex-[2] px-4 py-3 rounded border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            value={searchCity}
                            onChange={(e) => setSearchCity(e.target.value)}
                            className="flex-1 px-4 py-3 rounded border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả khu vực</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                        </select>
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="flex-1 px-4 py-3 rounded border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Loại nhà đất</option>
                            <option value="sale">Mua bán</option>
                            <option value="rent">Cho thuê</option>
                        </select>
                        <select
                            value={searchPrice}
                            onChange={(e) => setSearchPrice(e.target.value)}
                            className="flex-1 px-4 py-3 rounded border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Mức giá</option>
                            <option value="under-1">Dưới 1 tỷ</option>
                            <option value="1-3">1 - 3 tỷ</option>
                            <option value="3-5">3 - 5 tỷ</option>
                            <option value="over-5">Trên 5 tỷ</option>
                        </select>
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition"
                        >
                            Tìm kiếm
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Listings */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Bất động sản nổi bật</h2>
                        <p className="mt-2 text-gray-600">Được xem nhiều nhất trong 24h qua</p>
                    </div>
                    <Link href="/listings" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                        Xem tất cả <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProperties.map((property) => (
                        <div key={property.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden group">
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={property.images[0]}
                                    alt={property.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                    {property.type === 'sale' ? 'Bán' : 'Cho thuê'}
                                </div>
                                <div className="absolute bottom-4 left-4 bg-black/60 text-white px-2 py-1 rounded flex items-center gap-1 text-sm">
                                    <MapPin className="w-3 h-3" /> {property.city}
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="mb-2">
                                    <span className="text-blue-600 font-bold text-xl">{property.price} {property.currency}</span>
                                    {property.type === 'rent' && <span className="text-gray-500 text-sm"></span>}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 h-14">
                                    <Link href={`/listings/${property.id}`} className="hover:text-blue-600 transition">
                                        {property.title}
                                    </Link>
                                </h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{property.address}</p>

                                <div className="flex items-center gap-4 text-gray-600 text-sm border-t pt-4">
                                    {property.bedrooms && (
                                        <div className="flex items-center gap-1">
                                            <BedDouble className="w-4 h-4" />
                                            <span>{property.bedrooms} PN</span>
                                        </div>
                                    )}
                                    {property.bathrooms && (
                                        <div className="flex items-center gap-1">
                                            <Bath className="w-4 h-4" />
                                            <span>{property.bathrooms} WC</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Maximize className="w-4 h-4" />
                                        <span>{property.area} m²</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories Section */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Khám phá theo loại hình</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { id: 'apartment', name: 'Căn hộ chung cư', count: '2,540 tin' },
                            { id: 'house', name: 'Nhà riêng', count: '1,230 tin' },
                            { id: 'land', name: 'Đất nền', count: '850 tin' },
                            { id: 'office', name: 'Văn phòng', count: '420 tin' },
                        ].map((cat) => (
                            <div key={cat.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition text-center cursor-pointer">
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                    <Building2 className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-gray-900">{cat.name}</h3>
                                <p className="text-gray-500 text-sm mt-1">{cat.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

