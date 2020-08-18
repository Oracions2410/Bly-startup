const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')


/*
+--------------------------------------------------------------------+
|   CREATE USER   
|   POST /users
+--------------------------------------------------------------------+

*/

async function create(req, res) {
    try {

        const { username, email, password, c_password, phone } = req.body
        if (!(username && email && password, c_password && phone)) {
            res.status(400).json({
                message: 'INVALID REQUEST: You must provide all fields (username, email, password, c_password, phone)'
            })
        }

        // Validator 
        if (!(password === c_password)) {
            res.status(400).json({ message: 'Passwords do not match' })
        }
        const hash = await bcrypt.hash(password, 10)
        const newUser = new User({
            _id: mongoose.Types.ObjectId(),
            username,
            email,
            password: hash,
            phone
        })
        await newUser.save()
        res.status(200).json({
            message: 'User created',
            newUser: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                phone: newUser.phone,
                created_at: newUser.created_at,
                request: {
                    type: 'GET',
                    url: `${req.protocol}://${req.get('host')}/users/${newUser._id}`
                }
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}


/*
+--------------------------------------------------------------------+
|   FIND ALL USERS   
|   GET /users
+--------------------------------------------------------------------+

*/

async function findAll(req, res) {
    try {

        const users = await User.find().select('_id username email phone created_at  updated_at')
        if (users.length < 1) {
            return res.status(404).json({ count: 0, message: 'Not user found' })
        }
        res.status(200).json({
            count: users.length,
            users: users.map(user => {
                return {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                    request: {
                        type: 'GET',
                        url: `${req.protocol}://${req.get('host')}/users/${user._id}`
                    }
                }
            })
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}


/*
+--------------------------------------------------------------------+
|   FIND ONE USER   
|   GET /users
+--------------------------------------------------------------------+
*/

async function findById(req, res) {
    try {
        const id = req.params.userId
        const user = await User.findOne({ _id: id }).select('_id username email phone created_at updated_at')
        if (!user) {
            res.status(404).json({ message: 'Not entry found for user ID' })
        }
        console.log(user)
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            created_at: user.created_at,
            updated_at: user.updated_at,
            request: {
                type: 'GET',
                url: `${req.protocol}://${req.get('host')}/users`
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}


/*
+--------------------------------------------------------------------+
|   UPDATE ALL FIELD ON USER   
|   PUT /users
+--------------------------------------------------------------------+

*/

async function updateAll(req, res) {
    try {
        const id = req.params.userId
        const { username, email, password, c_password, phone } = req.body
        if (!(username && email && password && c_password && phone)) {
            return res.status(400).json({
                message: 'INVALID REQUEST: You must fill all fields (username, email, password, c_password, phone)'
            })
        }

        if (!(password === c_password)) {
            return res.status(400).json({ message: 'The passwords do not match' })
        }

        const hash = bcrypt.hash(password, 10)
        await User.updateOne({ _id: id }, { $set: { username, email, hash, phone, updated_at: Date.now() } })

        res.status(200).json({
            message: 'User updated',
            url: `${req.protocol}://${req.get('host')}/users/${id}`
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}


/*
+--------------------------------------------------------------------+
|   UPDATE ONE FIELD ON USER USER   
|   PATCH /users
+--------------------------------------------------------------------+
*/

async function update(req, res) {
    try {
        const id = req.params.userId
        const { username, email, phone, password, c_password } = req.body

        if (!(username || email || phone) && !(password && c_password)) {
            res.status(400).json({ message: 'INVALID REQUEST: You must fill least one valid field' })
        }

        const toUpdate = { updated_at: Date.now() }

        const inputKeys = Object.keys(req.body)

        if (inputKeys.includes('username')) toUpdate.username = req.body.username
        if (inputKeys.includes('email')) toUpdate.email = req.body.email
        if (inputKeys.includes('phone')) toUpdate.phone = req.body.phone
        if (inputKeys.includes('password') && inputKeys.includes('c_password')) {
            if (!(passsword === c_password))
                return res.status(400).json({ message: 'The passwords do not match' })
            toUpdate.password = await bcrypt.hash(password, 10)
        }

        await User.updateOne({ _id: id }, { $set: toUpdate })
        res.status(200).json({
            message: 'User updated',
            url: `${req.protocol}://${req.get('host')}/users/${id}`
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}


/*
+--------------------------------------------------------------------+
|   DELETE USER   
|   DELETE /users
+--------------------------------------------------------------------+

*/
async function remove(req, res) {
    try {
        const id = req.params.userId
        await User.deleteOne({ _id: id })
        res.status(200).json({
            message: 'User deleted',
            request: {
                type: 'POST',
                url: {
                    username: 'String',
                    email: 'String',
                    phone: 'String',
                    password: 'String',
                    c_password: 'String'
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