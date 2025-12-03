require('dotenv').config()
const { connectDB } = require('./src/config/db')
const logger = require('./src/config/logger')
const app = require('./src/app')

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    })
  })
  .catch(err => {
    logger.error(`Database connection failed: ${err.message}`)
    app.listen(PORT, () => {
      logger.warn(`Server running on port ${PORT} with DB connection error`)
    })
  })

