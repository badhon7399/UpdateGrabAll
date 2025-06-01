const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected for seeding'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Sample product data with realistic images
const dummyProducts = [
  // Electronics Category
  {
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    description: 'Experience crystal-clear sound with these premium wireless headphones. Features active noise cancellation, 30-hour battery life, and comfortable over-ear design.',
    price: 12999,
    discountedPrice: 9999,
    images: [
      {
        public_id: 'products/headphones1',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format'
      },
      {
        public_id: 'products/headphones2',
        url: 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500&auto=format'
      }
    ],
    brand: 'SoundMaster',
    stock: 50,
    featured: true,
    shipping: 0,
    deliveryTime: '2-3 business days',
    specifications: [
      { key: 'Battery Life', value: '30 hours' },
      { key: 'Connectivity', value: 'Bluetooth 5.0' },
      { key: 'Noise Cancellation', value: 'Active' }
    ]
  },
  {
    name: 'Ultra HD Smart TV 55"',
    slug: 'ultra-hd-smart-tv-55-inch',
    description: 'Transform your home entertainment with this 55-inch Ultra HD Smart TV. Features AI-powered picture quality enhancement, built-in streaming apps, and voice control.',
    price: 75999,
    discountedPrice: 67999,
    images: [
      {
        public_id: 'products/tv1',
        url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&auto=format'
      }
    ],
    brand: 'VisionTech',
    stock: 25,
    featured: true,
    shipping: 1200,
    deliveryTime: '3-5 business days',
    specifications: [
      { key: 'Resolution', value: '4K Ultra HD' },
      { key: 'Screen Size', value: '55 inches' },
      { key: 'Smart Features', value: 'Built-in streaming, Voice control' }
    ]
  },
  {
    name: 'Professional DSLR Camera',
    slug: 'professional-dslr-camera',
    description: 'Capture stunning photos and videos with this professional-grade DSLR camera. Includes 24.2MP sensor, 4K video recording, and advanced autofocus system.',
    price: 89999,
    discountedPrice: 84999,
    images: [
      {
        public_id: 'products/camera1',
        url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format'
      },
      {
        public_id: 'products/camera2',
        url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format'
      }
    ],
    brand: 'PhotoPro',
    stock: 15,
    featured: false,
    shipping: 0,
    deliveryTime: '2-3 business days',
    specifications: [
      { key: 'Sensor', value: '24.2MP APS-C CMOS' },
      { key: 'Video', value: '4K UHD' },
      { key: 'Connectivity', value: 'Wi-Fi, Bluetooth, USB-C' }
    ]
  },
  
  // Fashion Category
  {
    name: 'Premium Leather Wallet',
    slug: 'premium-leather-wallet',
    description: 'Handcrafted genuine leather wallet with multiple card slots and RFID protection. Perfect blend of style and functionality for the modern gentleman.',
    price: 2499,
    discountedPrice: 1999,
    images: [
      {
        public_id: 'products/wallet1',
        url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format'
      }
    ],
    brand: 'LeatherCraft',
    stock: 100,
    featured: false,
    shipping: 0,
    deliveryTime: '1-2 business days',
    specifications: [
      { key: 'Material', value: 'Genuine Leather' },
      { key: 'Card Slots', value: '8' },
      { key: 'Features', value: 'RFID Protection' }
    ]
  },
  {
    name: 'Designer Sunglasses',
    slug: 'designer-sunglasses',
    description: 'Stylish designer sunglasses with UV protection and polarized lenses. Lightweight frame and elegant design make these perfect for any occasion.',
    price: 4999,
    discountedPrice: 3999,
    images: [
      {
        public_id: 'products/sunglasses1',
        url: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&auto=format'
      }
    ],
    brand: 'VisionStyle',
    stock: 75,
    featured: true,
    shipping: 0,
    deliveryTime: '1-2 business days',
    specifications: [
      { key: 'Protection', value: 'UV400' },
      { key: 'Lens', value: 'Polarized' },
      { key: 'Frame', value: 'Lightweight Metal' }
    ]
  },
  
  // Home & Kitchen Category
  {
    name: 'Smart Coffee Maker',
    slug: 'smart-coffee-maker',
    description: 'Programmable smart coffee maker with app control, customizable brewing options, and built-in grinder. Start your day with the perfect cup of coffee.',
    price: 7999,
    discountedPrice: 6499,
    images: [
      {
        public_id: 'products/coffeemaker1',
        url: 'https://images.unsplash.com/photo-1517914309481-a3d6f3c03b0e?w=500&auto=format'
      }
    ],
    brand: 'HomeComfort',
    stock: 30,
    featured: true,
    shipping: 300,
    deliveryTime: '2-4 business days',
    specifications: [
      { key: 'Capacity', value: '12 cups' },
      { key: 'Features', value: 'App control, Built-in grinder' },
      { key: 'Programmable', value: 'Yes' }
    ]
  },
  {
    name: 'Premium Knife Set',
    slug: 'premium-knife-set',
    description: 'Professional-grade 15-piece knife set with German stainless steel blades and ergonomic handles. Includes wooden block for safe storage.',
    price: 9999,
    discountedPrice: 7999,
    images: [
      {
        public_id: 'products/knifeset1',
        url: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&auto=format'
      }
    ],
    brand: 'ChefElite',
    stock: 20,
    featured: false,
    shipping: 0,
    deliveryTime: '2-3 business days',
    specifications: [
      { key: 'Pieces', value: '15' },
      { key: 'Material', value: 'German Stainless Steel' },
      { key: 'Includes', value: 'Wooden Storage Block' }
    ]
  },
  
  // Beauty Category
  {
    name: 'Luxury Skincare Set',
    slug: 'luxury-skincare-set',
    description: 'Complete luxury skincare regimen with cleanser, toner, serum, and moisturizer. Made with natural ingredients for all skin types.',
    price: 5999,
    discountedPrice: 4999,
    images: [
      {
        public_id: 'products/skincare1',
        url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format'
      }
    ],
    brand: 'NaturalGlow',
    stock: 40,
    featured: true,
    shipping: 0,
    deliveryTime: '1-2 business days',
    specifications: [
      { key: 'Skin Type', value: 'All Types' },
      { key: 'Ingredients', value: 'Natural, Paraben-free' },
      { key: 'Includes', value: 'Cleanser, Toner, Serum, Moisturizer' }
    ]
  }
];

// Sample categories
const dummyCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and electronic devices',
    image: {
      public_id: 'categories/electronics',
      url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format'
    },
    featured: true,
    icon: 'fa-mobile-alt'
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy clothing and accessories',
    image: {
      public_id: 'categories/fashion',
      url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format'
    },
    featured: true,
    icon: 'fa-tshirt'
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Everything for your home and kitchen',
    image: {
      public_id: 'categories/home',
      url: 'https://images.unsplash.com/photo-1556911220-bda9f7f7597e?w=500&auto=format'
    },
    featured: true,
    icon: 'fa-home'
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    description: 'Skincare, makeup, and beauty products',
    image: {
      public_id: 'categories/beauty',
      url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format'
    },
    featured: true,
    icon: 'fa-spa'
  }
];

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    
    console.log('Previous data cleared');
    
    // Find admin user (or create one if doesn't exist)
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('No admin user found, creating one...');
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@graball.com',
        password: 'password123',
        phone: '+8801712345678',
        role: 'admin'
      });
    }
    
    // Insert categories
    const categories = await Category.insertMany(dummyCategories);
    console.log(`${categories.length} categories added`);
    
    // Map category names to IDs
    const categoryMap = {};
    categories.forEach(category => {
      categoryMap[category.name] = category._id;
    });
    
    // Assign categories to products
    const productsWithCategories = dummyProducts.map(product => {
      let categoryId;
      
      if (product.name.includes('Headphones') || product.name.includes('TV') || product.name.includes('Camera')) {
        categoryId = categoryMap['Electronics'];
      } else if (product.name.includes('Wallet') || product.name.includes('Sunglasses')) {
        categoryId = categoryMap['Fashion'];
      } else if (product.name.includes('Coffee') || product.name.includes('Knife')) {
        categoryId = categoryMap['Home & Kitchen'];
      } else if (product.name.includes('Skincare')) {
        categoryId = categoryMap['Beauty'];
      } else {
        // Default to Electronics if no match
        categoryId = categoryMap['Electronics'];
      }
      
      return {
        ...product,
        category: categoryId,
        user: adminUser._id
      };
    });
    
    // Insert products
    const insertedProducts = await Product.insertMany(productsWithCategories);
    console.log(`${insertedProducts.length} products added`);
    
    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
