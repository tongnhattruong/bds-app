
'use client';

import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { Home, Building2, UserCircle, PlusCircle, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '../lib/auth';

import { useBDS } from '../lib/store';

export default function BDSNavbar() {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { systemConfig, menuItems } = useBDS();

    const logoText = systemConfig?.headerTitle || 'Bất Động Sản';
    const logoUrl = systemConfig?.logoUrl;

    const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
        const IconComponent = (LucideIcons as any)[name] || HelpCircle;
        return <IconComponent className={className} />;
    };

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo" className="h-8 w-8 object-contain" />
                            ) : (
                                <Building2 className="h-8 w-8 text-blue-600" />
                            )}
                            <span className="font-bold text-xl text-blue-800">{logoText}</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.url}
                                    target={item.target}
                                    className="inline-flex items-center gap-2 px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-medium text-gray-500 hover:text-blue-600 transition"
                                >
                                    {item.icon && <IconRenderer name={item.icon} className="w-4 h-4" />}
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <Link href="/admin/post" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        <PlusCircle className="w-4 h-4" />
                                        Đăng tin
                                    </Link>
                                )}

                                <div className="flex items-center gap-3 pl-4 border-l ml-2">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                    </div>
                                    {isAdmin ? (
                                        <Link href="/admin" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition" title="Trang quản lý">
                                            <UserCircle className="w-8 h-8 text-blue-600" />
                                        </Link>
                                    ) : (
                                        <div className="p-2 rounded-full bg-gray-100 text-gray-500">
                                            <UserCircle className="w-8 h-8" />
                                        </div>
                                    )}
                                    <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition" title="Đăng xuất">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link href="/login" className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition shadow-sm">
                                <UserCircle className="w-5 h-5" />
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

