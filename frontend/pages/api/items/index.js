import connectDB from '../../../lib/db';
import { Item } from '../../../lib/models';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { category, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;
      
      // Build filter object
      const filter = { isActive: true };
      
      if (category) {
        filter.category = category;
      }
      
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
      }
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (page - 1) * limit;
      const items = await Item.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Item.countDocuments(filter);

      res.json({
        items,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, price, category, image, stock } = req.body;
      
      const item = new Item({
        name,
        description,
        price,
        category,
        image,
        stock
      });

      await item.save();
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
