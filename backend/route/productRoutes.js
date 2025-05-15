import express from 'express';
import Product from '../models/product.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, name, page = 1, limit = 10, priceRange } = req.query;
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const query = {};

    if (category) {
      query.category = category;
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    
    if (priceRange === 'under1k') {
      query.price = { $lt: 1000 };
    } else if (priceRange === '1kto2k') {
      query.price = { $gte: 1000, $lte: 2000 };
    } else if (priceRange === '2kto5k') {
      query.price = { $gte: 2000, $lte: 5000 };
    } else if (priceRange === '5kto10k') {
      query.price = { $gte: 5000, $lte: 10000 };
    } else if (priceRange === '10kto40k') {
      query.price = { $gte: 10000, $lte: 40000 };
    }

    const totalCount = await Product.countDocuments(query);

    let products;

    if (category && pageNumber === 1) {

      
      const allCategoryProducts = await Product.find(query);
      products = allCategoryProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, pageSize);
    } else {
      // Regular paginated fetch
      const skip = (pageNumber - 1) * pageSize;
      products = await Product.find(query)
        .skip(skip)
        .limit(pageSize);
    }

    res.json({ products, totalCount });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;
