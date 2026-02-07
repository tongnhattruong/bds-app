'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase/client';

export type PropertyType = 'sale' | 'rent';
export type PropertyCategory = 'house' | 'apartment' | 'land' | 'office';

export interface Property {
    id: string;
    title: string;
    price: number;
    currency: string;
    area: number;
    address: string;
    city: string;
    type: PropertyType;
    category: PropertyCategory;
    description?: string;
    images: string[];
    bedrooms?: number;
    bathrooms?: number;
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    youtubeUrl?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    createdAt?: string;
}

export interface City {
    id: string;
    name: string;
}

export interface District {
    id: string;
    name: string;
    cityId: string;
}

interface FilterParams {
    type?: string;
    category?: string;
    priceRange?: string;
    city?: string;
    district?: string;
    searchTerm?: string;
}

export interface SystemConfig {
    postsPerPage: number;
    relatedPostsLimit: number;
    siteTitle?: string;
    siteDescription?: string;
    siteKeywords?: string;
    ogImage?: string;
    headerTitle?: string;
    logoUrl?: string;
    faviconUrl?: string;
    footerAbout?: string;
    footerAddress?: string;
    footerEmail?: string;
    footerPhone?: string;
    socialFacebook?: string;
    socialZalo?: string;
    socialYoutube?: string;
    defaultContactName?: string;
    defaultViewMode?: 'list' | 'grid';
    gridColumns?: number;
}

export interface NewsCategory {
    id: string;
    name: string;
    description?: string;
}

export interface News {
    id: string;
    title: string;
    slug?: string;
    summary: string;
    content: string;
    thumbnail: string;
    categoryId: string;
    author: string;
    createdAt: string;
    isPublished: boolean;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
}

export interface Page {
    id: string;
    title: string;
    slug: string;
    content: string;
    isPublished: boolean;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    createdAt: string;
    updatedAt: string;
}

export interface MenuItem {
    id: string;
    label: string;
    url: string;
    icon?: string;
    order: number;
    target: '_self' | '_blank';
}

interface BDSContextType {
    properties: Property[];
    addProperty: (property: Property) => Promise<boolean>;
    updateProperty: (property: Property) => Promise<boolean>;
    deleteProperty: (id: string) => Promise<boolean>;
    getPropertyById: (id: string) => Property | undefined;
    filteredProperties: (filters: FilterParams) => Property[];

    cities: City[];
    districts: District[];
    addCity: (city: City) => Promise<boolean>;
    deleteCity: (id: string) => Promise<boolean>;
    addDistrict: (district: District) => Promise<boolean>;
    deleteDistrict: (id: string) => Promise<boolean>;
    getDistrictsByCity: (cityId: string) => District[];

    news: News[];
    newsCategories: NewsCategory[];
    addNews: (news: News) => Promise<boolean>;
    updateNews: (news: News) => Promise<boolean>;
    deleteNews: (id: string) => Promise<boolean>;
    addNewsCategory: (category: NewsCategory) => Promise<boolean>;
    deleteNewsCategory: (id: string) => Promise<boolean>;

    pages: Page[];
    addPage: (page: Page) => Promise<boolean>;
    updatePage: (page: Page) => Promise<boolean>;
    deletePage: (id: string) => Promise<boolean>;
    getPageBySlug: (slug: string) => Page | undefined;

    systemConfig: SystemConfig;
    updateSystemConfig: (config: SystemConfig) => Promise<boolean>;

    menuItems: MenuItem[];
    updateMenuItems: (items: MenuItem[]) => Promise<boolean>;
    addMenuItem: (item: MenuItem) => Promise<boolean>;
    deleteMenuItem: (id: string) => Promise<boolean>;

    fetchAllData: () => Promise<void>;
    isLoading: boolean;
}

const BDSContext = createContext<BDSContextType | undefined>(undefined);

const initialSystemConfig: SystemConfig = {
    postsPerPage: 6,
    relatedPostsLimit: 3,
    siteTitle: 'Bất Động Sản - Mua bán nhà đất uy tín',
    siteDescription: 'Cổng thông tin bất động sản hàng đầu.',
    headerTitle: 'Bất Động Sản',
    footerAbout: 'Nền tảng kết nối mua bán bất động sản uy tín.',
    footerAddress: 'TP.HCM',
    footerEmail: 'contact@bds.com',
    footerPhone: '0909 000 999',
};

