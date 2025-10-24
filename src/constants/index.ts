export const platformInfo = {
  name: 'Luxora',
  logo: '/images/logo.png',
  description:
    "Discover the world's most luxurious fashion brands and collections.",
  socialLinks: {
    facebook: 'https://www.facebook.com/luxora',
    instagram: 'https://www.instagram.com/luxora',
    twitter: 'https://twitter.com/luxora',
    youtube: 'https://www.youtube.com/channel/luxora',
  },
  contact: {
    email: 'contact@luxora.com',
    phone: '+1 (123) 456-7890',
    address: '123 Main Street, City, Country',
  },
};

export const navItems = [
  { href: '/', label: 'Home' },
  { href: '/brands', label: 'Brands' },
  { href: '/products', label: 'Products' },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
];

export const quickLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/careers', label: 'Careers' },
  { href: '/press', label: 'Press' },
  { href: '/sustainability', label: 'Sustainability' },
];

export const customerService = [
  { href: '/help', label: 'Help Center' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/shipping', label: 'Shipping Info' },
  { href: '/returns', label: 'Returns' },
  { href: '/size-guide', label: 'Size Guide' },
];

export const legal = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/cookies', label: 'Cookie Policy' },
  { href: '/accessibility', label: 'Accessibility' },
];

export const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'France',
  'Germany',
  'Italy',
  'Spain',
  'Japan',
];

export const emailNotifications = [
  {
    key: 'newsletter',
    label: 'Newsletter',
    description: 'Weekly updates and luxury fashion news',
  },
  {
    key: 'promotions',
    label: 'Promotions',
    description: 'Special offers and exclusive deals',
  },
  {
    key: 'orderUpdates',
    label: 'Order Updates',
    description: 'Shipping and delivery notifications',
  },
  {
    key: 'newArrivals',
    label: 'New Arrivals',
    description: 'Latest products from your favorite brands',
  },
  {
    key: 'priceDrops',
    label: 'Price Drops',
    description: 'Notifications when items go on sale',
  },
];

// TODO: Fetch brands from API
export const brands = [
  { name: 'Chanel', slug: 'chanel' },
  { name: 'Gucci', slug: 'gucci' },
  { name: 'Prada', slug: 'prada' },
  { name: 'Versace', slug: 'versace' },
  { name: 'Dior', slug: 'dior' },
];

// TODO: Fetch featured brands from API
export const featuredBrands = [
  {
    id: '1',
    name: 'Chanel',
    description: 'Timeless elegance and sophisticated luxury fashion.',
    image:
      'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 245,
    category: 'Fashion',
    isVerified: true,
  },
  {
    id: '2',
    name: 'Gucci',
    description: 'Italian luxury fashion house known for leather goods.',
    image:
      'https://images.pexels.com/photos/1188748/pexels-photo-1188748.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 189,
    category: 'Fashion',
    isVerified: true,
  },
  {
    id: '3',
    name: 'Rolex',
    description: 'Swiss luxury watch manufacturer with prestigious heritage.',
    image:
      'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 67,
    category: 'Watches',
    isVerified: true,
  },
];

export const featuredProducts = [
  {
    id: '1',
    name: 'Silk Evening Gown',
    brand: 'Versace',
    price: 2850,
    originalPrice: 3200,
    image:
      'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.8,
    reviewCount: 124,
    category: 'Dresses',
    isNew: false,
    isSale: true,
  },
  {
    id: '2',
    name: 'Leather Handbag',
    brand: 'Hermès',
    price: 4200,
    image:
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.9,
    reviewCount: 87,
    category: 'Bags',
    isNew: true,
    isSale: false,
  },
  {
    id: '3',
    name: 'Diamond Necklace',
    brand: 'Tiffany & Co.',
    price: 8500,
    image:
      'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.7,
    reviewCount: 45,
    category: 'Jewelry',
    isNew: false,
    isSale: false,
  },
  {
    id: '4',
    name: 'Cashmere Coat',
    brand: 'Burberry',
    price: 1890,
    originalPrice: 2100,
    image:
      'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.6,
    reviewCount: 203,
    category: 'Outerwear',
    isNew: true,
    isSale: true,
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Fashion Enthusiast',
    content:
      'LUXE has transformed my shopping experience. The quality and authenticity of every piece is exceptional.',
    rating: 5,
    avatar:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    name: 'Michael Chen',
    role: 'Collector',
    content:
      'The curation is impeccable. I trust LUXE to deliver only the finest luxury items.',
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
