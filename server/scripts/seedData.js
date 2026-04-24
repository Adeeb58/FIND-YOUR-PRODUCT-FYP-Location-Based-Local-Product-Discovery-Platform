// server/scripts/seedData.js
// Run this once to seed the MongoDB database with mock data:
//   cd server && node scripts/seedData.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

const seedProducts = [
  { name: 'Organic Fresh Milk', brand: 'Happy Cow Dairies', category: 'Dairy', description: 'Fresh organic milk from grass-fed cows, 1-liter carton. Rich in calcium, protein, and essential vitamins. Locally sourced from certified organic farms.', imageUrl: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=500', tags: ['organic', 'fresh', 'local', 'calcium-rich'] },
  { name: 'Artisan Sourdough Bread', brand: "Baker's Delight", category: 'Bakery', description: 'Hand-kneaded sourdough, baked fresh daily. Perfect for sandwiches and toast. Made with natural fermentation process for authentic flavor.', imageUrl: 'https://images.pexels.com/photos/1756061/pexels-photo-1756061.jpeg?auto=compress&cs=tinysrgb&w=500', tags: ['artisan', 'fresh', 'handmade', 'sourdough'] },
  { name: 'Fresh Hass Avocados (Pack of 3)', brand: 'Green Harvest Farms', category: 'Produce', description: 'Ripe and ready-to-eat Hass avocados, perfect for guacamole and salads. Rich in healthy fats and fiber. Imported from premium farms.', imageUrl: 'https://images.pexels.com/photos/1580984/pexels-photo-1580984.jpeg?auto=compress&cs=tinysrgb&w=500', tags: ['organic', 'fresh', 'ripe', 'healthy'] },
  { name: 'Premium Arabica Coffee Beans', brand: 'Bean Voyage', category: 'Beverages', description: 'Single-origin Arabica beans, medium roast, 250g bag. Rich and aromatic with notes of chocolate and caramel. Perfect for espresso and filter coffee.', imageUrl: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=500', tags: ['premium', 'single-origin', 'arabica', 'medium-roast'] },
  { name: 'Raw Organic Honey', brand: 'Bee Happy Apiary', category: 'Pantry', description: 'Raw, unfiltered organic honey from local wildflowers, 500g jar. Natural antibacterial properties. No processing or heating.', imageUrl: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=500', tags: ['organic', 'raw', 'local', 'unfiltered'] },
  { name: 'Free Range Eggs (Dozen)', brand: 'Farm Fresh', category: 'Dairy', description: 'Farm-fresh free-range eggs from happy hens. Rich in protein and omega-3. No antibiotics or hormones. Grade A quality.', imageUrl: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=500', tags: ['free-range', 'fresh', 'organic', 'protein-rich'] },
  { name: 'Whole Wheat Pasta', brand: 'Pasta Artisan', category: 'Pantry', description: 'Premium whole wheat pasta, 500g pack. High in fiber and nutrients. Made from 100% durum wheat. Perfect for healthy meals.', imageUrl: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=500', tags: ['whole-wheat', 'healthy', 'premium', 'high-fiber'] },
  { name: 'Fresh Strawberries (500g)', brand: 'Berry Farms', category: 'Produce', description: 'Sweet and juicy strawberries, locally grown. Perfect for desserts and smoothies. Rich in vitamin C and antioxidants.', imageUrl: 'https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg?auto=compress&cs=tinysrgb&w=500', tags: ['fresh', 'sweet', 'local', 'vitamin-c'] },
  { name: 'Extra Virgin Olive Oil', brand: 'Mediterranean Gold', category: 'Pantry', description: 'Cold-pressed extra virgin olive oil, 500ml bottle. Rich and flavorful with fruity notes. Perfect for salads and cooking.', imageUrl: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=500', tags: ['extra-virgin', 'cold-pressed', 'premium', 'mediterranean'] },
  { name: 'Fresh Atlantic Salmon Fillet', brand: 'Ocean Fresh', category: 'Seafood', description: 'Wild-caught Atlantic salmon, 300g fillet. Rich in omega-3 fatty acids. Sustainably sourced. Perfect for grilling or baking.', imageUrl: 'https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg?auto=compress&cs=tinysrgb&w=500', tags: ['wild-caught', 'fresh', 'premium', 'omega-3'] },
  { name: 'Greek Yogurt (500g)', brand: 'Creamy Delight', category: 'Dairy', description: 'Thick and creamy Greek yogurt, high in protein. Perfect for breakfast bowls and smoothies. No added sugars or preservatives.', imageUrl: '/images/products/greek_yogurt.png', tags: ['greek', 'protein', 'creamy', 'no-sugar'] },
  { name: 'Dark Chocolate (70% Cocoa)', brand: 'Cocoa Dreams', category: 'Pantry', description: 'Premium dark chocolate bar, 100g. Rich in antioxidants. Made from single-origin cocoa beans. Perfect for gifting or personal indulgence.', imageUrl: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=500', tags: ['dark-chocolate', 'premium', 'antioxidants', 'single-origin'] },
  { name: 'Fresh Tomatoes (1kg)', brand: 'Garden Fresh', category: 'Produce', description: 'Ripe, red tomatoes perfect for salads, cooking, and sauces. Locally grown with no pesticides. Rich in lycopene and vitamin C.', imageUrl: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=500', tags: ['fresh', 'local', 'organic', 'vitamin-c'] },
  { name: 'Basmati Rice (5kg)', brand: 'Golden Grain', category: 'Pantry', description: 'Premium long-grain Basmati rice, aged for perfect texture. Aromatic and fluffy when cooked. Ideal for biryanis and pulao.', imageUrl: 'https://images.pexels.com/photos/7421244/pexels-photo-7421244.jpeg?auto=compress&cs=tinysrgb&w=500', tags: ['basmati', 'premium', 'long-grain', 'aromatic'] },
  { name: 'Fresh Spinach (250g)', brand: 'Green Leaf Farms', category: 'Produce', description: 'Fresh, tender spinach leaves. Rich in iron, vitamins, and minerals. Perfect for salads, smoothies, and cooking.', imageUrl: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=500', tags: ['fresh', 'organic', 'iron-rich', 'healthy'] },
  { name: 'Almonds (500g)', brand: 'Nutty Delights', category: 'Pantry', description: 'Premium California almonds, raw and unsalted. High in protein, healthy fats, and vitamin E. Perfect for snacking and cooking.', imageUrl: 'https://images.pexels.com/photos/1013420/pexels-photo-1013420.jpeg?auto=compress&cs=tinysrgb&w=500', tags: ['premium', 'raw', 'protein', 'healthy-fats'] },
];

// Vendor seed data with proper GeoJSON [longitude, latitude]
const seedVendors = (productMap) => [
  {
    name: 'Fresh Foods Market',
    address: '123 Market Street, Koramangala, Bangalore 560095',
    location: { type: 'Point', coordinates: [77.6245, 12.9352] }, // [lng, lat]
    rating: 4.8, reviewCount: 234,
    openingHours: 'Mon-Sat: 8:00 AM - 8:00 PM, Sun: 9:00 AM - 6:00 PM',
    description: 'Your neighborhood fresh food market with the best local produce and organic options.',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800',
    contactEmail: 'contact@freshfoods.com', contactPhone: '+91 80 1234 5678',
    isVerified: true, featured: true,
    products: [
      { product: productMap['Organic Fresh Milk'], price: 3.99, stock: 'Available', stockCount: 45 },
      { product: productMap['Fresh Hass Avocados (Pack of 3)'], price: 2.49, stock: 'Low', stockCount: 8 },
      { product: productMap['Premium Arabica Coffee Beans'], price: 12.99, stock: 'Available', stockCount: 23 },
      { product: productMap['Free Range Eggs (Dozen)'], price: 4.99, stock: 'Available', stockCount: 30 },
      { product: productMap['Fresh Strawberries (500g)'], price: 4.99, stock: 'Available', stockCount: 18 },
    ],
  },
  {
    name: 'The Local Grocer',
    address: '456 MG Road, Indiranagar, Bangalore 560038',
    location: { type: 'Point', coordinates: [77.6408, 12.9784] },
    rating: 4.6, reviewCount: 189,
    openingHours: 'Daily: 7:00 AM - 9:00 PM',
    description: 'Family-owned grocery store serving the community for over 20 years.',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    contactEmail: 'info@localgrocer.com', contactPhone: '+91 80 2345 6789',
    isVerified: true, featured: false,
    products: [
      { product: productMap['Organic Fresh Milk'], price: 4.29, stock: 'Available', stockCount: 32 },
      { product: productMap['Artisan Sourdough Bread'], price: 5.50, stock: 'Available', stockCount: 15 },
      { product: productMap['Raw Organic Honey'], price: 8.75, stock: 'Low', stockCount: 5 },
      { product: productMap['Whole Wheat Pasta'], price: 3.99, stock: 'Available', stockCount: 28 },
      { product: productMap['Basmati Rice (5kg)'], price: 15.99, stock: 'Available', stockCount: 12 },
    ],
  },
  {
    name: 'Daily Essentials',
    address: '789 Brigade Road, Bangalore 560025',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] },
    rating: 4.4, reviewCount: 156,
    openingHours: 'Mon-Fri: 6:00 AM - 10:00 PM, Weekends: 7:00 AM - 9:00 PM',
    description: 'Convenient neighborhood store for all your daily needs. Open early, close late.',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800',
    contactEmail: 'daily@essentials.com', contactPhone: '+91 80 3456 7890',
    isVerified: false, featured: false,
    products: [
      { product: productMap['Organic Fresh Milk'], price: 3.89, stock: 'Available', stockCount: 40 },
      { product: productMap['Premium Arabica Coffee Beans'], price: 13.50, stock: 'Out of Stock', stockCount: 0 },
      { product: productMap['Fresh Strawberries (500g)'], price: 4.99, stock: 'Available', stockCount: 18 },
      { product: productMap['Greek Yogurt (500g)'], price: 5.49, stock: 'Available', stockCount: 22 },
      { product: productMap['Fresh Tomatoes (1kg)'], price: 2.99, stock: 'Available', stockCount: 35 },
    ],
  },
  {
    name: 'Organic Corner',
    address: '101 Farm Road, Whitefield, Bangalore 560066',
    location: { type: 'Point', coordinates: [77.7499, 12.9698] },
    rating: 4.9, reviewCount: 312,
    openingHours: 'Daily: 8:00 AM - 7:00 PM',
    description: 'Premium organic products sourced directly from local farms.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800',
    contactEmail: 'organic@corner.com', contactPhone: '+91 80 4567 8901',
    isVerified: true, featured: true,
    products: [
      { product: productMap['Artisan Sourdough Bread'], price: 5.75, stock: 'Available', stockCount: 20 },
      { product: productMap['Fresh Hass Avocados (Pack of 3)'], price: 2.60, stock: 'Available', stockCount: 35 },
      { product: productMap['Raw Organic Honey'], price: 8.99, stock: 'Available', stockCount: 15 },
      { product: productMap['Extra Virgin Olive Oil'], price: 12.99, stock: 'Available', stockCount: 12 },
      { product: productMap['Fresh Spinach (250g)'], price: 1.99, stock: 'Available', stockCount: 25 },
    ],
  },
  {
    name: 'Seaside Seafood Market',
    address: '202 Harbor Road, Mangalore 575001',
    location: { type: 'Point', coordinates: [74.8560, 12.9141] },
    rating: 4.7, reviewCount: 278,
    openingHours: 'Tue-Sun: 9:00 AM - 6:00 PM, Closed Mondays',
    description: 'Fresh seafood daily from local fishermen. Best quality guaranteed.',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800',
    contactEmail: 'seafood@seaside.com', contactPhone: '+91 824 1234 567',
    isVerified: true, featured: false,
    products: [
      { product: productMap['Fresh Atlantic Salmon Fillet'], price: 18.99, stock: 'Available', stockCount: 8 },
    ],
  },
  {
    name: 'Sweet Treats Bakery',
    address: '303 Baker Street, Jayanagar, Bangalore 560011',
    location: { type: 'Point', coordinates: [77.5831, 12.9279] },
    rating: 4.5, reviewCount: 145,
    openingHours: 'Wed-Sun: 7:00 AM - 5:00 PM, Closed Mon-Tue',
    description: 'Artisan bakery specializing in fresh breads and pastries baked daily.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800',
    contactEmail: 'hello@sweettreats.com', contactPhone: '+91 80 5678 9012',
    isVerified: true, featured: false,
    products: [
      { product: productMap['Artisan Sourdough Bread'], price: 5.25, stock: 'Available', stockCount: 25 },
      { product: productMap['Dark Chocolate (70% Cocoa)'], price: 6.99, stock: 'Available', stockCount: 18 },
    ],
  },
  {
    name: 'Spice Bazaar',
    address: '404 Commercial Street, Bangalore 560001',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] },
    rating: 4.8, reviewCount: 267,
    openingHours: 'Daily: 9:00 AM - 8:00 PM',
    description: 'Your one-stop shop for authentic Indian spices, grains, and specialty items.',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800',
    contactEmail: 'info@spicebazaar.com', contactPhone: '+91 80 6789 0123',
    isVerified: true, featured: false,
    products: [
      { product: productMap['Basmati Rice (5kg)'], price: 14.99, stock: 'Available', stockCount: 20 },
      { product: productMap['Almonds (500g)'], price: 9.99, stock: 'Available', stockCount: 15 },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Vendor.deleteMany({});
    console.log('🗑️  Cleared existing products and vendors');

    // Insert products
    const insertedProducts = await Product.insertMany(seedProducts);
    console.log(`✅ Seeded ${insertedProducts.length} products`);

    // Build name → _id map
    const productMap = {};
    insertedProducts.forEach(p => {
      productMap[p.name] = p._id;
    });

    // Insert vendors (with real MongoDB ObjectIds for products)
    const vendorData = seedVendors(productMap);
    const insertedVendors = await Vendor.insertMany(vendorData);
    console.log(`✅ Seeded ${insertedVendors.length} vendors`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('You can now test:');
    console.log('  GET http://localhost:5000/api/search?q=milk');
    console.log('  GET http://localhost:5000/api/search?q=bread&lat=12.9716&lng=77.5946&radius=5');
    console.log('  GET http://localhost:5000/api/vendors/nearby?lat=12.9716&lng=77.5946&radius=10');
    console.log('  GET http://localhost:5000/api/vendors');
    console.log('  GET http://localhost:5000/api/products');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
