const Supplier = require('../models/Supplier')
const Activity = require('../models/Activity')

async function createSupplier(req, res, next) {
  try {
    const supplier = await Supplier.create(req.validatedBody)
    await Activity.create({ type: 'supplier.create', entityType: 'Supplier', entityId: supplier._id, message: `Supplier created: ${supplier.name}`, user: req.user?.name, ip: req.ip })
    res.status(201).json(supplier)
  } catch (err) {
    next(err)
  }
}

async function getSuppliers(req, res, next) {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 })
    res.json(suppliers)
  } catch (err) {
    next(err)
  }
}

async function getSupplier(req, res, next) {
  try {
    const supplier = await Supplier.findById(req.params.id)
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' })
    res.json(supplier)
  } catch (err) {
    next(err)
  }
}

async function updateSupplier(req, res, next) {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.validatedBody, { new: true })
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' })
    await Activity.create({ type: 'supplier.update', entityType: 'Supplier', entityId: supplier._id, message: `Supplier updated: ${supplier.name}`, user: req.user?.name, ip: req.ip })
    res.json(supplier)
  } catch (err) {
    next(err)
  }
}

async function deleteSupplier(req, res, next) {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id)
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' })
    await Activity.create({ type: 'supplier.delete', entityType: 'Supplier', entityId: supplier._id, message: `Supplier deleted: ${supplier.name}`, user: req.user?.name, ip: req.ip })
    res.json({ message: 'Supplier deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { createSupplier, getSuppliers, getSupplier, updateSupplier, deleteSupplier }
