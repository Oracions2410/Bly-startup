const mongoose = require('mongoose')
const Category = require('../models/category')

async function create(req, res, next) {
    const { name, desc } = req.body

    if (!(name, desc)) res.status(400).json({ message: 'INVALID REQUEST: You must provide all fields (name, desc)' })

    try {

        const newCategory = new Category({
            _id: mongoose.Types.ObjectId(),
            name,
            desc,
            created_at: Date.now()
        })

        await newCategory.save()

        res.status(201).json({
            message: 'Category created',
            newCategory: {
                _id: newCategory._id,
                name: newCategory.name,
                desc: newCategory.desc,
                created_at: newCategory.created_at
            },
            request: {
                type: 'GET',
                url: `${req.protocol}://${req.get('host')}/categories/${newCategory._id}`
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ ou: 'dans le controller', error: err })
    }
}

async function findAll(req, res, next) {
    try {

        const categories = await Category.find()
        if (categories.length < 1) {
            return res.status(404).json({ count: 0, message: 'Not categorie found' })
        }
        console.log(categories)

        res.status(200).json({
            count: categories.length,
            categories: categories.map(category => {
                return {
                    _id: category._id,
                    name: category.name,
                    desc: category.desc,
                    created_at: category.created_at,
                    updated_at: category.updated_at,
                    request: {
                        type: 'GET',
                        url: `${req.protocol}://${req.get('host')}/categories/${category._id}`
                    }
                }
            })
        })

    } catch (err) {
        console.log(err)
        res.status(200).json({ error: err })
    }
}

async function findById(req, res, next) {
    const id = req.params.categoryId
    try {

        const category = await Category.findById({ _id: id })
        if (!category) {
            return res.status(404).json({ message: 'Not entry found for category ID' })
        }
        res.status(200).json({
            _id: category._id,
            name: category.name,
            desc: category.desc,
            created_at: category.created_at,
            request: {
                type: 'GET',
                url: `${req.protocol}://${req.get('host')}/categories`
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}

async function updateAll(req, res, next) {
    const id = req.params.categoryId
    const { name, desc } = req.body
    if (!(name && desc)) {
        return res.status(400).json({ message: 'You must fill All valid fields' })
    }
    try {

        await Category.updateOne({ _id: id }, { $set: { name, desc, update_at: Date.now() } })
        res.status(200).json({
            message: 'Category updated',
            url: `${req.protocol}://${req.get('host')}/categories/${id}`
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}

async function update(req, res, next) {
    try {
        const id = req.params.categoryId
        const { name, desc } = req.body

        if (!(name || desc)) {
            res.status(400).json({ message: 'You must fill least one valid field' })
        }

        const toUpdate = {}
        if (Object.keys(req.body).includes('name')) toUpdate.name = req.body.name
        if (Object.keys(req.body).includes('desc')) toUpdate.desc = req.body.desc

        await Category.updateOne({ _id: id }, { $set: toUpdate })

        res.status(200).json({
            message: 'Category updated',
            url: `${req.protocol}://${req.get('host')}/categories/${id}`
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}

async function remove(req, res, next) {
    try {
        const id = req.params.categoryId

        await Category.remove({ _id: id })
        res.status(200).json({
            message: 'Category deleted',
            request: {
                type: 'POST',
                url: { name: 'String', desc: 'String' }
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