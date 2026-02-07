'use client';

import { useAuth, User, UserRole } from '../../lib/auth';
import { useState } from 'react';
import { Plus, Trash, Edit, Save, X, User as UserIcon } from 'lucide-react';

export default function UserManagementPage() {
    const { users, addUser, deleteUser, updateUser, user: currentUser } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState<Partial<User>>({
        username: '',
        password: '',
        name: '',
        role: 'user',
        email: ''
    });

    const resetForm = () => {
        setFormData({
            username: '',
            password: '',
            name: '',
            role: 'user',
            email: ''
        });
        setIsAdding(false);
        setEditingUserId(null);
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.password || !formData.name) return;

        addUser({
            username: formData.username,
            password: formData.password,
            name: formData.name,
            role: formData.role as UserRole,
            email: formData.email
        });
        resetForm();
    };

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUserId) return;

        const updates = { ...formData };
        if (!updates.password || updates.password.trim() === '') {
            delete updates.password;
        }

        updateUser(editingUserId, updates);
        resetForm();
    };

    const startEdit = (user: User) => {
        setEditingUserId(user.id);
        setFormData({
            username: user.username,
            password: user.password,
            name: user.name,
            role: user.role,
            email: user.email
        });
        setIsAdding(true); // Reuse the add form logic/UI
    };

    const handleDelete = (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
            deleteUser(id);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý thành viên</h1>
                    <p className="mt-1 text-sm text-gray-500">Danh sách và phân quyền người dùng hệ thống</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus className="w-4 h-4" /> Thêm thành viên
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-8 animate-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">
                            {editingUserId ? 'Chỉnh sửa thông tin' : 'Thêm thành viên mới'}
                        </h2>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={editingUserId ? handleUpdateUser : handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                            <input
                                type="text"
                                required
                                disabled={!!editingUserId} // Don't allow changing username
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                            <input
                                type="text"
                                required={!editingUserId}
                                placeholder={editingUserId ? "Nhập để đổi mật khẩu (để trống nếu giữ nguyên)" : ""}
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                            <select
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="user">Thành viên</option>
                                <option value="admin">Quản trị viên</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
                            >
                                {editingUserId ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành viên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name} {currentUser?.id === user.id && <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full ml-2">Bạn</span>}</div>
                                            <div className="text-sm text-gray-500">{user.email || user.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => startEdit(user)} className="text-blue-600 hover:text-blue-900 mr-4" title="Sửa">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    {currentUser?.id !== user.id && (
                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900" title="Xóa">
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

