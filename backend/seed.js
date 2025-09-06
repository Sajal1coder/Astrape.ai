const mongoose = require('mongoose');
const Item = require('./models/Item');
require('dotenv').config();

const sampleItems = [
  {
    name: 'iPhone 14 Pro',
    description: 'Latest Apple smartphone with advanced camera system',
    price: 999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
    stock: 50
  },
  {
    name: 'MacBook Air M2',
    description: 'Powerful laptop with M2 chip and all-day battery life',
    price: 1199,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
    stock: 30
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Air Max technology',
    price: 150,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    stock: 100
  },
  {
    name: 'Levi\'s 501 Jeans',
    description: 'Classic straight-fit jeans in premium denim',
    price: 89,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=300&fit=crop',
    stock: 75
  },
  {
    name: 'The Great Gatsby',
    description: 'Classic American novel by F. Scott Fitzgerald',
    price: 12,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop',
    stock: 200
  },
  {
    name: 'JavaScript: The Good Parts',
    description: 'Essential guide to JavaScript programming',
    price: 25,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=300&fit=crop',
    stock: 150
  },
  {
    name: 'Garden Tool Set',
    description: 'Complete set of essential gardening tools',
    price: 45,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop',
    stock: 60
  },
  {
    name: 'LED Plant Grow Light',
    description: 'Full spectrum LED light for indoor plants',
    price: 35,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=300&h=300&fit=crop',
    stock: 40
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with extra cushioning',
    price: 29,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop',
    stock: 80
  },
  {
    name: 'Resistance Bands Set',
    description: 'Complete set of resistance bands for home workouts',
    price: 19,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    stock: 120
  },
  {
    name: 'Moisturizing Face Cream',
    description: 'Hydrating face cream with natural ingredients',
    price: 24,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
    stock: 90
  },
  {
    name: 'Vitamin C Serum',
    description: 'Anti-aging serum with 20% Vitamin C',
    price: 32,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop',
    stock: 70
  },
  {
    name: 'LEGO Creator Set',
    description: '3-in-1 building set for creative play',
    price: 49,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    stock: 55
  },
  {
    name: 'Remote Control Car',
    description: 'High-speed RC car with rechargeable battery',
    price: 79,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    stock: 35
  },
  {
    name: 'Wireless Headphones',
    description: 'Noise-cancelling Bluetooth headphones',
    price: 199,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    stock: 65
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracker with heart rate monitor',
    price: 249,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    stock: 45
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking',
    price: 39,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
    stock: 85
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Premium organic cotton t-shirt, comfortable fit',
    price: 25,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    stock: 120
  },
  {
    name: 'Leather Wallet',
    description: 'Genuine leather bifold wallet with RFID protection',
    price: 65,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    stock: 40
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable drip coffee maker with thermal carafe',
    price: 89,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
    stock: 25
  },
  {
    name: 'Succulent Plant Set',
    description: 'Collection of 6 assorted succulent plants with pots',
    price: 32,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300&h=300&fit=crop',
    stock: 60
  },
  {
    name: 'Dumbbell Set',
    description: 'Adjustable dumbbell set 5-50 lbs per hand',
    price: 199,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    stock: 15
  },
  {
    name: 'Basketball',
    description: 'Official size basketball with superior grip',
    price: 29,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=300&fit=crop',
    stock: 50
  },
  {
    name: 'Lip Balm Set',
    description: 'Natural lip balm set with 4 different flavors',
    price: 18,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=300&fit=crop',
    stock: 100
  },
  {
    name: 'Hair Straightener',
    description: 'Ceramic hair straightener with temperature control',
    price: 75,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=300&h=300&fit=crop',
    stock: 30
  },
  {
    name: 'Board Game Collection',
    description: 'Classic board games collection for family fun',
    price: 45,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&h=300&fit=crop',
    stock: 25
  },
  {
    name: 'Action Figure',
    description: 'Collectible superhero action figure with accessories',
    price: 35,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    stock: 40
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');

    // Insert sample items
    await Item.insertMany(sampleItems);
    console.log(`Inserted ${sampleItems.length} sample items`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
