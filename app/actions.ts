'use server'

import { prisma } from './lib/prisma'
import { revalidatePath } from 'next/cache'

// Compatible type definition for UI components
export type PropertyData = {
    title: string;
    price: number;
    currency: string;
    area: number;
    address: string;
    city: string;
    type: string;
    category: string;
    description: string;
    images: string[];
    bedrooms?: number;
    bathrooms?: number;
    contactName: string;
    contactPhone: string;
}

export async function getProperties() {
    try {
        const properties = await prisma.property.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Parse JSON string images back to array
        return properties.map((p: any) => ({
            ...p,
            images: JSON.parse(p.images) as string[]
        }));
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}

export async function createProperty(data: PropertyData) {
    try {
        await prisma.property.create({
            data: {
                ...data,
                images: JSON.stringify(data.images)
            }
        });
        revalidatePath('/listings');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to create property:', error);
        return { success: false, error: 'Failed to create property' };
    }
}

export async function deleteProperty(id: string) {
    try {
        await prisma.property.delete({
            where: { id }
        });
        revalidatePath('/listings');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete property:', error);
        return { success: false, error: 'Failed to delete' };
    }
}

