const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const images = [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1074&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1175&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1628133287836-40bd5453bed1?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1170&auto=format&fit=crop"
]

async function main() {
    console.log('Start seeding ...')

    // Clean up existing data
    await prisma.property.deleteMany({})
    await prisma.district.deleteMany({})
    await prisma.city.deleteMany({})

    // Seed Cities
    const hcm = await prisma.city.create({
        data: { id: 'hcm', name: 'Hồ Chí Minh' }
    })
    const hn = await prisma.city.create({
        data: { id: 'hn', name: 'Hà Nội' }
    })
    const dn = await prisma.city.create({
        data: { id: 'dn', name: 'Đà Nẵng' }
    })

    // Seed Districts
    await prisma.district.createMany({
        data: [
            { id: 'q1', name: 'Quận 1', cityId: 'hcm' },
            { id: 'q2', name: 'TP. Thủ Đức', cityId: 'hcm' },
            { id: 'q3', name: 'Quận 3', cityId: 'hcm' },
            { id: 'q7', name: 'Quận 7', cityId: 'hcm' },
            { id: 'binhthanh', name: 'Quận Bình Thạnh', cityId: 'hcm' },
            { id: 'hoankiem', name: 'Quận Hoàn Kiếm', cityId: 'hn' },
            { id: 'caugiay', name: 'Quận Cầu Giấy', cityId: 'hn' },
            { id: 'haichau', name: 'Quận Hải Châu', cityId: 'dn' }
        ]
    })

    const properties = [
        {
            title: "Biệt thự hiện đại Thảo Điền, hồ bơi riêng",
            price: 45,
            currency: "Tỷ",
            area: 350,
            address: "Lê Văn Miến, Thảo Điền, TP. Thủ Đức",
            city: "Hồ Chí Minh",
            type: "sale",
            category: "house",
            description: "Biệt thự sân vườn rộng rãi, thiết kế Châu Âu hiện đại. Gồm 5 phòng ngủ, 6WC, hồ bơi riêng, gara ô tô. Khu vực an ninh, yên tĩnh, cộng đồng dân cư văn minh.",
            images: JSON.stringify([images[0], images[2], images[6]]),
            bedrooms: 5,
            bathrooms: 6,
            contactName: "Nguyễn Văn An",
            contactPhone: "0909123456",
            contactEmail: "an.nguyen@bds.com",
            seoTitle: "Bán biệt thự Thảo Điền có hồ bơi",
            seoDescription: "Bán biệt thự Thảo Điền, TP Thủ Đức. Diện tích 350m2, thiết kế hiện đại, có hồ bơi.",
            seoKeywords: "biet thu thao dien, nha thu duc, biet thu ho boi",
            youtubeUrl: ""
        },
        {
            title: "Căn hộ cao cấp Vinhomes Central Park, view sông",
            price: 6.5,
            currency: "Tỷ",
            area: 85,
            address: "208 Nguyễn Hữu Cảnh, Bình Thạnh",
            city: "Hồ Chí Minh",
            type: "sale",
            category: "apartment",
            description: "Căn hộ 2 phòng ngủ, tầng cao, view trực diện sông và công viên. Nội thất đầy đủ cao cấp. Tiện ích 5 sao: bệnh viện, trường học, TTTM...",
            images: JSON.stringify([images[1], images[7], images[5]]),
            bedrooms: 2,
            bathrooms: 2,
            contactName: "Trần Thị Bé",
            contactPhone: "0909888999",
            contactEmail: "be.tran@bds.com",
            seoTitle: "Bán căn hộ Vinhomes Central Park 2PN view sông",
            seoDescription: "Căn hộ 2PN Vinhomes Central Park, tầng cao view đẹp, giá tốt.",
            seoKeywords: "can ho vinhomes, chung cu binh thanh",
            youtubeUrl: ""
        },
        {
            title: "Nhà phố thương mại Quận 1, vị trí đắc địa",
            price: 32,
            currency: "Tỷ",
            area: 120,
            address: "Đường Hai Bà Trưng, Quận 1",
            city: "Hồ Chí Minh",
            type: "sale",
            category: "house",
            description: "Nhà mặt tiền đường lớn, thuận tiện kinh doanh đa ngành nghề hoặc cho thuê văn phòng. Kết cấu trệt 3 lầu.",
            images: JSON.stringify([images[3], images[8], images[6]]),
            bedrooms: 4,
            bathrooms: 4,
            contactName: "Phạm Hùng",
            contactPhone: "0987654321",
            contactEmail: "hung.pham@realestate.com",
            seoTitle: "Bán nhà mặt tiền Quận 1 Hai Bà Trưng",
            youtubeUrl: ""
        },
        {
            title: "Biệt thự nghỉ dưỡng ngoại ô Hà Nội",
            price: 18,
            currency: "Tỷ",
            area: 500,
            address: "Khu đô thị Ecopark, Hà Nội",
            city: "Hà Nội",
            type: "sale",
            category: "house",
            description: "Không gian sống xanh, trong lành. Biệt thự đơn lập, 4 mặt thoáng, sân vườn rộng.",
            images: JSON.stringify([images[4], images[2], images[0]]),
            bedrooms: 4,
            bathrooms: 5,
            contactName: "Lê Văn Cường",
            contactPhone: "0912345678",
            contactEmail: "cuong.le@mail.com",
            youtubeUrl: ""
        },
        {
            title: "Cho thuê căn hộ dịch vụ Quận 7",
            price: 15,
            currency: "Triệu/tháng",
            area: 60,
            address: "Nguyễn Thị Thập, Quận 7",
            city: "Hồ Chí Minh",
            type: "rent",
            category: "apartment",
            description: "Căn hộ dịch vụ full nội thất, bao phí quản lý, internet. Chỉ việc xách vali vào ở.",
            images: JSON.stringify([images[5], images[7], images[1]]),
            bedrooms: 1,
            bathrooms: 1,
            contactName: "Ms. Lan",
            contactPhone: "0283777777",
            contactEmail: "lan@apartments.com",
            youtubeUrl: ""
        },
        {
            title: "Văn phòng trọn gói Quận Cầu Giấy",
            price: 25,
            currency: "Triệu/tháng",
            area: 80,
            address: "Duy Tân, Cầu Giấy",
            city: "Hà Nội",
            type: "rent",
            category: "office",
            description: "Văn phòng hạng B, đầy đủ bàn ghế, phòng họp. Khu vực tập trung nhiều công ty công nghệ.",
            images: JSON.stringify([images[8], images[6]]),
            bedrooms: 0,
            bathrooms: 2,
            contactName: "Mr. Tuấn Admin",
            contactPhone: "0999888777",
            contactEmail: "tuan@office.vn",
            youtubeUrl: ""
        },
        {
            title: "Penthouse Sky Villa - Đẳng cấp thượng lưu",
            price: 85,
            currency: "Tỷ",
            area: 450,
            address: "Khu Thủ Thiêm, TP. Thủ Đức",
            city: "Hồ Chí Minh",
            type: "sale",
            category: "apartment",
            description: "Penthouse thông tầng, view panorama toàn cảnh sông Sài Gòn và Quận 1. Hồ bơi riêng, thang máy riêng.",
            images: JSON.stringify([images[6], images[4], images[1]]),
            bedrooms: 4,
            bathrooms: 5,
            contactName: "Luxury Homes",
            contactPhone: "0909999999",
            contactEmail: "vip@luxury.com",
            youtubeUrl: ""
        },
        {
            title: "Đất nền dự án ven biển Đà Nẵng",
            price: 3.5,
            currency: "Tỷ",
            area: 100,
            address: "Đường Võ Nguyên Giáp, Sơn Trà",
            city: "Đà Nẵng",
            type: "sale",
            category: "land",
            description: "Lô đất đẹp, cách biển 200m, thích hợp xây khách sạn hoặc homestay.",
            images: JSON.stringify([images[2], images[3]]),
            bedrooms: 0,
            bathrooms: 0,
            contactName: "Trần Văn D",
            contactPhone: "0933444555",
            contactEmail: "d.tran@danang.bds",
            youtubeUrl: ""
        }
    ]

    for (const p of properties) {
        const property = await prisma.property.create({
            data: p
        })
        console.log(`Created property with id: ${property.id}`)
    }
    // Seed System Config
    await prisma.systemConfig.create({
        data: {
            id: 'global',
            siteTitle: 'Bất Động Sản - Mua bán nhà đất uy tín',
            siteDescription: 'Cổng thông tin bất động sản hàng đầu.',
            headerTitle: 'Bất Động Sản',
            footerAbout: 'Nền tảng kết nối mua bán bất động sản uy tín.',
            footerAddress: 'TP.HCM',
            footerEmail: 'contact@bds.com',
            footerPhone: '0909 000 999',
            postsPerPage: 6,
            relatedPostsLimit: 3
        }
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
