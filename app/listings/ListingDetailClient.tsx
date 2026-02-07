'use client';

import {
    MapPin, BedDouble, Bath, Calendar, User, Phone, Mail, Heart,
    Share2, ArrowLeft, Building2, ChevronLeft, ChevronRight,
    Edit, PlayCircle, X, Maximize2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/auth';
import { useToast } from '../components/Toast';
import { useRouter } from 'next/navigation';
import SEOHead from '../components/SEOHead';
import { Property, SystemConfig } from '../lib/store';
import Image from 'next/image';

interface ListingDetailClientProps {
    property: Property;
    relatedProperties: Property[];
    systemConfig: SystemConfig;
}

// Helper to optimize Unsplash URLs
const getOptimizedUrl = (url: string, width = 1200) => {
    if (url.includes('unsplash.com')) {
        const baseUrl = url.split('?')[0];
        return `${baseUrl}?auto=format&fit=crop&q=80&w=${width}`;
    }
    return url;
};

export default function ListingDetailClient({ property, relatedProperties, systemConfig }: ListingDetailClientProps) {
    const { isAdmin } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    const [isSaved, setIsSaved] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const savedIds = JSON.parse(localStorage.getItem('bds_wishlist') || '[]');
        setIsSaved(savedIds.includes(property.id));
    }, [property.id]);

    useEffect(() => {
        if (property && property.images.length > 1 && !isZoomed && !isHovered) {
            timerRef.current = setInterval(() => {
                setActiveImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
            }, 3000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [property, isZoomed, isHovered]);

    const handleSaveProperty = () => {
        const savedIds = JSON.parse(localStorage.getItem('bds_wishlist') || '[]');
        let newSavedIds = [];
        if (isSaved) {
            newSavedIds = savedIds.filter((savedId: string) => savedId !== property.id);
            showToast('Đã bỏ lưu tin đăng', 'info');
        } else {
            newSavedIds = [...savedIds, property.id];
            showToast('Đã lưu tin đăng vào danh sách quan tâm', 'success');
        }
        localStorage.setItem('bds_wishlist', JSON.stringify(newSavedIds));
        setIsSaved(!isSaved);
    };

    const handleCopyLink = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            showToast('Đã sao chép liên kết!', 'info');
        }
    };

    const getYoutubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = property.youtubeUrl ? getYoutubeId(property.youtubeUrl) : null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SEOHead
                title={property.seoTitle || property.title}
                description={property.seoDescription || property.description}
                keywords={property.seoKeywords}
                image={property.images[0]}
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="text-sm text-gray-500 flex items-center gap-2">
                    <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
                    <span>/</span>
                    <Link href="/listings" className="hover:text-blue-600">
                        {property.type === 'sale' ? 'Mua bán' : 'Cho thuê'}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 truncate font-medium max-w-[200px] md:max-w-[300px]">{property.title}</span>
                </div>

                {isAdmin && (
                    <Link
                        href={`/admin/post?id=${property.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
                    >
                        <Edit className="w-4 h-4" /> Chỉnh sửa tin
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div
                        className="bg-gray-200 rounded-xl overflow-hidden aspect-video mb-8 relative group border border-gray-100 shadow-sm cursor-pointer"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => setIsZoomed(true)}
                    >
                        {property.images && property.images.length > 0 ? (
                            <>
                                <Image
                                    src={getOptimizedUrl(property.images[activeImageIndex] || property.images[0])}
                                    alt={property.title}
                                    fill
                                    className="object-cover transition-opacity duration-300"
                                    priority
                                />
                                {property.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev === 0 ? property.images.length - 1 : prev - 1); }}
                                            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition opacity-0 group-hover:opacity-100 z-10"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev === property.images.length - 1 ? 0 : prev + 1); }}
                                            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition opacity-0 group-hover:opacity-100 z-10"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                            {property.images.map((_: string, idx: number) => (
                                                <button key={idx} onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }} className={`w-2 h-2 rounded-full transition-all ${idx === activeImageIndex ? 'bg-white w-4' : 'bg-white/50'}`} />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">No Images Available</div>
                        )}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition duration-300 z-10">
                            <button onClick={(e) => { e.stopPropagation(); handleSaveProperty(); }} className="bg-white/90 p-2 rounded-full hover:text-red-500 hover:scale-110 transition shadow-sm"><Heart className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-current' : ''}`} /></button>
                            <button onClick={(e) => { e.stopPropagation(); handleCopyLink(); }} className="bg-white/90 p-2 rounded-full hover:text-blue-600 hover:scale-110 transition shadow-sm"><Share2 className="w-5 h-5" /></button>
                        </div>
                        <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded shadow-sm uppercase z-10">{property.type === 'sale' ? 'Cần bán' : 'Cho thuê'}</div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">{property.title}</h1>
                        <div className="flex items-center text-gray-600 mb-6">
                            <MapPin className="w-5 h-5 mr-2 text-red-500" />
                            <span className="font-medium">{property.address}, {property.city}</span>
                        </div>
                        <div className="flex flex-wrap gap-6 py-4 border-y border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm mb-1">Mức giá</span>
                                <span className="text-2xl font-bold text-blue-600">{property.price} {property.currency}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm mb-1">Diện tích</span>
                                <span className="text-xl font-bold text-gray-900">{property.area} m²</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Đặc điểm bất động sản</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                                <BedDouble className="w-6 h-6 text-blue-500" />
                                <div><p className="text-xs text-gray-500">Phòng ngủ</p><p className="font-semibold">{property.bedrooms || '--'}</p></div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                                <Bath className="w-6 h-6 text-blue-500" />
                                <div><p className="text-xs text-gray-500">Phòng tắm</p><p className="font-semibold">{property.bathrooms || '--'}</p></div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                                <Building2 className="w-6 h-6 text-blue-500" />
                                <div><p className="text-xs text-gray-500">Loại hình</p><p className="font-semibold capitalize">{property.category === 'house' ? 'Nhà riêng' : property.category === 'apartment' ? 'Căn hộ' : property.category}</p></div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                                <Calendar className="w-6 h-6 text-blue-500" />
                                <div><p className="text-xs text-gray-500">Ngày đăng</p><p className="font-semibold">{property.createdAt}</p></div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 content-area">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin mô tả</h2>
                        <div className="prose max-w-none text-gray-700 leading-relaxed ql-editor-display" dangerouslySetInnerHTML={{ __html: property.description || '' }} />
                    </div>

                    {youtubeId && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><PlayCircle className="w-6 h-6 text-red-600" /> Video giới thiệu</h2>
                            <div className="aspect-video rounded-xl overflow-hidden shadow-sm">
                                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </div>
                        </div>
                    )}

                    {relatedProperties.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Bất động sản tương tự</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {relatedProperties.map(item => (
                                    <Link key={item.id} href={`/listings/${item.id}`} className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                                        <div className="aspect-[4/3] overflow-hidden relative">
                                            <Image src={getOptimizedUrl(item.images[0], 400)} alt={item.title} fill className="object-cover transform group-hover:scale-110 transition duration-500" />
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                <p className="text-white font-bold text-lg">{item.price} {item.currency}</p>
                                                <p className="text-white/80 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.city}</p>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition">{item.title}</h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 sticky top-24">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center border-2 border-white shadow-sm filter"><User className="w-7 h-7 text-blue-600" /></div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Được đăng bởi</p>
                                <p className="font-bold text-lg text-gray-900">{property.contactName}</p>
                            </div>
                        </div>
                        <a href={`tel:${property.contactPhone}`} className="w-full bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 mb-3 hover:bg-green-700 transition shadow-md"><Phone className="w-5 h-5" /> {property.contactPhone}</a>
                        <a href={`mailto:${property.contactEmail || 'contact@bds.com'}`} className="w-full bg-white text-blue-600 border-2 border-blue-600 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition mb-6"><Mail className="w-5 h-5" /> Gửi email</a>
                    </div>
                </div>
            </div>

            {isZoomed && (
                <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4" onClick={() => setIsZoomed(false)}>
                    <button className="absolute top-4 right-4 text-white p-2 z-50 bg-black/50 rounded-full"><X className="w-8 h-8" /></button>
                    <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <img src={property.images[activeImageIndex]} alt="Full view" className="max-w-full max-h-full object-contain" />
                    </div>
                </div>
            )}
        </div>
    );
}
