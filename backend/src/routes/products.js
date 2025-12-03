const router = require('express').Router()
const { productCreateSchema, productUpdateSchema } = require('../validators/productValidator')
const validate = require('../middleware/validate')
const controller = require('../controllers/productsController')

router.post('/', validate(productCreateSchema), controller.createProduct)
router.get('/', controller.getProducts)
router.get('/:id', controller.getProduct)
router.put('/:id', validate(productUpdateSchema), controller.updateProduct)
router.delete('/:id', controller.deleteProduct)

module.exports = router
