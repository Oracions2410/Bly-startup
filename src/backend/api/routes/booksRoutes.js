const express = require('express')
const router = express.Router()

const multer = require('../middlewares/multer-config')
const bookCtrl = require('../controllers/bookCtrl')

router.post('/', multer, bookCtrl.create)
router.get('/', bookCtrl.findAll)
router.get('/:bookId', bookCtrl.findById)
router.put('/:bookId', bookCtrl.updateAll)
router.patch('/:bookId', bookCtrl.update)
router.delete('/:bookId', bookCtrl.remove)

module.exports = router