export function BDSProvider({ children }: { children: React.ReactNode }) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [news, setNews] = useState<News[]>([]);
    const [newsCategories, setNewsCategories] = useState<NewsCategory[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [systemConfig, setSystemConfig] = useState<SystemConfig>(initialSystemConfig);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const [
                { data: props },
                { data: cits },
                { data: dists },
                { data: nws },
                { data: pgs },
                { data: mItems },
                { data: sys },
                { data: nCats }
            ] = await Promise.all([
                supabase.from('Property').select('*').order('createdAt', { ascending: false }),
                supabase.from('City').select('*'),
                supabase.from('District').select('*'),
                supabase.from('News').select('*').order('createdAt', { ascending: false }),
                supabase.from('Page').select('*').order('createdAt', { ascending: false }),
                supabase.from('MenuItem').select('*').order('order', { ascending: true }),
                supabase.from('SystemConfig').select('*').eq('id', 'global').maybeSingle(),
                supabase.from('NewsCategory').select('*').order('createdAt', { ascending: true })
            ]);

            if (sys) setSystemConfig(sys);
            if (nCats) setNewsCategories(nCats);
            if (props) {
                setProperties(props.map((p: any) => ({
                    ...p,
                    images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || [])
                })));
            }
            if (cits) setCities(cits);
            if (dists) setDistricts(dists);
            if (nws) setNews(nws);
            if (pgs) setPages(pgs);
            if (mItems) setMenuItems(mItems);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addProperty = async (newProperty: Property) => {
        const { error } = await supabase.from('Property').insert([{
            ...newProperty,
            images: JSON.stringify(newProperty.images)
        }]);
        if (error) return false;
        fetchAllData();
        return true;
    };

    const updateProperty = async (updatedProperty: Property) => {
        const { error } = await supabase.from('Property').update({
            ...updatedProperty,
            images: JSON.stringify(updatedProperty.images)
        }).eq('id', updatedProperty.id);
        if (error) return false;
        fetchAllData();
        return true;
    };

    const deleteProperty = async (id: string) => {
        const { error } = await supabase.from('Property').delete().eq('id', id);
        if (error) return false;
        fetchAllData();
        return true;
    };

    const getPropertyById = (id: string) => {
        return properties.find((p) => p.id === id);
    };

    const addCity = async (city: City) => {
        const { error } = await supabase.from('City').insert([city]);
        if (error) return false;
        fetchAllData();
        return true;
    };

    const deleteCity = async (id: string) => {
        const { error } = await supabase.from('City').delete().eq('id', id);
        if (error) return false;
        fetchAllData();
        return true;
    };

    const addDistrict = async (district: District) => {
        const { error } = await supabase.from('District').insert([district]);
        if (error) return false;
        fetchAllData();
        return true;
    };

    const deleteDistrict = async (id: string) => {
        const { error } = await supabase.from('District').delete().eq('id', id);
        if (error) return false;
        fetchAllData();
        return true;
    };

    const getDistrictsByCity = (cityId: string) => {
        return districts.filter(d => d.cityId === cityId);
    };

    const addNews = async (item: News) => {
        const { error } = await supabase.from('News').insert([item]);
        if (error) return false;
        fetchAllData();
        return true;
    };

    const updateNews = async (updatedItem: News) => {
        const { error } = await supabase.from('News').update(updatedItem).eq('id', updatedItem.id);
        if (error) return false;
        fetchAllData();
        return true;
    };

    const deleteNews = async (id: string) => {
        const { error } = await supabase.from('News').delete().eq('id', id);
        if (error) return false;
        fetchAllData();
        return true;
    };

    const addNewsCategory = async (category: NewsCategory) => {
        const { error } = await supabase.from('NewsCategory').insert([category]);
        if (error) {
            console.error('Lỗi thêm NewsCategory:', error);
            return false;
        }
        fetchAllData();
        return true;
    };

    const deleteNewsCategory = async (id: string) => {
        const { error } = await supabase.from('NewsCategory').delete().eq('id', id);
        if (error) {
            console.error('Lỗi xóa NewsCategory:', error);
            return false;
        }
        fetchAllData();
        return true;
    };

    const addPage = async (page: Page) => {
        const { error } = await supabase.from('Page').insert([page]);
        if (error) return false;
        fetchAllData();
        return true;
    };

    const updatePage = async (page: Page) => {
        const { error } = await supabase.from('Page').update(page).eq('id', page.id);
        if (error) return false;
        fetchAllData();
        return true;
    };

    const deletePage = async (id: string) => {
        const { error } = await supabase.from('Page').delete().eq('id', id);
        if (error) return false;
        fetchAllData();
        return true;
    };

    const getPageBySlug = (slug: string) => {
        return pages.find(p => p.slug === slug);
    };

    const updateSystemConfig = async (config: SystemConfig) => {
        const { error } = await supabase.from('SystemConfig').upsert({
            id: 'global',
            ...config
        });
        if (error) return false;
        fetchAllData();
        return true;
    };

    const updateMenuItems = async (items: MenuItem[]) => {
        // This is tricky with Supabase if we want to update all at once.
        // For simplicity, we'll upsert them one by one or just use a loop.
        const promises = items.map(item => supabase.from('MenuItem').upsert(item));
        await Promise.all(promises);
        fetchAllData();
        return true;
    };

    const addMenuItem = async (item: MenuItem) => {
        const newItem = {
            ...item,
            id: item.id || crypto.randomUUID()
        };
        const { error } = await supabase.from('MenuItem').insert([newItem]);
        if (error) {
            console.error('Lỗi thêm MenuItem:', error);
            return false;
        }
        fetchAllData();
        return true;
    };

    const deleteMenuItem = async (id: string) => {
        const { error } = await supabase.from('MenuItem').delete().eq('id', id);
        if (error) {
            console.error('Lỗi xóa MenuItem:', error);
            return false;
        }
        fetchAllData();
        return true;
    };

    const filteredProperties = (filters: FilterParams) => {
        return properties.filter((property) => {
            if (filters.type && filters.type !== 'all' && property.type !== filters.type) return false;
            if (filters.category && filters.category !== 'all' && property.category !== filters.category) return false;
            if (filters.searchTerm) {
                const term = filters.searchTerm.toLowerCase();
                if (!property.title.toLowerCase().includes(term) && !property.address.toLowerCase().includes(term)) return false;
            }
            if (filters.city && filters.city !== '' && filters.city !== 'all') {
                const cityObj = cities.find(c => c.id === filters.city);
                const cityName = cityObj ? cityObj.name : filters.city;
                if (!property.city.toLowerCase().includes(cityName.toLowerCase()) && !property.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
            }
            if (filters.district && filters.district !== '') {
                const districtObj = districts.find(d => d.id === filters.district);
                const districtName = districtObj ? districtObj.name : filters.district;
                if (!property.address.toLowerCase().includes(districtName.toLowerCase())) return false;
            }
            if (filters.priceRange) {
                const price = property.price;
                const unit = property.currency;
                let priceInBillion = price;
                if (unit === 'Triệu') priceInBillion = price / 1000;
                switch (filters.priceRange) {
                    case 'under-1': if (priceInBillion >= 1) return false; break;
                    case '1-3': if (priceInBillion < 1 || priceInBillion > 3) return false; break;
                    case '3-5': if (priceInBillion < 1 || priceInBillion > 5) return false; break;
                    case 'over-5': if (priceInBillion <= 5) return false; break;
                }
            }
            return true;
        });
    };

    return (
        <BDSContext.Provider value={{
            properties, addProperty, updateProperty, deleteProperty, getPropertyById, filteredProperties,
            cities, districts, addCity, deleteCity, addDistrict, deleteDistrict, getDistrictsByCity,
            news, newsCategories, addNews, updateNews, deleteNews, addNewsCategory, deleteNewsCategory,
            pages, addPage, updatePage, deletePage, getPageBySlug,
            systemConfig, updateSystemConfig, fetchAllData, isLoading,
            menuItems, updateMenuItems, addMenuItem, deleteMenuItem
        }}>
            {children}
        </BDSContext.Provider>
    );
}

export function useBDS() {
    const context = useContext(BDSContext);
    if (context === undefined) {
        throw new Error('useBDS must be used within a BDSProvider');
    }
    return context;
}
