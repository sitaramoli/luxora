import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenvConfig({ path: resolve(process.cwd(), '.env.local') });

// Direct database imports to avoid alias path issues
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { collections, collectionItems, products, users } from '../database/schema';
import { eq } from 'drizzle-orm';

// Create direct database connection
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle({ client: sql });

async function seedCollections() {
  try {
    console.log('🌱 Starting collections seeding...');

    // First, get an admin user to assign as creator
    const adminUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, 'ADMIN'))
      .limit(1);

    if (!adminUser.length) {
      throw new Error('No admin user found. Please create an admin user first.');
    }

    const createdBy = adminUser[0].id;

    // Get some existing products to add to collections
    const existingProducts = await db
      .select({ id: products.id })
      .from(products)
      .limit(10);

    console.log(`Found ${existingProducts.length} products to use in collections`);

    // Sample collections data
    const sampleCollections = [
      {
        name: 'Spring Elegance 2024',
        slug: 'spring-elegance-2024',
        description: 'Discover the latest spring collection featuring vibrant colors and flowing silhouettes that capture the essence of renewal and sophistication. Each piece is carefully selected to embody the fresh energy of the season while maintaining timeless elegance.',
        shortDescription: 'Vibrant spring pieces with flowing silhouettes and fresh sophistication.',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
        coverImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80',
        season: 'SPRING',
        year: '2024',
        status: 'ACTIVE',
        isFeatured: true,
        isNew: true,
        displayOrder: 10,
        metaTitle: 'Spring Elegance 2024 - Luxury Spring Collection | Luxora',
        metaDescription: 'Discover our exclusive Spring Elegance 2024 collection featuring vibrant colors and sophisticated designs from the world\'s finest luxury brands.',
        tags: ['spring', 'elegant', 'vibrant', 'sophisticated', 'luxury'],
        priceRangeMin: 500,
        priceRangeMax: 5000,
        createdBy,
      },
      {
        name: 'Timeless Classics',
        slug: 'timeless-classics',
        description: 'Iconic pieces that never go out of style, curated from the world\'s finest brands. This collection celebrates enduring design and exceptional craftsmanship that transcends seasonal trends, ensuring each piece remains relevant and beautiful for years to come.',
        shortDescription: 'Iconic pieces that never go out of style from the world\'s finest brands.',
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
        coverImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80',
        season: 'ALL_SEASON',
        year: '2024',
        status: 'ACTIVE',
        isFeatured: true,
        isNew: false,
        displayOrder: 9,
        metaTitle: 'Timeless Classics - Eternal Luxury Collection | Luxora',
        metaDescription: 'Shop our Timeless Classics collection featuring iconic luxury pieces from Hermès, Chanel, and Cartier that never go out of style.',
        tags: ['timeless', 'classic', 'iconic', 'luxury', 'heritage'],
        priceRangeMin: 1000,
        priceRangeMax: 15000,
        createdBy,
      },
      {
        name: 'Evening Glamour',
        slug: 'evening-glamour',
        description: 'Sophisticated evening wear for the most exclusive occasions. From red carpet events to intimate soirées, this collection ensures you make an unforgettable impression with every appearance. Each piece embodies luxury and refinement.',
        shortDescription: 'Sophisticated evening wear for exclusive occasions and special events.',
        image: 'https://images.unsplash.com/photo-1566479179817-c0adf69c6f6c?w=800&q=80',
        coverImage: 'https://images.unsplash.com/photo-1566479179817-c0adf69c6f6c?w=1600&q=80',
        season: 'ALL_SEASON',
        year: '2024',
        status: 'ACTIVE',
        isFeatured: false,
        isNew: false,
        displayOrder: 8,
        metaTitle: 'Evening Glamour Collection - Luxury Evening Wear | Luxora',
        metaDescription: 'Discover sophisticated evening wear from Versace, Valentino, and Tom Ford. Perfect for red carpet events and exclusive occasions.',
        tags: ['evening', 'glamour', 'sophisticated', 'formal', 'luxury'],
        priceRangeMin: 2000,
        priceRangeMax: 8000,
        createdBy,
      },
      {
        name: 'Summer Luxe 2024',
        slug: 'summer-luxe-2024',
        description: 'Light, airy pieces perfect for summer sophistication. This collection celebrates the season with breathable fabrics, vibrant colors, and effortless elegance that transitions seamlessly from day to night.',
        shortDescription: 'Light, airy pieces perfect for summer sophistication and comfort.',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
        coverImage: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600&q=80',
        season: 'SUMMER',
        year: '2024',
        status: 'ACTIVE',
        isFeatured: false,
        isNew: true,
        displayOrder: 7,
        metaTitle: 'Summer Luxe 2024 - Light & Sophisticated Summer Collection | Luxora',
        metaDescription: 'Shop our Summer Luxe 2024 collection featuring light, airy pieces from Gucci, Prada, and Bottega Veneta perfect for summer elegance.',
        tags: ['summer', 'luxe', 'light', 'airy', 'sophisticated'],
        priceRangeMin: 400,
        priceRangeMax: 3500,
        createdBy,
      },
      {
        name: 'Heritage Collection',
        slug: 'heritage-collection',
        description: 'Celebrating the rich heritage and craftsmanship of luxury fashion. This collection honors the traditional techniques and timeless designs that have defined luxury for generations, featuring pieces from heritage houses.',
        shortDescription: 'Celebrating rich heritage and traditional craftsmanship in luxury fashion.',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
        coverImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80',
        season: 'ALL_SEASON',
        year: '2024',
        status: 'ACTIVE',
        isFeatured: true,
        isNew: false,
        displayOrder: 6,
        metaTitle: 'Heritage Collection - Traditional Luxury Craftsmanship | Luxora',
        metaDescription: 'Explore our Heritage Collection celebrating traditional luxury craftsmanship from Burberry, Louis Vuitton, and Hermès.',
        tags: ['heritage', 'traditional', 'craftsmanship', 'luxury', 'timeless'],
        priceRangeMin: 800,
        priceRangeMax: 12000,
        createdBy,
      },
      {
        name: 'Modern Minimalism',
        slug: 'modern-minimalism',
        description: 'Clean lines and contemporary design for the modern luxury consumer. This collection embraces the beauty of simplicity, featuring pieces that make a statement through their refined restraint and exceptional quality.',
        shortDescription: 'Clean lines and contemporary design for modern luxury consumers.',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
        coverImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
        season: 'ALL_SEASON',
        year: '2024',
        status: 'ACTIVE',
        isFeatured: false,
        isNew: true,
        displayOrder: 5,
        metaTitle: 'Modern Minimalism - Contemporary Luxury Design | Luxora',
        metaDescription: 'Discover our Modern Minimalism collection featuring clean lines and contemporary designs from Jil Sander, The Row, and Lemaire.',
        tags: ['modern', 'minimalism', 'contemporary', 'clean', 'refined'],
        priceRangeMin: 600,
        priceRangeMax: 4000,
        createdBy,
      },
      {
        name: 'Winter Elegance 2024',
        slug: 'winter-elegance-2024',
        description: 'Luxurious pieces to elevate your winter wardrobe with warmth and sophistication. Rich textures, deep colors, and exceptional craftsmanship define this collection designed for the discerning winter connoisseur.',
        shortDescription: 'Luxurious winter pieces combining warmth with sophisticated style.',
        image: 'https://images.unsplash.com/photo-1544957992-20327b90d2fd?w=800&q=80',
        coverImage: 'https://images.unsplash.com/photo-1544957992-20327b90d2fd?w=1600&q=80',
        season: 'WINTER',
        year: '2024',
        status: 'ACTIVE',
        isFeatured: true,
        isNew: false,
        displayOrder: 4,
        metaTitle: 'Winter Elegance 2024 - Luxury Winter Collection | Luxora',
        metaDescription: 'Explore our Winter Elegance collection featuring luxurious winter pieces with rich textures and sophisticated designs.',
        tags: ['winter', 'elegance', 'warm', 'sophisticated', 'luxury'],
        priceRangeMin: 800,
        priceRangeMax: 6000,
        createdBy,
      },
      {
        name: 'Autumn Harvest',
        slug: 'autumn-harvest',
        description: 'Rich, earthy tones and textures inspired by the beauty of fall. This collection captures the essence of autumn with warm colors, luxurious materials, and designs that reflect the season\'s natural elegance.',
        shortDescription: 'Rich autumn tones and textures inspired by the beauty of fall.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80',
        season: 'FALL',
        year: '2024',
        status: 'DRAFT',
        isFeatured: false,
        isNew: true,
        displayOrder: 3,
        metaTitle: 'Autumn Harvest - Fall Luxury Collection | Luxora',
        metaDescription: 'Discover our Autumn Harvest collection featuring rich, earthy tones and luxurious textures perfect for fall.',
        tags: ['autumn', 'harvest', 'earthy', 'warm', 'textures'],
        priceRangeMin: 700,
        priceRangeMax: 4500,
        createdBy,
      }
    ];

    // Insert collections
    console.log('📦 Inserting collections...');
    const insertedCollections = await db
      .insert(collections)
      .values(sampleCollections)
      .returning({ id: collections.id, name: collections.name });

    console.log(`✅ Inserted ${insertedCollections.length} collections:`);
    insertedCollections.forEach(collection => {
      console.log(`  - ${collection.name} (${collection.id})`);
    });

    // Add some products to collections if we have products available
    if (existingProducts.length > 0) {
      console.log('🔗 Adding products to collections...');
      
      const collectionItemsToInsert = [];
      
      // Add products to each collection (distribute products across collections)
      for (let i = 0; i < insertedCollections.length && i < existingProducts.length; i++) {
        const collection = insertedCollections[i];
        const productsForCollection = existingProducts.slice(
          Math.floor(i * existingProducts.length / insertedCollections.length),
          Math.floor((i + 1) * existingProducts.length / insertedCollections.length) || existingProducts.length
        );

        for (let j = 0; j < productsForCollection.length; j++) {
          collectionItemsToInsert.push({
            collectionId: collection.id,
            productId: productsForCollection[j].id,
            displayOrder: j,
            isHighlighted: j === 0, // Highlight the first product in each collection
            addedBy: createdBy,
          });
        }
      }

      if (collectionItemsToInsert.length > 0) {
        await db.insert(collectionItems).values(collectionItemsToInsert);
        console.log(`✅ Added ${collectionItemsToInsert.length} product-collection relationships`);
      }
    }

    console.log('🎉 Collections seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`  - Collections created: ${insertedCollections.length}`);
    console.log(`  - Featured collections: ${sampleCollections.filter(c => c.isFeatured).length}`);
    console.log(`  - Active collections: ${sampleCollections.filter(c => c.status === 'ACTIVE').length}`);
    console.log(`  - Draft collections: ${sampleCollections.filter(c => c.status === 'DRAFT').length}`);
    
    // Display collections by season
    const seasons = ['SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL_SEASON'];
    seasons.forEach(season => {
      const seasonCollections = sampleCollections.filter(c => c.season === season);
      if (seasonCollections.length > 0) {
        console.log(`  - ${season.replace('_', ' ')} collections: ${seasonCollections.length}`);
      }
    });

  } catch (error) {
    console.error('❌ Error seeding collections:', error);
    throw error;
  }
}

// Only run if called directly
if (require.main === module) {
  seedCollections()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedCollections };