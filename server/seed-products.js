// Seed script to create products from images
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product');
const Category = require('./models/category');
const User = require('./models/user');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Find or create admin user
const getAdminUser = async () => {
  try {
    // Try to find an existing admin user
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (adminUser) {
      console.log('Found existing admin user');
      return adminUser._id;
    }
    
    // If no admin exists, create one
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@graball.com',
      password: 'Password123!',
      role: 'admin'
    });
    
    console.log('Created new admin user');
    return adminUser._id;
  } catch (error) {
    console.error('Error finding/creating admin user:', error.message);
    process.exit(1);
  }
};

// Create categories if they don't exist
const ensureCategories = async () => {
  const categories = [
    {
      name: 'Furniture',
      description: 'Home and office furniture',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'
    },
    {
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03'
    },
    {
      name: 'Gifts',
      description: 'Unique gift items for all occasions',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48'
    },
    {
      name: 'Office Supplies',
      description: 'Essential items for your office',
      image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86'
    }
  ];

  const categoryIds = {};
  
  for (const category of categories) {
    const existing = await Category.findOne({ name: category.name });
    if (existing) {
      console.log(`Category ${category.name} already exists`);
      categoryIds[category.name] = existing._id;
    } else {
      const newCategory = await Category.create(category);
      console.log(`Created category: ${newCategory.name}`);
      categoryIds[category.name] = newCategory._id;
    }
  }
  
  return categoryIds;
};

// Product data
const createProducts = async (categoryIds, adminUserId) => {
  const products = [
    {
      name: 'Portable Laptop Desk',
      description: 'Elegant portable laptop desk with foldable legs, perfect for working from bed, couch, or any comfortable spot. Features a sleek black surface with ample space for your laptop, mouse, phone, and even a coffee cup.',
      price: 2499,
      compareAtPrice: 2999,
      brand: 'ComfortDesk',
      countInStock: 25,
      category: categoryIds['Furniture'],
      images: [
        {
          public_id: 'portable_laptop_desk_1',
          url: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7'
        }
      ],
      rating: 4.5,
      numReviews: 12,
      isFeatured: true,
      isActive: true,
      specifications: [
        { key: 'Material', value: 'High-quality MDF with aluminum legs' },
        { key: 'Dimensions', value: '60 × 40 × 28 cm' },
        { key: 'Weight Capacity', value: 'Up to 15kg' },
        { key: 'Foldable', value: 'Yes' },
        { key: 'Color', value: 'Black' }
      ]
    },
    {
      name: 'SKE Mini DC UPS',
      description: 'Reliable mini DC UPS (Uninterruptible Power Supply) for small electronics and network devices. Provides backup power during outages, protecting your devices from sudden shutdowns.',
      price: 3500,
      compareAtPrice: 3999,
      brand: 'SKE',
      countInStock: 15,
      category: categoryIds['Electronics'],
      images: [
        {
          public_id: 'mini_dc_ups_1',
          url: 'https://images.unsplash.com/photo-1603539444875-76e7684265f3'
        }
      ],
      rating: 4.2,
      numReviews: 8,
      isFeatured: true,
      isActive: true,
      specifications: [
        { key: 'Output', value: 'DC 5V/9V/12V' },
        { key: 'Battery Capacity', value: '7800mAh' },
        { key: 'Runtime', value: 'Up to 4 hours (depending on load)' },
        { key: 'Ports', value: '4 DC output ports' },
        { key: 'Protection', value: 'Overcharge, over-discharge, short circuit' }
      ]
    },
    {
      name: 'Casio fx-991CW Scientific Calculator',
      description: 'Advanced scientific calculator with natural textbook display and 552 functions. Perfect for students, engineers and professionals who need reliable calculations.',
      price: 1799,
      compareAtPrice: 1999,
      brand: 'Casio',
      countInStock: 30,
      category: categoryIds['Office Supplies'],
      images: [
        {
          public_id: 'casio_calculator_1',
          url: 'https://images.unsplash.com/photo-1564473185935-b9a17ec36d6b'
        }
      ],
      rating: 4.8,
      numReviews: 25,
      isFeatured: false,
      isActive: true,
      specifications: [
        { key: 'Functions', value: '552 functions' },
        { key: 'Display', value: 'Natural textbook display' },
        { key: 'Power', value: 'Solar + Battery' },
        { key: 'Memory', value: '47 variables' },
        { key: 'Features', value: 'Equation solver, complex number calculations, matrix calculations' }
      ]
    },
    {
      name: 'Personalized LED Night Light',
      description: 'Custom LED night light with personalized names and a heart symbol. Perfect romantic gift for anniversaries, Valentine\'s Day, or birthdays. Creates a warm, intimate atmosphere with its soft glow.',
      price: 1299,
      compareAtPrice: 1599,
      brand: 'LoveLight',
      countInStock: 20,
      category: categoryIds['Gifts'],
      images: [
        {
          public_id: 'led_night_light_1',
          url: 'https://images.unsplash.com/photo-1582478192200-b4bd08b40096'
        }
      ],
      rating: 4.7,
      numReviews: 15,
      isFeatured: true,
      isActive: true,
      specifications: [
        { key: 'Material', value: 'Acrylic and ABS base' },
        { key: 'Power', value: 'USB and battery operated' },
        { key: 'LED Color', value: 'Warm white' },
        { key: 'Customization', value: 'Two names and heart symbol' },
        { key: 'Size', value: '15cm × 10cm × 5cm' }
      ]
    },
    {
      name: 'Love Pearl Gift Set',
      description: 'Unique gift featuring a real cultured pearl inside an oyster, with an elegant pendant necklace. Each pearl is unique, symbolizing a one-of-a-kind love or friendship.',
      price: 1999,
      compareAtPrice: 2499,
      brand: 'Pearl Treasures',
      countInStock: 10,
      category: categoryIds['Gifts'],
      images: [
        {
          public_id: 'love_pearl_1',
          url: 'https://images.unsplash.com/photo-1614246506743-8a589e62af12'
        }
      ],
      rating: 4.6,
      numReviews: 18,
      isFeatured: true,
      isActive: true,
      specifications: [
        { key: 'Pearl Size', value: '7-8mm' },
        { key: 'Pearl Color', value: 'White/Cream (natural variations)' },
        { key: 'Chain Length', value: '45cm' },
        { key: 'Material', value: 'Sterling silver chain and pendant cage' },
        { key: 'Package', value: 'Gift box with certificate of authenticity' }
      ]
    }
  ];

  for (const product of products) {
    const existingProduct = await Product.findOne({ name: product.name });
    if (existingProduct) {
      console.log(`Product "${product.name}" already exists`);
      continue;
    }

    // Generate slug from name
    product.slug = product.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + 
      '-' + Date.now().toString().slice(-4);

    try {
      const newProduct = await Product.create(product);
      console.log(`Created product: ${newProduct.name}`);
    } catch (error) {
      console.error(`Error creating product "${product.name}":`, error.message);
    }
  }
};

// Run the seeding process
const seedProducts = async () => {
  try {
    const adminUserId = await getAdminUser();
    const categoryIds = await ensureCategories();
    await createProducts(categoryIds, adminUserId);
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};

seedProducts();
