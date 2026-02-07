const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const newsItems = [
    {
        title: "Xu hướng thị trường BĐS 2025: Dòng tiền đổ về đâu?",
        slug: "xu-huong-thi-truong-bds-2025",
        summary: "Phân tích các phân khúc bất động sản hứa hẹn sẽ bùng nổ trong năm tới và chiến lược đầu tư hiệu quả.",
        content: "<p>Thị trường bất động sản năm 2025 được dự báo sẽ có nhiều chuyển biến tích cực nhờ sự phục hồi của kinh tế vĩ mô và các thay đổi về chính sách pháp lý...</p><p>Các nhà đầu tư đang dần chuyển hướng sang các phân khúc có tính thanh khoản cao và giá trị sử dụng thực...</p>",
        thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000",
        author: "Gravy Admin",
        isPublished: true,
        categoryId: "thi-truong"
    },
    {
        title: "Luật Đất đai 2024: Bước ngoặt lớn cho thị trường địa ốc",
        slug: "luat-dat-dai-2024-buoc-ngoat-lon",
        summary: "Những thay đổi quan trọng trong Luật Đất đai mới sẽ tác động trực tiếp đến giá đất và quyền lợi của người sử dụng đất.",
        content: "<h3>Điểm mới của Luật Đất đai</h3><p>Luật Đất đai (sửa đổi) đã chính thức được thông qua với nhiều quy định đột phá về định giá đất, bồi thường và hỗ trợ tái định cư...</p>",
        thumbnail: "https://images.unsplash.com/photo-1582408921715-18e7806367c1?q=80&w=1000",
        author: "Gravy Admin",
        isPublished: true,
        categoryId: "phap-ly"
    },
    {
        title: "Căn hộ ven sông Sài Gòn vẫn giữ sức hút với nhà đầu tư",
        slug: "can-ho-ven-song-sai-gon-suc-hut",
        summary: "Tầm nhìn đẹp và không gian sống trong lành khiến các dự án ven sông luôn nằm trong tầm ngắm của giới thượng lưu.",
        content: "<p>Không chỉ sở hữu giá trị phong thủy tốt, các căn hộ ven sông còn mang lại không gian sống đẳng cấp và yên bình giữa lòng thành phố nhộn nhịp...</p>",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1000",
        author: "Gravy News",
        isPublished: true,
        categoryId: "du-an"
    },
    {
        title: "Lợi suất cho thuê căn hộ tại Hà Nội tăng mạnh đầu năm 2024",
        slug: "loi-suat-cho-thue-can-ho-ha-noi",
        summary: "Nhu cầu thuê nhà ở thực tế tăng cao đẩy giá thuê căn hộ chung cư tại các quận trung tâm Hà Nội tăng vọt.",
        content: "<p>Theo báo cáo mới nhất, giá thuê chung cư tại Hà Nội đã tăng trung bình 15-20% so với cùng kỳ năm ngoái do nguồn cung khan hiếm...</p>",
        thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000",
        author: "Market Watch",
        isPublished: true,
        categoryId: "thi-truong"
    },
    {
        title: "Những lưu ý khi đầu tư đất nền vùng ven dịp cuối năm",
        slug: "luu-y-dau-tu-dat-nen-vung-ven",
        summary: "Đất nền vùng ven vẫn là kênh đầu tư hấp dẫn nhưng tiềm ẩn nhiều rủi ro về pháp lý và quy hoạch.",
        content: "<p>Trước khi xuống tiền đầu tư đất nền, nhà đầu tư cần kiểm tra kỹ quy hoạch 1/500, năng lực chủ đầu tư và hạ tầng kết nối xung quanh...</p>",
        thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fee74a62?q=80&w=1000",
        author: "Investment Expert",
        isPublished: true,
        categoryId: "dau-tu"
    },
    {
        title: "Shophouse khối đế: Gà đẻ trứng vàng hay \"bánh vẽ\"?",
        slug: "shophouse-khoi-de-ga-de-trung-vang",
        summary: "Đánh giá tiềm năng kinh doanh và rủi ro khi đầu tư vào loại hình shophouse tại các tòa chung cư cao tầng.",
        content: "<p>Shophouse khối đế luôn được quảng cáo là có tỷ suất lợi nhuận cao, nhưng thực tế phụ thuộc rất lớn vào tỷ lệ cư dân lấp đầy và vị trí giao thương...</p>",
        thumbnail: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000",
        author: "Gravy Admin",
        isPublished: true,
        categoryId: "dau-tu"
    },
    {
        title: "Công nghệ Proptech đang thay đổi cuộc chơi bất động sản ra sao?",
        slug: "proptech-doi-moi-cuoc-choi-bds",
        summary: "Từ xem nhà thực tế ảo AR/VR đến quản lý vận hành bằng AI, công nghệ đang chuyển đổi ngành bất động sản truyền thống.",
        content: "<p>Proptech không còn là khái niệm xa lạ mà đang len lỏi vào mọi khâu của thị trường BĐS, giúp tăng tính minh bạch và tiết kiệm thời gian...</p>",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000",
        author: "Tech Insight",
        isPublished: true,
        categoryId: "cong-nghe"
    },
    {
        title: "Tại sao bất động sản nghỉ dưỡng vẫn chưa hồi phục như mong đợi?",
        slug: "bds-nghi-duong-bao-gio-hoi-phuc",
        summary: "Phân tích các rào cản khiến phân khúc condotel và biệt thự biển vẫn đang trong giai đoạn \"ngủ đông\".",
        content: "<p>Dù du lịch đã phục hồi nhưng BĐS nghỉ dưỡng vẫn gặp khó khăn do vấn đề pháp lý chưa rõ ràng và lãi suất vay đầu tư còn cao...</p>",
        thumbnail: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1000",
        author: "Economic Review",
        isPublished: true,
        categoryId: "thi-truong"
    },
    {
        title: "Cơ hội săn nhà giá tốt khi lãi suất ngân hàng tiếp tục giảm",
        slug: "san-nha-gia-tot-lai-suat-giam",
        summary: "Nhiều ngân hàng tung ra các gói vay ưu đãi với lãi suất chỉ từ 5-6%/năm tạo điều kiện tốt cho người mua nhà ở thực.",
        content: "<p>Đây là thời điểm vàng để người mua nhà có thể tiếp cận nguồn vốn rẻ, tuy nhiên cần lưu ý đến biên độ lãi suất sau thời gian ưu đãi...</p>",
        thumbnail: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=1000",
        author: "Finance Today",
        isPublished: true,
        categoryId: "tai-chinh"
    },
    {
        title: "Quy hoạch hạ tầng giao thông: Động lực cho BĐS khu nam phát triển",
        slug: "ha-tang-khu-nam-don-bay-bds",
        summary: "Các dự án đường vành đai, cầu vượt mới đang tạo ra cú hích lớn cho giá trị bất động sản khu vực phía Nam thành phố.",
        content: "<p>Hạ tầng luôn đi trước, giá trị BĐS theo sau. Sự hoàn thiện của các trục đường huyết mạch sẽ giúp việc di chuyển thuận lợi và thúc đẩy đô thị hóa...</p>",
        thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
        author: "Urban Planning",
        isPublished: true,
        categoryId: "quy-hoach"
    }
]

async function main() {
    console.log('🚀 Đang nạp tin tức...')

    // Clean up if you really want to, but here we just want to ADD if not exists
    // For now we'll just upsert by slug

    for (const item of newsItems) {
        await prisma.news.upsert({
            where: { slug: item.slug },
            update: item,
            create: item,
        })
        console.log(`✅ Đã nạp: ${item.title}`)
    }

    console.log('✨ Xong!')
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
