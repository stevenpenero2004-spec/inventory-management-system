module.exports = schema => (req, res, next) => {
  const target = req.body
  const { error, value } = schema.validate(target, { abortEarly: false, stripUnknown: true })
  if (error) {
    const err = new Error('Validation error')
    err.status = 400
    err.details = error.details
    return next(err)
  }
  req.validatedBody = value
  next()
}

