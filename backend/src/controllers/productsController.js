const Product = require('../models/Product')
const Activity = require('../models/Activity')

async function createProduct(req, res, next) {
  try {
    const data = req.validatedBody
    const product = await Product.create(data)
    await Activity.create({ type: 'product.create', entityType: 'Product', entityId: product._id, message: `Product created: ${product.name}`, user: req.user?.name, ip: req.ip, meta: { sku: product.sku } })
    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
}

async function getProducts(req, res, next) {
  try {
    const { page = 1, limit = 10, q = '', category, supplier, status } = req.query
    const filter = {}
    if (q) filter.$text = { $search: q }
    if (category) filter.category = category
    if (supplier) filter.supplier = supplier
    if (status) filter.status = status
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [items, total] = await Promise.all([
      Product.find(filter).populate('category supplier').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Product.countDocuments(filter),
    ])
    res.json({ items, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) {
    next(err)
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate('category supplier')
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    next(err)
  }
}

async function updateProduct(req, res, next) {
  try {
    const data = req.validatedBody
    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    await Activity.create({ type: 'product.update', entityType: 'Product', entityId: product._id, message: `Product updated: ${product.name}`, user: req.user?.name, ip: req.ip, meta: data })
    res.json(product)
  } catch (err) {
    next(err)
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    await Activity.create({ type: 'product.delete', entityType: 'Product', entityId: product._id, message: `Product deleted: ${product.name}`, user: req.user?.name, ip: req.ip, meta: { sku: product.sku } })
    res.json({ message: 'Product deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct }
