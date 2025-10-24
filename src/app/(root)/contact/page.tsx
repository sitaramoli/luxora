'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, Send, MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { platformInfo } from '@/constants';
import { contactSchema } from '@/lib/validations';

type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Contact form submitted:', data);
      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      contact: platformInfo.contact.email,
      availability: '24/7 Response',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak with our team',
      contact: platformInfo.contact.phone,
      availability: 'Mon-Fri 9AM-6PM EST',
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with an agent',
      contact: 'Available on website',
      availability: 'Mon-Fri 9AM-9PM EST',
    },
  ];

  const categories = [
    'General Inquiry',
    'Order Support',
    'Product Information',
    'Shipping & Delivery',
    'Returns & Exchanges',
    'Technical Support',
    'Partnership Inquiry',
    'Press & Media',
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Message Sent!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for contacting us. We'll get back to you within 24
              hours.
            </p>
            <Button onClick={() => setIsSubmitted(false)} className="w-full">
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We're here to help with any questions about our luxury products and
            services
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>
            <div className="space-y-6">
              {contactMethods.map(
                (
                  { icon: Icon, title, description, availability, contact },
                  index
                ) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Icon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {description}
                          </p>
                          <p className="font-medium text-black">{contact}</p>
                          <p className="text-xs text-gray-500">
                            {availability}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        {...register('name')}
                        id="name"
                        placeholder="Enter your full name"
                        className={errors.name ? 'border-red-300' : ''}
                      />
                      {errors.name && (
                        <p className="text-red-600 text-sm">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        {...register('email')}
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className={errors.email ? 'border-red-300' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        onValueChange={value => setValue('category', value)}
                      >
                        <SelectTrigger
                          className={errors.category ? 'border-red-300' : ''}
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem
                              key={category}
                              value={category
                                .toLowerCase()
                                .replace(/\s+/g, '-')}
                            >
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-red-600 text-sm">
                          {errors.category.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        {...register('subject')}
                        id="subject"
                        placeholder="Brief description of your inquiry"
                        className={errors.subject ? 'border-red-300' : ''}
                      />
                      {errors.subject && (
                        <p className="text-red-600 text-sm">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      {...register('message')}
                      id="message"
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                      className={errors.message ? 'border-red-300' : ''}
                    />
                    {errors.message && (
                      <p className="text-red-600 text-sm">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white hover:bg-gray-800"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: 'How do I track my order?',
                answer:
                  'You can track your order by logging into your account and visiting the Orders section, or by using the tracking number sent to your email.',
              },
              {
                question: 'What is your return policy?',
                answer:
                  'We offer a 30-day return policy for all items in original condition. Returns are free for defective items.',
              },
              {
                question: 'Do you ship internationally?',
                answer:
                  'Yes, we ship to over 25 countries worldwide. International shipping rates and delivery times vary by location.',
              },
              {
                question: 'How do I become a merchant?',
                answer:
                  'You can apply to become a merchant by submitting an application through our merchant portal. Our team will review your' +
                  ' application' +
                  ' within 5-7 business days.',
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
