const Product = require('../models/Product')
const Stock = require('../models/Stock')

function parseRange(query) {
  const now = new Date()
  const days = parseInt(query.days || '30', 10)
  const end = query.endDate ? new Date(query.endDate) : now
  const start = query.startDate ? new Date(query.startDate) : new Date(end.getTime() - days * 24 * 60 * 60 * 1000)
  return { start, end }
}

async function stockLevels(req, res, next) {
  try {
    const items = await Product.find().select('name sku stockQuantity reorderLevel').sort({ stockQuantity: 1 })
    res.json(items)
  } catch (err) { next(err) }
}

async function stockMovements(req, res, next) {
  try {
    const { start, end } = parseRange(req.query)
    const agg = await Stock.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      { $group: { _id: { d: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, t: '$type' }, qty: { $sum: '$quantity' } } },
      { $sort: { '_id.d': 1 } },
    ])
    const map = {}
    agg.forEach(r => {
      const d = r._id.d
      if (!map[d]) map[d] = { date: d, in: 0, out: 0 }
      if (r._id.t === 'IN') map[d].in = r.qty
      else map[d].out = r.qty
    })
    res.json(Object.values(map))
  } catch (err) { next(err) }
}

async function topProducts(req, res, next) {
  try {
    const { start, end } = parseRange(req.query)
    const top = parseInt(req.query.top || '5', 10)
    const agg = await Stock.aggregate([
      { $match: { date: { $gte: start, $lte: end }, type: 'OUT' } },
      { $group: { _id: '$product', qty: { $sum: '$quantity' } } },
      { $sort: { qty: -1 } },
      { $limit: top },
    ])
    const ids = agg.map(a => a._id)
    const products = await Product.find({ _id: { $in: ids } }).select('name sku')
    const byId = Object.fromEntries(products.map(p => [p._id.toString(), p]))
    res.json(agg.map(a => ({ product: byId[a._id.toString()], quantity: a.qty })))
  } catch (err) { next(err) }
}

async function demandByCategory(req, res, next) {
  try {
    const { start, end } = parseRange(req.query)
    const agg = await Stock.aggregate([
      { $match: { date: { $gte: start, $lte: end }, type: 'OUT' } },
      { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'p' } },
      { $unwind: '$p' },
      { $group: { _id: '$p.category', qty: { $sum: '$quantity' } } },
      { $sort: { qty: -1 } },
    ])
    const ids = agg.map(a => a._id)
    const categories = await require('../models/Category').find({ _id: { $in: ids } }).select('name')
    const byId = Object.fromEntries(categories.map(c => [c._id.toString(), c]))
    res.json(agg.map(a => ({ category: byId[a._id.toString()], quantity: a.qty })))
  } catch (err) { next(err) }
}

async function demandBySupplier(req, res, next) {
  try {
    const { start, end } = parseRange(req.query)
    const agg = await Stock.aggregate([
      { $match: { date: { $gte: start, $lte: end }, type: 'OUT' } },
      { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'p' } },
      { $unwind: '$p' },
      { $group: { _id: '$p.supplier', qty: { $sum: '$quantity' } } },
      { $sort: { qty: -1 } },
    ])
    const ids = agg.map(a => a._id)
    const suppliers = await require('../models/Supplier').find({ _id: { $in: ids } }).select('name')
    const byId = Object.fromEntries(suppliers.map(s => [s._id.toString(), s]))
    res.json(agg.map(a => ({ supplier: byId[a._id.toString()], quantity: a.qty })))
  } catch (err) { next(err) }
}

module.exports = { stockLevels, stockMovements, topProducts, demandByCategory, demandBySupplier }

