const mongoose = require('mongoose');
const Item = require('./models/Item');
require('dotenv').config();

const sampleItems = [
  {
    name: 'iPhone 14 Pro',
    description: 'Latest Apple smartphone with advanced camera system',
    price: 999,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300x300?text=iPhone+14+Pro',
    stock: 50
  },
  {
    name: 'MacBook Air M2',
    description: 'Powerful laptop with M2 chip and all-day battery life',
    price: 1199,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300x300?text=MacBook+Air',
    stock: 30
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Air Max technology',
    price: 150,
    category: 'Clothing',
    image: 'https://via.placeholder.com/300x300?text=Nike+Air+Max',
    stock: 100
  },
  {
    name: 'Levi\'s 501 Jeans',
    description: 'Classic straight-fit jeans in premium denim',
    price: 89,
    category: 'Clothing',
    image: 'https://via.placeholder.com/300x300?text=Levis+Jeans',
    stock: 75
  },
  {
    name: 'The Great Gatsby',
    description: 'Classic American novel by F. Scott Fitzgerald',
    price: 12,
    category: 'Books',
    image: 'https://via.placeholder.com/300x300?text=Great+Gatsby',
    stock: 200
  },
  {
    name: 'JavaScript: The Good Parts',
    description: 'Essential guide to JavaScript programming',
    price: 25,
    category: 'Books',
    image: 'https://via.placeholder.com/300x300?text=JS+Book',
    stock: 150
  },
  {
    name: 'Garden Tool Set',
    description: 'Complete set of essential gardening tools',
    price: 45,
    category: 'Home & Garden',
    image: 'https://via.placeholder.com/300x300?text=Garden+Tools',
    stock: 60
  },
  {
    name: 'LED Plant Grow Light',
    description: 'Full spectrum LED light for indoor plants',
    price: 35,
    category: 'Home & Garden',
    image: 'https://via.placeholder.com/300x300?text=Grow+Light',
    stock: 40
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with extra cushioning',
    price: 29,
    category: 'Sports',
    image: 'https://via.placeholder.com/300x300?text=Yoga+Mat',
    stock: 80
  },
  {
    name: 'Resistance Bands Set',
    description: 'Complete set of resistance bands for home workouts',
    price: 19,
    category: 'Sports',
    image: 'https://via.placeholder.com/300x300?text=Resistance+Bands',
    stock: 120
  },
  {
    name: 'Moisturizing Face Cream',
    description: 'Hydrating face cream with natural ingredients',
    price: 24,
    category: 'Beauty',
    image: 'https://via.placeholder.com/300x300?text=Face+Cream',
    stock: 90
  },
  {
    name: 'Vitamin C Serum',
    description: 'Anti-aging serum with 20% Vitamin C',
    price: 32,
    category: 'Beauty',
    image: 'https://via.placeholder.com/300x300?text=Vitamin+C',
    stock: 70
  },
  {
    name: 'LEGO Creator Set',
    description: '3-in-1 building set for creative play',
    price: 49,
    category: 'Toys',
    image: 'https://via.placeholder.com/300x300?text=LEGO+Set',
    stock: 55
  },
  {
    name: 'Remote Control Car',
    description: 'High-speed RC car with rechargeable battery',
    price: 79,
    category: 'Toys',
    image: 'https://via.placeholder.com/300x300?text=RC+Car',
    stock: 35
  },
  {
    name: 'Wireless Headphones',
    description: 'Noise-cancelling Bluetooth headphones',
    price: 199,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300x300?text=Headphones',
    stock: 65
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracker with heart rate monitor',
    price: 249,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300x300?text=Smart+Watch',
    stock: 45
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
