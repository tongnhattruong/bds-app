'use client';

import { useBDS } from '../lib/store';
import Link from 'next/link';

export default function BDSFooter() {
    const { systemConfig } = useBDS();
    const config = systemConfig; // Alias for easier usage

    return (
        <footer className="bg-gray-800 text-white py-12 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">Về chúng tôi</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {config?.footerAbout || 'Nền tảng kết nối mua bán bất động sản uy tín, minh bạch và nhanh chóng. Mang đến trải nghiệm tìm kiếm nhà đất tốt nhất cho bạn.'}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Liên hệ</h3>
                        <p className="text-gray-400 text-sm mb-2">Hotline: {config?.footerPhone || '0909 000 999'}</p>
                        <p className="text-gray-400 text-sm mb-2">Email: {config?.footerEmail || 'contact@bds.com'}</p>
                        <p className="text-gray-400 text-sm">Địa chỉ: {config?.footerAddress || 'Quận 1, TP.HCM'}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Theo dõi</h3>
                        <div className="flex gap-4 text-gray-400 text-sm">
                            {config?.socialFacebook && (
                                <a href={config.socialFacebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">Facebook</a>
                            )}
                            {config?.socialZalo && (
                                <a href={config.socialZalo} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">Zalo</a>
                            )}
                            {config?.socialYoutube && (
                                <a href={config.socialYoutube} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">Youtube</a>
                            )}
                            {/* Fallbacks if empty for demo */}
                            {!config?.socialFacebook && !config?.socialZalo && !config?.socialYoutube && (
                                <>
                                    <span className="text-gray-600">Chưa có liên kết mạng xã hội</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} {config?.siteTitle || 'Bất Động Sản Demo'}. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

