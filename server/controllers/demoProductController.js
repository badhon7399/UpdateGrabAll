const Product = require('../models/product');
const Category = require('../models/category');
const User = require('../models/user');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Seed demo products from the provided images
// @route   POST /api/products/demo
// @access  Private/Admin
exports.seedDemoProducts = asyncHandler(async (req, res) => {
  try {
    // Find admin user
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found. Please create an admin user first.'
      });
    }

    // Ensure categories exist
    const categories = [
      { name: 'Furniture', slug: 'furniture', description: 'Home and office furniture' },
      { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories' },
      { name: 'Office Supplies', slug: 'office-supplies', description: 'Essential items for your office' },
      { name: 'Gifts', slug: 'gifts', description: 'Unique gift items for all occasions' }
    ];

    const categoryIds = {};
    
    for (const category of categories) {
      let cat = await Category.findOne({ name: category.name });
      if (!cat) {
        cat = await Category.create({
          name: category.name,
          slug: category.slug,
          description: category.description,
          user: adminUser._id
        });
      }
      categoryIds[category.name] = cat._id;
    }

    // Demo products data
    const demoProducts = [
      {
        name: 'Portable Laptop Desk',
        slug: 'portable-laptop-desk',
        description: 'Elegant portable laptop desk with foldable legs, perfect for working from bed, couch, or any comfortable spot. Features a sleek black surface with ample space for your laptop, mouse, phone, and even a coffee cup.',
        price: 2499,
        brand: 'ComfortDesk',
        countInStock: 25,
        category: categoryIds['Furniture'],
        images: [
          {
            public_id: 'portable_laptop_desk_1',
            url: 'https://i.imgur.com/RcKQbmE.jpg'
          }
        ],
        rating: 4.5,
        numReviews: 12,
        isFeatured: true,
        isActive: true,
        user: adminUser._id,
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
        slug: 'ske-mini-dc-ups',
        description: 'Reliable mini DC UPS (Uninterruptible Power Supply) for small electronics and network devices. Provides backup power during outages, protecting your devices from sudden shutdowns.',
        price: 3500,
        brand: 'SKE',
        countInStock: 15,
        category: categoryIds['Electronics'],
        images: [
          {
            public_id: 'mini_dc_ups_1',
            url: 'https://i.imgur.com/NPpjchn.jpg'
          }
        ],
        rating: 4.2,
        numReviews: 8,
        isFeatured: true,
        isActive: true,
        user: adminUser._id,
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
        slug: 'casio-fx-991cw-calculator',
        description: 'Advanced scientific calculator with natural textbook display and 552 functions. Perfect for students, engineers and professionals who need reliable calculations.',
        price: 1799,
        brand: 'Casio',
        countInStock: 30,
        category: categoryIds['Office Supplies'],
        images: [
          {
            public_id: 'casio_calculator_1',
            url: 'https://i.imgur.com/7xHsKkJ.jpg'
          }
        ],
        rating: 4.8,
        numReviews: 25,
        isFeatured: true,
        isActive: true,
        user: adminUser._id,
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
        slug: 'personalized-led-night-light',
        description: 'Custom LED night light with personalized names and a heart symbol. Perfect romantic gift for anniversaries, Valentine\'s Day, or birthdays. Creates a warm, intimate atmosphere with its soft glow.',
        price: 1299,
        brand: 'LoveLight',
        countInStock: 20,
        category: categoryIds['Gifts'],
        images: [
          {
            public_id: 'led_night_light_1',
            url: 'https://i.imgur.com/I8b5tjE.jpg'
          }
        ],
        rating: 4.7,
        numReviews: 15,
        isFeatured: true,
        isActive: true,
        user: adminUser._id,
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
        slug: 'love-pearl-gift-set',
        description: 'Unique gift featuring a real cultured pearl inside an oyster, with an elegant pendant necklace. Each pearl is unique, symbolizing a one-of-a-kind love or friendship.',
        price: 1999,
        brand: 'Pearl Treasures',
        countInStock: 10,
        category: categoryIds['Gifts'],
        images: [
          {
            public_id: 'love_pearl_1',
            url: 'https://i.imgur.com/a9F4CaH.jpg'
          }
        ],
        rating: 4.6,
        numReviews: 18,
        isFeatured: true,
        isActive: true,
        user: adminUser._id,
        specifications: [
          { key: 'Pearl Size', value: '7-8mm' },
          { key: 'Pearl Color', value: 'White/Cream (natural variations)' },
          { key: 'Chain Length', value: '45cm' },
          { key: 'Material', value: 'Sterling silver chain and pendant cage' },
          { key: 'Package', value: 'Gift box with certificate of authenticity' }
        ]
      }
    ];

    // Create products or update if they already exist
    const results = [];
    for (const product of demoProducts) {
      let existingProduct = await Product.findOne({ slug: product.slug });
      
      if (existingProduct) {
        existingProduct = await Product.findByIdAndUpdate(
          existingProduct._id,
          product,
          { new: true, runValidators: true }
        );
        results.push({ updated: true, product: existingProduct });
      } else {
        const newProduct = await Product.create(product);
        results.push({ created: true, product: newProduct });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Demo products created successfully',
      results
    });
    
  } catch (error) {
    console.error('Error seeding demo products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed demo products',
      error: error.message
    });
  }
});
