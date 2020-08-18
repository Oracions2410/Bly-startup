const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    desc: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    imagename: String,
    upload_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, required: true, default: Date.now() },
    updated_at: Date,
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    imagename: { type: String, required: true }
})

module.exports = mongoose.model('Book', bookSchema)