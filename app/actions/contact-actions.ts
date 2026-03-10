'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
// Import Enum from generated prisma client to ensure type safety
import { ContactCategory } from '@/lib/generated/prisma/client';

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const categoryStr = formData.get('category') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !categoryStr || !message) {
      return { success: false, error: 'All fields are required.' };
    }

    const category = categoryStr as ContactCategory;

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        category,
        message,
      },
    });

    revalidatePath('/admin');
    
    return { success: true, message: 'Message sent successfully!' };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: 'An error occurred while sending your message. Please try again.' };
  }
}
