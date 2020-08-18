const multer = require('multer')

const MIMES_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, 'assets/images'),
    filename: (req, file, callback) => callback(null, new Date().toISOString() + file.originalname)
})

module.exports = multer({ storage: storage }).single('image')