const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: String,
    created_at: { type: Date, default: Date.now() },
    updated_at: Date
})

module.exports = mongoose.model('User', userSchema)