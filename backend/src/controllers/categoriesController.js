const Category = require('../models/Category')
const Activity = require('../models/Activity')

async function createCategory(req, res, next) {
  try {
    const category = await Category.create(req.validatedBody)
    await Activity.create({ type: 'category.create', entityType: 'Category', entityId: category._id, message: `Category created: ${category.name}`, user: req.user?.name, ip: req.ip })
    res.status(201).json(category)
  } catch (err) {
    next(err)
  }
}

async function getCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json(categories)
  } catch (err) {
    next(err)
  }
}

async function getCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json(category)
  } catch (err) {
    next(err)
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.validatedBody, { new: true })
    if (!category) return res.status(404).json({ message: 'Category not found' })
    await Activity.create({ type: 'category.update', entityType: 'Category', entityId: category._id, message: `Category updated: ${category.name}`, user: req.user?.name, ip: req.ip })
    res.json(category)
  } catch (err) {
    next(err)
  }
}

async function deleteCategory(req, res, next) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category not found' })
    await Activity.create({ type: 'category.delete', entityType: 'Category', entityId: category._id, message: `Category deleted: ${category.name}`, user: req.user?.name, ip: req.ip })
    res.json({ message: 'Category deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { createCategory, getCategories, getCategory, updateCategory, deleteCategory }
