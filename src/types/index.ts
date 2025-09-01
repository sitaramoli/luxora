export interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  rememberMe?: boolean;
}

export type AccountStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "UNDER_REVIEW";
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";
export type UserRole = "CUSTOMER" | "ADMIN" | "MERCHANT";

export interface Brand {
  slug: string;
  name: string;
  description: string;
  about: string;
  category: string;
  coverPhoto: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  isVerified: boolean;
  founded: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  isNew: boolean;
  isSale: boolean;
  description: string;
  features: string[];
  images: string[];
  sizes: string[];
  colors: { name: string; value: string }[];
  inStock: boolean;
  stockCount: number;
  slug: string;
}

export interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: string;
  paymentId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  brandId: string;
  quantity: number;
  price: string;
  total: string;
  color: string | null;
  size: string | null;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  selectedColor: string | null;
  selectedSize: string | null;
}

export interface Wishlist {
  id: string;
  items: WishlistItem[];
  total: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
}

export interface Review {
  id: number;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

export interface RecentOrder {
  id: string;
  name: string;
  date: string;
  status:
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";
  total: number;
  items: number;
  brand: string;
}

export interface Address {
  id: string;
  type: "home" | "work" | "other";
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  image: string | null;
  role: "CUSTOMER" | "ADMIN" | "MERCHANT";
  createdAt: Date | string;
  gender: "MALE" | "FEMALE" | "OTHER";
  isVerified: boolean;
  phone: string | null;
}

export interface Merchant {
  id: string;
  name: string;
  email: string;
  category: string;
  status: "ACTIVE" | "PENDING" | "UNDER_REVIEW" | "SUSPENDED";
  createdAt: string;
  totalProducts: number;
  totalSales: string;
  rating: number;
  verified: boolean;
  description: string;
  website: string;
  phone: string;
  address: string;
  commission: number;
  lastActive: string;
}
