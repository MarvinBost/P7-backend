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
                return res.status(409).json({
                    'error': 'email already exist !'
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                'error': 'erreur findOne',
                'err': `${err}`
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
            attributes: ['id', 'email', 'username'],
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
                id: req.params.id
            }
        })
        .then(user => {
            if (user.id == id) {
                return res.status(200).json("C'est ton profil")
            } else {
                models.User.findOne({
                        where: {
                            id: id
                        }
                    })
                    .then(user => {
                        if (user.isAdmin == true) {
                            return res.status(200).json({
                                message: 'ok'
                            })
                        } else {
                            return res.status(401).json({
                                error: 'Unauthorized request !'
                            })
                        }
                    })
                    .catch(err => {
                        return res.status(404).json({
                            error: 'User not found !'
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