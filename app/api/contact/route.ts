import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { to, propertyTitle, propertyLink, customerName, customerPhone, customerEmail, message } = body;

        // Configure SMTP transporter
        // Bác cần cung cấp user và pass trong .env
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng (App Password)
            },
        });

        const mailOptions = {
            from: `"Website Bất Động Sản" <${process.env.EMAIL_USER}>`,
            to: to, // Gửi tới email người đăng tin
            subject: `[Yêu cầu tư vấn] ${propertyTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; max-width: 600px;">
                    <h2 style="color: #2563eb;">Có khách hàng quan tâm đến tin đăng của bạn!</h2>
                    <p style="color: #666; font-size: 14px;">Bạn vừa nhận được một yêu cầu tư vấn mới từ website.</p>
                    
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #1e293b;">Thông tin khách hàng:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 5px 0; color: #64748b; width: 120px;">Họ tên:</td>
                                <td style="padding: 5px 0; font-weight: bold;">${customerName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #64748b;">Số điện thoại:</td>
                                <td style="padding: 5px 0; font-weight: bold;">${customerPhone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #64748b;">Email:</td>
                                <td style="padding: 5px 0;">${customerEmail || 'Không cung cấp'}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="margin: 20px 0;">
                        <h3 style="color: #1e293b;">Bất động sản quan tâm:</h3>
                        <p style="margin-bottom: 5px;"><strong>${propertyTitle}</strong></p>
                        <p><a href="${propertyLink}" style="color: #2563eb; text-decoration: none;">Xem chi tiết tin đăng tại đây &rarr;</a></p>
                    </div>

                    <div style="margin: 20px 0;">
                        <h3 style="color: #1e293b;">Lời nhắn của khách:</h3>
                        <p style="font-style: italic; background-color: #fff7ed; padding: 10px; border-left: 4px solid #f97316;">
                            "${message || 'Tôi cần thêm thông tin về căn nhà này.'}"
                        </p>
                    </div>

                    <hr style="border: 0; border-top: 1px solid #e0e0e0;">
                    <p style="font-size: 12px; color: #94a3b8; text-align: center;">Đây là email tự động từ hệ thống website Bất Động Sản.</p>
                </div>
            `,
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
        } else {
            console.warn('Thiếu cấu hình SMTP trong .env. Yêu cầu vẫn được ghi nhận nhưng email không thể gửi đi.');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
