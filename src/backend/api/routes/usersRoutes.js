const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/userCtrl')

router.post('/', userCtrl.create)
router.get('/', userCtrl.findAll)
router.get('/:userId', userCtrl.findById)
router.put('/:userId', userCtrl.updateAll)
router.patch('/:userId', userCtrl.update)
router.delete('/:userId', userCtrl.remove)


module.exports = router