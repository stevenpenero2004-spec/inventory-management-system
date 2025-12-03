const Product = require('../models/Product')
const Category = require('../models/Category')

async function summary(req, res, next) {
  try {
    const [totalProducts, totalCategories, lowStock] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Product.find({ $expr: { $lte: ['$stockQuantity', '$reorderLevel'] }, status: 'active' }).select('name sku stockQuantity reorderLevel').limit(50),
    ])
    res.json({ totalProducts, totalCategories, lowStock })
  } catch (err) {
    next(err)
  }
}

module.exports = { summary }

