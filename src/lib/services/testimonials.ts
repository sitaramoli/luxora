'use server';

import { dbWithMonitoring } from '@/database/drizzle';
import { testimonials, type Testimonial } from '@/database/schema';
import { desc, eq } from 'drizzle-orm';

export const getHighestRatedTestimonials = async (limit: number = 10): Promise<Testimonial[]> => {
  return await dbWithMonitoring.execute(
    'getHighestRatedTestimonials',
    async () => {
      const result = await dbWithMonitoring.db
        .select()
        .from(testimonials)
        .where(eq(testimonials.isActive, true))
        .orderBy(desc(testimonials.rating), desc(testimonials.createdAt))
        .limit(limit);
      
      return result;
    }
  );
};

export const getTestimonialsByRating = async (rating: number): Promise<Testimonial[]> => {
  return await dbWithMonitoring.execute(
    'getTestimonialsByRating',
    async () => {
      const result = await dbWithMonitoring.db
        .select()
        .from(testimonials)
        .where(eq(testimonials.rating, rating))
        .orderBy(desc(testimonials.createdAt));
      
      return result;
    }
  );
};

export const getAllActiveTestimonials = async (): Promise<Testimonial[]> => {
  return await dbWithMonitoring.execute(
    'getAllActiveTestimonials',
    async () => {
      const result = await dbWithMonitoring.db
        .select()
        .from(testimonials)
        .where(eq(testimonials.isActive, true))
        .orderBy(desc(testimonials.rating), desc(testimonials.createdAt));
      
      return result;
    }
  );
};

export const createTestimonial = async (testimonialData: {
  userId?: string | null;
  name: string;
  role?: string | null;
  content: string;
  rating: number;
  avatar?: string | null;
}): Promise<Testimonial> => {
  return await dbWithMonitoring.execute(
    'createTestimonial',
    async () => {
      const [result] = await dbWithMonitoring.db
        .insert(testimonials)
        .values({
          userId: testimonialData.userId,
          name: testimonialData.name,
          role: testimonialData.role,
          content: testimonialData.content,
          rating: testimonialData.rating,
          avatar: testimonialData.avatar,
          isActive: true,
        })
        .returning();
      
      return result;
    }
  );
};