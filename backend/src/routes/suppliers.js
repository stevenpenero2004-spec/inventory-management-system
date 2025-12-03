const router = require('express').Router()
const { supplierCreateSchema, supplierUpdateSchema } = require('../validators/supplierValidator')
const validate = require('../middleware/validate')
const controller = require('../controllers/suppliersController')

router.post('/', validate(supplierCreateSchema), controller.createSupplier)
router.get('/', controller.getSuppliers)
router.get('/:id', controller.getSupplier)
router.put('/:id', validate(supplierUpdateSchema), controller.updateSupplier)
router.delete('/:id', controller.deleteSupplier)

module.exports = router
