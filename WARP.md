# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Luxora is a Next.js 15-based luxury e-commerce platform built with TypeScript, featuring a multi-tenant architecture supporting customers, merchants, and admin users. It uses modern technologies including Drizzle ORM with PostgreSQL, NextAuth.js for authentication, and shadcn/ui components.

## Development Commands

### Core Development

```bash
# Start development server with Turbopack (fastest)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Code Quality

```bash
# Run linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Type checking without building
npm run type-check

# Bundle analysis
npm run analyze
```

### Database Operations

```bash
# Generate new migration from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Push schema directly to database (dev only)
npm run db:push

# Open Drizzle Studio for database management
npm run db:studio
```

## Architecture Overview

### App Router Structure

The project uses Next.js 15 App Router with a sophisticated route organization:

- `(auth)/` - Authentication pages (sign-in, sign-up)
- `(root)/` - Main customer-facing pages with shared layout
- `admin/` - Admin dashboard with role-based access
- `merchant/` - Merchant dashboard for inventory and order management
- `api/` - API routes for authentication and server actions

### Database Schema (Drizzle ORM)

The schema is defined in `src/database/schema.ts` with these key entities:

- **Users**: Multi-role system (CUSTOMER, ADMIN, MERCHANT)
- **Merchants**: Business accounts with detailed profiles
- **Products**: Full e-commerce product catalog with variants
- **Orders/OrderItems**: Complete order management system
- **Carts/CartItems**: Shopping cart implementation

Key enums: `USER_ROLE_ENUM`, `ORDER_STATUS_ENUM`, `PRODUCT_STATUS_ENUM`, `ACCOUNT_STATUS_ENUM`

### Authentication System

- **Framework**: NextAuth.js v5 (beta) with JWT strategy
- **Provider**: Credentials-based authentication with bcrypt
- **Session Management**: Configurable session duration with "remember me"
- **Role-based Access**: Integrated with database user roles

### Component Architecture

#### UI Components (shadcn/ui)

- **Style**: "new-york" variant with neutral base color
- **Location**: `src/components/ui/`
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with CSS variables

#### Business Components

- **Admin Components**: `src/components/admin/` - Dashboard and management
- **Merchant Components**: `src/components/merchant/` - Inventory management
- **Shared Components**: Product cards, brand cards, headers, etc.

### Services Layer

Business logic is organized in `src/lib/services/`:

- `users.ts` - User management operations
- `products.ts` - Product catalog operations
- `merchants.ts` - Merchant management
- `orders.ts` - Order processing

### Performance Monitoring

The application includes built-in performance monitoring in `src/lib/performance.ts` with database query tracking through `dbWithMonitoring` wrapper.

## Environment Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# ImageKit (Image CDN)
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/..."
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="..."
IMAGEKIT_PRIVATE_KEY="..."

# API Endpoints
NEXT_PUBLIC_API_ENDPOINT="http://localhost:3000/"
NEXT_PUBLIC_PROD_API_ENDPOINT="..."

# Upstash Redis (Caching/Rate Limiting)
UPSTASH_REDIS_URL="..."
UPSTASH_REDIS_TOKEN="..."

# Qstash (Background Jobs)
QSTASH_URL="..."
QSTASH_TOKEN="..."

# Email (Resend)
RESEND_TOKEN="..."
```

## Development Patterns

### Database Operations

- Use `dbWithMonitoring.execute()` for performance-tracked queries
- Follow Drizzle ORM patterns with proper relations
- Implement optimistic updates where appropriate
- Use database indexes for frequently queried fields

### File Upload System

- ImageKit integration for optimized image delivery
- WebP/AVIF format support with fallbacks
- Configurable device sizes and image dimensions
- File upload component in `src/components/FileUpload.tsx`

### State Management

- Server Components for data fetching
- Server Actions for mutations
- React Hook Form with Zod validation
- Optimistic UI updates where appropriate

### Error Handling

- Comprehensive form validation with Zod schemas
- Toast notifications using Sonner
- Performance monitoring for database operations
- Rate limiting with Upstash Redis

## Testing & Development

### Database Development

1. Make schema changes in `src/database/schema.ts`
2. Generate migration: `npm run db:generate`
3. Review migration files in `./migrations/`
4. Apply migration: `npm run db:migrate`
5. Use Drizzle Studio for data inspection: `npm run db:studio`

### Component Development

- Follow shadcn/ui patterns for new components
- Use TypeScript strictly with proper type definitions
- Implement proper loading and error states
- Consider performance implications (use React.memo when needed)

### Role-Based Feature Development

When developing features that involve different user roles:

1. Check user role in page components using `auth()`
2. Implement role-based routing in middleware if needed
3. Use proper TypeScript types for role-specific data
4. Test with different user roles (customer, merchant, admin)

## Performance Considerations

### Next.js Optimizations

- Turbopack enabled for faster development builds
- Bundle splitting configured for vendors and UI components
- Image optimization with multiple formats and sizes
- Server-side rendering with proper caching headers

### Database Optimizations

- Indexed frequently queried columns (user_id, status, created_at)
- Connection pooling with Neon serverless
- Performance monitoring wrapper for query tracking
- Proper use of select queries with limits

### Caching Strategy

- Redis integration for rate limiting and caching
- Static generation for public pages when possible
- Image CDN with optimized delivery
- Bundle optimization with tree shaking

## Common Development Tasks

### Adding a New Product Feature

1. Update `products` schema if needed
2. Add migration: `npm run db:generate && npm run db:migrate`
3. Update TypeScript types in schema file
4. Modify product service in `src/lib/services/products.ts`
5. Update UI components in `src/components/ProductCard.tsx` or related

### Adding Authentication Route

1. Create page in appropriate auth group: `src/app/(auth)/`
2. Implement server action if needed
3. Update NextAuth configuration in `src/auth.ts`
4. Test with different user states

### Adding Admin Feature

1. Create page in `src/app/admin/`
2. Implement role check in page component
3. Update admin sidebar navigation
4. Add proper TypeScript types for admin-specific data
