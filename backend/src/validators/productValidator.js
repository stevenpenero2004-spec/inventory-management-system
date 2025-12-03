const Joi = require('joi')

const productCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  sku: Joi.string().min(2).max(50).trim().required(),
  description: Joi.string().allow(''),
  price: Joi.number().min(0).precision(2).required(),
  category: Joi.string().hex().length(24).required(),
  supplier: Joi.string().hex().length(24).required(),
  stockQuantity: Joi.number().integer().min(0).default(0),
  reorderLevel: Joi.number().integer().min(0).default(0),
  status: Joi.string().valid('active', 'inactive').default('active'),
})

const productUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  sku: Joi.string().min(2).max(50).trim(),
  description: Joi.string().allow(''),
  price: Joi.number().min(0).precision(2),
  category: Joi.string().hex().length(24),
  supplier: Joi.string().hex().length(24),
  stockQuantity: Joi.number().integer().min(0),
  reorderLevel: Joi.number().integer().min(0),
  status: Joi.string().valid('active', 'inactive'),
}).min(1)

module.exports = { productCreateSchema, productUpdateSchema }
