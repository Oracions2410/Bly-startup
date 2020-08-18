const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    desc: { type: String, required: true },
    created_at: { type: Date, required: true, default: Date.now() },
    updated_at: Date
})

module.exports = mongoose.model('Category', categorySchema)