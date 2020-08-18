const express = require('express')
const router = express.Router()

const categoryCtrl = require('../controllers/categoryCtrl')

router.post('/', categoryCtrl.create)
router.get('/', categoryCtrl.findAll)
router.get('/:categoryId', categoryCtrl.findById)
router.put('/:categoryId', categoryCtrl.updateAll)
router.patch('/:categoryId', categoryCtrl.update)
router.delete('/:categoryId', categoryCtrl.remove)

module.exports = router