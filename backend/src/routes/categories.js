const router = require('express').Router()
const { categoryCreateSchema, categoryUpdateSchema } = require('../validators/categoryValidator')
const validate = require('../middleware/validate')
const controller = require('../controllers/categoriesController')

router.post('/', validate(categoryCreateSchema), controller.createCategory)
router.get('/', controller.getCategories)
router.get('/:id', controller.getCategory)
router.put('/:id', validate(categoryUpdateSchema), controller.updateCategory)
router.delete('/:id', controller.deleteCategory)

module.exports = router
