import mongoose from 'mongoose';

// Item Schema
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

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  cart: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  }]
}, {
  timestamps: true
});

// Index for better search performance
itemSchema.index({ name: 'text', description: 'text' });
itemSchema.index({ category: 1 });
itemSchema.index({ price: 1 });

export const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);
