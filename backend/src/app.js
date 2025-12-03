const express = require('express')
const cors = require('cors')
const logger = require('./config/logger')
const productsRoute = require('./routes/products')
const suppliersRoute = require('./routes/suppliers')
const categoriesRoute = require('./routes/categories')
const stocksRoute = require('./routes/stocks')
const dashboardRoute = require('./routes/dashboard')
const reportsRoute = require('./routes/reports')
const activityRoute = require('./routes/activity')
const authRoute = require('./routes/auth')
const auth = require('./middleware/authMiddleware')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
})

app.use('/api/auth', authRoute)
app.use('/api/products', auth, productsRoute)
app.use('/api/suppliers', auth, suppliersRoute)
app.use('/api/categories', auth, categoriesRoute)
app.use('/api/stocks', auth, stocksRoute)
app.use('/api/dashboard', auth, dashboardRoute)
app.use('/api/reports', auth, reportsRoute)
app.use('/api/activity', auth, activityRoute)

app.use(notFound)
app.use(errorHandler)

module.exports = app
