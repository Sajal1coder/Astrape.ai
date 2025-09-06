import connectDB from '../../../../lib/db';
import { User } from '../../../../lib/models';
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
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const user = await auth(req);
    const { cartItemId } = req.query;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const populatedUser = await User.findById(user._id).populate('cart.item');
    const cartItem = populatedUser.cart.id(cartItemId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Check stock availability
    if (cartItem.item.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    cartItem.quantity = quantity;
    await populatedUser.save();

    // Return updated cart
    const updatedUser = await User.findById(user._id).populate('cart.item');
    const cartWithTotals = updatedUser.cart.map(cartItem => ({
      _id: cartItem._id,
      item: cartItem.item,
      quantity: cartItem.quantity,
      subtotal: cartItem.item.price * cartItem.quantity
    }));

    res.json({
      message: 'Cart updated',
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
