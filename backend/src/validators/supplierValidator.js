const Joi = require('joi')

const supplierCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(7).max(20).required(),
  address: Joi.string().allow(''),
  productsSupplied: Joi.array().items(Joi.string().hex().length(24)).default([]),
})

const supplierUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  phone: Joi.string().min(7).max(20),
  address: Joi.string().allow(''),
  productsSupplied: Joi.array().items(Joi.string().hex().length(24)),
}).min(1)

module.exports = { supplierCreateSchema, supplierUpdateSchema }

