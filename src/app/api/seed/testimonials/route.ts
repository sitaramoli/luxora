import { type NextRequest, NextResponse } from 'next/server';

import { createTestimonial } from '@/lib/services/testimonials';

const testimonialsData = [
  {
    name: 'Sarah Johnson',
    role: 'Fashion Enthusiast',
    content:
      'Luxora has transformed my shopping experience. The quality and authenticity of every piece is exceptional.',
    rating: 5,
    avatar:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    name: 'Michael Chen',
    role: 'Collector',
    content:
      'The curation is impeccable. I trust Luxora to deliver only the finest luxury items.',
    rating: 5,
    avatar:
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    name: 'Emma Wilson',
    role: 'Designer',
    content:
      'As a designer, I appreciate the attention to detail and craftsmanship in every product.',
    rating: 5,
    avatar:
      'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
];

export async function POST(request: NextRequest) {
  try {
    const results = [];

    for (const testimonial of testimonialsData) {
      const result = await createTestimonial({
        userId: null,
        name: testimonial.name,
        role: testimonial.role,
        content: testimonial.content,
        rating: testimonial.rating,
        avatar: testimonial.avatar,
      });
      results.push(result);
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonials seeded successfully',
      data: results,
    });
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error seeding testimonials',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
