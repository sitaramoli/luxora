"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  Users,
  Globe,
  Shield,
  Heart,
  Star,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { platformInfo } from "@/constants";

const AboutPage: React.FC = () => {
  const stats = [
    { label: "Luxury Brands", value: "500+", icon: Award },
    { label: "Happy Customers", value: "50K+", icon: Users },
    { label: "Countries Served", value: "25+", icon: Globe },
    { label: "Years of Excellence", value: "15+", icon: Star },
  ];

  const values = [
    {
      icon: Shield,
      title: "Authenticity Guaranteed",
      description:
        "Every item is verified by our expert team to ensure 100% authenticity.",
    },
    {
      icon: Heart,
      title: "Curated Excellence",
      description:
        "Our team of luxury experts handpicks every item in our collection.",
    },
    {
      icon: Users,
      title: "Customer First",
      description:
        "We provide personalized service and support for every customer.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Bringing luxury fashion from around the world to your doorstep.",
    },
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      image:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Former luxury retail executive with 20+ years of experience in high-end fashion.",
    },
    {
      name: "Marcus Rodriguez",
      role: "Chief Technology Officer",
      image:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Technology leader passionate about creating seamless luxury shopping experiences.",
    },
    {
      name: "Elena Volkov",
      role: "Head of Curation",
      image:
        "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Former fashion editor with an eye for timeless elegance and emerging trends.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="About LUXE"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl font-bold mb-4">About Luxora</h1>
            <p className="text-xl">
              Redefining luxury e-commerce through authenticity, curation, and
              exceptional service
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Founded in 2025, Luxora began as a vision to democratize access to
            authentic luxury fashion. We believe that everyone deserves to
            experience the craftsmanship, heritage, and beauty of the world's
            finest brands. Today, we're the premier destination for luxury
            fashion, connecting discerning customers with prestigious brands
            from around the globe.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our platform brings together carefully vetted luxury vendors,
            ensuring that every piece in our collection meets the highest
            standards of quality and authenticity. From timeless classics to
            cutting-edge contemporary designs, Luxora is where luxury meets
            accessibility.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="w-24 h-24 relative mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{member.role}</p>
                  <p className="text-sm text-gray-700">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gray-50 rounded-2xl p-12 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              "To make authentic luxury fashion accessible to everyone, while
              supporting the world's finest brands and artisans. We believe
              luxury should be about quality, craftsmanship, and timeless
              beauty—not exclusivity."
            </p>
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Get in Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">{platformInfo.contact.email}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">{platformInfo.contact.phone}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">{platformInfo.contact.address}</p>
            </div>
          </div>
          <Link href="/contact">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
              Contact Us
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
