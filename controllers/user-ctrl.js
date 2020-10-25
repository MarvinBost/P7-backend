// imports
const bcrypt = require('bcrypt')
const jwt = require('../utils/jwt.utils')
const models = require('../models/')

// Routes

exports.signup = (req, res) => {
    console.log(({
        data: req.body.email
    }))
    models.User.findOne({
            attributes: ['email'],
            where: {
                email: req.body.email
            }
        })
        .then(user => {
            if (!user) {
                bcrypt.hash(req.body.password, 5, (err, pass) => {

                    console.log(err)

                    let newUser = models.User.create({
                            email: req.body.email,
                            username: req.body.username,
                            password: pass,
                            isAdmin: false
                        })
                        .then(newUser => {
                            return res.status(201).json({
                                message: 'Utilisateur crée !',
                                userId: newUser.id
                            })
                        })
                        .catch(err => {
                            return res.status(500).json({
                                'error': `${err}`
                            })
                        })
                })
            } else {
                return res.status(200).json({
                    error: 'email already exist !'
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                error: 'erreur findOne',
                err: `${err}`
            })
        })
}

exports.login = (req, res) => {
    const {
        email,
        password
    } = req.body
    if (email == null || password == null)
        return res.status(400).json({
            'error': 'Request body is empty or incompleted !'
        })
    models.User.findOne({
            where: {
                email: email
            }
        })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, pass) => {
                    if (pass) {
                        return res.status(200).json({
                            'userId': user.id,
                            'token': jwt.generateToken(user)
                        })
                    } else {
                        return res.status(400).json({
                            'error': 'invalid password !'
                        })
                    }
                })
            } else
                return res.status(404).json({
                    'error': 'user not found !'
                })
        })
}

exports.getuser = (req, res) => {
    let id = jwt.getid(req)
    models.User.findOne({
            attributes: ['id', 'email', 'username', 'isAdmin'],
            where: {
                id: id
            }
        })
        .then(user => {
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({
                    'error': 'user not found !'
                })
            }
        }).catch(err => {
            res.status(500).json({
                'error': `${err}`
            })
        })
}

exports.deluser = (req, res) => {
    let id = jwt.getid(req)
    models.User.findOne({
            where: {
                id: req.params.id // find user target on DB
            }
        })
        .then(usert => {
            if (usert.id == id) { // if user target is you
                models.User.destroy({
                        where: {
                            id: id
                        }
                    })
                    .then(userdeleted => {
                        return res.status(200).json({
                            message: 'Your account has been deleted !'
                        })
                    })
                    .catch(err => {
                        return res.status(500).json({
                            error: `${err}`
                        })
                    })
            } else { // is user target is not you
                models.User.findOne({ // find you in DB
                        where: {
                            id: id //use id in your token
                        }
                    })
                    .then(user => {
                        if (user.isAdmin == true) { // if you are Admin
                            models.User.destroy({
                                    where: {
                                        id: req.params.id
                                    }
                                })
                                .then(userdeleted => {
                                    return res.status(200).json({
                                        message: `Account "${usert.username}" has been deleted`
                                    })
                                })
                                .catch(err => {
                                    return res.status(500).json({
                                        error: `${err}`
                                    })
                                })
                        } else { // if you dont have admin permissions
                            return res.status(401).json({
                                error: 'Unauthorized request !'
                            })
                        }
                    })
                    .catch(err => { // if you dont exist in DB
                        console.log(err)
                        return res.status(404).json({
                            error: 'Your account is not active on Groupomania !'
                        })
                    })
            }
        })
        .catch(err => {
            return res.status(404).json({
                error: 'User not found !'
            })
        })
}
exports.listUsers = (req, res) => {
    let fields = req.query.fields
    let order = req.query.order
    let limit = parseInt(req.query.limit)
    models.User.findAll({
            order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
            attributes: (fields != '*' && fields != null) ? fields.split(',') : ['id', 'email', 'username', 'isAdmin', 'createdAt'],
            limit: (!isNaN(limit)) ? limit : null
        })
        .then(users => {
            if (users) {
                res.status(200).json(users)
            } else {
                res.status(404).json({
                    'error': 'no users found'
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                'error': `${err}`
            })
        })
}

exports.upUser = (req, res) => {
    models.User.update({
        isAdmin: req.body.isAdmin
    }, {
        where: {
            id: req.params.id
        }
    }).then(user => {
        return res.status(201).json(user)
    }).catch(err => {
        return res.status(500).json(err)
    })
}