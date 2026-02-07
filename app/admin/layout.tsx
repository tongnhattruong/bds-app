'use client';

import Link from 'next/link';
import { LayoutDashboard, PlusCircle, Settings, MapPin, List, LogOut, Newspaper, Users, FileText } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, logout, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.replace('/login');
            } else if (user?.role !== 'admin') {
                router.replace('/');
            }
        }
    }, [isAuthenticated, user, router, isLoading]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md z-10 hidden md:block">
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition group">
                            <LayoutDashboard className="w-5 h-5 group-hover:text-blue-600" />
                            <span className="font-medium">Tổng quan</span>
                        </Link>

                        <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition">
                            <Users className="w-5 h-5" />
                            Quản lý người dùng
                        </Link>

                        <Link href="/admin/properties" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition">
                            <List className="w-5 h-5" />
                            Quản lý tin đăng
                        </Link>
                        <Link href="/admin/news" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition">
                            <Newspaper className="w-5 h-5" />
                            Quản lý tin tức
                        </Link>
                        <Link href="/admin/pages" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition">
                            <FileText className="w-5 h-5" />
                            Quản lý trang tĩnh
                        </Link>
                        <Link href="/admin/locations" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition">
                            <MapPin className="w-5 h-5" />
                            Quản lý địa điểm
                        </Link>
                        <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition">
                            <Settings className="w-5 h-5" />
                            Cài đặt
                        </Link>
                    </nav>

                    <div className="p-4 border-t">
                        <button onClick={logout} className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition">
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header (visible only on small screens) */}
            <div className="md:hidden">
                {/* Simple header for mobile would go here */}
            </div>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    );
}

