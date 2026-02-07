
export type PropertyType = 'sale' | 'rent';
export type PropertyCategory = 'house' | 'apartment' | 'land' | 'office';

export interface Property {
    id: string;
    title: string;
    price: number;
    currency: string;
    area: number; // m2
    address: string;
    city: string;
    type: PropertyType;
    category: PropertyCategory;
    description: string;
    images: string[];
    bedrooms?: number;
    bathrooms?: number;
    createdAt: string;
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    youtubeUrl?: string;
    // SEO Specific
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
}


export const mockProperties: Property[] = [
    {
        id: '1',
        title: 'Biệt thự sân vườn Thảo Điền',
        price: 35,
        currency: 'Tỷ',
        area: 250,
        address: 'Đường Quốc Hương, Thảo Điền',
        city: 'Hồ Chí Minh',
        type: 'sale',
        category: 'house',
        description: 'Biệt thự góc 2 mặt tiền, hồ bơi riêng, nội thất cao cấp nhập khẩu.',
        images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2670&auto=format&fit=crop'],
        bedrooms: 4,
        bathrooms: 5,
        createdAt: '2024-02-06',
        contactName: 'Nguyễn Văn A',
        contactPhone: '0909000111',
        contactEmail: 'nguyenvana@example.com',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },

    {
        id: '2',
        title: 'Căn hộ cao cấp Vinhomes Central Park',
        price: 6.5,
        currency: 'Tỷ',
        area: 80,
        address: '208 Nguyễn Hữu Cảnh',
        city: 'Hồ Chí Minh',
        type: 'sale',
        category: 'apartment',
        description: 'Căn hộ 2PN view sông trực diện, tầng trung, đầy đủ nội thất.',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop'],
        bedrooms: 2,
        bathrooms: 2,
        createdAt: '2024-02-05',
        contactName: 'Trần Thị B',
        contactPhone: '0909000222',
        contactEmail: 'tranthib@example.com'
    },
    {
        id: '3',
        title: 'Nhà phố thương mại Quận 1',
        price: 50, // Triệu/tháng
        currency: 'Triệu/tháng',
        area: 120,
        address: 'Hai Bà Trưng, Đa Kao',
        city: 'Hồ Chí Minh',
        type: 'rent',
        category: 'house',
        description: 'Nhà nguyên căn mặt tiền, phù hợp làm văn phòng hoặc kinh doanh nhà hàng.',
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop'],
        bedrooms: 3,
        bathrooms: 3,
        createdAt: '2024-02-04',
        contactName: 'Lê Văn C',
        contactPhone: '0909000333'
    },
    {
        id: '4',
        title: 'Đất nền dự án Long An',
        price: 2.1,
        currency: 'Tỷ',
        area: 100,
        address: 'Bến Lức',
        city: 'Long An',
        type: 'sale',
        category: 'land',
        description: 'Đất vuông vức, sổ đỏ chính chủ, xây dựng tự do.',
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop'],
        createdAt: '2024-02-03',
        contactName: 'Phạm Văn D',
        contactPhone: '0909000444'
    }
];

