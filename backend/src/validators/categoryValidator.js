const Joi = require('joi')

const categoryCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow(''),
})

const categoryUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().allow(''),
}).min(1)

module.exports = { categoryCreateSchema, categoryUpdateSchema }

