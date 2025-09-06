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
  await connectDB();

  if (req.method === 'GET') {
    try {
      const user = await auth(req);
      const populatedUser = await User.findById(user._id).populate('cart.item');
      
      // Filter out any items that no longer exist or are inactive
      const validCartItems = populatedUser.cart.filter(cartItem => 
        cartItem.item && cartItem.item.isActive
      );

      // Update user's cart if any items were removed
      if (validCartItems.length !== populatedUser.cart.length) {
        populatedUser.cart = validCartItems;
        await populatedUser.save();
      }

      const cartWithTotals = validCartItems.map(cartItem => ({
        _id: cartItem._id,
        item: cartItem.item,
        quantity: cartItem.quantity,
        subtotal: cartItem.item.price * cartItem.quantity
      }));

      const total = cartWithTotals.reduce((sum, item) => sum + item.subtotal, 0);

      res.json({
        cart: cartWithTotals,
        total,
        itemCount: cartWithTotals.reduce((sum, item) => sum + item.quantity, 0)
      });
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } else if (req.method === 'DELETE') {
    // Clear cart
    try {
      const user = await auth(req);
      user.cart = [];
      await user.save();

      res.json({ message: 'Cart cleared', cart: [], total: 0 });
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
