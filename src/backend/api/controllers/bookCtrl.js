const mongoose = require('mongoose')
const Book = require('../models/book')

async function create(req, res) {
    return res.status(200).json({
        file: req.file || 'rien',
        body: req.body
    })
    try {
        // Validator
        const { title, desc, category, author, upload_by } = req.body
        const imagename = req.file.filename

        if (!(title && desc && category && author && upload_by)) {
            return res.status(400).json({ message: 'INVALID REQUEST: You must fill all fields (title, desc, author, category, upload_by)' })
        }

        // if (!validator.stringLengthIsCorrect([title, category, author, upload_by], 255
        //     && !validator.stringLengthIsCorrect([desc], 1000))
        // ) {
        //     res.json({ message: 'The strings fields must be less 255 charaters and desc be less 1000 characters' })
        // }

        const newBook = new Book({
            _id: mongoose.Types.ObjectId(),
            title,
            desc,
            category,
            author,
            upload_by,
            imagename
        })

        await newBook.save()

        res.status(201).json({
            message: 'Book created',
            newBook: {
                _id: newBook._id,
                title: newBook.title,
                desc: newBook.desc,
                author: newBook.author,
                upload_by: newBook.uplodad_by,
                downloads: newBook.downloads,
                views: newBook.views,
                imagename: newBook.imagename,
                created_at: newBook.created_at,
                request: {
                    type: 'GET',
                    url: `${req.protocol}://${req.get('host')}/books/${newBook._id}`
                }
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}



async function findAll(req, res) {
    try {

        const books = await Book.find()
            .select('_id title desc author category upload_by downloads views created_at updated_at')
            .populate('category', 'name desc')
            .populate('upload_by', 'username email phone created_at')

        if (books.length < 1) {
            res.status(404).json({ message: 'Not book found' })
        }

        console.log(books)

        res.status(200).json({
            count: books.length,
            books: books.map(book => {
                return {
                    _id: book._id,
                    title: book.title,
                    desc: book.desc,
                    author: book.author,
                    category: book.category,
                    upload_by: book.upload_by,
                    downloads: book.downloads,
                    views: book.views,
                    created_at: book.created_at,
                    updated_at: book.updated_at,
                    request: {
                        type: 'GET',
                        url: `${req.protocol}://${req.get('host')}/books/${book._id}`
                    }
                }
            })
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}



async function findById(req, res) {
    try {
        const id = req.params.bookId
        const book = await Book.findOne({ _id: id })
            .select('_id title desc author category upload_by downloads views created_at updated_at')
            .populate('category', 'name desc')
            .populate('upload_by', 'username email phone created_at')

        if (!book) {
            res.status(404).json({ message: 'Not entry found for book ID' })
        }

        res.status(200).json({
            _id: book._id,
            title: book.title,
            desc: book.desc,
            author: book.author,
            category: book.category,
            upload_by: book.upload_by,
            downloads: book.downloads,
            views: book.views,
            created_at: book.created_at,
            updated_at: book.updated_at,
            request: {
                type: 'GET',
                url: `${req.protocol}://${req.get('host')}/books/${book._id}`
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}



async function updateAll(req, res) {
    try {
        const id = req.params.bookId
        const { title, desc, author, category, upload_by, downloads, views } = req.body

        if (!(title && desc && author && category && upload_by && downloads && views)) {
            res.status(400).json({ message: 'INVALID REQUEST: You must fill all fields (title, desc' })
        }

        await Book.updateOne({ _id: id },
            { $set: { updated_at: Date.now(), title, desc, author, category, upload_by, downloads, views } })

        res.status(200).json({
            message: 'Book updated',
            url: `${req.protocol}://${req.get('host')}/books/${id}`
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}




async function update(req, res) {
    try {
        const id = req.params.bookId
        const { title, desc, author, category, upload_by, downloads, views } = req.body

        if (!(title || desc || author || category || upload_by || downloads || views)) {
            res.status(400).json({ message: 'INVALID REQUEST: You must fill least one field (title, desc, author, category, upload_by, downloads, views)' })
        }

        // if (!(validator.stringLengthIsCorrect([title, author, category, upload_by, downloads, views], 255)
        //     && !validator.stringLengthIsCorrect([desc], 1000))) {
        //     res.json({ message: 'The strings fields must be less 255 charaters and desc be less 1000 characters' })
        // }

        toUpdate = { updated_at: Date.now() }
        const inputKeys = Object.keys(req.body)

        if (inputKeys.includes('title')) toUpdate.title = req.body.title
        if (inputKeys.includes('desc')) toUpdate.desc = req.body.desc
        if (inputKeys.includes('author')) toUpdate.author = req.body.author
        if (inputKeys.includes('category')) toUpdate.category = req.body.category
        if (inputKeys.includes('upload_by')) toUpdate.upload_by = req.body.upload_by
        if (inputKeys.includes('downloads')) toUpdate.downloads = req.body.downloads
        if (inputKeys.includes('views')) toUpdate.views = req.body.views

        await Book.updateOne({ _id: id }, { $set: toUpdate })

        res.status(200).json({
            message: 'Book updated',
            url: `${req.protocol}://${req.get('host')}/books/${id}`
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}



async function remove(req, res) {
    try {

        const id = req.params.bookId
        await Book.deleteOne({ _id: id })
        res.status(200).json({
            message: 'Book deleted',
            request: {
                type: 'POST',
                url: {
                    title: 'String',
                    desc: 'String',
                    author: 'String',
                    upload_by: 'userId',
                    category: 'categoryId',
                    downloads: 'Number',
                    views: 'Number'
                }
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}


module.exports = {
    create,
    findAll,
    findById,
    updateAll,
    update,
    remove
}