const Joi = require('joi')

const stockCreateSchema = Joi.object({
  product: Joi.string().hex().length(24).required(),
  type: Joi.string().valid('IN', 'OUT').required(),
  quantity: Joi.number().integer().min(1).required(),
  date: Joi.date(),
  remarks: Joi.string().allow(''),
})

const stockUpdateSchema = Joi.object({
  type: Joi.string().valid('IN', 'OUT'),
  quantity: Joi.number().integer().min(1),
  date: Joi.date(),
  remarks: Joi.string().allow(''),
}).min(1)

module.exports = { stockCreateSchema, stockUpdateSchema }
