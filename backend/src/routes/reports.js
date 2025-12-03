const router = require('express').Router()
const controller = require('../controllers/reportsController')

router.get('/stock-levels', controller.stockLevels)
router.get('/stock-movements', controller.stockMovements)
router.get('/top-products', controller.topProducts)
router.get('/demand-by-category', controller.demandByCategory)
router.get('/demand-by-supplier', controller.demandBySupplier)

module.exports = router

