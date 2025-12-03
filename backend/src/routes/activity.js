const router = require('express').Router()
const controller = require('../controllers/activityController')

router.get('/', controller.getActivity)
router.delete('/', controller.clearActivity)

module.exports = router

