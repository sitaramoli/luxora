import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
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

const Testimonials = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600">
            Trusted by luxury enthusiasts worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  &#34;{testimonial.content}&#34;
                </p>
                <div className="flex items-center">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
