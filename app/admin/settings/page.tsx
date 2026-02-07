'use client';

import { useState, useEffect } from 'react';
import { Save, User, Lock, Bell, Shield, Settings, Globe } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../components/Toast';

import { useBDS, SystemConfig } from '../../lib/store';
import { clearCache, updateSystemConfigAction } from '../../lib/actions';

export default function AdminSettingsPage() {
    const { user, updateUser } = useAuth();
    const { showToast } = useToast();
    const { systemConfig } = useBDS();

    // Tab state: 'profile' | 'password' | 'config'
    const [activeTab, setActiveTab] = useState('profile');

    const [profileData, setProfileData] = useState({
        displayName: 'Administrator',
        email: 'tongnhattruong@gmail.com',
        phone: '0968267676',
        address: 'Hồ Chí Minh'
    });

    const [passData, setPassData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [siteConfig, setSiteConfig] = useState({
        siteName: 'Bất Động Sản Demo',
        contactEmail: 'tongnhattruong@gmail.com',
        hotline: '0968267676',
        maintenanceMode: false
    });

    const [sysConfigData, setSysConfigData] = useState<SystemConfig>({
        postsPerPage: 6,
        relatedPostsLimit: 3
    });

    useEffect(() => {
        // Load saved settings
        const savedProfile = localStorage.getItem('bds_admin_profile');
        if (savedProfile) {
            setProfileData(JSON.parse(savedProfile));
        }

        const savedConfig = localStorage.getItem('bds_site_config');
        if (savedConfig) {
            setSiteConfig(JSON.parse(savedConfig));
        }
    }, []);

    // Sync systemConfig from store to local state
    useEffect(() => {
        if (systemConfig) {
            setSysConfigData(systemConfig);
        }
    }, [systemConfig]);

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('bds_admin_profile', JSON.stringify(profileData));

        // Cập nhật vào AuthContext để các trang khác (như News) nhận được tên mới
        if (user) {
            updateUser(user.id, { name: profileData.displayName });
        }

        showToast('Cập nhật thông tin hồ sơ thành công!', 'success');
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passData.newPassword !== passData.confirmPassword) {
            showToast('Mật khẩu xác nhận không khớp!', 'error');
            return;
        }
        if (passData.newPassword.length < 6) {
            showToast('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
            return;
        }

        showToast('Đổi mật khẩu thành công!', 'success');
        setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleConfigSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Save System Config to DB via Server Action
        const res = await updateSystemConfigAction(sysConfigData as any);
        if (res.success) {
            // updateSystemConfig(sysConfigData); // Avoid double write and race conditions
            showToast('Cập nhật cấu hình hệ thống thành công!', 'success');
        } else {
            showToast(res.message, 'error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Cài đặt hệ thống</h1>
                <p className="text-gray-500">Quản lý tài khoản và cấu hình website</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <nav className="flex flex-col p-2">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <User className="w-5 h-5" />
                                Thông tin cá nhân
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'password' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Lock className="w-5 h-5" />
                                Đổi mật khẩu
                            </button>
                            <button
                                onClick={() => setActiveTab('config')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'config' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Shield className="w-5 h-5" />
                                Cấu hình Website
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b">Thông tin cá nhân</h2>
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 flex items-center gap-4 mb-2">
                                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold border-2 border-white shadow-sm">
                                            {profileData.displayName.charAt(0)}
                                        </div>
                                        <div>
                                            <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition">
                                                Thay đổi ảnh đại diện
                                            </button>
                                            <p className="text-xs text-gray-500 mt-1">Hỗ trợ JPG, PNG tối đa 2MB</p>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị</label>
                                        <input
                                            type="text"
                                            value={profileData.displayName}
                                            onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                                        <input
                                            type="text"
                                            value={profileData.address}
                                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-sm transition flex items-center gap-2">
                                        <Save className="w-4 h-4" /> Lưu thay đổi
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b">Đổi mật khẩu</h2>
                            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                                    <input
                                        type="password"
                                        required
                                        value={passData.currentPassword}
                                        onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        required
                                        value={passData.newPassword}
                                        onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Tối thiểu 6 ký tự</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                                    <input
                                        type="password"
                                        required
                                        value={passData.confirmPassword}
                                        onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-sm transition flex items-center gap-2">
                                        <Save className="w-4 h-4" /> Cập nhật mật khẩu
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'config' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-blue-600" /> Cấu hình hệ thống
                            </h2>

                            <form onSubmit={handleConfigSubmit}>
                                <div className="space-y-6">
                                    {/* System Config Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Website (SEO Title)</label>
                                            <input
                                                type="text"
                                                value={sysConfigData.siteTitle || ''}
                                                onChange={(e) => setSysConfigData({ ...sysConfigData, siteTitle: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="Bất Động Sản Demo"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị Header (Logo Text)</label>
                                            <input
                                                type="text"
                                                value={sysConfigData.headerTitle || ''}
                                                onChange={(e) => setSysConfigData({ ...sysConfigData, headerTitle: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="BDS APP"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <User className="w-4 h-4 text-blue-600" /> Thông tin liên hệ mặc định cho tin đăng
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-4">Các thông tin này sẽ được tự động điền khi bác đăng tin bất động sản mới.</p>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên liên hệ mặc định</label>
                                                <input
                                                    type="text"
                                                    value={sysConfigData.defaultContactName || ''}
                                                    onChange={(e) => setSysConfigData({ ...sysConfigData, defaultContactName: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="VD: Nguyễn Văn A"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Hotline mặc định</label>
                                                <input
                                                    type="text"
                                                    value={sysConfigData.footerPhone || ''}
                                                    onChange={(e) => setSysConfigData({ ...sysConfigData, footerPhone: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="0968xxxxxx"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email mặc định</label>
                                                <input
                                                    type="email"
                                                    value={sysConfigData.footerEmail || ''}
                                                    onChange={(e) => setSysConfigData({ ...sysConfigData, footerEmail: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="abc@gmail.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Display Config */}
                                    <div className="pt-6 border-t border-gray-100">
                                        <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-blue-600" /> Cấu hình hiển thị
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Kiểu hiển thị mặc định</label>
                                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSysConfigData({ ...sysConfigData, defaultViewMode: 'list' })}
                                                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${sysConfigData.defaultViewMode !== 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                    >
                                                        Danh sách (List)
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSysConfigData({ ...sysConfigData, defaultViewMode: 'grid' })}
                                                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${sysConfigData.defaultViewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                    >
                                                        Lưới (Grid)
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Giao diện mà người dùng sẽ thấy khi mới vào trang Listings.</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Số cột (Chế độ Grid)</label>
                                                <div className="flex gap-2">
                                                    {[2, 3, 4].map(cols => (
                                                        <button
                                                            key={cols}
                                                            type="button"
                                                            onClick={() => setSysConfigData({ ...sysConfigData, gridColumns: cols })}
                                                            className={`flex-1 py-2 text-sm font-bold border rounded-lg transition ${sysConfigData.gridColumns === cols || (!sysConfigData.gridColumns && cols === 2) ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                                        >
                                                            {cols} Cột
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Số lượng tin hiển thị trên mỗi hàng ở màn hình lớn.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Số tin mỗi trang (Phân trang)</label>
                                                <input
                                                    type="number"
                                                    value={sysConfigData.postsPerPage}
                                                    onChange={(e) => setSysConfigData({ ...sysConfigData, postsPerPage: parseInt(e.target.value) })}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                                    min="1"
                                                    max="20"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Số lượng tin hiển thị trên mỗi trang danh sách.</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Số tin liên quan</label>
                                                <input
                                                    type="number"
                                                    value={sysConfigData.relatedPostsLimit}
                                                    onChange={(e) => setSysConfigData({ ...sysConfigData, relatedPostsLimit: parseInt(e.target.value) })}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                                    min="1"
                                                    max="10"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Số lượng tin hiển thị ở mục "Tin liên quan".</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interface Config */}
                                    <div className="pt-6 border-t border-gray-100">
                                        <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-purple-600" /> Cấu hình Giao diện
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên Header (Logo Text)</label>
                                                    <input
                                                        type="text"
                                                        value={sysConfigData.headerTitle || ''}
                                                        onChange={(e) => setSysConfigData({ ...sysConfigData, headerTitle: e.target.value })}
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                                        placeholder="Bất Động Sản"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo & Favicon</label>
                                                    <div className="flex items-start gap-4">
                                                        {sysConfigData.logoUrl ? (
                                                            <div className="relative group border rounded-lg overflow-hidden w-32 h-16 bg-white flex items-center justify-center">
                                                                <img src={sysConfigData.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setSysConfigData({ ...sysConfigData, logoUrl: '', faviconUrl: '' })}
                                                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition"
                                                                >
                                                                    Xóa
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full text-center hover:bg-gray-50 transition cursor-pointer relative">
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) {
                                                                            const reader = new FileReader();
                                                                            reader.onload = (event) => {
                                                                                const img = new Image();
                                                                                img.onload = () => {
                                                                                    // 1. Resize for Logo (max width 500px)
                                                                                    const canvasLogo = document.createElement('canvas');
                                                                                    const MAX_WIDTH = 500;
                                                                                    let width = img.width;
                                                                                    let height = img.height;

                                                                                    if (width > MAX_WIDTH) {
                                                                                        height *= MAX_WIDTH / width;
                                                                                        width = MAX_WIDTH;
                                                                                    }
                                                                                    canvasLogo.width = width;
                                                                                    canvasLogo.height = height;
                                                                                    const ctxLogo = canvasLogo.getContext('2d');
                                                                                    ctxLogo?.drawImage(img, 0, 0, width, height);
                                                                                    const logoDataUrl = canvasLogo.toDataURL('image/png');

                                                                                    // 2. Crop for Favicon (Square, Center, 64x64)
                                                                                    const canvasFav = document.createElement('canvas');
                                                                                    const size = Math.min(img.width, img.height);
                                                                                    const x = (img.width - size) / 2;
                                                                                    const y = (img.height - size) / 2;

                                                                                    canvasFav.width = 64;
                                                                                    canvasFav.height = 64;
                                                                                    const ctxFav = canvasFav.getContext('2d');
                                                                                    ctxFav?.drawImage(img, x, y, size, size, 0, 0, 64, 64);
                                                                                    const favDataUrl = canvasFav.toDataURL('image/png');

                                                                                    setSysConfigData({
                                                                                        ...sysConfigData,
                                                                                        logoUrl: logoDataUrl,
                                                                                        faviconUrl: favDataUrl
                                                                                    });
                                                                                };
                                                                                img.src = event.target?.result as string;
                                                                            };
                                                                            reader.readAsDataURL(file);
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="text-sm text-gray-500">Tải ảnh lên</span>
                                                            </div>
                                                        )}

                                                        {/* Favicon Preview */}
                                                        {sysConfigData.faviconUrl && (
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-xs text-gray-500 mb-1">Favicon</span>
                                                                <div className="w-8 h-8 rounded border bg-white flex items-center justify-center overflow-hidden">
                                                                    <img src={sysConfigData.faviconUrl} alt="Favicon" className="w-full h-full object-contain" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Footer: Giới thiệu</label>
                                                <textarea
                                                    value={sysConfigData.footerAbout || ''}
                                                    onChange={(e) => setSysConfigData({ ...sysConfigData, footerAbout: e.target.value })}
                                                    rows={3}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                                    placeholder="Giới thiệu ngắn về công ty..."
                                                ></textarea>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Footer: Địa chỉ</label>
                                                    <input
                                                        type="text"
                                                        value={sysConfigData.footerAddress || ''}
                                                        onChange={(e) => setSysConfigData({ ...sysConfigData, footerAddress: e.target.value })}
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                        placeholder="Địa chỉ công ty"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Footer: Email</label>
                                                    <input
                                                        type="text"
                                                        value={sysConfigData.footerEmail || ''}
                                                        onChange={(e) => setSysConfigData({ ...sysConfigData, footerEmail: e.target.value })}
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                        placeholder="contact@email.com"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Footer: SĐT</label>
                                                    <input
                                                        type="text"
                                                        value={sysConfigData.footerPhone || ''}
                                                        onChange={(e) => setSysConfigData({ ...sysConfigData, footerPhone: e.target.value })}
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                        placeholder="Hotline"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Mạng xã hội (Footer)</label>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Facebook URL"
                                                        value={sysConfigData.socialFacebook || ''}
                                                        onChange={(e) => setSysConfigData({ ...sysConfigData, socialFacebook: e.target.value })}
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Zalo URL"
                                                        value={sysConfigData.socialZalo || ''}
                                                        onChange={(e) => setSysConfigData({ ...sysConfigData, socialZalo: e.target.value })}
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Youtube URL"
                                                        value={sysConfigData.socialYoutube || ''}
                                                        onChange={(e) => setSysConfigData({ ...sysConfigData, socialYoutube: e.target.value })}
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SEO Config */}
                                    <div className="pt-6 border-t border-gray-100">
                                        <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-green-600" /> Cấu hình SEO Tổng quan
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề trang (Title)</label>
                                                <input
                                                    type="text"
                                                    value={sysConfigData.siteTitle || ''}
                                                    onChange={(e) => setSysConfigData({ ...sysConfigData, siteTitle: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                                    placeholder="Vd: Bất Động Sản Demo - Mua bán nhà đất uy tín"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (Meta Description)</label>
                                                <textarea
                                                    value={sysConfigData.siteDescription || ''}
                                                    onChange={(e) => setSysConfigData({ ...sysConfigData, siteDescription: e.target.value })}
                                                    rows={3}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                                    placeholder="Mô tả ngắn gọn về website..."
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Từ khóa (Keywords)</label>
                                                <input
                                                    type="text"
                                                    value={sysConfigData.siteKeywords || ''}
                                                    onChange={(e) => setSysConfigData({ ...sysConfigData, siteKeywords: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                                    placeholder="Vd: bds, nha dat, mua ban nha..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh chia sẻ (OG Image URL)</label>
                                                <input
                                                    type="text"
                                                    value={sysConfigData.ogImage || ''}
                                                    onChange={(e) => setSysConfigData({ ...sysConfigData, ogImage: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                                    placeholder="https://example.com/image.jpg"
                                                />
                                            </div>
                                        </div>

                                        {/* Google Search Preview */}
                                        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Google Search Preview</h4>
                                            <div className="bg-white p-4 rounded shadow-sm max-w-xl">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500">Logo</div>
                                                    <div>
                                                        <div className="text-xs text-gray-800">example.com</div>
                                                        <div className="text-xs text-green-700">https://example.com</div>
                                                    </div>
                                                </div>
                                                <div className="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer truncate">
                                                    {sysConfigData.siteTitle || 'Tiêu đề trang chưa có'}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {sysConfigData.siteDescription || 'Mô tả trang web sẽ hiện ở đây. Hãy viết một mô tả hấp dẫn để thu hút người dùng click vào trang web của bạn.'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-yellow-800">
                                        <input
                                            type="checkbox"
                                            id="maintenance"
                                            checked={siteConfig.maintenanceMode}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, maintenanceMode: e.target.checked })}
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="maintenance" className="font-medium cursor-pointer select-none">Bật chế độ bảo trì (Chỉ Admin mới truy cập được)</label>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <Bell className="w-4 h-4 text-red-600" /> Quản lý Cache
                                        </h3>
                                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-red-800">Xóa Cache Hệ thống</p>
                                                <p className="text-sm text-red-600">Xóa toàn bộ cache server để cập nhật nội dung mới nhất ngay lập tức.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    const res = await clearCache();
                                                    if (res.success) showToast(res.message, 'success');
                                                    else showToast(res.message, 'error');
                                                }}
                                                className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-100 font-medium transition shadow-sm"
                                            >
                                                Xóa Cache Ngay
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2"
                                        >
                                            <Save className="w-5 h-5" /> Lưu cấu hình
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

