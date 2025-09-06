const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Other']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x300?text=No+Image'
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better search performance
itemSchema.index({ name: 'text', description: 'text' });
itemSchema.index({ category: 1 });
itemSchema.index({ price: 1 });

module.exports = mongoose.model('Item', itemSchema);
