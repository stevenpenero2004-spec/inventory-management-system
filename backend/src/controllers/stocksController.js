const mongoose = require('mongoose')
const Stock = require('../models/Stock')
const Product = require('../models/Product')
const Activity = require('../models/Activity')

async function addStock(req, res, next) {
  try {
    const { product, type, quantity, date, remarks } = req.validatedBody
    let prod
    if (type === 'OUT') {
      prod = await Product.findOneAndUpdate(
        { _id: product, stockQuantity: { $gte: quantity } },
        { $inc: { stockQuantity: -quantity } },
        { new: true }
      )
      if (!prod) {
        const err = new Error('Insufficient stock')
        err.status = 400
        throw err
      }
    } else {
      prod = await Product.findByIdAndUpdate(product, { $inc: { stockQuantity: quantity } }, { new: true })
      if (!prod) {
        const err = new Error('Product not found')
        err.status = 404
        throw err
      }
    }
    const entry = await Stock.create({ product, type, quantity, date, remarks })
    await Activity.create({ type: type === 'IN' ? 'stock.in' : 'stock.out', entityType: 'Stock', entityId: entry._id, message: `${type} ${quantity} for ${prod.name}`, user: req.user?.name, ip: req.ip, meta: { product: prod._id.toString() } })
    res.status(201).json(entry)
  } catch (err) {
    next(err)
  }
}

async function getHistory(req, res, next) {
  try {
    const { product, page = 1, limit = 10 } = req.query
    const filter = {}
    if (product) filter.product = product
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [items, total] = await Promise.all([
      Stock.find(filter).populate('product').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Stock.countDocuments(filter),
    ])
    res.json({ items, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) {
    next(err)
  }
}

async function deleteEntry(req, res, next) {
  try {
    const entry = await Stock.findById(req.params.id)
    if (!entry) {
      const err = new Error('Stock entry not found')
      err.status = 404
      throw err
    }
    const delta = entry.type === 'IN' ? -entry.quantity : entry.quantity
    let prod
    if (delta < 0) {
      prod = await Product.findOneAndUpdate(
        { _id: entry.product, stockQuantity: { $gte: Math.abs(delta) } },
        { $inc: { stockQuantity: delta } },
        { new: true }
      )
      if (!prod) {
        const err = new Error('Insufficient stock to delete entry')
        err.status = 400
        throw err
      }
    } else {
      prod = await Product.findByIdAndUpdate(entry.product, { $inc: { stockQuantity: delta } }, { new: true })
    }
    await Stock.deleteOne({ _id: entry._id })
    await Activity.create({ type: 'stock.delete', entityType: 'Stock', entityId: entry._id, message: `Deleted stock entry for ${prod?.name || ''}`, user: req.user?.name, ip: req.ip })
    res.json({ message: 'Stock entry deleted' })
  } catch (err) {
    next(err)
  }
}

async function updateEntry(req, res, next) {
  try {
    const entry = await Stock.findById(req.params.id)
    if (!entry) {
      const err = new Error('Stock entry not found')
      err.status = 404
      throw err
    }
    const updates = req.validatedBody || {}
    const newType = updates.type ?? entry.type
    const newQty = updates.quantity ?? entry.quantity
    const oldEffect = entry.type === 'IN' ? entry.quantity : -entry.quantity
    const newEffect = newType === 'IN' ? newQty : -newQty
    const delta = newEffect - oldEffect

    let prod
    if (delta < 0) {
      prod = await Product.findOneAndUpdate(
        { _id: entry.product, stockQuantity: { $gte: Math.abs(delta) } },
        { $inc: { stockQuantity: delta } },
        { new: true }
      )
      if (!prod) {
        const err = new Error('Insufficient stock')
        err.status = 400
        throw err
      }
    } else if (delta > 0) {
      prod = await Product.findByIdAndUpdate(entry.product, { $inc: { stockQuantity: delta } }, { new: true })
    } else {
      prod = await Product.findById(entry.product)
    }

    Object.assign(entry, updates)
    await entry.save()
    await Activity.create({ type: 'stock.update', entityType: 'Stock', entityId: entry._id, message: `Updated stock entry for ${prod?.name || ''}`, user: req.user?.name, ip: req.ip, meta: updates })
    res.json(entry)
  } catch (err) {
    next(err)
  }
}

module.exports = { addStock, getHistory, deleteEntry, updateEntry }
