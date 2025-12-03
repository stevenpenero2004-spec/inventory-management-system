const Activity = require('../models/Activity')

async function getActivity(req, res, next) {
  try {
    const { type, entityType, user, days = 30, page = 1, limit = 20 } = req.query
    const end = new Date()
    const start = new Date(end.getTime() - parseInt(days) * 24 * 60 * 60 * 1000)
    const filter = { createdAt: { $gte: start, $lte: end } }
    if (type) filter.type = type
    if (entityType) filter.entityType = entityType
    if (user) filter.user = user
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [items, total] = await Promise.all([
      Activity.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Activity.countDocuments(filter),
    ])
    res.json({ items, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) { next(err) }
}

async function clearActivity(req, res, next) {
  try {
    await Activity.deleteMany({})
    res.json({ message: 'Activity cleared' })
  } catch (err) { next(err) }
}

module.exports = { getActivity, clearActivity }

