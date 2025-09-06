import connectDB from '../../../lib/db';
import { User, Item } from '../../../lib/models';
import jwt from 'jsonwebtoken';

// Auth middleware
const auth = async (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No token provided');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const user = await auth(req);
    const { itemId, quantity = 1 } = req.body;

    // Check if item exists and is active
    const item = await Item.findById(itemId);
    if (!item || !item.isActive) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check stock availability
    if (item.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Check if item already exists in cart
    const existingCartItem = user.cart.find(cartItem => 
      cartItem.item.toString() === itemId
    );

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;
      if (item.stock < newQuantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      existingCartItem.quantity = newQuantity;
    } else {
      // Add new item to cart
      user.cart.push({ item: itemId, quantity });
    }

    await user.save();
    
    // Return updated cart
    const updatedUser = await User.findById(user._id).populate('cart.item');
    const cartWithTotals = updatedUser.cart.map(cartItem => ({
      _id: cartItem._id,
      item: cartItem.item,
      quantity: cartItem.quantity,
      subtotal: cartItem.item.price * cartItem.quantity
    }));

    res.json({
      message: 'Item added to cart',
      cart: cartWithTotals,
      total: cartWithTotals.reduce((sum, item) => sum + item.subtotal, 0)
    });
  } catch (error) {
    if (error.message === 'No token provided' || error.message === 'User not found') {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}
