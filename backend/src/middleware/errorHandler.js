const logger = require('../config/logger')

module.exports = (err, req, res, next) => {
  const status = err.status || 500
  const response = { message: err.message || 'Internal Server Error' }
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack
  }
  logger.error(`${req.method} ${req.url} ${status} ${err.message}`)
  res.status(status).json(response)
}

