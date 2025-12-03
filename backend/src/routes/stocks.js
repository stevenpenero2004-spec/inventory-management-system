const router = require('express').Router()
const { stockCreateSchema, stockUpdateSchema } = require('../validators/stockValidator')
const validate = require('../middleware/validate')
const controller = require('../controllers/stocksController')

router.post('/', validate(stockCreateSchema), controller.addStock)
router.get('/history', controller.getHistory)
router.delete('/:id', controller.deleteEntry)
router.put('/:id', validate(stockUpdateSchema), controller.updateEntry)

module.exports = router
