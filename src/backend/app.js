require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const cors = require('./api/middlewares/cors')
const db = require('./api/db/connection')
const multer = require('./api/middlewares/multer-config')

const categoriesRoutes = require('./api/routes/categoriesRoutes')
const usersRoutes = require('./api/routes/usersRoutes')
const booksRoutes = require('./api/routes/booksRoutes')

db.mongoconnect()

app.use('/ping', (req, res) => res.send(`Backend server is running on ${req.protocol}://${req.get('host')} ....`))

// Middlewares
app.use(morgan('dev'))
app.use(cors)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes
//---[Categories]
app.use('/categories', categoriesRoutes)
app.use('/users', usersRoutes)
app.use('/books', booksRoutes)


// Errors Management
app.use((req, res, next) => {
    const error = new Error('404 Resource not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        message: error.message
    })
})
module.exports = app