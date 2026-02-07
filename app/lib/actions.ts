'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from './prisma'
// import { SystemConfig } from '@prisma/client'

export async function clearCache() {
    try {
        revalidatePath('/', 'layout')
        return { success: true, message: 'Đã xóa cache toàn bộ hệ thống' }
    } catch (error) {
        return { success: false, message: 'Lỗi khi xóa cache' }
    }
}

export async function updateSystemConfigAction(data: any) {
    try {
        // Sanitize input: Only allow valid schema fields
        const validFields = [
            'postsPerPage', 'relatedPostsLimit',
            'siteTitle', 'siteDescription', 'siteKeywords', 'ogImage',
            'headerTitle', 'logoUrl', 'faviconUrl',
            'footerAbout', 'footerAddress', 'footerEmail', 'footerPhone',
            'socialFacebook', 'socialZalo', 'socialYoutube', 'defaultContactName',
            'defaultViewMode', 'gridColumns'
        ];

        const updateData: any = {};
        Object.keys(data).forEach(key => {
            if (validFields.includes(key)) {
                updateData[key] = data[key];
            }
        });

        console.log('Sanitized Data:', updateData);

        // Workaround for outdated Prisma Client:
        // Use UPSERT for known fields, and RAW QUERY for new fields.

        const safeBaseData = { ...updateData };
        // Delete new fields so standard Prisma client won't crash
        delete safeBaseData.defaultViewMode;
        delete safeBaseData.gridColumns;

        // 1. Ensure record exists with base fields
        await prisma.systemConfig.upsert({
            where: { id: 'global' },
            update: safeBaseData,
            create: {
                id: 'global',
                postsPerPage: 6,
                relatedPostsLimit: 3,
                ...safeBaseData
            }
        });

        // 2. Update new fields using Raw Query to bypass outdated client definitions
        const mode = updateData.defaultViewMode;
        const cols = updateData.gridColumns;
        let rawCount = 0;

        try {
            if (mode !== undefined && cols !== undefined) {
                rawCount = await prisma.$executeRaw`UPDATE "SystemConfig" SET "defaultViewMode" = ${mode}, "gridColumns" = ${Number(cols)} WHERE "id" = 'global'`;
            } else if (mode !== undefined) {
                rawCount = await prisma.$executeRaw`UPDATE "SystemConfig" SET "defaultViewMode" = ${mode} WHERE "id" = 'global'`;
            } else if (cols !== undefined) {
                // Ensure cols is number
                rawCount = await prisma.$executeRaw`UPDATE "SystemConfig" SET "gridColumns" = ${Number(cols)} WHERE "id" = 'global'`;
            }
        } catch (rawError) {
            console.error('Raw Query Failed:', rawError);
            return { success: true, message: 'Đã lưu cấu hình cơ bản, nhưng lỗi cập nhật giao diện: ' + String(rawError) };
        }

        revalidatePath('/', 'layout'); // Clear all cache

        return { success: true, message: `Cập nhật thành công (Giao diện: ${rawCount} dòng)` };
    } catch (error) {
        console.error('Update config error:', error);
        return { success: false, message: 'Lỗi khi cập nhật cấu hình: ' + (error instanceof Error ? error.message : String(error)) };
    }
}
