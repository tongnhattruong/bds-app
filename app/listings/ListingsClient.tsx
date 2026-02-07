'use client';

import Image from 'next/image';
import { MapPin, Filter, ChevronDown, LayoutGrid, List as ListIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Property, City, District, SystemConfig } from '../lib/store';

interface ListingsClientProps {
    initialProperties: Property[];
    cities: City[];
    districts: District[];
    systemConfig: SystemConfig;
    currentPage: number;
    totalPages: number;
}

// Helper to optimize Unsplash URLs
const getOptimizedUrl = (url: string, width = 600) => {
    if (url.includes('unsplash.com')) {
        const baseUrl = url.split('?')[0];
        return `${baseUrl}?auto=format&fit=crop&q=75&w=${width}`;
    }
    return url;
};

export default function ListingsClient({ initialProperties, cities, districts, systemConfig, currentPage, totalPages }: ListingsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get filters from URL
    const filterType = searchParams.get('type') || 'all';
    const filterCategory = searchParams.get('category') || 'all';
    const filterPrice = searchParams.get('price') || 'all';
    const filterCity = searchParams.get('city') || '';
    const filterDistrict = searchParams.get('district') || '';
    // pageParam is passed as prop 'currentPage'

    // UI States
    const [viewMode, setViewMode] = useState<'list' | 'grid'>(systemConfig.defaultViewMode || 'list');
    const [sortBy, setSortBy] = useState('newest'); // newest, price-asc, price-desc

    // Derived states
    const [localDistrict, setLocalDistrict] = useState(filterDistrict);

    useEffect(() => {
        setLocalDistrict(filterDistrict);
    }, [filterDistrict]);

    // Handle Filter Changes
    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // Reset page on filter change
        if (key !== 'page') {
            params.delete('page');
        }

        // If city changes, reset district
        if (key === 'city') {
            params.delete('district');
            setLocalDistrict('');
        }

        router.push(`/listings?${params.toString()}`);
    };

    // Sorting Logic (Client Side for now, or Server Side?)
    // User requested Server Component for caching. 
    // Ideally sorting should also be server side (URL param).
    // Let's implement client-side sorting for the *current page* or *fetched list*?
    // If the Server returns *filtered* list, we can sort it here.
    // BUT pagination is tricky if we sort client side. 
    // So Sorting MUST be server side if we want correct pagination.

    const handleSortChange = (value: string) => {
        setSortBy(value);
        // We could also push sort to URL: router.push(...)
        // But the original code sorted client side on the *filtered* list.
        // If we move logic to Server, we must pass 'sort' param to server.
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', value);
        router.push(`/listings?${params.toString()}`);
    };

    // Client-side rendering of the properties passed from Server
    // The Server already filtered and sorted and paginated? 
    // Attempt 1: Server does everything.
    // Means 'initialProperties' is ALREADY the correct page of data.

    // BUT! The original logic pulled ALL properties and filtered client side.
    // If we want "Server Component" benefits:
    // 1. Server fetches ALL (or many).
    // 2. Server Filters.
    // 3. Server Sorts.
    // 4. Server Paginates.
    // 5. Server passes ONLY the current page items to Client.

    // So 'initialProperties' should be just the current page's items.

    // Helper to get districts for sidebar
    const currentDistricts = filterCity ? districts.filter(d => d.cityId === filterCity) : [];

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/listings?${params.toString()}`);
        // Scroll to top handled by browser navigation usually, but we can force it
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Dynamic Grid Class
    const gridCols = systemConfig.gridColumns || 2;
    const gridClass = gridCols === 3 ? 'sm:grid-cols-3' : gridCols === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-2';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {filterType === 'rent' ? 'Nhà đất cho thuê' : (filterType === 'sale' ? 'Mua bán nhà đất' : 'Tất cả tin đăng')}
                    </h1>
                    {/* We might not know total count if we paginate on server. We need to pass totalCount. */}
                    {/* For now, assume initialProperties has a count? No, we need a prop for totalCount. */}
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    {/* View Toggle */}
                    <div className="flex bg-white border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 transition ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                            title="Danh sách"
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                        <div className="w-px bg-gray-200"></div>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 transition ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                            title="Lưới"
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="appearance-none bg-white border rounded-lg py-2 pl-4 pr-10 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="price-asc">Giá thấp đến cao</option>
                            <option value="price-desc">Giá cao đến thấp</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50 bg-white lg:hidden">
                        <Filter className="w-4 h-4" /> Bộ lọc
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="bg-white p-5 border rounded-lg shadow-sm sticky top-24">
                        <h3 className="font-bold mb-4 text-lg">Lọc kết quả</h3>

                        <div className="mb-6">
                            <h4 className="font-medium mb-2 text-sm text-gray-700">Loại hình</h4>
                            <select
                                value={filterType}
                                onChange={(e) => updateFilter('type', e.target.value)}
                                className="w-full border rounded p-2 text-sm mb-3 focus:outline-none focus:border-blue-500"
                            >
                                <option value="all">Tất cả</option>
                                <option value="sale">Mua bán</option>
                                <option value="rent">Cho thuê</option>
                            </select>

                            <select
                                value={filterCategory}
                                onChange={(e) => updateFilter('category', e.target.value)}
                                className="w-full border rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="all">Tất cả loại nhà đất</option>
                                <option value="house">Nhà riêng</option>
                                <option value="apartment">Căn hộ chung cư</option>
                                <option value="land">Đất nền</option>
                                <option value="office">Văn phòng</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-medium mb-2 text-sm text-gray-700">Khu vực</h4>
                            <select
                                value={filterCity}
                                onChange={(e) => updateFilter('city', e.target.value)}
                                className="w-full border rounded p-2 text-sm mb-3 focus:outline-none focus:border-blue-500"
                            >
                                <option value="">Tất cả Tỉnh/Thành</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select>

                            <select
                                value={localDistrict}
                                onChange={(e) => updateFilter('district', e.target.value)}
                                disabled={!filterCity}
                                className="w-full border rounded p-2 text-sm disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:border-blue-500"
                            >
                                <option value="">Tất cả Quận/Huyện</option>
                                {currentDistricts.map(dist => (
                                    <option key={dist.id} value={dist.id}>{dist.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-medium mb-2 text-sm text-gray-700">Mức giá</h4>
                            <div className="space-y-2">
                                {['all', 'under-1', '1-3', '3-5', 'over-5'].map(range => (
                                    <label key={range} className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price"
                                            checked={filterPrice === range}
                                            onChange={() => updateFilter('price', range)}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        {range === 'all' ? 'Tất cả' :
                                            range === 'under-1' ? 'Dưới 1 tỷ' :
                                                range === '1-3' ? '1 - 3 tỷ' :
                                                    range === '3-5' ? '3 - 5 tỷ' : 'Trên 5 tỷ'}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/listings')}
                            className="w-full bg-gray-100 text-gray-700 py-2 rounded font-medium hover:bg-gray-200 transition"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>

                <div className="col-span-1 lg:col-span-3">
                    <div className={`${viewMode === 'grid' ? `grid grid-cols-1 ${gridClass} gap-6` : 'flex flex-col gap-6'} mb-8`}>
                        {initialProperties.map((property) => (
                            <div key={property.id} className={`bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition flex ${viewMode === 'grid' ? 'flex-col' : 'flex-col sm:flex-row h-auto sm:h-52'}`}>
                                <Link href={`/listings/${property.id}`} className={`${viewMode === 'grid' ? 'aspect-video w-full' : 'w-full sm:w-72 h-52 sm:h-full'} relative flex-shrink-0 group block overflow-hidden`}>
                                    <Image
                                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&q=10&auto=format" // Ảnh siêu nhẹ để test (chỉ ~2KB)
                                        alt={property.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition duration-500"
                                        sizes="(max-width: 768px) 100vw, 300px"
                                        priority={initialProperties.indexOf(property) < 4}
                                    />
                                    {/* Secondary Image disabled for Ultra Light Test */}
                                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                        <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                            {property.type === 'sale' ? 'Bán' : 'Cho thuê'}
                                        </div>
                                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                            {property.images.length} ảnh
                                        </div>
                                </Link>

                                <div className="p-4 flex flex-col justify-between flex-1">
                                    <div>
                                        <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition ${viewMode === 'grid' ? 'text-lg' : 'text-xl'}`}>
                                            <Link href={`/listings/${property.id}`}>
                                                {property.title}
                                            </Link>
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-3 flex items-start gap-1 line-clamp-2">
                                            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            {property.address}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-end border-t pt-3 mt-2">
                                        <div>
                                            <div className="text-xl font-bold text-blue-600">{property.price} {property.currency}</div>
                                            <div className="text-sm text-gray-500 font-medium">{property.area} m²</div>
                                        </div>
                                        <span className="text-xs text-gray-400">{property.createdAt ? new Date(property.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {initialProperties.length === 0 && (
                            <div className="col-span-full text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Không tìm thấy tin đăng nào</h3>
                                <p className="text-gray-500 mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
                                <button
                                    onClick={() => router.push('/listings')}
                                    className="text-blue-600 font-bold hover:underline"
                                >
                                    Xóa tất cả bộ lọc
                                </button>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 rounded-lg font-bold border transition ${currentPage === page
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
