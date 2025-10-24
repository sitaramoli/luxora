import { type NextRequest, NextResponse } from 'next/server';

import { getHighestRatedTestimonials } from '@/lib/services/testimonials';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const testimonials = await getHighestRatedTestimonials(limit);

    return NextResponse.json({
      success: true,
      data: testimonials,
      count: testimonials.length,
    });
  } catch (error) {
    console.error('Error fetching highest rated testimonials:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching testimonials',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
