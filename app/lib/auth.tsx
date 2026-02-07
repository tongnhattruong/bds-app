'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'admin' | 'user' | 'guest';

export interface User {
    id: string;
    username: string;
    password?: string;
    role: UserRole;
    name: string;
    email?: string;
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    users: User[];
    login: (username: string, password?: string) => Promise<boolean>;
    logout: () => void;
    addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
    updateUser: (id: string, updates: Partial<User>) => void;
    deleteUser: (id: string) => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialUsers: User[] = [
    {
        id: '1',
        username: 'admin',
        password: 'admin',
        role: 'admin',
        name: 'Quản trị viên',
        email: 'admin@bds.com',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        username: 'user',
        password: 'user',
        role: 'user',
        name: 'Thành viên Demo',
        email: 'user@bds.com',
        createdAt: new Date().toISOString()
    }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Load users and current session
    useEffect(() => {
        // Load users
        const savedUsers = localStorage.getItem('bds_users');
        if (savedUsers) {
            setUsers(JSON.parse(savedUsers));
        } else {
            setUsers(initialUsers);
            localStorage.setItem('bds_users', JSON.stringify(initialUsers));
        }

        // Load session
        const savedUser = localStorage.getItem('bds_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        setIsLoading(false);
    }, []);

    const login = async (username: string, password?: string) => {
        return new Promise<boolean>((resolve) => {
            setTimeout(() => {
                const foundUser = users.find(u => u.username === username && u.password === password);
                if (foundUser) {
                    // Create session user (without password for security simulation)
                    const sessionUser = { ...foundUser };
                    // delete sessionUser.password; // Keep it simple for now

                    setUser(sessionUser);
                    localStorage.setItem('bds_user', JSON.stringify(sessionUser));

                    if (sessionUser.role === 'admin') {
                        router.push('/admin');
                    } else {
                        router.push('/');
                    }
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('bds_user');
        router.push('/login');
    };

    const addUser = (newUser: Omit<User, 'id' | 'createdAt'>) => {
        const userWithId: User = {
            ...newUser,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString()
        };
        const updatedUsers = [...users, userWithId];
        setUsers(updatedUsers);
        localStorage.setItem('bds_users', JSON.stringify(updatedUsers));
    };

    const updateUser = (id: string, updates: Partial<User>) => {
        const updatedUsers = users.map(u => u.id === id ? { ...u, ...updates } : u);
        setUsers(updatedUsers);
        localStorage.setItem('bds_users', JSON.stringify(updatedUsers));

        // Update current session if needed
        if (user && user.id === id) {
            const updatedSession = { ...user, ...updates };
            setUser(updatedSession);
            localStorage.setItem('bds_user', JSON.stringify(updatedSession));
        }
    };

    const deleteUser = (id: string) => {
        const updatedUsers = users.filter(u => u.id !== id);
        setUsers(updatedUsers);
        localStorage.setItem('bds_users', JSON.stringify(updatedUsers));
    };

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, users, login, logout, addUser, updateUser, deleteUser, isAuthenticated, isAdmin, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}


