const express = require('express');
const User = require('../models/User');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.item');
    
    // Filter out any items that no longer exist or are inactive
    const validCartItems = user.cart.filter(cartItem => 
      cartItem.item && cartItem.item.isActive
    );

    // Update user's cart if any items were removed
    if (validCartItems.length !== user.cart.length) {
      user.cart = validCartItems;
      await user.save();
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
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

    const user = await User.findById(req.user._id);
    
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
    const updatedUser = await User.findById(req.user._id).populate('cart.item');
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update cart item quantity
router.put('/update/:cartItemId', auth, async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const user = await User.findById(req.user._id).populate('cart.item');
    const cartItem = user.cart.id(cartItemId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Check stock availability
    if (cartItem.item.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    cartItem.quantity = quantity;
    await user.save();

    // Return updated cart
    const updatedUser = await User.findById(req.user._id).populate('cart.item');
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:cartItemId', auth, async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const user = await User.findById(req.user._id);
    user.cart.id(cartItemId).remove();
    await user.save();

    // Return updated cart
    const updatedUser = await User.findById(req.user._id).populate('cart.item');
    const cartWithTotals = updatedUser.cart.map(cartItem => ({
      _id: cartItem._id,
      item: cartItem.item,
      quantity: cartItem.quantity,
      subtotal: cartItem.item.price * cartItem.quantity
    }));

    res.json({
      message: 'Item removed from cart',
      cart: cartWithTotals,
      total: cartWithTotals.reduce((sum, item) => sum + item.subtotal, 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.json({ message: 'Cart cleared', cart: [], total: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
