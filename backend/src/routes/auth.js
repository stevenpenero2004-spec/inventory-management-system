const router = require('express').Router()
const validate = require('../middleware/validate')
const { registerSchema, loginSchema } = require('../validators/authValidator')
const controller = require('../controllers/authController')
const auth = require('../middleware/authMiddleware')

router.post('/register', validate(registerSchema), controller.register)
router.post('/login', validate(loginSchema), controller.login)
router.get('/me', auth, controller.me)
router.post('/logout', auth, controller.logout)

module.exports = router

