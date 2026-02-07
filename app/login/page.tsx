'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { Building2, User, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const { login, user, isLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoading && user) {
            if (user.role === 'admin') router.replace('/admin');
            else router.replace('/');
        }
    }, [user, router, isLoading]);

    if (isLoading || user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const success = await login(username, password);
        if (!success) {
            setError('Tên đăng nhập hoặc mật khẩu không đúng.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Link href="/" className="bg-blue-600 p-3 rounded-xl shadow-lg hover:bg-blue-700 transition">
                        <Building2 className="w-10 h-10 text-white" />
                    </Link>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Đăng nhập hệ thống
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Quản lý bất động sản chuyên nghiệp
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center font-medium border border-red-100">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Tên đăng nhập
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3" // Increased padding for better touch
                                    placeholder="admin"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mật khẩu
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3"
                                    placeholder="admin"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                    Quên mật khẩu?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
                            >
                                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Tài khoản demo
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-gray-500 text-center">
                            <div className="p-2 bg-gray-50 rounded">
                                <p className="font-bold">Admin</p>
                                <p>User: admin / Pass: admin</p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                                <p className="font-bold">User</p>
                                <p>User: user / Pass: user</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

